# AI Data Center Power

An interactive page on the largest AI data centers in Epoch AI's open database.

Live page: https://acorvin.github.io/ai-data-center-power/

## The problem

Epoch AI's open database lists 93 data centers built for artificial intelligence, with estimates of their power, computing and cost. As a table it does not show how concentrated that capacity is, or how the largest sites compare when ranked by power instead of by computing.

## What I did

I drew all 73 sites that have power capacity today as circles sized by megawatts, using a D3 force layout, and ranked the ten largest three ways: by power, by computing, and by computing per megawatt. Each site opens to show its owner, its users and its estimated cost. A Python script reads Epoch's data, works out the totals and builds the page.

## What it found

- The ten largest sites hold 5,356 of the 13,833 megawatts in the database, or 39%.
- Eight of the ten are in the United States, and the other two are DayOne sites in Malaysia.
- Google's Pryor site has the ninth-most power of the ten but the fourth-most computing, at an estimated 1,730 H100-equivalents per megawatt, against a median of 1,137 across all 73 sites.

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
