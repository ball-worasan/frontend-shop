#!/usr/bin/env python3
"""Scan every saved image layer and image metadata before publication.

The scanner sees each raw layer independently, including deleted files. It prints
redacted findings only. The image tar and scratch stay in the GitHub runner temp.
"""

import json
import os
from pathlib import Path
import re
import subprocess
import sys
import tarfile
import tempfile

GITLEAKS = os.environ.get("GITLEAKS_BIN", "gitleaks")
GITLEAKS_CONFIG = Path(__file__).with_name("gitleaks-image.toml")
SENSITIVE = re.compile(r"(secret|token|password|private.?key|credential|api.?key)", re.I)


def run_scan(path: Path) -> bool:
    command = [
        GITLEAKS, "dir", str(path), "--no-banner", "--redact", "--exit-code", "1",
        "--config", str(GITLEAKS_CONFIG),
    ]
    return subprocess.run(command, check=False).returncode == 0


def main() -> int:
    image_tar = Path(sys.argv[1]).resolve()
    if not image_tar.is_file():
        raise ValueError("image tar missing")
    with tempfile.TemporaryDirectory(prefix="shop-layer-scan-") as work:
        scratch = Path(work)
        with tarfile.open(image_tar) as image:
            manifest = json.load(image.extractfile("manifest.json"))
            if len(manifest) != 1 or not manifest[0].get("Layers"):
                raise ValueError("unexpected Docker image archive")
            config_name = manifest[0]["Config"]
            config = json.load(image.extractfile(config_name))
            config_file = scratch / "image-config.json"
            config_file.write_text(json.dumps(config))
            env = config.get("config", {}).get("Env", [])
            if any(SENSITIVE.search(item.split("=", 1)[0]) for item in env):
                print("Image config contains sensitive ENV name", file=sys.stderr)
                return 1
            if not run_scan(scratch):
                print("Image config secret scan failed", file=sys.stderr)
                return 1
            for index, name in enumerate(manifest[0]["Layers"], 1):
                layer_dir = scratch / f"layer-{index:03d}"
                layer_dir.mkdir()
                member = image.extractfile(name)
                if member is None:
                    raise ValueError("image layer missing")
                with tarfile.open(fileobj=member, mode="r|*") as layer:
                    # Ignore absolute paths, links and special files. Scan real bytes.
                    for item in layer:
                        target = Path(item.name)
                        if item.isfile() and not target.is_absolute() and ".." not in target.parts:
                            output = layer_dir / target
                            output.parent.mkdir(parents=True, exist_ok=True)
                            source = layer.extractfile(item)
                            if source is None:
                                raise ValueError("layer file unreadable")
                            with output.open("wb") as dest:
                                while block := source.read(1024 * 1024):
                                    dest.write(block)
                if not run_scan(layer_dir):
                    print(f"Image layer {index} secret scan failed", file=sys.stderr)
                    return 1
                for root, dirs, files in os.walk(layer_dir, topdown=False):
                    for filename in files:
                        (Path(root) / filename).unlink()
                    for dirname in dirs:
                        (Path(root) / dirname).rmdir()
                layer_dir.rmdir()
            print(f"Image secret scan passed ({len(manifest[0]['Layers'])} raw layers)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
