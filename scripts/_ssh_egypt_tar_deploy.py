"""Fast Egypt deploy: tar sync backend/src + frontend/src, docker rebuild, smoke."""
from __future__ import annotations

import os
import sys
import tarfile
import tempfile
import time
from pathlib import Path

import paramiko

sys.stdout.reconfigure(line_buffering=True)
PASSWORD = os.environ["HOSTINGER_ROOT_PASSWORD"]
LOCAL = Path(
    r"c:\Users\mounir\Desktop\codebases\RootsEgypt-full-SourceCode-main\RootsEgypt-full-SourceCode-main"
)
HOST = "2.24.221.152"
CODE_DIRS = [
    "/etc/easypanel/projects/rootsegypt/backend-egyptroots/code",
    "/etc/easypanel/projects/rootsegypt/frontend-egyptroots/code",
]
INCLUDE = [
    "backend/src",
    "frontend/src",
    "frontend/public/robots.txt",
    "frontend/public/sitemap.xml",
    "frontend/public/bgimgbehindSections.jpeg",
    "frontend/public/newSectionBackground.jpeg",
    "frontend/index.html",
]
SKIP_PARTS = {"node_modules", ".git", "__pycache__", "dist", ".vite", "coverage"}


def should_skip(path: Path) -> bool:
    return any(part in SKIP_PARTS for part in path.parts) or path.suffix in {".bak", ".map"}


def run(ssh, cmd: str, timeout: int = 900):
    print(f"\n$ {cmd}", flush=True)
    _, stdout, stderr = ssh.exec_command(cmd, timeout=timeout)
    out = stdout.read().decode("utf-8", "replace")
    err = stderr.read().decode("utf-8", "replace")
    code = stdout.channel.recv_exit_status()
    if out.strip():
        print(out[-4500:], flush=True)
    if err.strip():
        print("ERR/PROG:", err[-4500:], flush=True)
    print("exit=", code, flush=True)
    return code, out, err


def build_tar(tar_path: Path) -> int:
    n = 0
    with tarfile.open(tar_path, "w:gz") as tar:
        for rel in INCLUDE:
            local = LOCAL / rel
            if not local.exists():
                print("missing", rel, flush=True)
                continue
            if local.is_file():
                tar.add(local, arcname=rel.replace("\\", "/"))
                n += 1
                continue
            for root, dirs, files in os.walk(local):
                dirs[:] = [d for d in dirs if d not in SKIP_PARTS]
                for name in files:
                    lf = Path(root) / name
                    if should_skip(lf.relative_to(LOCAL)):
                        continue
                    arc = lf.relative_to(LOCAL).as_posix()
                    tar.add(lf, arcname=arc)
                    n += 1
    print(f"tar packed {n} files -> {tar_path} ({tar_path.stat().st_size // 1024} KB)", flush=True)
    return n


def main() -> None:
    with tempfile.TemporaryDirectory() as td:
        tar_path = Path(td) / "egypt-parity.tgz"
        build_tar(tar_path)

        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        print("connecting egypt...", flush=True)
        ssh.connect(HOST, username="root", password=PASSWORD, timeout=40, allow_agent=False, look_for_keys=False)
        sftp = ssh.open_sftp()
        remote_tar = "/tmp/egypt-parity.tgz"
        print("uploading tar...", flush=True)
        sftp.put(str(tar_path), remote_tar)
        sftp.close()
        print("upload done", flush=True)

        for code_dir in CODE_DIRS:
            code, _, _ = run(ssh, f"mkdir -p {code_dir} && tar -xzf {remote_tar} -C {code_dir}")
            if code != 0:
                raise SystemExit(f"extract failed in {code_dir}")
            run(
                ssh,
                f"test -f {code_dir}/frontend/src/App.tsx && test -f {code_dir}/backend/src/app.module.ts && echo OK_EXTRACT",
            )

        be_ctx = "/etc/easypanel/projects/rootsegypt/backend-egyptroots/code/backend"
        fe_ctx = "/etc/easypanel/projects/rootsegypt/frontend-egyptroots/code/frontend"
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
        run(ssh, "rm -f /tmp/egypt-parity.tgz")
        ssh.close()
        print("EGYPT DEPLOY DONE", flush=True)


if __name__ == "__main__":
    main()
