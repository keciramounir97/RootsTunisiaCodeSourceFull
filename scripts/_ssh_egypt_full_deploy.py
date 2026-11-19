"""Sync + docker rebuild Egypt Hostinger deployment."""
from __future__ import annotations

import os
import posixpath
import sys
import time
from pathlib import Path

import paramiko

sys.stdout.reconfigure(line_buffering=True)
PASSWORD = os.environ["HOSTINGER_ROOT_PASSWORD"]
LOCAL = Path(
    r"c:\Users\mounir\Desktop\codebases\RootsEgypt-full-SourceCode-main\RootsEgypt-full-SourceCode-main"
)
HOST = "2.24.221.152"
PATHS = [
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


def upload_rel(sftp, remote_root: str, rel: str) -> int:
    local = LOCAL / rel
    if not local.exists():
        print("missing", rel, flush=True)
        return 0
    remote = posixpath.join(remote_root, rel.replace("\\", "/"))
    if local.is_file():
        put_file(sftp, local, remote)
        print("+", rel, flush=True)
        return 1
    n = 0
    for root, _, files in os.walk(local):
        for name in files:
            lf = Path(root) / name
            rf = posixpath.join(remote, lf.relative_to(local).as_posix())
            put_file(sftp, lf, rf)
            n += 1
    print(f"+ {rel}/ ({n})", flush=True)
    return n


def run(ssh, cmd, timeout=900):
    print(f"\n$ {cmd}", flush=True)
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=timeout)
    out = stdout.read().decode("utf-8", "replace")
    err = stderr.read().decode("utf-8", "replace")
    code = stdout.channel.recv_exit_status()
    if out.strip():
        print(out[-3500:], flush=True)
    if err.strip():
        print("ERR/PROG:", err[-3500:], flush=True)
    print("exit=", code, flush=True)
    return code, out, err


def main() -> None:
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    print("connecting egypt...", flush=True)
    ssh.connect(HOST, username="root", password=PASSWORD, timeout=30, allow_agent=False, look_for_keys=False)
    _, out, _ = run(ssh, "find /etc/easypanel/projects/rootsegypt -maxdepth 3 -type d -name code")
    code_dirs = [ln.strip() for ln in out.splitlines() if ln.strip().endswith("/code")]
    print("code dirs", code_dirs, flush=True)
    if not code_dirs:
        raise SystemExit("no egypt code dirs")

    sftp = ssh.open_sftp()
    for remote in code_dirs:
        print("sync", remote, flush=True)
        for rel in PATHS:
            upload_rel(sftp, remote, rel)
    sftp.close()

    # Discover dockerfiles / image names
    run(ssh, "docker service ls --format '{{.Name}} {{.Image}}' | grep -i egypt || true")
    run(ssh, "find /etc/easypanel/projects/rootsegypt -name Dockerfile | head -20")

    # Typical paths based on prior probes
    be_ctx_candidates = [
        "/etc/easypanel/projects/rootsegypt/backend-egyptroots/code/backend",
        "/etc/easypanel/projects/rootsegypt/backend/code/backend",
    ]
    fe_ctx_candidates = [
        "/etc/easypanel/projects/rootsegypt/frontend-egyptroots/code/frontend",
        "/etc/easypanel/projects/rootsegypt/frontend/code/frontend",
    ]
    _, listing, _ = run(
        ssh,
        "ls -d /etc/easypanel/projects/rootsegypt/*/code/backend /etc/easypanel/projects/rootsegypt/*/code/frontend 2>/dev/null || true",
    )
    be_ctx = next((p for p in be_ctx_candidates if p in listing), None)
    fe_ctx = next((p for p in fe_ctx_candidates if p in listing), None)
    if not be_ctx or not fe_ctx:
        # parse listing lines
        for line in listing.splitlines():
            line = line.strip()
            if line.endswith("/backend"):
                be_ctx = line
            if line.endswith("/frontend"):
                fe_ctx = line
    print("build contexts", be_ctx, fe_ctx, flush=True)
    if not be_ctx or not fe_ctx:
        raise SystemExit("could not resolve docker build contexts")

    # image names from services
    _, imgs, _ = run(ssh, "docker service inspect rootsegypt_backend-egyptroots --format '{{.Spec.TaskTemplate.ContainerSpec.Image}}' 2>/dev/null; docker service inspect rootsegypt_frontend-egyptroots --format '{{.Spec.TaskTemplate.ContainerSpec.Image}}' 2>/dev/null")
    lines = [ln.strip() for ln in imgs.splitlines() if ln.strip()]
    be_img = lines[0] if lines else "easypanel/rootsegypt/backend-egyptroots:latest"
    fe_img = lines[1] if len(lines) > 1 else "easypanel/rootsegypt/frontend-egyptroots:latest"
    print("images", be_img, fe_img, flush=True)

    code, _, _ = run(ssh, f"docker build -t {be_img} {be_ctx}", timeout=900)
    if code != 0:
        raise SystemExit("egypt backend build failed")
    code, _, _ = run(
        ssh,
        f"docker build --build-arg VITE_API_URL=https://api.rootsegypt.org -t {fe_img} {fe_ctx}",
        timeout=900,
    )
    if code != 0:
        raise SystemExit("egypt frontend build failed")

    run(ssh, f"docker service update --image {be_img} --force rootsegypt_backend-egyptroots", timeout=360)
    run(ssh, f"docker service update --image {fe_img} --force rootsegypt_frontend-egyptroots", timeout=360)
    time.sleep(30)
    run(ssh, "curl -sk --max-time 20 https://api.rootsegypt.org/api/health || true")
    run(
        ssh,
        "curl -sk --max-time 20 -X POST -H 'Content-Type: application/json' "
        "-d '{\"path\":\"/\",\"title\":\"egypt-deploy\"}' https://api.rootsegypt.org/api/analytics/collect || true",
    )
    run(ssh, "curl -skI --max-time 15 https://rootsegypt.org/ | head -15")
    run(ssh, "curl -skI --max-time 15 https://www.rootsegypt.org/ | head -15")
    run(ssh, "curl -skI --max-time 15 https://rootsegypt.org/robots.txt | head -15")
    run(ssh, "docker logs $(docker ps -qf name=rootsegypt_backend | head -1) 2>&1 | grep -i analytics | head -20")
    ssh.close()
    print("EGYPT DEPLOY DONE", flush=True)


if __name__ == "__main__":
    main()
