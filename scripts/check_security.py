#!/usr/bin/env python3
"""Validate security reporting sources, generated files, or deployed endpoints."""
import argparse
from datetime import datetime, timedelta, timezone
from html.parser import HTMLParser
from pathlib import Path
import sys
import time
from urllib.error import HTTPError, URLError
from urllib.parse import urljoin
from urllib.request import HTTPRedirectHandler, Request, build_opener, urlopen

REPORT = "https://github.com/ServiceStack/ServiceStack/security/advisories/new"
PORTAL = "https://account.servicestack.net/security"
POLICY = "https://servicestack.net/security"
ISSUES = "https://github.com/ServiceStack/Issues"
DISCOVERY = "/.well-known/security.txt"
LEGACY = "/security.txt"


class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.urls = set()

    def handle_starttag(self, tag, attrs):
        if tag == "a":
            self.urls.update(value for key, value in attrs if key == "href" and value)


def require(condition, message):
    if not condition:
        raise ValueError(message)


def validate_txt(text):
    fields = {}
    for line in text.splitlines():
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        key, separator, value = line.partition(":")
        require(separator and value.strip(), "Malformed security.txt field")
        fields.setdefault(key, []).append(value.strip())
    require(fields.get("Contact") == [REPORT, PORTAL], "Reporting contacts or their priority have changed")
    require(fields.get("Policy") == [POLICY], "Missing canonical policy URL")
    require(fields.get("Canonical") == ["https://servicestack.net" + DISCOVERY],
            "Use only the /.well-known/security.txt canonical URL")
    require(fields.get("Preferred-Languages") == ["en"], "Missing reporting language")
    require(len(fields.get("Expires", [])) == 1, "Exactly one Expires field is required")
    expires = datetime.fromisoformat(fields["Expires"][0].replace("Z", "+00:00"))
    require(expires.tzinfo is not None, "Expires must include a timezone")
    require(expires > datetime.now(timezone.utc) + timedelta(days=30),
            "Renew security.txt: it expires within 30 days or has already expired")


def validate_page(html):
    parser = Links()
    parser.feed(html)
    require({REPORT, PORTAL, ISSUES}.issubset(parser.urls), "Security page is missing reporting links")
    require("report a security vulnerability" in html.lower(), "Security endpoint returned an unrelated page")
    require(DISCOVERY in parser.urls, "Security page is missing the security.txt link")


def check_source(app):
    text = (app / "wwwroot/.well-known/security.txt").read_text(encoding="utf-8")
    validate_txt(text)
    page = (app / "_pages/security.md").read_text(encoding="utf-8")
    require(all(url in page for url in (REPORT, PORTAL, ISSUES, DISCOVERY)), "Policy source is missing reporting links")
    footer = (app / "Pages/Shared/Footer.cshtml").read_text(encoding="utf-8")
    require('ContentUrl("/security")' in footer, "Footer is missing the security page")


def check_dist(dist):
    text = (dist / ".well-known/security.txt").read_text(encoding="utf-8")
    validate_txt(text)
    require(not (dist / "security.txt").exists(), "Do not publish a duplicate security.txt; production uses an HTTP redirect")
    page = next((path for path in (dist / "security.html", dist / "security/index.html") if path.is_file()), None)
    require(page is not None, "Static build is missing the security page")
    validate_page(page.read_text(encoding="utf-8-sig"))


def fetch(url):
    request = Request(url, headers={"User-Agent": "ServiceStack-Security-Discovery-Check/1.0"})
    with urlopen(request, timeout=30) as response:
        require(response.status == 200, f"{url} returned HTTP {response.status}")
        require(response.url.startswith("https://"), f"{url} redirected away from HTTPS")
        return response.read(2 * 1024 * 1024).decode("utf-8-sig"), response.headers.get_content_type(), response.headers.get_content_charset()



class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def check_legacy_redirect(base):
    url = base.rstrip("/") + LEGACY
    request = Request(url, headers={"User-Agent": "ServiceStack-Security-Discovery-Check/1.0"})
    try:
        with build_opener(NoRedirect()).open(request, timeout=30) as response:
            raise ValueError(f"{url} must return a permanent HTTP redirect, not HTTP {response.status}")
    except HTTPError as response:
        with response:
            require(response.code in (301, 308), f"{url} must return HTTP 301 or 308, got {response.code}")
            target = urljoin(url, response.headers.get("Location", ""))
            require(target == base.rstrip("/") + DISCOVERY, "Legacy security.txt redirects to the wrong location")


def check_live(base):
    require(base.startswith("https://"), "Deployed checks require HTTPS")
    page, content_type, _ = fetch(base.rstrip("/") + "/security")
    require(content_type == "text/html", "Security policy must be served as HTML")
    validate_page(page)
    canonical, content_type, charset = fetch(base.rstrip("/") + DISCOVERY)
    require(content_type == "text/plain" and (charset or "").lower() == "utf-8",
            "security.txt must be served as text/plain; charset=utf-8")
    validate_txt(canonical)
    check_legacy_redirect(base)
    # GET only: verify that reporters can reach the form or its sign-in page.
    for contact in (REPORT, PORTAL):
        fetch(contact)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--app", type=Path, default=Path(__file__).resolve().parents[1] / "MyApp")
    parser.add_argument("--dist", type=Path)
    parser.add_argument("--live", help="Check the deployed HTTPS site as well as sources")
    parser.add_argument("--attempts", type=int, default=1)
    parser.add_argument("--delay", type=int, default=10)
    args = parser.parse_args()
    check_source(args.app)
    if args.dist:
        check_dist(args.dist)
    if args.live:
        for attempt in range(max(1, args.attempts)):
            try:
                check_live(args.live)
                break
            except (ValueError, HTTPError, URLError, TimeoutError, OSError):
                if attempt + 1 >= args.attempts:
                    raise
                print("Waiting for reporting endpoints/cache propagation...", flush=True)
                time.sleep(args.delay)
    print("Security reporting checks passed.")


if __name__ == "__main__":
    try:
        main()
    except (ValueError, HTTPError, URLError, TimeoutError, OSError) as error:
        print(f"Security reporting check failed: {error}", file=sys.stderr)
        sys.exit(1)
