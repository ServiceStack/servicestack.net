#!/usr/bin/env python3
"""Apply routing rules while preserving the bucket's existing website settings."""
import argparse
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile


def validate_rules(rules):
    if not isinstance(rules, list) or not 1 <= len(rules) <= 50:
        raise ValueError("Routing rules must be a JSON array containing 1 to 50 rules.")
    for rule in rules:
        if not isinstance(rule, dict) or not isinstance(rule.get("Redirect"), dict) or not rule["Redirect"]:
            raise ValueError("Each routing rule must contain a non-empty Redirect object.")


def merge_configuration(current, rules):
    if not isinstance(current, dict):
        raise ValueError("S3 returned an invalid website configuration.")
    if "RedirectAllRequestsTo" in current:
        raise ValueError("Cannot apply routing rules to a bucket that redirects all requests.")
    if not isinstance(current.get("IndexDocument"), dict) or not current["IndexDocument"].get("Suffix"):
        raise ValueError("The bucket must already have static website hosting configured with an index document.")
    validate_rules(rules)
    return {**current, "RoutingRules": rules}


def aws(*args):
    return subprocess.run(["aws", "s3api", *args], check=True, capture_output=True, text=True,
                          env={**os.environ, "AWS_PAGER": ""})


def sync_redirects(bucket, rules_path):
    rules = json.loads(rules_path.read_text(encoding="utf-8"))
    validate_rules(rules)
    current = json.loads(aws("get-bucket-website", "--bucket", bucket, "--output", "json").stdout)
    updated = merge_configuration(current, rules)
    if updated == current:
        print(f"S3 website routing rules already match {rules_path}.")
        return
    with tempfile.TemporaryDirectory(prefix="s3-website-") as temporary:
        config_path = Path(temporary) / "website.json"
        config_path.write_text(json.dumps(updated), encoding="utf-8")
        aws("put-bucket-website", "--bucket", bucket,
            "--website-configuration", "file://" + str(config_path))
    print(f"Applied {len(rules)} routing rules to {bucket}; preserved existing website document settings.")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--bucket", required=True)
    parser.add_argument("--rules", required=True, type=Path)
    args = parser.parse_args()
    sync_redirects(args.bucket, args.rules)


if __name__ == "__main__":
    try:
        main()
    except subprocess.CalledProcessError as error:
        print(f"S3 website configuration update failed: {error.stderr or error}", file=sys.stderr)
        sys.exit(1)
    except (ValueError, OSError) as error:
        print(f"S3 website configuration update failed: {error}", file=sys.stderr)
        sys.exit(1)
