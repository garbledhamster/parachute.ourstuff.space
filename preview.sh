#!/bin/sh
set -eu
cd "$(dirname "$0")"
label=space.ourstuff.parachute-preview
agent="$HOME/Library/LaunchAgents/$label.plist"
scope="gui/$(id -u)"
runtime="$HOME/Library/Application Support/Parachute Preview"
stage() {
    mkdir -p "$runtime/releases"
    /usr/bin/ditto releases "$runtime/releases"
    cp serve.py "$runtime/serve.py.next"
    mv "$runtime/serve.py.next" "$runtime/serve.py"
    cp latest.txt "$runtime/latest.txt.next"
    mv "$runtime/latest.txt.next" "$runtime/latest.txt"
}
case "${1:-status}" in
  install)
    test "$#" -eq 2 || { echo "Usage: ./preview.sh install <Mac LAN IP>"; exit 1; }
    test ! -e "$agent" || { echo "Already installed."; exit 1; }
    stage
    /usr/bin/python3 - "$agent" "$label" "$runtime/serve.py" "$2" <<'PY'
import ipaddress
import plistlib
import sys
from pathlib import Path
path, label, script, address = sys.argv[1:]
ip = ipaddress.IPv4Address(address)
if not (ip.is_private and not ip.is_unspecified):
    raise SystemExit("Use a private LAN address.")
path = Path(path)
path.parent.mkdir(parents=True, exist_ok=True)
if path.exists():
    raise SystemExit(f"Already installed. Use ./preview.sh status or stop: {path}")
log = Path.home() / "Library" / "Logs" / "parachute-preview.log"
with path.open("xb") as output:
    plistlib.dump({
        "Label": label,
        "ProgramArguments": ["/usr/bin/python3", script, "--bind", address, "--port", "8857"],
        "RunAtLoad": True,
        "KeepAlive": True,
        "StandardErrorPath": str(log),
        "StandardOutPath": str(log),
    }, output)
PY
    launchctl bootstrap "$scope" "$agent"
    ;;
  publish) stage; launchctl kickstart -k "$scope/$label" ;;
  start) launchctl bootstrap "$scope" "$agent" ;;
  stop) launchctl bootout "$scope/$label" ;;
  status) launchctl print "$scope/$label" ;;
  *) echo "Usage: ./preview.sh install <Mac LAN IP> | publish | start | stop | status"; exit 1 ;;
esac
