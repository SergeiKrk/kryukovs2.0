export const framePath = (index) => `/assets/v3/identity-frames/frame-${String(index).padStart(4, '0')}.webp`;
/** @param {{ failed?: boolean, reduced?: boolean, saveData?: boolean, saved?: string | null, explicit?: boolean, bitmapAvailable?: boolean }} options */
export function shouldAnimate({ failed = false, reduced = false, saveData = false, saved = null, explicit, bitmapAvailable = true }) {
  return !failed && !reduced && !saveData && bitmapAvailable && (explicit ?? saved !== 'off');
}
export const sampleFrames = (count = 107) => Array.from({ length: count }, (_, i) => Math.round(i * 106 / (count - 1)));
export function progressIndex(progress, frames) {
  const bounded = Number.isFinite(progress) ? Math.max(0, Math.min(1, progress)) : 0;
  // Small opening and final holds, independent of the viewport's scroll budget.
  return Math.round(Math.max(0, Math.min(1, (bounded - 0.04) / 0.86)) * (frames.length - 1));
}
export function frameWindow(index, length, direction = 1) {
  return [0, direction, 2 * direction, -direction, 3 * direction, -2 * direction, 4 * direction]
    .map((offset) => index + offset).filter((value) => value >= 0 && value < length);
}

/** Bounded, disposable decoded frames. Transport is injectable for failure/race tests. */
export function createFrameLoader({ frames, load, draw, fail, limit = 8, concurrency = 2 }) {
  const cache = new Map();
  const pending = new Map();
  const failed = new Set();
  let target = 0, direction = 1, displayed = -1, disposed = false, errors = 0;
  let wanted = frameWindow(0, frames.length);
  function trim() {
    while (cache.size > limit) {
      const victim = [...cache.keys()].filter((key) => key !== displayed)
        .sort((a, b) => Math.abs(b - target) - Math.abs(a - target))[0];
      cache.get(victim)?.close();
      cache.delete(victim);
    }
  }
  function render() {
    const nearest = [...cache.keys()].sort((a, b) => Math.abs(a - target) - Math.abs(b - target))[0];
    if (nearest === undefined || nearest === displayed) return;
    // Do not replace a closer displayed frame with a stale request completing late.
    if (displayed >= 0 && Math.abs(nearest - target) > Math.abs(displayed - target)) return;
    displayed = nearest;
    draw(cache.get(nearest), frames[nearest]);
  }
  function pump() {
    if (disposed) return;
    for (const key of wanted) {
      if (pending.size >= concurrency) break;
      if (cache.has(key) || pending.has(key) || failed.has(key)) continue;
      const controller = new AbortController();
      pending.set(key, controller);
      Promise.resolve().then(() => load(frames[key], controller.signal)).then((bitmap) => {
        if (disposed || controller.signal.aborted) { bitmap.close(); return; }
        cache.set(key, bitmap);
        errors = 0;
        render();
        trim();
      }).catch(() => {
        if (disposed || controller.signal.aborted) return;
        failed.add(key);
        if (++errors >= 3) { dispose(); fail(); }
      }).finally(() => {
        pending.delete(key);
        pump();
      });
    }
  }
  function seek(index) {
    if (disposed) return;
    const next = Math.max(0, Math.min(frames.length - 1, index));
    if (next !== target) direction = next > target ? 1 : -1;
    target = next;
    wanted = frameWindow(target, frames.length, direction);
    for (const [key, controller] of pending) if (!wanted.includes(key)) controller.abort();
    render();
    pump();
  }
  function dispose() {
    disposed = true;
    for (const controller of pending.values()) controller.abort();
    pending.clear();
    for (const bitmap of cache.values()) bitmap.close();
    cache.clear();
    failed.clear();
  }
  return { seek, dispose, stats: () => ({ cached: cache.size, pending: pending.size, target, displayed, disposed }) };
}
