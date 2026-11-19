import os, sys, paramiko
sys.stdout.reconfigure(line_buffering=True)
pw = os.environ["HOSTINGER_ROOT_PASSWORD"]
checks = [
    ("tunis", "2.24.71.239", [
        "curl -sk --max-time 15 https://server.rootstunisia.com/api/health | head -c 220; echo",
        "curl -sk -o /dev/null -w 'collect:%{http_code}\\n' --max-time 15 -X POST -H 'Content-Type: application/json' -d '{\"path\":\"/\",\"title\":\"t\"}' https://server.rootstunisia.com/api/analytics/collect",
        "curl -skI --max-time 10 https://www.rootstunisia.com/ | head -1",
        "curl -skI --max-time 10 https://rootstunisia.com/sitemap.xml | head -1",
    ]),
    ("egypt", "2.24.221.152", [
        "curl -sk --max-time 15 https://api.rootsegypt.org/api/health | head -c 220; echo",
        "curl -sk -o /dev/null -w 'collect:%{http_code}\\n' --max-time 15 -X POST -H 'Content-Type: application/json' -d '{\"path\":\"/\",\"title\":\"e\"}' https://api.rootsegypt.org/api/analytics/collect",
        "curl -skI --max-time 10 https://www.rootsegypt.org/ | head -1",
        "curl -skI --max-time 10 https://rootsegypt.org/sitemap.xml | head -1",
    ]),
]
for name, host, cmds in checks:
    print("====", name, flush=True)
    c = paramiko.SSHClient()
    c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    c.connect(host, username="root", password=pw, timeout=25, allow_agent=False, look_for_keys=False)
    for cmd in cmds:
        stdin, stdout, stderr = c.exec_command(cmd, timeout=40)
        print(stdout.read().decode().strip())
    c.close()
