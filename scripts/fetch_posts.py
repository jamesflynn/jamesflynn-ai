#!/usr/bin/env python3
"""Fetch the Substack RSS feed and write posts.json for the Writing section."""

import json
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path

FEED_URL = "https://jamesflynn8.substack.com/feed"
OUT_PATH = Path(__file__).resolve().parent.parent / "posts.json"
MAX_POSTS = 6


def main():
    req = urllib.request.Request(FEED_URL, headers={"User-Agent": "jamesflynn.ai posts fetcher"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        root = ET.fromstring(resp.read())

    posts = []
    for item in root.iter("item"):
        title = item.findtext("title", "").strip()
        link = item.findtext("link", "").strip()
        description = item.findtext("description", "").strip()
        pub_date = item.findtext("pubDate", "").strip()

        enclosure = item.find("enclosure")
        image = enclosure.get("url") if enclosure is not None else None

        # Normalize date to ISO for easy client-side formatting
        iso_date = None
        if pub_date:
            dt = datetime.strptime(pub_date, "%a, %d %b %Y %H:%M:%S %Z").replace(tzinfo=timezone.utc)
            iso_date = dt.date().isoformat()

        posts.append({
            "title": title,
            "description": description,
            "link": link,
            "date": iso_date,
            "image": image,
        })

        if len(posts) >= MAX_POSTS:
            break

    OUT_PATH.write_text(json.dumps({"posts": posts}, indent=2) + "\n")
    print(f"Wrote {len(posts)} posts to {OUT_PATH}")


if __name__ == "__main__":
    main()
