#!/usr/bin/env python3
"""Prepare a narrow GitOps promotion PR. No Kubernetes or server access."""

import argparse
import json
from pathlib import Path
import re
import sys

HEX = re.compile(r"^[0-9a-f]{40}$")
DIGEST = re.compile(r"^sha256:[0-9a-f]{64}$")
RELEASE = re.compile(r"^release-v(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$")
TAG = re.compile(r"^v(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$")
IMAGE = re.compile(r"(?m)^([ ]*image: )ghcr\.io/ball-worasan/(?:e-commerce-web|frontend-shop)@sha256:[0-9a-f]{64}$")
REVISION = re.compile(r"(?m)^([ ]*)(?:ecommerce|shop)\.worasan\.com/source-revision: [0-9a-f]{40}$")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--gitops", type=Path, required=True)
    parser.add_argument("--ref", required=True)
    parser.add_argument("--source", required=True)
    parser.add_argument("--digest", required=True)
    args = parser.parse_args()
    if not HEX.fullmatch(args.source) or not DIGEST.fullmatch(args.digest):
        raise ValueError("invalid source SHA or image digest")
    if args.ref == "development":
        env = "dev"
        release = None
    elif RELEASE.fullmatch(args.ref):
        env = "uat"
        release = args.ref.removeprefix("release-")
    elif TAG.fullmatch(args.ref):
        env = "prod"
        release = args.ref
    else:
        raise ValueError("ref is not development, a SemVer release branch or tag")

    gate = json.loads((args.gitops / "ops/frontend-shop-promotion.json").read_text())
    required = ("enabled", "handoff_complete", "feature_contract_accepted", "public_image_verified")
    if any(gate.get(key) is not True for key in required):
        raise ValueError("GitOps promotion gate is closed")
    if release and gate.get("active_release") != release:
        raise ValueError("another UAT release is active or none was selected")
    if env == "prod":
        if gate.get("production_ready") is not True:
            raise ValueError("production manifest/backend scope has not been accepted")
        record = json.loads((args.gitops / f"ops/frontend-shop-releases/{release}.json").read_text())
        if record != {"source_sha": args.source, "digest": args.digest, "uat_accepted": True}:
            raise ValueError("tag does not match accepted UAT source and digest")

    manifest = args.gitops / f"k8s/apps/frontend-shop/{env}/web.yaml"
    original = manifest.read_text()
    updated, images = IMAGE.subn(rf"\1ghcr.io/ball-worasan/frontend-shop@{args.digest}", original)
    updated, revisions = REVISION.subn(
        lambda match: f"{match.group(1)}shop.worasan.com/source-revision: {args.source}",
        updated,
    )
    if images != 1 or revisions != 1:
        raise ValueError("manifest image/revision layout changed")
    manifest.write_text(updated)
    if env == "uat":
        record = args.gitops / f"ops/frontend-shop-releases/{release}.json"
        record.parent.mkdir(parents=True, exist_ok=True)
        desired = {"source_sha": args.source, "digest": args.digest, "uat_accepted": False}
        if record.exists():
            previous = json.loads(record.read_text())
            if previous.get("source_sha") == args.source and previous.get("digest") == args.digest:
                desired["uat_accepted"] = previous.get("uat_accepted") is True
        record.write_text(json.dumps(desired, indent=2) + "\n")
    print(f"Prepared {env} image promotion to {args.digest}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (ValueError, OSError, json.JSONDecodeError) as exc:
        print(f"Promotion blocked: {exc}", file=sys.stderr)
        raise SystemExit(1)
