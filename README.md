# Parachute Flower

A responsive planning preview for the Flower exercise. Choose a petal, write a phrase or pop an idea, then review the entries together.

Use the [latest preview](http://parachute.ourstuff.space:8857/) from the home network or home VPN. [V1](http://parachute.ourstuff.space:8857/v1/) preserves the earlier Flower editor. [V2](http://parachute.ourstuff.space:8857/v2/) is the approved planning baseline and current homepage. The direct VPN fallback is [the Mac address](http://10.200.0.59:8857/).

This is a planning preview. Entries and drafts last for the open browser session. The repository is private and the preview runs on the Mac’s private network address.

## Where to work

| Location | Purpose |
| --- | --- |
| `src/` | Working HTML, CSS, catalog, and app JavaScript |
| `releases/v1/`, `releases/v2/` | Fixed review snapshots |
| `latest.txt` | The approved snapshot served at the homepage |
| [Planning and handoff](docs/PLAN.md) | Current decisions, mockups, and remaining work |

## Run and publish

Run `python3 serve.py --port 8857` for a local loopback preview when the port is available. Use another port if needed. The server reads `latest.txt` and serves release files only. Preview changes in `src/` independently with `python3 -m http.server 8858 --bind 127.0.0.1 --directory src`.

The Mac service is installed under the current user. Run `./preview.sh status` to check it, `./preview.sh stop` to stop it, or `./preview.sh start` to bring it back. On a fresh Mac, use `./preview.sh install <Mac LAN IP>`. Launchd runs the staged copy under `~/Library/Application Support/Parachute Preview`.

When the next version is approved, review the relevant stage images and browser checks. Run `python3 release.py v3` to freeze the next snapshot and move the homepage pointer. Review and commit both the snapshot and pointer. Run `./preview.sh publish` on the Mac, verify the homepage and numbered URLs, then push main and the release tag. Leave existing numbered folders intact. To roll back the homepage, point `latest.txt` at the previous approved version, commit it, and publish again.

The hostname’s DNS-only A record points to the Mac’s private address. Update the record and the service binding together if the Mac’s address changes. The VPN must route to that address. HTTP port 8857 is inside that private network.
