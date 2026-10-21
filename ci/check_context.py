#!/usr/bin/env python3
"""Fail closed if tracked files or Docker build inputs could carry credentials."""

from pathlib import Path
import re
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
ALLOWED = {"package.json", "bun.lock", "next.config.ts", "tsconfig.json"}
DIRS = {"app", "components", "lib", "public"}
DENIED_NAME = re.compile(r"(^|/)(\.env[^/]*|id_rsa[^/]*|id_ed25519[^/]*|kubeconfig[^/]*|[^/]+\.(pem|key|p12|pfx|jks|sqlite|db))$", re.I)


def tracked() -> list[str]:
    result = subprocess.run(
        ["git", "ls-files", "-z"], cwd=ROOT, check=True, capture_output=True
    )
    return [path.decode("utf-8", "surrogateescape") for path in result.stdout.split(b"\0") if path]


def main() -> int:
    files = tracked()
    bad = [path for path in files if DENIED_NAME.search(path)]
    expected = {"*", "!app", "!app/**", "!components", "!components/**", "!lib", "!lib/**", "!public", "!public/**"}
    actual = set((ROOT / ".dockerignore").read_text().splitlines())
    if not expected.issubset(actual):
        print("Docker context allowlist missing", file=sys.stderr)
        return 1
    allowed_files = [p for p in files if p in ALLOWED or p.split("/", 1)[0] in DIRS]
    if not allowed_files:
        print("Docker context empty", file=sys.stderr)
        return 1
    if bad:
        print(f"Disallowed tracked credential-like paths: {len(bad)}", file=sys.stderr)
        return 1
    if any(DENIED_NAME.search(p) for p in allowed_files):
        print("Disallowed Docker context path", file=sys.stderr)
        return 1
    dockerfile = (ROOT / "Dockerfile").read_text()
    if re.search(r"^\s*(ARG|COPY\s+\.)\b", dockerfile, re.I | re.M):
        print("Dockerfile ARG or broad COPY forbidden", file=sys.stderr)
        return 1
    print(f"Context guard passed ({len(allowed_files)} tracked inputs)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
