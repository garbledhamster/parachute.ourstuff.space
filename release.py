#!/usr/bin/env python3
"""Snapshot src as the next numbered release and update the latest pointer."""
import shutil
import sys
import tempfile
from pathlib import Path

root = Path(__file__).resolve().parent
releases = root / "releases"
pointer = root / "latest.txt"
number = max(int(path.name[1:]) for path in releases.iterdir()
             if path.is_dir() and path.name.startswith("v") and path.name[1:].isdigit())
version = f"v{number + 1}"
if sys.argv[1:] != [version]:
    raise SystemExit(f"After reviewing src, run python3 release.py {version}")
if not (root / "src/index.html").is_file():
    raise SystemExit("src/index.html is required.")
with tempfile.TemporaryDirectory(dir=releases) as temporary:
    staged = Path(temporary) / version
    shutil.copytree(root / "src", staged)
    staged.rename(releases / version)
    next_pointer = Path(temporary) / "latest.txt"
    next_pointer.write_text(version + "\n")
    next_pointer.replace(pointer)
print(f"Created releases/{version}. Review the release, then commit and push it.")
