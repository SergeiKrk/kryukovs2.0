import assert from "node:assert/strict";
import test from "node:test";

const bridge = await import(`./calculatorBridge.mjs?test=${Date.now()}`);

const summary = {
  schemaVersion: 2,
  taskType: "site",
  answers: { taskType: "site", siteFormat: "corporate", sitePageCount: 12, siteDesign: "individual", toolGoal: "личный текст" },
  selectedOfferId: "corporate",
  estimate: { kind: "from", priceLabel: "от 62 000 ₽", offerId: "corporate", totalOneTime: 62000, lines: [{ id: "base", label: "Корпоративный сайт", amount: 50000 }] },
  assumptions: [],
  unknowns: [],
  nextStep: "project-brief",
};

test("bridge передаёт результат и сохраняет только безопасный черновик", () => {
  const storage = new Map();
  const events = [];
  globalThis.window = {
    sessionStorage: { getItem: (key) => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value), removeItem: (key) => storage.delete(key) },
    dispatchEvent: (event) => events.push(event),
  };
  bridge.publishCalculatorSummary(summary);
  const saved = JSON.parse(storage.values().next().value);
  assert.deepEqual(saved.answers, { taskType: "site", siteFormat: "corporate", sitePageCount: 12, siteDesign: "individual" });
  assert.equal(events[0].type, bridge.CALCULATOR_SUMMARY_EVENT);
  assert.deepEqual(bridge.readPendingCalculatorSummary(), { ...summary, answers: saved.answers });
  delete globalThis.window;
});

test("bridge не ломает переход при запрещённом sessionStorage", () => {
  const events = [];
  globalThis.window = { sessionStorage: { setItem: () => { throw new Error("storage disabled"); } }, dispatchEvent: (event) => events.push(event) };
  assert.doesNotThrow(() => bridge.publishCalculatorSummary(summary));
  assert.equal(events.length, 1);
  delete globalThis.window;
});
