// Heraldic artwork for the crest-history episode: the FC Barcelona crest redrawn on a 1000-unit grid from
// measurements of the club's current crest (outline, field borders, stripe counts and positions, ball seams),
// plus the related symbols the episode explains (Senyera, England's flag, Barcelona's city arms).
import React from 'react';

export const CREST = {gold: '#edbb00', black: '#0a0a0c', white: '#ffffff', red: '#db0030', yellow: '#ffed02', blue: '#004d98', garnet: '#a50044', empty: '#101b38'};

type Pt = [number, number];
type Seg = {line?: boolean; pts: Pt[]};

/** Catmull-Rom through the points as cubic Béziers (no leading M). */
const curve = (p: Pt[]) => {
  let d = '';
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[Math.max(0, i - 1)], p1 = p[i], p2 = p[i + 1], p3 = p[Math.min(p.length - 1, i + 2)];
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0]} ${p2[1]}`;
  }
  return d;
};
const segs = (list: Seg[]) => list.map((s) => s.line ? s.pts.slice(1).map(([x, y]) => ` L${x} ${y}`).join('') : curve(s.pts)).join('');
const mirror = (list: Seg[]): Seg[] => [...list].reverse().map((s) => ({...s, pts: [...s.pts].reverse().map(([x, y]) => [1000 - x, y] as Pt)}));
/** A symmetric closed path from its left half, given from the top centre round to the bottom centre. */
const symmetric = (left: Seg[]) => `M${left[0].pts[0][0]} ${left[0].pts[0][1]}${segs(left)}${segs(mirror(left))} Z`;
const half = (left: Seg[]) => `M${left[0].pts[0][0]} ${left[0].pts[0][1]}${segs(left)} Z`;

// Outer silhouette: two pointed "ears", raised top corners, wings level with the initials band, pointed base.
const OUTER: Seg[] = [
  {pts: [[500, 76], [460, 71], [420, 60], [385, 42], [351, 21]]},
  {pts: [[351, 21], [321, 40], [287, 55], [250, 64], [213, 68], [175, 68], [138, 62], [103, 50]]},
  {line: true, pts: [[103, 50], [60, 108]]},
  {pts: [[60, 108], [68, 120], [76, 132], [86, 150], [98, 174], [108, 198], [115, 222], [120, 246], [122, 270], [121, 294], [118, 318], [113, 342], [106, 366], [95, 390], [83, 414], [72, 432], [55, 456], [37, 480], [16, 504]]},
  {line: true, pts: [[16, 504], [63, 551], [63, 600]]},
  {pts: [[63, 600], [65, 630], [69, 660], [75, 684], [82, 708], [91, 732], [101, 756], [115, 780], [132, 804], [152, 828], [179, 852], [213, 876], [259, 900], [290, 912], [332, 924], [360, 930], [397, 936], [430, 941]]},
  {line: true, pts: [[430, 941], [500, 999]]},
];
// Upper field (cross | Senyera), inside the gold frame.
const UPPER: Seg[] = [
  {pts: [[500, 137], [453, 131], [427, 125], [407, 119], [388, 113], [367, 101], [350, 93]]},
  {pts: [[350, 93], [333, 101], [318, 107], [301, 113], [280, 119], [250, 125], [200, 130], [160, 128], [141, 124]]},
  {pts: [[141, 124], [144, 132], [148, 138], [153, 150], [158, 162], [163, 174], [167, 186], [170, 198], [173, 210], [176, 222], [178, 240], [180, 258], [180, 282], [179, 306], [176, 330], [171, 354], [164, 378], [156, 402], [153, 411]]},
  {line: true, pts: [[153, 411], [500, 411]]},
];
// Lower field (blaugrana stripes and the ball).
const LOWER: Seg[] = [
  {line: true, pts: [[500, 549], [124, 549]]},
  {pts: [[124, 549], [124, 600], [125, 630], [130, 660], [137, 690], [149, 720], [167, 750], [190, 780], [209, 798], [223, 810], [242, 822], [263, 834], [289, 846], [322, 858], [343, 864], [370, 870], [408, 876], [450, 879], [500, 880]]},
];
export const CREST_PATH = {outer: symmetric(OUTER), upper: symmetric(UPPER), lower: symmetric(LOWER), upperLeft: half(UPPER), upperRight: half(mirror(UPPER))};

const SEAMS: Pt[][] = [
  [[442, 629], [437, 650], [433, 672], [432, 694], [438, 715], [452, 732], [472, 739], [491, 728], [502, 709]],
  [[406, 753], [413, 753], [419, 752], [425, 751], [432, 749], [437, 746], [442, 741], [446, 736], [450, 731]],
  [[501, 710], [515, 704], [529, 706], [540, 717], [546, 730], [558, 733], [572, 736], [584, 745], [592, 758]],
  [[548, 735], [540, 749], [530, 761], [516, 771], [502, 779], [487, 784], [471, 788], [455, 791], [439, 793]],
  [[501, 712], [491, 701], [484, 689], [485, 674], [492, 661], [494, 649], [488, 636], [489, 622], [498, 610]],
  [[603, 718], [594, 704], [584, 691], [572, 679], [560, 669], [546, 660], [530, 654], [514, 651], [497, 653]],
];
// The initials' letterforms (F, C, B), in the source drawing's units; placed with the matrix where they are drawn.
const INITIALS = [
  'M266.3 461.88V462.16H252.33V534.82H267.43V504.66H288.96V489.29H267.43V477.5H304.58V461.88Z',
  'M380.57 484.64 394.12 477.56C385.47 458.44 350.41 453.01 338.87 477.56 326.97 506.86 339.62 534.07 362.66 536.72 377.29 538.85 388.89 531.69 393.82 518.96L380.42 511.28C376.85 520.17 363.25 526.29 352.87 511.43 349.68 504.79 348.86 494.57 352.42 484.64 360.93 472.95 373.37 474.21 380.57 484.64Z',
  'M432.36 462.07 432.64 535.38 472.55 535.22C485.54 533.4 502.56 512.15 482.61 495.63 493.16 486.34 491.84 466.46 470.74 462.22ZM447.71 476.5H467.58C476.32 479.02 473.73 487.42 467.86 488.85H447.71ZM447.86 503.16 468.77 503.44C479.11 506.52 476.77 518.3 469.08 520.32L448.02 520.16Z',
];
const STRIPE = 340 / 9; // Senyera pallet width: nine equal stripes from the centre line (the last gold one runs to the border)

export type CrestPart = 'cross' | 'senyera' | 'initials' | 'colours' | 'ball';
export const CREST_PARTS: CrestPart[] = ['cross', 'senyera', 'initials', 'colours', 'ball'];

type CrestProps = {
  width: number;
  id: string;
  /** 0..1 per part; a hidden part leaves its field empty (assembly). Defaults to all shown. */
  show?: Partial<Record<CrestPart, number>>;
  /** 0..1 per part; darkens that part so another one reads as the focus. */
  dim?: Partial<Record<CrestPart, number>>;
  /** Number of Senyera red pallets drawn (0..4, fractional grows the next one). */
  bars?: number;
  /** 0..1 draws the outline on; below 1 the fill is hidden. */
  draw?: number;
  /** Gold glow round one part. */
  glow?: CrestPart; glowAmount?: number;
  shadow?: boolean; shine?: boolean;
};

const BAND_BOX = {x: 130, y: 416, w: 740, h: 128};

export const Crest: React.FC<CrestProps> = ({width, id, show = {}, dim = {}, bars = 4, draw = 1, glow, glowAmount = 1, shadow = true, shine = true}) => {
  const s = (p: CrestPart) => show[p] ?? 1; const dm = (p: CrestPart) => dim[p] ?? 0;
  const filled = Math.max(0, Math.min(1, (draw - 0.75) / 0.25));
  const u = (n: string) => `${id}-${n}`;
  const glowPath = glow === 'cross' ? CREST_PATH.upperLeft : glow === 'senyera' ? CREST_PATH.upperRight : glow === 'colours' ? CREST_PATH.lower : undefined;
  return <svg width={width} height={width * 1.01} viewBox="0 0 1000 1010" style={{overflow: 'visible'}}>
    <defs>
      <clipPath id={u('outer')}><path d={CREST_PATH.outer} /></clipPath>
      <clipPath id={u('ul')}><path d={CREST_PATH.upperLeft} /></clipPath>
      <clipPath id={u('ur')}><path d={CREST_PATH.upperRight} /></clipPath>
      <clipPath id={u('low')}><path d={CREST_PATH.lower} /></clipPath>
      <clipPath id={u('ball')}><circle cx={501} cy={712} r={101} /></clipPath>
      <linearGradient id={u('shine')} x1="0" y1="0" x2="0.35" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity=".22" /><stop offset=".45" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity=".18" />
      </linearGradient>
      <filter id={u('shadow')} x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="22" stdDeviation="26" floodColor="#000" floodOpacity=".55" /></filter>
      <filter id={u('glow')} x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="14" /></filter>
    </defs>
    <g filter={shadow ? `url(#${u('shadow')})` : undefined} opacity={filled}>
      {/* frame: gold field with the black rim inside the silhouette */}
      <path d={CREST_PATH.outer} fill={CREST.gold} />
      <path d={CREST_PATH.outer} fill="none" stroke={CREST.black} strokeWidth={40} clipPath={`url(#${u('outer')})`} />
      {/* empty fields under every part */}
      <path d={CREST_PATH.upper} fill={CREST.empty} /><path d={CREST_PATH.lower} fill={CREST.empty} />
      <g clipPath={`url(#${u('ul')})`} opacity={s('cross')}>
        <rect x={100} y={60} width={400} height={380} fill={CREST.white} />
        <rect x={281} y={60} width={107} height={380} fill={CREST.red} transform={`translate(0 ${(1 - s('cross')) * -30})`} />
        <rect x={100} y={216} width={400} height={103} fill={CREST.red} transform={`translate(${(1 - s('cross')) * -30} 0)`} />
        <rect x={100} y={60} width={400} height={380} fill="#050a18" opacity={dm('cross') * .72} />
      </g>
      <g clipPath={`url(#${u('ur')})`} opacity={s('senyera')}>
        <rect x={500} y={60} width={400} height={380} fill={CREST.yellow} />
        {[0, 1, 2, 3].map((k) => { const g = Math.max(0, Math.min(1, bars - k)); return g > 0 ?
          <rect key={k} x={500 + (2 * k + 1) * STRIPE} y={60 + (1 - g) * 380} width={STRIPE} height={380 * g} fill={CREST.red} /> : null; })}
        <rect x={500} y={60} width={400} height={380} fill="#050a18" opacity={dm('senyera') * .72} />
      </g>
      <path d={CREST_PATH.upper} fill="none" stroke={CREST.black} strokeWidth={8} />
      <line x1={499} y1={128} x2={499} y2={411} stroke={CREST.black} strokeWidth={5} />
      <g opacity={s('initials')} fill={CREST.black} fillRule="evenodd" transform={`matrix(1.3328 0 0 1.3328 2.8456 ${-182.0467 + (1 - s('initials')) * 24})`}>
        {INITIALS.map((d) => <path key={d.slice(0, 12)} d={d} />)}
      </g>
      <rect {...BAND_BOX} fill="#050a18" opacity={dm('initials') * .62} rx={10} />
      <g clipPath={`url(#${u('low')})`}>
        <g opacity={s('colours')}>
          <rect x={100} y={540} width={800} height={360} fill={CREST.blue} />
          {[225, 445, 665].map((x, k) => <rect key={x} x={x} y={540 + (1 - Math.max(0, Math.min(1, s('colours') * 3 - k))) * 360} width={110} height={360} fill={CREST.garnet} />)}
        </g>
        <g opacity={s('ball')} transform={`translate(501 712) scale(${0.6 + 0.4 * s('ball')}) translate(-501 -712)`}>
          <circle cx={501} cy={712} r={101} fill={CREST.gold} />
          <g clipPath={`url(#${u('ball')})`} fill="none" stroke={CREST.black} strokeWidth={6.5} strokeLinecap="round">{SEAMS.map((p, k) => <path key={k} d={`M${p[0][0]} ${p[0][1]}${curve(p)}`} />)}</g>
          <circle cx={501} cy={712} r={101} fill="none" stroke={CREST.black} strokeWidth={6.5} />
        </g>
        <rect x={100} y={540} width={800} height={360} fill="#050a18" opacity={Math.max(dm('colours'), dm('ball')) * .72} />
      </g>
      <path d={CREST_PATH.lower} fill="none" stroke={CREST.black} strokeWidth={8} />
      {shine && <path d={CREST_PATH.outer} fill={`url(#${u('shine')})`} />}
    </g>
    {draw < 1 && <path d={CREST_PATH.outer} fill="none" stroke={CREST.gold} strokeWidth={10} pathLength={1} strokeDasharray={`${Math.min(1, draw / 0.75)} 1`} strokeLinejoin="round" />}
    {glow && glowAmount > 0 && <g opacity={glowAmount}>
      {glowPath ? <>
        <path d={glowPath} fill="none" stroke="#ffd34d" strokeWidth={26} filter={`url(#${u('glow')})`} />
        <path d={glowPath} fill="none" stroke="#ffe27a" strokeWidth={9} strokeLinejoin="round" />
      </> : glow === 'ball' ? <>
        <circle cx={501} cy={712} r={112} fill="none" stroke="#ffd34d" strokeWidth={26} filter={`url(#${u('glow')})`} />
        <circle cx={501} cy={712} r={112} fill="none" stroke="#ffe27a" strokeWidth={9} />
      </> : <>
        <rect {...BAND_BOX} rx={14} fill="none" stroke="#ffd34d" strokeWidth={24} filter={`url(#${u('glow')})`} />
        <rect {...BAND_BOX} rx={14} fill="none" stroke="#ffe27a" strokeWidth={8} />
      </>}
    </g>}
  </svg>;
};

/** The Senyera: nine equal horizontal stripes, gold and red, gently waving. */
export const Senyera: React.FC<{width: number; f: number; bars?: number; wave?: number}> = ({width, f, bars = 4, wave = 1}) => {
  const h = width * 2 / 3; const cols = 48;
  return <svg width={width} height={h + 24} viewBox={`0 -12 ${width} ${h + 24}`} style={{overflow: 'visible'}}>
    {Array.from({length: cols}, (_, c) => {
      const x = c * width / cols; const dy = Math.sin(f / 9 - c / 6) * 9 * wave * (c / cols); const shade = 1 - 0.13 * wave * (0.5 + 0.5 * Math.sin(f / 9 - c / 6 + 1.2)) * (c / cols);
      return <g key={c} transform={`translate(0 ${dy})`} style={{filter: `brightness(${shade})`}}>
        {Array.from({length: 9}, (_, k) => { const red = k % 2 === 1 && (k - 1) / 2 < bars;
          return <rect key={k} x={x} y={k * h / 9} width={width / cols + 1} height={h / 9 + .5} fill={red ? CREST.red : CREST.yellow} />; })}
      </g>;
    })}
  </svg>;
};

/** England's flag: St George's cross, 3:5. */
export const EnglandFlag: React.FC<{width: number}> = ({width}) => {
  const h = width * 3 / 5; const bar = h / 5;
  return <svg width={width} height={h} viewBox={`0 0 ${width} ${h}`}>
    <rect width={width} height={h} fill="#fff" /><rect x={(width - bar) / 2} width={bar} height={h} fill="#ce1124" /><rect y={(h - bar) / 2} width={width} height={bar} fill="#ce1124" />
  </svg>;
};

/** Square St George's cross (the crest's upper-left field on its own). */
export const CrossField: React.FC<{size: number; draw?: number}> = ({size, draw = 1}) => <svg width={size} height={size} viewBox="0 0 100 100">
  <rect width={100} height={100} rx={4} fill="#fff" />
  <rect x={39} y={0} width={22} height={100 * draw} fill={CREST.red} />
  <rect x={0} y={39} width={100 * draw} height={22} fill={CREST.red} />
</svg>;

/** Heater shield, or four pallets gules: the arms of the House of Barcelona / Crown of Aragon. */
export const BarsShield: React.FC<{width: number; bars?: number}> = ({width, bars = 4}) => <svg width={width} height={width * 1.18} viewBox="0 0 100 118">
  <defs><clipPath id="bars-shield"><path d="M4 4H96V58C96 88 74 106 50 114C26 106 4 88 4 58Z" /></clipPath></defs>
  <g clipPath="url(#bars-shield)">
    <rect width={100} height={118} fill={CREST.yellow} />
    {[0, 1, 2, 3].map((k) => { const g = Math.max(0, Math.min(1, bars - k)); return <rect key={k} x={4 + (2 * k + 1) * 92 / 9} y={0} width={92 / 9} height={118 * g} fill={CREST.red} />; })}
  </g>
  <path d="M4 4H96V58C96 88 74 106 50 114C26 106 4 88 4 58Z" fill="none" stroke="#2a1d06" strokeWidth={3} />
</svg>;

/** A wax-seal style roundel carrying the pallets (schematic). */
export const BarsSeal: React.FC<{size: number}> = ({size}) => <svg width={size} height={size} viewBox="0 0 100 100">
  <defs><clipPath id="bars-seal"><circle cx={50} cy={50} r={33} /></clipPath></defs>
  <circle cx={50} cy={50} r={47} fill="#8a1e1e" /><circle cx={50} cy={50} r={41} fill="none" stroke="#c9544c" strokeWidth={1.5} strokeDasharray="2 3" />
  <g clipPath="url(#bars-seal)"><rect width={100} height={100} fill="#d4a63a" />{[0, 1, 2, 3].map((k) => <rect key={k} x={17 + (2 * k + 1) * 66 / 9} y={0} width={66 / 9} height={100} fill="#7c1414" />)}</g>
  <circle cx={50} cy={50} r={33} fill="none" stroke="#5a0e0e" strokeWidth={2} />
</svg>;

/** Barcelona's city arms, schematic: a lozenge quartered with St George's cross (1st, 4th) and the pallets (2nd, 3rd), crowned. */
export const CityArms: React.FC<{width: number; reveal?: number}> = ({width, reveal = 1}) => <svg width={width} height={width * 1.3} viewBox="0 0 100 130">
  <defs><clipPath id="city-lozenge"><path d="M50 26 92 78 50 128 8 78Z" /></clipPath></defs>
  <g opacity={reveal}>
    {/* royal crown */}
    <path d="M24 22 30 6 40 16 50 2 60 16 70 6 76 22Z" fill={CREST.gold} stroke="#4a3300" strokeWidth={1.4} />
    <rect x={24} y={20} width={52} height={6} rx={1.5} fill={CREST.gold} stroke="#4a3300" strokeWidth={1.4} />
    {[30, 50, 70].map((x) => <circle key={x} cx={x} cy={x === 50 ? 3 : 7} r={2.4} fill={CREST.gold} stroke="#4a3300" strokeWidth={1} />)}
  </g>
  <g clipPath="url(#city-lozenge)">
    <rect x={0} y={26} width={50} height={52} fill="#fff" /><rect x={50} y={78} width={50} height={52} fill="#fff" />
    <rect x={21} y={26} width={8} height={52} fill={CREST.red} /><rect x={0} y={48} width={50} height={8} fill={CREST.red} />
    <rect x={71} y={78} width={8} height={52} fill={CREST.red} /><rect x={50} y={100} width={50} height={8} fill={CREST.red} />
    <rect x={50} y={26} width={50} height={52} fill={CREST.yellow} /><rect x={0} y={78} width={50} height={52} fill={CREST.yellow} />
    {[0, 1, 2, 3].map((k) => <React.Fragment key={k}><rect x={50 + (2 * k + 1) * 50 / 9} y={26} width={50 / 9} height={52} fill={CREST.red} /><rect x={(2 * k + 1) * 50 / 9} y={78} width={50 / 9} height={52} fill={CREST.red} /></React.Fragment>)}
  </g>
  <path d="M50 26 92 78 50 128 8 78Z" fill="none" stroke="#2a1d06" strokeWidth={2.2} />
  <line x1={50} y1={26} x2={50} y2={128} stroke="#2a1d06" strokeWidth={1} /><line x1={8} y1={78} x2={92} y2={78} stroke="#2a1d06" strokeWidth={1} />
</svg>;
