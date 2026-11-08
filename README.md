# Parachute Flower

Choose one of seven petals, write a phrase or pop a suggestion, then review or print your Flower. The preview keeps entries and drafts for the current browser session.

[Open the latest release](https://parachute.ourstuff.space/) or revisit [V1](https://parachute.ourstuff.space/v1/) and [V2](https://parachute.ourstuff.space/v2/). V2 is the current approved release.

## Where to work

- `src/` holds the editor, styles and suggestion catalog.
- `releases/` holds numbered snapshots. Keep released snapshots intact.
- `latest.txt` chooses the approved release served at the homepage.
- [Planning and handoff](docs/PLAN.md) records the remaining product decisions.

## Preview and publish

1. Preview `src/` on loopback with `python3 -m http.server 8858 --bind 127.0.0.1 --directory src`.
2. After approval, run `python3 release.py v3` with the next version number, then commit the snapshot and pointer on `main`.
3. Run `python3 pages.py /path/to/new-output` to assemble the public site. Copy that output to a clean checkout of `gh-pages`, replacing the previous generated files. Review the diff, then commit and push `gh-pages`. Its root is the GitHub Pages publishing source.
4. Verify the homepage, the new numbered route, and an older route on the custom domain. Cloudflare serves a DNS-only CNAME to `garbledhamster.github.io`.

To roll back, point `latest.txt` at the prior release, commit the pointer on `main`, and rebuild the Pages branch. The numbered releases stay available.
