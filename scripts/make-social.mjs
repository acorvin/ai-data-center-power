// Social graphic (1600 x 2000, 4:5) using the same D3 cluster layout as the page.
// Run from the alexcorvin-io repo (needs d3 and @resvg/resvg-js):  node scripts/make-social.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const SITE = '/Users/nostromo/Documents/alexcorvin-io/node_modules';
const d3 = await import(SITE + '/d3/src/index.js');
const { Resvg } = await import(SITE + '/@resvg/resvg-js/index.js');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const html = fs.readFileSync(path.join(root, 'docs/index.html'), 'utf8');
const D = JSON.parse(html.match(/const D=(\{.*?\});\nconst fmt/s)[1]);

const W = 1600, H = 2000, M = 107, INK = '#1c1e21', MUTED = '#5a5e66', SOFT = '#8b8e93', FAINT = '#e3e4e1';
const nodes = D.sites.map(s => ({ ...s, r: 2.03 * Math.sqrt(s.mw) }));
const sim = d3.forceSimulation(nodes).force('x', d3.forceX(0).strength(.045)).force('y', d3.forceY(0).strength(.3))
  .force('c', d3.forceCollide(d => d.r + 1.6).iterations(4)).stop();
for (let i = 0; i < 500; i++) sim.tick();
const x0 = d3.min(nodes, d => d.x - d.r), x1 = d3.max(nodes, d => d.x + d.r), y0 = d3.min(nodes, d => d.y - d.r), y1 = d3.max(nodes, d => d.y + d.r);
const top = 950, band = 560;
const k = Math.min((W - 2 * M) / (x1 - x0), band / (y1 - y0));
const ox = W / 2 - (x0 + x1) / 2 * k, oy = top + band / 2 - (y0 + y1) / 2 * k;

let g = '';
for (const d of [...nodes].sort((a, b) => (a.rank ? 1 : 0) - (b.rank ? 1 : 0) || a.mw - b.mw)) {
  const cx = ox + d.x * k, cy = oy + d.y * k, r = d.r * k;
  g += `<circle cx="${cx}" cy="${cy}" r="${r - 1.5}" fill="${d.rank ? '#c06a85' : '#3f6c96'}" fill-opacity="${d.rank ? 1 : .78}" stroke="#f8f7f4" stroke-width="3"/>`;
  if (d.rank && d.rank <= 3) g += `<circle cx="${cx}" cy="${cy}" r="${r - 12}" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="2"/>`;
  if (d.rank) { const fs = Math.max(15, d.r * .78) * k; g += `<text x="${cx}" y="${cy + fs * .34}" font-size="${fs}" fill="#fff" text-anchor="middle" font-weight="300">${d.rank}</text>`; }
}
const t = D.totals, fmt = d3.format(',.0f');
const mono = (x, y, s, txt, fill = MUTED, extra = '') => `<text x="${x}" y="${y}" font-family="Geist Mono" font-size="${s}" ${extra.includes('letter-spacing') ? '' : `letter-spacing="${s * .09}"`} fill="${fill}" ${extra}>${txt}</text>`;
const sans = (x, y, s, txt, fill = INK, extra = '') => `<text x="${x}" y="${y}" font-family="Geist" font-size="${s}" fill="${fill}" ${extra.includes('font-weight') ? '' : 'font-weight="300"'} ${extra}>${txt}</text>`;
const rows = D.ten.slice(0, 3).map((s, i) => {
  const y = 1700 + i * 62;
  return `<line x1="${M}" x2="${W - M}" y1="${y - 40}" y2="${y - 40}" stroke="${FAINT}" stroke-width="2"/>` +
    mono(M, y, 30, s.rank, SOFT) + sans(M + 65, y, 34, `${s.name}, ${s.place.split(', ').pop()}`, INK, 'font-weight="400"') +
    mono(W - M, y, 30, `${fmt(s.mw)} MW`, INK, 'text-anchor="end"');
}).join('');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="#f8f7f4"/>
${mono(M, 138, 32, 'AI INFRASTRUCTURE · OCTOBER 2026')}
${sans(M, 300, 114, 'Ten data centers hold 39%', INK, 'letter-spacing="-3.2"')}
${sans(M, 423, 114, 'of the AI power capacity', INK, 'letter-spacing="-3.2"')}
${sans(M, 546, 114, 'Epoch AI tracks.', SOFT, 'letter-spacing="-3.2"')}
${sans(M, 633, 37, `That is ${fmt(t.tenMw)} of the ${fmt(t.mw)} megawatts at the ${t.live} sites with capacity today.`, MUTED)}
${sans(M, 688, 37, `${t.all - t.live} more of the ${t.all} sites Epoch AI follows have none yet. Epoch estimates it`, MUTED)}
${sans(M, 742, 37, `covers about 43% of the world’s deployed AI computing.`, MUTED)}
${mono(M, 842, 30, 'EACH CIRCLE IS ONE SITE, SIZED BY POWER CAPACITY')}
<circle cx="${M + 14}" cy="905" r="14" fill="#c06a85"/>${sans(M + 47, 916, 34, `The ten largest, numbered: ${fmt(t.tenMw)} MW`, INK, 'font-weight="400"')}
<circle cx="835" cy="905" r="14" fill="#3f6c96" fill-opacity=".78"/>${sans(868, 916, 34, `The other ${t.live - 10} sites`, INK, 'font-weight="400"')}
${g}
${mono(M, 1626, 28, 'THE THREE LARGEST SITES')}
${rows}
<line x1="${M}" x2="${W - M}" y1="1860" y2="1860" stroke="${FAINT}" stroke-width="2"/>
${mono(M, 1916, 28, 'SOURCE: EPOCH AI, AI DATA CENTERS', SOFT)}${mono(M, 1960, 28, 'DATA UPDATED 5 OCT 2026 · CC BY', SOFT)}
${mono(W - M, 1920, 34, 'alexcorvin.io', INK, 'text-anchor="end" letter-spacing="0"')}
</svg>`;
const fonts = ['Geist-Variable.ttf', 'GeistMono-Variable.ttf'].map(f => '/Users/nostromo/Downloads/ai-data-center-power/fonts/' + f);
const png = new Resvg(svg, { font: { fontFiles: fonts, loadSystemFonts: false, defaultFontFamily: 'Geist' } }).render().asPng();
fs.mkdirSync(path.join(root, 'social'), { recursive: true });
fs.writeFileSync(path.join(root, 'social/ai-data-center-power-4x5.png'), png);
console.log('wrote social/ai-data-center-power-4x5.png');
