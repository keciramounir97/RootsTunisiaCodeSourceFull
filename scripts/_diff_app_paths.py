import re
from pathlib import Path

def paths(p: Path):
    t = p.read_text(encoding="utf-8")
    return sorted(set(re.findall(r'path="([^"]+)"', t)))

tp = paths(Path(r"c:\Users\mounir\Desktop\codebases\RootsTunisiaCodeSourceFull\frontend\src\App.tsx"))
ep = paths(Path(r"c:\Users\mounir\Desktop\codebases\RootsEgypt-full-SourceCode-main\RootsEgypt-full-SourceCode-main\frontend\src\App.tsx"))
print("tunis only", [x for x in tp if x not in ep])
print("egypt only", [x for x in ep if x not in tp])
print("counts", len(tp), len(ep))
