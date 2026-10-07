"""Build the AI Data Center Power page.

Reads data/data-centers-power.csv (fields from Epoch AI's AI Data Centers database) and
data/ten-largest-details.json (place, owner and users for the ten largest, with Epoch's confidence ratings),
works out the totals, injects the data into src/page.template.html and writes docs/index.html.
The circle layout is computed in the browser with D3, so nothing here is pre-positioned.

Usage:
  python3 scripts/build.py
"""

from __future__ import annotations

import csv
import json
import statistics
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CSV_PATH = ROOT / "data" / "data-centers-power.csv"
DETAILS = ROOT / "data" / "ten-largest-details.json"
TEMPLATE = ROOT / "src" / "page.template.html"
OUT = ROOT / "docs" / "index.html"
UPDATED = "5 October 2026"  # Epoch AI's "last updated" date for the download


def main() -> None:
    details = json.loads(DETAILS.read_text())
    rows = list(csv.DictReader(CSV_PATH.open(encoding="utf-8")))
    live = [r for r in rows if float(r["Power capacity (MW)"]) > 0]

    sites = [
        {
            "n": r["Site"],
            "c": r["Country"],
            "mw": float(r["Power capacity (MW)"]),
            "rank": int(r["Rank by power"]) if r["Group"] == "Ten largest" else None,
        }
        for r in live
    ]
    ten = []
    for r in live:
        if r["Group"] != "Ten largest":
            continue
        d = details[r["Site"]]
        ten.append({
            "rank": int(r["Rank by power"]),
            "name": r["Site"],
            "place": d["place"],
            "country": r["Country"],
            "mw": float(r["Power capacity (MW)"]),
            "h100": int(r["Computing (H100-equivalents)"]),
            "cost": float(r["Implied capital cost (2025 USD billions)"]),
            "owner": d["owner"],
            "users": d["users"],
        })

    total_mw = sum(s["mw"] for s in sites)
    ten_mw = sum(t["mw"] for t in ten)
    per_mw = [int(r["Computing (H100-equivalents)"]) / float(r["Power capacity (MW)"]) for r in live]
    cost_per_mw = {round(float(r["Implied capital cost (2025 USD billions)"]) * 1000 / float(r["Power capacity (MW)"]), 1) for r in live}
    totals = {
        "all": len(rows),
        "live": len(live),
        "mw": round(total_mw, 1),
        "tenMw": round(ten_mw, 1),
        "medianPerMw": round(statistics.median(per_mw)),
        "costPerMw": 37.882,  # constant in Epoch's data ($ millions per MW); see README
        "updated": UPDATED,
    }
    print(totals, "| distinct cost per MW:", sorted(cost_per_mw), "| US sites:", sum(s["c"] == "United States" for s in sites))

    html = TEMPLATE.read_text().replace("/*__DATA__*/null", json.dumps({"sites": sites, "ten": ten, "totals": totals}, ensure_ascii=False))
    OUT.write_text(html)
    print(f"wrote {OUT.relative_to(ROOT)} ({len(html) / 1000:.0f} KB)")


if __name__ == "__main__":
    main()
