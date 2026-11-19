"""Sync full Egypt local frontend/src to Hostinger then rebuild."""
from __future__ import annotations

import os
import posixpath
import sys
import time
from pathlib import Path

import paramiko

sys.stdout.reconfigure(line_buffering=True)
PASSWORD = os.environ["HOSTINGER_ROOT_PASSWORD"]
LOCAL_SRC = Path(
    r"c:\Users\mounir\Desktop\codebases\RootsEgypt-full-SourceCode-main\RootsEgypt-full-SourceCode-main\frontend\src"
)
REMOTE_ROOTS = [
    "/etc/easypanel/projects/rootsegypt/frontend-egyptroots/code/frontend/src",
    "/etc/easypanel/projects/rootsegypt/backend-egyptroots/code/frontend/src",
]
SKIP_DIRS = {"node_modules", ".git", "__pycache__", "dist"}


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


def main() -> None:
    c = paramiko.SSHClient()
    c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    print("connect", flush=True)
    c.connect("2.24.221.152", username="root", password=PASSWORD, timeout=30, allow_agent=False, look_for_keys=False)
    sftp = c.open_sftp()
    uploaded = 0
    for remote_root in REMOTE_ROOTS:
        print("syncing to", remote_root, flush=True)
        for root, dirs, files in os.walk(LOCAL_SRC):
            dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
            rel = Path(root).relative_to(LOCAL_SRC).as_posix()
            remote_dir = remote_root if rel == "." else posixpath.join(remote_root, rel)
            ensure_dir(sftp, remote_dir)
            for name in files:
                lf = Path(root) / name
                rf = posixpath.join(remote_dir, name)
                sftp.put(str(lf), rf)
                uploaded += 1
                if uploaded % 200 == 0:
                    print("...", uploaded, flush=True)
    # also public robots/sitemap + AdminSidebar already done; sync public quickly
    local_public = LOCAL_SRC.parent / "public"
    for remote_code in [
        "/etc/easypanel/projects/rootsegypt/frontend-egyptroots/code/frontend/public",
        "/etc/easypanel/projects/rootsegypt/backend-egyptroots/code/frontend/public",
    ]:
        for name in ("robots.txt", "sitemap.xml"):
            lf = local_public / name
            if lf.exists():
                ensure_dir(sftp, remote_code)
                sftp.put(str(lf), posixpath.join(remote_code, name))
                print("public", name, flush=True)
    sftp.close()
    print("uploaded", uploaded, flush=True)

    def run(cmd, timeout=900):
        print(f"\n$ {cmd}", flush=True)
        stdin, stdout, stderr = c.exec_command(cmd, timeout=timeout)
        out = stdout.read().decode("utf-8", "replace")
        err = stderr.read().decode("utf-8", "replace")
        code = stdout.channel.recv_exit_status()
        if out.strip():
            print(out[-3000:], flush=True)
        if err.strip():
            print("ERR/PROG:", err[-3000:], flush=True)
        print("exit", code, flush=True)
        return code

    run("test -f /etc/easypanel/projects/rootsegypt/frontend-egyptroots/code/frontend/src/context/TranslationContext.tsx && echo OK_TC")
    run("test -f /etc/easypanel/projects/rootsegypt/frontend-egyptroots/code/frontend/src/components/WhatsAppButton.tsx && echo OK_WA || echo NO_WA")
    code = run(
        "docker build --build-arg VITE_API_URL=https://api.rootsegypt.org "
        "-t easypanel/rootsegypt/frontend-egyptroots "
        "/etc/easypanel/projects/rootsegypt/frontend-egyptroots/code/frontend"
    )
    if code != 0:
        raise SystemExit("frontend build failed")
    run("docker service update --image easypanel/rootsegypt/backend-egyptroots --force rootsegypt_backend-egyptroots")
    run("docker service update --image easypanel/rootsegypt/frontend-egyptroots --force rootsegypt_frontend-egyptroots")
    time.sleep(30)
    run("curl -sk --max-time 20 https://api.rootsegypt.org/api/health || true")
    run(
        "curl -sk --max-time 20 -X POST -H 'Content-Type: application/json' "
        "-d '{\"path\":\"/\",\"title\":\"egypt-ok\"}' https://api.rootsegypt.org/api/analytics/collect || true"
    )
    run("docker logs $(docker ps -qf name=rootsegypt_backend | head -1) 2>&1 | grep -i analytics | head -20")
    run("curl -skI --max-time 15 https://rootsegypt.org/ | head -12")
    run("curl -skI --max-time 15 https://www.rootsegypt.org/ | head -12")
    run("curl -skI --max-time 15 https://rootsegypt.org/robots.txt | head -12")
    c.close()
    print("DONE", flush=True)


if __name__ == "__main__":
    main()
