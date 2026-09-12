import assert from "node:assert/strict";
import test from "node:test";

let helpers = {};
try {
  helpers = await import("./v3MotionHelpers.mjs");
} catch {
  // RED: assertions below describe the API before the production helper exists.
}

test("motion preference respects reduced motion and a saved off choice", () => {
  assert.equal(helpers.resolveMotionEnabled?.(null, false), true);
  assert.equal(helpers.resolveMotionEnabled?.("on", false), true);
  assert.equal(helpers.resolveMotionEnabled?.("off", false), false);
  assert.equal(helpers.resolveMotionEnabled?.("on", true), false);
});

test("portfolio travel never becomes negative", () => {
  assert.equal(helpers.getHorizontalTravel?.(1800, 1200), 600);
  assert.equal(helpers.getHorizontalTravel?.(900, 1200), 0);
});

test("video scrub maps bounded progress to the safe media range", () => {
  assert.equal(helpers.getVideoTime?.(8, 0.5), 3.98);
  assert.equal(helpers.getVideoTime?.(8, -1), 0);
  assert.equal(helpers.getVideoTime?.(8, 2), 7.96);
  assert.equal(helpers.getVideoTime?.(0.02, 1), 0);
});

test("motion event accepts the documented detail object only", () => {
  assert.equal(helpers.readMotionEvent?.({ enabled: false }, true), false);
  assert.equal(helpers.readMotionEvent?.({ enabled: true }, false), true);
  assert.equal(helpers.readMotionEvent?.(true, false), false);
  assert.equal(helpers.readMotionEvent?.({}, true), true);
});
