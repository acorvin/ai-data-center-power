# AI Data Center Power

**Ten data centers hold 39% of the AI power capacity Epoch AI tracks.** An interactive page on the largest AI data centers in Epoch AI's open database. It shows all 73 sites with power capacity as circles sized by megawatts, then ranks the ten largest by power, by computing and by computing per megawatt, and opens each one to show its owner, users and estimated cost.

Both figures are drawn with D3: the circle layout is a D3 force simulation computed in the browser, and the ranked list uses D3 scales, a data join and transitions.

## Run it

```bash
python3 scripts/build.py     # rebuilds docs/index.html from the CSV
cd docs && python3 -m http.server 8000
```

`src/page.template.html` is the page. `scripts/build.py` reads `data/data-centers-power.csv` and `data/ten-largest-details.json`, works out the totals, and writes the data into `docs/index.html`. The page loads D3 and Geist from CDNs when opened on its own. On alexcorvin.io the copy is patched to use the site's own files (`npm run sync:projects`).

## Data

Epoch AI, *AI Data Centers*, https://epoch.ai/data/data-centers. Updated 5 October 2026. Released under a Creative Commons Attribution license.

- `data/data-centers-power.csv` holds the fields used here for all 93 sites.
- `data/ten-largest-details.json` holds location, owner and users for the ten largest, with Epoch's own confidence ratings.

Notes on the data:

- 20 of the 93 sites show no current power capacity, so they are not drawn.
- Epoch's capital cost is a constant $37.882 million per megawatt at every site, so cost here is an implied figure and is not used to rank.
- Epoch lists no owner or user for the two DayOne sites.
- Epoch estimates its list covers about 43% of the world's deployed AI computing.

## Fonts

Geist and Geist Mono, used under the SIL Open Font License.
