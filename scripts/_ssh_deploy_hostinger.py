"""Deploy analytics + SEO changes to Hostinger EasyPanel (targeted file sync)."""
from __future__ import annotations

import os
import posixpath
import sys
import time
from pathlib import Path

import paramiko

sys.stdout.reconfigure(line_buffering=True)

PASSWORD = os.environ.get("HOSTINGER_ROOT_PASSWORD")
if not PASSWORD:
    print("HOSTINGER_ROOT_PASSWORD env var required", file=sys.stderr)
    sys.exit(1)

# Relative paths to upload (files or dirs)
TUNIS_PATHS = [
    "backend/src/modules/analytics",
    "backend/src/app.module.ts",
    "backend/src/main.ts",
    "frontend/src/analytics",
    "frontend/src/admin/pages/LiveAnalytics.tsx",
    "frontend/src/admin/components/AdminSidebar.tsx",
    "frontend/src/App.tsx",
    "frontend/src/seo/SeoHead.tsx",
    "frontend/public/robots.txt",
    "frontend/public/sitemap.xml",
    "frontend/src/locales/en.json",
    "frontend/src/locales/fr.json",
    "frontend/src/locales/ar.json",
    "frontend/src/locales/es.json",
    "frontend/src/locales/it.json",
    "frontend/src/locales/mt.json",
    "frontend/.env.example",
    "backend/.env.example.analytics",
]

EGYPT_PATHS = list(TUNIS_PATHS)

TARGETS = {
    "tunis": {
        "host": "2.24.71.239",
        "local": Path(r"c:\Users\mounir\Desktop\codebases\RootsTunisiaCodeSourceFull"),
        "remote_code_dirs": [
            "/etc/easypanel/projects/rootstunisia/backend/code",
            "/etc/easypanel/projects/rootstunisia/frontend/code",
        ],
        "services": ["rootstunisia_backend", "rootstunisia_frontend"],
        "paths": TUNIS_PATHS,
        "health": [
            "https://api.rootstunisia.com/api/health",
            "https://rootstunisia.com/",
            "https://www.rootstunisia.com/",
        ],
        "api_collect": "https://api.rootstunisia.com/api/analytics/collect",
    },
    "egypt": {
        "host": "2.24.221.152",
        "local": Path(
            r"c:\Users\mounir\Desktop\codebases\RootsEgypt-full-SourceCode-main\RootsEgypt-full-SourceCode-main"
        ),
        "remote_code_dirs": [],  # discovered
        "services": ["rootsegypt_backend-egyptroots", "rootsegypt_frontend-egyptroots"],
        "paths": EGYPT_PATHS,
        "health": [
            "https://api.rootsegypt.org/api/health",
            "https://rootsegypt.org/",
            "https://www.rootsegypt.org/",
        ],
        "api_collect": "https://api.rootsegypt.org/api/analytics/collect",
    },
}


def ensure_remote_dir(sftp: paramiko.SFTPClient, remote: str) -> None:
    parts = remote.strip("/").split("/")
    cur = ""
    for part in parts:
        cur += "/" + part
        try:
            sftp.stat(cur)
        except FileNotFoundError:
            try:
                sftp.mkdir(cur)
            except OSError:
                pass


def put_file(sftp: paramiko.SFTPClient, local: Path, remote: str) -> None:
    ensure_remote_dir(sftp, posixpath.dirname(remote))
    sftp.put(str(local), remote)


def upload_rel(sftp: paramiko.SFTPClient, local_root: Path, remote_root: str, rel: str) -> int:
    local = local_root / rel
    if not local.exists():
        print(f"  missing {rel}")
        return 0
    remote = posixpath.join(remote_root, rel.replace("\\", "/"))
    count = 0
    if local.is_file():
        put_file(sftp, local, remote)
        print(f"  + {rel}")
        return 1
    for root, _dirs, files in os.walk(local):
        for name in files:
            lf = Path(root) / name
            rf = posixpath.join(remote, lf.relative_to(local).as_posix())
            put_file(sftp, lf, rf)
            count += 1
    print(f"  + {rel}/ ({count} files)")
    return count


def run(ssh: paramiko.SSHClient, cmd: str, timeout: int = 180) -> tuple[int, str, str]:
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=timeout)
    out = stdout.read().decode("utf-8", "replace")
    err = stderr.read().decode("utf-8", "replace")
    code = stdout.channel.recv_exit_status()
    return code, out, err


def discover_code_dirs(ssh: paramiko.SSHClient, project: str) -> list[str]:
    _, out, _ = run(ssh, f"find /etc/easypanel/projects/{project} -maxdepth 3 -type d -name code 2>/dev/null")
    return [line.strip() for line in out.splitlines() if line.strip().endswith("/code")]


def deploy_one(name: str, cfg: dict) -> None:
    print(f"\n===== DEPLOY {name} -> {cfg['host']} =====", flush=True)
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    print("connecting...", flush=True)
    ssh.connect(
        cfg["host"],
        username="root",
        password=PASSWORD,
        timeout=30,
        allow_agent=False,
        look_for_keys=False,
        banner_timeout=30,
    )
    print("connected", flush=True)
    sftp = ssh.open_sftp()

    remote_dirs = list(cfg["remote_code_dirs"])
    if not remote_dirs:
        project = "rootsegypt" if name == "egypt" else "rootstunisia"
        remote_dirs = discover_code_dirs(ssh, project)
        print(f"discovered: {remote_dirs}", flush=True)
    if not remote_dirs:
        raise SystemExit(f"No remote code dirs for {name}")

    local_root: Path = cfg["local"]
    total = 0
    for remote in remote_dirs:
        print(f"syncing -> {remote}", flush=True)
        for rel in cfg["paths"]:
            total += upload_rel(sftp, local_root, remote, rel)
        stamp = posixpath.join(remote, ".roots_deploy_stamp")
        with sftp.file(stamp, "w") as f:
            f.write(f"at={time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())}\ntarget={name}\n")
    sftp.close()
    print(f"uploaded {total} files", flush=True)

    for service in cfg["services"]:
        print(f"forcing service update: {service}", flush=True)
        code, out, err = run(ssh, f"docker service update --force {service}", timeout=360)
        print(f"  exit={code}", flush=True)
        if out.strip():
            print(out.strip()[-500:], flush=True)
        if err.strip():
            print(err.strip()[-500:], flush=True)

    print("waiting 40s for rollout...", flush=True)
    time.sleep(40)
    for url in cfg["health"]:
        _, out, _ = run(ssh, f"curl -skI -o /dev/null -w '%{{http_code}}' --max-time 20 {url} || true")
        print(f"health {url} -> {out.strip()}", flush=True)

    _, out, _ = run(
        ssh,
        "curl -sk -o /dev/null -w '%{http_code}' --max-time 20 -X POST "
        "-H 'Content-Type: application/json' "
        f"-d '{{\"path\":\"/\",\"title\":\"deploy-check\"}}' {cfg['api_collect']} || true",
    )
    print(f"analytics collect -> {out.strip()}", flush=True)

    # robots + sitemap reachability
    site = cfg["health"][1].rstrip("/")
    for path in ["/robots.txt", "/sitemap.xml"]:
        _, out, _ = run(ssh, f"curl -skI -o /dev/null -w '%{{http_code}}' --max-time 15 {site}{path} || true")
        print(f"{path} -> {out.strip()}", flush=True)

    ssh.close()
    print(f"===== {name} deploy finished =====", flush=True)


def main() -> None:
    which = sys.argv[1:] or ["tunis", "egypt"]
    for name in which:
        if name not in TARGETS:
            print(f"Unknown target {name}", file=sys.stderr)
            sys.exit(2)
        deploy_one(name, TARGETS[name])


if __name__ == "__main__":
    main()
