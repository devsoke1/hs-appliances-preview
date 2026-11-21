import { mkdirSync, writeFileSync } from "node:fs";

const brands = {
  beko: "BEKO",
  lg: "LG",
  samsung: "SAMSUNG",
  bosch: "BOSCH",
  aeg: "AEG",
  miele: "MIELE",
  hotpoint: "HOTPOINT",
  indesit: "INDESIT",
  whirlpool: "WHIRLPOOL",
  siemens: "SIEMENS",
  neff: "NEFF",
  zanussi: "ZANUSSI",
  foster: "FOSTER",
  williams: "WILLIAMS",
  true: "TRUE",
  hoshizaki: "HOSHIZAKI",
  scotsman: "SCOTSMAN",
  daikin: "DAIKIN",
  "mitsubishi-electric": "MITSUBISHI",
};

mkdirSync("public/brands", { recursive: true });
for (const [slug, label] of Object.entries(brands)) {
  const w = Math.max(148, Math.round(label.length * 16 + 36));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} 48" role="img" aria-label="${label}"><text x="50%" y="32" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="700" fill="#00243A" letter-spacing="0.4">${label}</text></svg>`;
  writeFileSync(`public/brands/${slug}.svg`, svg);
}
console.log(`wrote ${Object.keys(brands).length} brand marks`);
