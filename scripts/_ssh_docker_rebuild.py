"""Manually rebuild EasyPanel images from synced code and roll services."""
from __future__ import annotations

import os
import sys
import time

import paramiko

sys.stdout.reconfigure(line_buffering=True)
PASSWORD = os.environ["HOSTINGER_ROOT_PASSWORD"]

BUILDS = {
    "tunis": {
        "host": "2.24.71.239",
        "steps": [
            # Peek dockerfiles
            "sed -n '1,40p' /etc/easypanel/projects/rootstunisia/backend/code/backend/Dockerfile",
            "sed -n '1,40p' /etc/easypanel/projects/rootstunisia/frontend/code/frontend/Dockerfile",
            "ls /etc/easypanel/actions 2>/dev/null | head",
            # Build backend
            "docker build -t easypanel/rootstunisia/backend:latest /etc/easypanel/projects/rootstunisia/backend/code/backend",
            # Build frontend (needs build args maybe)
            "docker build -t easypanel/rootstunisia/frontend:latest /etc/easypanel/projects/rootstunisia/frontend/code/frontend",
            # Update services with new image digest force
            "docker service update --image easypanel/rootstunisia/backend:latest --force rootstunisia_backend",
            "docker service update --image easypanel/rootstunisia/frontend:latest --force rootstunisia_frontend",
        ],
        "health": [
            "sleep 25",
            "curl -sk --max-time 20 https://api.rootstunisia.com/api/health || true",
            "curl -sk -o /dev/null -w 'collect:%{http_code}\\n' --max-time 20 -X POST -H 'Content-Type: application/json' -d '{\"path\":\"/\",\"title\":\"x\"}' https://api.rootstunisia.com/api/analytics/collect || true",
            "curl -skI --max-time 15 https://rootstunisia.com/ | head -15",
            "curl -skI --max-time 15 https://www.rootstunisia.com/ | head -15",
        ],
    },
    "egypt": {
        "host": "2.24.221.152",
        "steps": [
            "find /etc/easypanel/projects/rootsegypt -name Dockerfile 2>/dev/null | head -20",
            "docker service ls --format '{{.Name}} {{.Image}}' | grep rootsegypt || true",
        ],
        "health": [],
    },
}


def main() -> None:
    which = sys.argv[1] if len(sys.argv) > 1 else "tunis"
    only_health = "--health" in sys.argv
    cfg = BUILDS[which]
    c = paramiko.SSHClient()
    c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    print(f"connect {cfg['host']}", flush=True)
    c.connect(cfg["host"], username="root", password=PASSWORD, timeout=30, allow_agent=False, look_for_keys=False)
    steps = cfg["health"] if only_health else cfg["steps"] + cfg["health"]
    for cmd in steps:
        print(f"\n$ {cmd}", flush=True)
        # long timeout for docker build
        timeout = 900 if cmd.startswith("docker build") or cmd.startswith("docker service update") else 120
        stdin, stdout, stderr = c.exec_command(cmd, timeout=timeout)
        # stream-ish
        out = stdout.read().decode("utf-8", "replace")
        err = stderr.read().decode("utf-8", "replace")
        code = stdout.channel.recv_exit_status()
        if out.strip():
            print(out[-4000:], flush=True)
        if err.strip():
            print("ERR/PROG:", err[-4000:], flush=True)
        print(f"exit={code}", flush=True)
        if code != 0 and cmd.startswith("docker build"):
            print("BUILD FAILED — aborting further steps", flush=True)
            break
    c.close()


if __name__ == "__main__":
    main()
