"""Full parity deploy: sync code to Tunis + Egypt Hostinger, rebuild images, smoke."""
from __future__ import annotations

import os
import posixpath
import sys
import time
from pathlib import Path

import paramiko

sys.stdout.reconfigure(line_buffering=True)
PASSWORD = os.environ["HOSTINGER_ROOT_PASSWORD"]

TUNIS_LOCAL = Path(r"c:\Users\mounir\Desktop\codebases\RootsTunisiaCodeSourceFull")
EGYPT_LOCAL = Path(
    r"c:\Users\mounir\Desktop\codebases\RootsEgypt-full-SourceCode-main\RootsEgypt-full-SourceCode-main"
)

SKIP_DIRS = {"node_modules", ".git", "__pycache__", "dist", "coverage", ".vite"}
SKIP_SUFFIX = {".bak", ".map"}

TUNIS_REL = [
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
    "frontend/src/locales",
]

EGYPT_TREE_RELS = [
    "backend/src",
    "frontend/src",
    "frontend/public/robots.txt",
    "frontend/public/sitemap.xml",
    "frontend/public/bgimgbehindSections.jpeg",
    "frontend/public/newSectionBackground.jpeg",
    "frontend/index.html",
]


def ensure_dir(sftp, remote: str) -> None:
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


def put_file(sftp, local: Path, remote: str) -> None:
    ensure_dir(sftp, posixpath.dirname(remote))
    sftp.put(str(local), remote)


def upload_tree(sftp, local_root: Path, remote_root: str, rel: str) -> int:
    local = local_root / rel
    if not local.exists():
        print("missing", rel, flush=True)
        return 0
    remote = posixpath.join(remote_root, rel.replace("\\", "/"))
    if local.is_file():
        put_file(sftp, local, remote)
        print("+", rel, flush=True)
        return 1
    n = 0
    for root, dirs, files in os.walk(local):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        for name in files:
            if any(name.endswith(suf) for suf in SKIP_SUFFIX):
                continue
            lf = Path(root) / name
            rf = posixpath.join(remote, lf.relative_to(local).as_posix())
            put_file(sftp, lf, rf)
            n += 1
            if n % 250 == 0:
                print(f"  ... {rel} {n}", flush=True)
    print(f"+ {rel}/ ({n})", flush=True)
    return n


def run(ssh, cmd: str, timeout: int = 900):
    print(f"\n$ {cmd}", flush=True)
    _, stdout, stderr = ssh.exec_command(cmd, timeout=timeout)
    out = stdout.read().decode("utf-8", "replace")
    err = stderr.read().decode("utf-8", "replace")
    code = stdout.channel.recv_exit_status()
    if out.strip():
        print(out[-4000:], flush=True)
    if err.strip():
        print("ERR/PROG:", err[-4000:], flush=True)
    print("exit=", code, flush=True)
    return code, out, err


def connect(host: str):
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    print(f"connecting {host}...", flush=True)
    ssh.connect(host, username="root", password=PASSWORD, timeout=40, allow_agent=False, look_for_keys=False)
    return ssh


def deploy_tunis() -> None:
    ssh = connect("2.24.71.239")
    remote_roots = [
        "/etc/easypanel/projects/rootstunisia/backend/code",
        "/etc/easypanel/projects/rootstunisia/frontend/code",
    ]
    sftp = ssh.open_sftp()
    total = 0
    for remote in remote_roots:
        print("sync tunis ->", remote, flush=True)
        for rel in TUNIS_REL:
            total += upload_tree(sftp, TUNIS_LOCAL, remote, rel)
    sftp.close()
    print("tunis uploaded", total, flush=True)

    # Prefer live API host used by Traefik
    be_img = "easypanel/rootstunisia/backend:latest"
    fe_img = "easypanel/rootstunisia/frontend:latest"
    code, _, _ = run(ssh, f"docker build -t {be_img} /etc/easypanel/projects/rootstunisia/backend/code/backend", 900)
    if code != 0:
        raise SystemExit("tunis backend build failed")
    code, _, _ = run(
        ssh,
        f"docker build --build-arg VITE_API_URL=https://server.rootstunisia.com -t {fe_img} "
        "/etc/easypanel/projects/rootstunisia/frontend/code/frontend",
        900,
    )
    if code != 0:
        raise SystemExit("tunis frontend build failed")
    run(ssh, f"docker service update --image {be_img} --force rootstunisia_backend", 360)
    run(ssh, f"docker service update --image {fe_img} --force rootstunisia_frontend", 360)
    time.sleep(28)
    run(ssh, "curl -sk --max-time 20 https://server.rootstunisia.com/api/health || true")
    run(
        ssh,
        "curl -sk -o /dev/null -w 'collect:%{http_code}\\n' --max-time 20 -X POST "
        "-H 'Content-Type: application/json' -d '{\"path\":\"/\",\"title\":\"tunis-parity\"}' "
        "https://server.rootstunisia.com/api/analytics/collect || true",
    )
    run(ssh, "curl -skI --max-time 15 https://rootstunisia.com/ | head -12")
    run(ssh, "curl -skI --max-time 15 https://www.rootstunisia.com/ | head -12")
    ssh.close()
    print("TUNIS DEPLOY DONE", flush=True)


def deploy_egypt() -> None:
    ssh = connect("2.24.221.152")
    _, out, _ = run(ssh, "ls -d /etc/easypanel/projects/rootsegypt/*/code 2>/dev/null")
    code_dirs = [ln.strip() for ln in out.splitlines() if ln.strip().endswith("/code")]
    if not code_dirs:
        raise SystemExit("no egypt code dirs")
    print("egypt code dirs", code_dirs, flush=True)

    sftp = ssh.open_sftp()
    total = 0
    for remote in code_dirs:
        print("sync egypt ->", remote, flush=True)
        for rel in EGYPT_TREE_RELS:
            total += upload_tree(sftp, EGYPT_LOCAL, remote, rel)
    sftp.close()
    print("egypt uploaded", total, flush=True)

    _, listing, _ = run(
        ssh,
        "ls -d /etc/easypanel/projects/rootsegypt/*/code/backend "
        "/etc/easypanel/projects/rootsegypt/*/code/frontend 2>/dev/null || true",
    )
    be_ctx = next((ln.strip() for ln in listing.splitlines() if ln.strip().endswith("/backend")), None)
    fe_ctx = next((ln.strip() for ln in listing.splitlines() if ln.strip().endswith("/frontend")), None)
    # Prefer *-egyptroots contexts when present
    for ln in listing.splitlines():
        ln = ln.strip()
        if "backend-egyptroots" in ln and ln.endswith("/backend"):
            be_ctx = ln
        if "frontend-egyptroots" in ln and ln.endswith("/frontend"):
            fe_ctx = ln
    print("build contexts", be_ctx, fe_ctx, flush=True)
    if not be_ctx or not fe_ctx:
        raise SystemExit("egypt build contexts missing")

    be_img = "easypanel/rootsegypt/backend-egyptroots:latest"
    fe_img = "easypanel/rootsegypt/frontend-egyptroots:latest"
    code, _, _ = run(ssh, f"docker build -t {be_img} {be_ctx}", 900)
    if code != 0:
        raise SystemExit("egypt backend build failed")
    code, _, _ = run(
        ssh,
        f"docker build --build-arg VITE_API_URL=https://api.rootsegypt.org -t {fe_img} {fe_ctx}",
        900,
    )
    if code != 0:
        raise SystemExit("egypt frontend build failed")
    run(ssh, f"docker service update --image {be_img} --force rootsegypt_backend-egyptroots", 360)
    run(ssh, f"docker service update --image {fe_img} --force rootsegypt_frontend-egyptroots", 360)
    time.sleep(30)
    run(ssh, "curl -sk --max-time 20 https://api.rootsegypt.org/api/health || true")
    run(
        ssh,
        "curl -sk -o /dev/null -w 'collect:%{http_code}\\n' --max-time 20 -X POST "
        "-H 'Content-Type: application/json' -d '{\"path\":\"/\",\"title\":\"egypt-parity\"}' "
        "https://api.rootsegypt.org/api/analytics/collect || true",
    )
    run(ssh, "curl -skI --max-time 15 https://rootsegypt.org/ | head -12")
    run(ssh, "curl -skI --max-time 15 https://www.rootsegypt.org/ | head -12")
    run(ssh, "curl -skI --max-time 15 https://rootsegypt.org/robots.txt | head -12")
    ssh.close()
    print("EGYPT DEPLOY DONE", flush=True)


def main() -> None:
    which = (sys.argv[1] if len(sys.argv) > 1 else "both").lower()
    if which in ("tunis", "both"):
        deploy_tunis()
    if which in ("egypt", "both"):
        deploy_egypt()
    print("ALL DONE", flush=True)


if __name__ == "__main__":
    main()
