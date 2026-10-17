import copy
import json
from pathlib import Path
import subprocess
import tempfile
import unittest
from unittest.mock import patch

import sync_s3_redirects as sync


class SyncS3RedirectsTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.rules_path = Path(self.temporary.name) / "rules.json"
        self.rules = [{"Condition": {"KeyPrefixEquals": "security.txt"}, "Redirect": {
            "ReplaceKeyWith": ".well-known/security.txt", "HttpRedirectCode": "301", "Protocol": "https"}}]
        self.rules_path.write_text(json.dumps(self.rules))
        self.current = {"IndexDocument": {"Suffix": "home.html"}, "ErrorDocument": {"Key": "errors/404.html"},
                        "RoutingRules": [{"Redirect": {"HostName": "old.example"}}]}

    def test_update_preserves_document_settings_and_replaces_only_routing_rules(self):
        original = copy.deepcopy(self.current)
        written = []

        def aws_call(*args):
            if args[0] == "get-bucket-website":
                return subprocess.CompletedProcess(args, 0, stdout=json.dumps(self.current))
            self.assertEqual(args[0], "put-bucket-website")
            self.assertEqual(args[args.index("--bucket") + 1], "example-bucket")
            config = args[args.index("--website-configuration") + 1]
            written.append(json.loads(Path(config.removeprefix("file://")).read_text()))
            return subprocess.CompletedProcess(args, 0, stdout="")

        with patch.object(sync, "aws", side_effect=aws_call) as aws:
            sync.sync_redirects("example-bucket", self.rules_path)
        self.assertEqual(aws.call_count, 2)
        self.assertEqual(written, [{**self.current, "RoutingRules": self.rules}])
        self.assertEqual(self.current, original)

    def test_no_write_when_rules_already_match(self):
        self.current["RoutingRules"] = self.rules
        with patch.object(sync, "aws", return_value=subprocess.CompletedProcess([], 0, stdout=json.dumps(self.current))) as aws:
            sync.sync_redirects("example-bucket", self.rules_path)
        self.assertEqual(aws.call_count, 1)

    def test_absent_error_document_is_not_replaced_with_a_default(self):
        result = sync.merge_configuration({"IndexDocument": {"Suffix": "custom.html"}}, self.rules)
        self.assertEqual(result, {"IndexDocument": {"Suffix": "custom.html"}, "RoutingRules": self.rules})

    def test_invalid_rules_fail_before_any_aws_call(self):
        for rules in ({}, [], [None], [{"Redirect": {}}], self.rules * 51):
            with self.subTest(rules=rules):
                self.rules_path.write_text(json.dumps(rules))
                with patch.object(sync, "aws") as aws:
                    with self.assertRaises(ValueError):
                        sync.sync_redirects("example-bucket", self.rules_path)
                    aws.assert_not_called()

    def test_unreadable_or_malformed_rules_fail_before_any_aws_call(self):
        for content in ("not JSON", None):
            with self.subTest(content=content):
                if content is None:
                    self.rules_path.unlink()
                else:
                    self.rules_path.write_text(content)
                with patch.object(sync, "aws") as aws:
                    with self.assertRaises((ValueError, OSError)):
                        sync.sync_redirects("example-bucket", self.rules_path)
                    aws.assert_not_called()

    def test_incompatible_or_missing_website_configuration_is_not_overwritten(self):
        for current in ({"RedirectAllRequestsTo": {"HostName": "example.com"}}, {}, {"IndexDocument": {}}, []):
            with self.subTest(current=current):
                with patch.object(sync, "aws", return_value=subprocess.CompletedProcess([], 0, stdout=json.dumps(current))) as aws:
                    with self.assertRaises(ValueError):
                        sync.sync_redirects("example-bucket", self.rules_path)
                    self.assertEqual(aws.call_count, 1)

    def test_failed_read_does_not_attempt_a_write(self):
        with patch.object(sync, "aws", side_effect=subprocess.CalledProcessError(1, "aws", stderr="AccessDenied")) as aws:
            with self.assertRaises(subprocess.CalledProcessError):
                sync.sync_redirects("example-bucket", self.rules_path)
            self.assertEqual(aws.call_count, 1)

    def test_failed_write_is_reported_as_failure(self):
        with patch.object(sync, "aws", side_effect=[
            subprocess.CompletedProcess([], 0, stdout=json.dumps(self.current)),
            subprocess.CalledProcessError(1, "aws", stderr="AccessDenied")]):
            with self.assertRaises(subprocess.CalledProcessError):
                sync.sync_redirects("example-bucket", self.rules_path)


if __name__ == "__main__":
    unittest.main()
