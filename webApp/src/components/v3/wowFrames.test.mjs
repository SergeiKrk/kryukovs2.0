import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sampleFrames, progressIndex, frameWindow, createFrameLoader, shouldAnimate } from './wowFrames.mjs';
const flush = () => new Promise((resolve) => setImmediate(resolve));
test('progress clamps both ends and mobile includes the real last frame', () => {
  const frames = sampleFrames(32);
  assert.equal(frames.length, new Set(frames).size);
  assert.equal(frames[progressIndex(-1, frames)], 0);
  assert.equal(frames[progressIndex(NaN, frames)], 0);
  assert.equal(frames[progressIndex(0.9, frames)], 106);
  assert.equal(frames[progressIndex(5, frames)], 106);
  assert.deepEqual(frameWindow(0, 32, -1), [0, 1, 2]);
  assert.deepEqual(frameWindow(31, 32, 1), [31, 30, 29]);
});
test('system motion and data preferences override an explicit on switch', () => {
  assert.equal(shouldAnimate({ explicit: true, reduced: true }), false);
  assert.equal(shouldAnimate({ explicit: true, saveData: true }), false);
  assert.equal(shouldAnimate({ explicit: true, failed: true }), false);
  assert.equal(shouldAnimate({ explicit: true, bitmapAvailable: false }), false);
  assert.equal(shouldAnimate({ saved: 'off' }), false);
  assert.equal(shouldAnimate({ saved: 'off', explicit: true }), true);
});
test('rapid reversal, bounded cache/concurrency, explicit disposal', async () => {
  let live = 0, closed = 0, peak = 0, loading = 0;
  const drawn = [];
  const loader = createFrameLoader({ frames: sampleFrames(), limit: 8,
    load: async () => { loading++; peak = Math.max(peak, loading); await flush(); loading--; live++;
      return { close() { live--; closed++; } }; },
    draw: (_, index) => drawn.push(index), fail: () => assert.fail('unexpected fallback'),
  });
  for (const index of [0, 50, 106, 80, 2, 106, 0]) { loader.seek(index); for (let i = 0; i < 12; i++) await flush(); assert.ok(loader.stats().cached <= 8); }
  assert.equal(drawn.at(-1), 0); assert.ok(drawn.includes(106)); assert.ok(peak <= 2);
  loader.seek(90); loader.dispose(); for (let i = 0; i < 5; i++) await flush();
  assert.equal(live, 0); assert.ok(closed > 8); assert.equal(loader.stats().pending, 0);
});
test('three failed loads enter fallback once and release the queue', async () => {
  let failures = 0;
  const loader = createFrameLoader({ frames: sampleFrames(), load: async () => { throw Error('offline'); }, draw: () => assert.fail(), fail: () => failures++ });
  loader.seek(50); for (let i = 0; i < 8; i++) await flush();
  assert.equal(failures, 1); assert.equal(loader.stats().disposed, true); assert.equal(loader.stats().pending, 0);
});
