// WCAG AA contrast for the text/background pairs the app actually uses (rule M9). Reads src/constants/theme.ts.
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../src/constants/theme.ts', import.meta.url), 'utf8');

function palette(name) {
  const block = source.match(new RegExp(`${name}: \\{([\\s\\S]*?)\\n  \\}`))?.[1] ?? '';
  return Object.fromEntries([...block.matchAll(/(\w+): '(#[0-9a-fA-F]{6})'/g)].map((m) => [m[1], m[2]]));
}

const channel = (v) => {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};
const luminance = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return 0.2126 * channel(n >> 16) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
};
const ratio = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

// [text token, background token, minimum ratio]
const PAIRS = [
  ['foreground', 'background', 4.5],
  ['foreground', 'card', 4.5],
  ['mutedForeground', 'background', 4.5],
  ['mutedForeground', 'card', 4.5],
  ['mutedForeground', 'muted', 4.5],
  ['mutedForeground', 'secondary', 4.5],
  ['foreground', 'secondary', 4.5],
  ['primaryForeground', 'primary', 4.5],
  ['primary', 'background', 4.5], // ghost buttons
  ['primary', 'card', 4.5],
  ['accentForeground', 'accent', 4.5], // the assistant's question bubble
  ['destructive', 'background', 4.5],
  ['destructive', 'card', 4.5],
  ['warning', 'background', 4.5],
  ['warning', 'card', 4.5],
  ['agent', 'background', 4.5],
  ['agent', 'card', 4.5],
  ['fact', 'factSoft', 4.5], // the three evidence tags sit on their soft tints
  ['source', 'sourceSoft', 4.5],
  ['synth', 'synthSoft', 4.5],
  ['synth', 'card', 4.5],
  ['warning', 'warningSoft', 4.5],
  ['critical', 'criticalSoft', 4.5],
  ['success', 'successSoft', 4.5],
];

let failed = 0;
for (const scheme of ['light', 'dark']) {
  const colors = palette(scheme);
  for (const [fg, bg, min] of PAIRS) {
    const value = ratio(colors[fg], colors[bg]);
    const ok = value >= min;
    if (!ok) failed += 1;
    console.log(`${ok ? 'ok  ' : 'FAIL'} ${scheme.padEnd(5)} ${fg} on ${bg}: ${value.toFixed(2)} (min ${min})`);
  }
}
if (failed) {
  console.error(`\n${failed} contrast pair(s) below WCAG AA.`);
  process.exit(1);
}
