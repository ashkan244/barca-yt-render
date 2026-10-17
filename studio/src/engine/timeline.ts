import type {EpisodeSpec, NarrationLine, Scene, T} from './types';

export const FPS = 30;

export type LineTiming = {id: string; text: string; from: number; len: number}; // frames, absolute
export type SceneTiming = {scene: Scene; from: number; dur: number; lines: LineTiming[]};
export type Plan = {scenes: SceneTiming[]; total: number; lines: LineTiming[]};

/** Expand "PL-001..PL-006" (inclusive, includes suffixed ids like PL-003a in between). */
export const expandLines = (spec: string | string[] | undefined, order: string[]): string[] => {
  if (!spec) return [];
  if (Array.isArray(spec)) return spec;
  const [a, b] = spec.split('..');
  if (!b) return [a];
  const i = order.indexOf(a), j = order.indexOf(b);
  if (i < 0 || j < 0) throw new Error(`unknown line range ${spec}`);
  return order.slice(i, j + 1);
};

/** Build absolute frame timings for every scene and narration line. */
export const plan = (ep: EpisodeSpec, narration: NarrationLine[], durations: Record<string, number>): Plan => {
  const order = narration.map((l) => l.id);
  const byId = new Map(narration.map((l) => [l.id, l]));
  const estimate = (text: string) => Math.max(1, text.split(/\s+/).length / 2.35); // ~141 wpm fallback
  let cursor = 0;
  const scenes: SceneTiming[] = [];
  const all: LineTiming[] = [];
  for (const scene of ep.scenes) {
    const ids = expandLines(scene.lines, order);
    const from = cursor;
    let t = Math.round((scene.lead ?? (ids.length ? 0.15 : 0)) * FPS);
    const lines: LineTiming[] = [];
    for (const id of ids) {
      const l = byId.get(id);
      if (!l) throw new Error(`missing narration line ${id}`);
      const len = Math.ceil((durations[id] ?? estimate(l.text)) * FPS);
      lines.push({id, text: l.text, from: from + t, len});
      t += len + Math.round((l.pause ?? 0.12) * FPS);
    }
    const dur = ids.length ? t + Math.round((scene.hold ?? 0.25) * FPS) : Math.round((scene.secs ?? 3) * FPS);
    scenes.push({scene, from, dur, lines});
    all.push(...lines);
    cursor += dur;
  }
  return {scenes, total: cursor, lines: all};
};

/** Resolve a scene-relative time (seconds, or "LINE-ID[+offset]") to frames from scene start. */
export const resolveT = (t: T, st: SceneTiming): number => {
  if (typeof t === 'number') return Math.round(t * FPS);
  const m = t.match(/^([A-Z]{2}-\d{3}[a-z]?)([+-][\d.]+)?$/);
  if (!m) return 0;
  const line = st.lines.find((l) => l.id === m[1]);
  const base = line ? line.from - st.from : 0;
  return base + Math.round(Number(m[2] ?? 0) * FPS);
};

/** SRT subtitles from line timings. */
export const toSrt = (lines: LineTiming[]) => {
  const ts = (f: number) => {
    const ms = Math.round((f / FPS) * 1000);
    const h = Math.floor(ms / 3600000), m = Math.floor((ms % 3600000) / 60000), s = Math.floor((ms % 60000) / 1000), r = ms % 1000;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')},${String(r).padStart(3, '0')}`;
  };
  return lines.map((l, i) => `${i + 1}\n${ts(l.from)} --> ${ts(l.from + l.len)}\n${l.text}\n`).join('\n');
};

/** YouTube chapters from chapter scenes (first must be 0:00). */
export const toChapters = (p: Plan) => {
  const fmt = (f: number) => { const s = Math.floor(f / FPS); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
  const out: string[] = [];
  p.scenes.forEach((st, i) => {
    if (st.scene.type === 'chapter') out.push(`${fmt(st.from)} ${(st.scene as {title: string}).title}`);
    if (i === 0 && st.scene.type !== 'chapter') out.push(`0:00 Intro`);
  });
  return out.join('\n');
};
