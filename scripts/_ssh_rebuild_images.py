"""Rebuild EasyPanel Docker images from synced code and force service update."""
from __future__ import annotations

import os
import sys
import time

import paramiko

sys.stdout.reconfigure(line_buffering=True)
PASSWORD = os.environ["HOSTINGER_ROOT_PASSWORD"]

SPECS = {
    "tunis": {
        "host": "2.24.71.239",
        "cmds": [
            # Inspect current image names / build context
            "docker service inspect rootstunisia_backend --format '{{.Spec.TaskTemplate.ContainerSpec.Image}}'",
            "docker service inspect rootstunisia_frontend --format '{{.Spec.TaskTemplate.ContainerSpec.Image}}'",
            "ls -la /etc/easypanel/projects/rootstunisia/backend/ | head -40",
            "ls -la /etc/easypanel/projects/rootstunisia/frontend/ | head -40",
            "find /etc/easypanel/projects/rootstunisia -maxdepth 2 -name 'Dockerfile*' -o -name '*.yml' -o -name 'source.json' -o -name 'config.json' 2>/dev/null | head -40",
            "cat /etc/easypanel/projects/rootstunisia/backend/*.json 2>/dev/null | head -200",
            "cat /etc/easypanel/projects/rootstunisia/frontend/*.json 2>/dev/null | head -200",
        ],
    },
    "egypt": {
        "host": "2.24.221.152",
        "cmds": [
            "docker service ls --format '{{.Name}} {{.Image}}' | grep -i rootsegypt || true",
            "find /etc/easypanel/projects/rootsegypt -maxdepth 3 -name 'Dockerfile*' -o -name '*.json' 2>/dev/null | head -60",
            "ls /etc/easypanel/projects/rootsegypt",
        ],
    },
}


def main() -> None:
    which = sys.argv[1] if len(sys.argv) > 1 else "tunis"
    cfg = SPECS[which]
    c = paramiko.SSHClient()
    c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    c.connect(cfg["host"], username="root", password=PASSWORD, timeout=30, allow_agent=False, look_for_keys=False)
    for cmd in cfg["cmds"]:
        print(f"\n$ {cmd}", flush=True)
        stdin, stdout, stderr = c.exec_command(cmd, timeout=90)
        print(stdout.read().decode("utf-8", "replace")[:5000], flush=True)
        err = stderr.read().decode("utf-8", "replace").strip()
        if err:
            print("ERR", err[:500], flush=True)
    c.close()


if __name__ == "__main__":
    main()
