import { interpolateColors } from 'remotion';

export const W = 1080;
export const H = 1920;
export const FPS = 30;

export const C = {
  blue: '#0d4ea6',
  garnet: '#a50044',
  gold: '#f2c230',
  goldDeep: '#c9a227',
  red: '#d1202f',
  white: '#f7f5ef',
  ink: '#111114',
  bgDark: '#0b0b0e',
};

// Barça Radar's licensed local fonts (studio/public/fonts, OFL), loaded under private names in Short.tsx
export const DISPLAY = '"NR Anton", Impact, sans-serif';
export const BODY = '"NR Montserrat", Arial, sans-serif';

// a colour as the crest shows it when its part is "off": desaturated and dimmed
const grayOf = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const l = Math.round((0.3 * r + 0.59 * g + 0.11 * b) * 0.55 + 18);
  return `rgb(${l},${l},${l})`;
};

export const dim = (hex: string, off: number) => (off <= 0 ? hex : interpolateColors(off, [0, 1], [hex, grayOf(hex)]));
