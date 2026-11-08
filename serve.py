#!/usr/bin/env python3
"""Serve only numbered snapshots and the approved latest alias."""
import argparse
import re
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parent
RELEASES = ROOT / "releases"
VERSION = re.compile(r"v[1-9][0-9]*")


def route(raw_path):
    path = unquote(urlsplit(raw_path).path)
    parts = path.strip("/").split("/") if path.strip("/") else []
    if any(part in ("", ".", "..") or part.startswith(".") or "\\" in part for part in parts):
        return None
    explicit = bool(parts and VERSION.fullmatch(parts[0]))
    version = parts.pop(0) if explicit else (ROOT / "latest.txt").read_text().strip()
    if not VERSION.fullmatch(version):
        return None
    directory = RELEASES / version
    if explicit and not parts and not path.endswith("/") and directory.is_dir():
        return f"/{version}/"
    candidate = directory.joinpath(*(parts or ["index.html"]))
    if candidate.is_file() and candidate.resolve().is_relative_to(directory.resolve()):
        return candidate
    return None


class Preview(SimpleHTTPRequestHandler):
    def send_head(self):
        result = route(self.path)
        if isinstance(result, str):
            self.send_response(302)
            self.send_header("Location", result)
            self.end_headers()
            return None
        if result is None:
            self.send_error(404)
            return None
        self.asset = result
        return super().send_head()

    def translate_path(self, path):
        return str(self.asset)

    def end_headers(self):
        self.send_header("Cache-Control", "no-cache")
        self.send_header("X-Content-Type-Options", "nosniff")
        super().end_headers()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--bind", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8857)
    args = parser.parse_args()
    with ThreadingHTTPServer((args.bind, args.port), Preview) as server:
        server.serve_forever()
