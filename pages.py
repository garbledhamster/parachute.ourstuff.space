#!/usr/bin/env python3
"""Build the GitHub Pages tree from approved static snapshots."""
import argparse
import re
import shutil
from pathlib import Path

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("output", type=Path, help="a new output directory")
args = parser.parse_args()

root = Path(__file__).resolve().parent
releases = root / "releases"
latest = (root / "latest.txt").read_text().strip()
versions = sorted(path for path in releases.iterdir()
                  if path.is_dir() and re.fullmatch(r"v[1-9][0-9]*", path.name))
if latest not in {path.name for path in versions}:
    parser.error("latest.txt must name a numbered release")
for version in versions:
    if not (version / "index.html").is_file():
        parser.error(f"{version.name} is missing index.html")

args.output.mkdir()
for version in versions:
    shutil.copytree(version, args.output / version.name)
shutil.copytree(releases / latest, args.output, dirs_exist_ok=True)
(args.output / ".nojekyll").touch()
(args.output / "CNAME").write_text("parachute.ourstuff.space\n")
print(f"Built {latest} and {len(versions)} numbered releases in {args.output}")
