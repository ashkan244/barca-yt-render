// Episode spec: a long-form video is a list of scenes; each scene owns a run of narration lines.
// Times inside a scene are seconds from scene start, or "LINE-ID" / "LINE-ID+1.5" (start of a line + offset).
export type T = number | string;
export type XY = [number, number];

export type NarrationLine = {id: string; text: string; pause?: number};

export type BaseScene = {
  type: string;
  lines?: string | string[]; // "PL-001..PL-006" or explicit list
  secs?: number; // duration for scenes without narration
  hold?: number; // extra seconds after the last line (default 0.4)
  lead?: number; // seconds before the first line (default 0.3)
  sfx?: {name: string; at: T; volume?: number}[];
  bg?: 'board' | 'slate' | 'navy' | 'paper';
  host?: 'full' | 'split' | 'pip' | 'off'; // host episodes: how the presenter appears in this scene
  take?: string; // host episodes: recorded clip id, e.g. HA-T03
};

export type BoardScene = BaseScene & {
  type: 'board';
  title?: string; // small chalk header
  tag?: string; // e.g. ILLUSTRATION
  tilt?: number;
  camera?: {at: T; zoom: number; focus?: XY}[];
  tokens?: {id: string; side: 'barca' | 'opp' | 'neutral'; label?: string; path: [T, number, number][]; hi?: [T, T, string][]; fade?: [T, T]}[];
  ball?: {path: [T, number, number][]; lift?: [T, T]};
  arrows?: {from: XY; to: XY; at: T; dur?: number; color?: string; dashed?: boolean; curve?: number; until?: T}[];
  zones?: {x: number; y: number; w: number; h: number; color?: string; at: T; until?: T; opacity?: number}[];
  offside?: {x: number; at: T; until?: T; color?: string}[];
  scans?: {token: string; at: T; side: 'left' | 'right'; color?: string}[];
  cones?: {token: string; at: T; until?: T; angle: number; width: number; color?: string; length?: number}[];
  labels?: {text: string; at: T; until?: T; x: number; y: number; color?: string}[];
  overlay?: {text: string; at: T; until?: T; color?: string; pos?: 'top' | 'center' | 'bottom'}[];
};

export type Scene =
  | BoardScene
  | (BaseScene & {type: 'title'; kicker?: string; title: string; sub?: string; photo?: string; style?: 'ink' | 'bw'})
  | (BaseScene & {type: 'chapter'; num?: string; title: string})
  | (BaseScene & {type: 'photo'; src: string; caption?: string; credit?: string; style?: 'ink' | 'bw' | 'sepia'; move?: 'in' | 'out' | 'left' | 'right' | 'still'; focus?: XY})
  | (BaseScene & {type: 'stat'; value: string; label: string; source?: string; prefix?: string; suffix?: string})
  | (BaseScene & {type: 'quote'; text: string; who: string; source?: string; photo?: string})
  | (BaseScene & {type: 'headline'; dateline: string; headline: string; deck?: string; note?: string})
  | (BaseScene & {type: 'timeline'; title?: string; events: {at: T; year: string; text: string}[]})
  | (BaseScene & {type: 'map'; from: {name: string; xy: XY}; to: {name: string; xy: XY}; label?: string; extra?: {name: string; xy: XY}[]})
  | (BaseScene & {type: 'score'; home: string; away: string; events: {at: T; minute: string; side: 'home' | 'away'; who: string}[]; venue?: string; date?: string})
  | (BaseScene & {type: 'list'; title?: string; items: {at: T; text: string; sub?: string}[]})
  | (BaseScene & {type: 'compare'; left: {title: string; points: string[]; good?: boolean}; right: {title: string; points: string[]; good?: boolean}})
  | (BaseScene & {type: 'bars'; title?: string; unit?: string; tag?: string; bars: {label: string; value: number; highlight?: boolean}[]; note?: string})
  | (BaseScene & {type: 'statement'; text: string; accent?: string; small?: string})
  | (BaseScene & {type: 'question'; text: string; options?: string[]})
  | (BaseScene & {type: 'endscreen'; next?: string; brand?: 'culer' | 'radar'})
  | (BaseScene & {type: 'gallery'; style?: PhotoStyle; photos: GalleryPhoto[]})
  | (BaseScene & {type: 'duo'; title?: string; style?: PhotoStyle; left: DuoCard; right: DuoCard; at?: T; divider?: string})
  | (BaseScene & {type: 'collage'; title?: string; style?: PhotoStyle; credit?: string; photos: {src: string; at: T; label?: string; rot?: number; style?: PhotoStyle}[]; spot?: {i: number; at: T; until?: T}[]});

export type PhotoStyle = 'ink' | 'bw' | 'sepia';
export type GalleryPhoto = {src: string; at: T; caption?: string; credit?: string; year?: string; move?: 'in' | 'out' | 'left' | 'right' | 'still'; focus?: XY; style?: PhotoStyle};
export type DuoCard = {src: string; label: string; sub?: string; credit?: string; focus?: XY; style?: PhotoStyle};

export type Thumb = {
  kicker: string; // small tag, e.g. "PLAY LIKE PEDRI"
  title: string; // ≤4 words, "\n" for line break
  accent?: string; // word(s) in gold
  style: 'board' | 'photo' | 'number' | 'bars';
  photo?: string;
  number?: string;
};

export type EpisodeSpec = {
  id: string; // e.g. EP01-PL
  code: string; // narration prefix, e.g. PL
  title: string;
  music?: string | string[]; // public/music/<file>; a list = one track per chapter (cycled)
  thumb?: Thumb;
  captions?: boolean; // burned-in phrase captions (image-led formats, Shorts)
  host?: boolean; // presenter-led episode (own recorded video replaces TTS)
  brand?: 'culer' | 'radar'; // channel: culer = The Culer Files (faceless), radar = Barça Radar (presenter)
  scenes: Scene[];
};
