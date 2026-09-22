import assert from "node:assert/strict";
import test from "node:test";

const bridge = await import(`./calculatorBridge.mjs?test=${Date.now()}`);

const summary = {
  schemaVersion: 1,
  taskType: "site",
  answers: {
    taskType: "site",
    siteFormat: "corporate-site",
    sitePages: "multi",
    siteMaterials: "idea",
    unsureGoal: "личный текст не должен попасть в черновик",
  },
  selectedOfferId: "corporate-site",
  estimate: { kind: "from", priceLabel: "от 75 000 ₽", offerId: "corporate-site" },
  assumptions: [],
  unknowns: [],
  nextStep: "project-brief",
};

test("bridge публикует полный summary и сохраняет только безопасный черновик", () => {
  const storage = new Map();
  const events = [];
  globalThis.window = {
    sessionStorage: {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
      removeItem: (key) => storage.delete(key),
    },
    dispatchEvent: (event) => events.push(event),
  };

  bridge.publishCalculatorSummary(summary);

  assert.equal(events[0].type, bridge.CALCULATOR_SUMMARY_EVENT);
  const saved = JSON.parse(storage.values().next().value);
  assert.equal(saved.answers.siteFormat, "corporate-site");
  assert.equal("unsureGoal" in saved.answers, false);
  assert.deepEqual(saved.assumptions, []);
  assert.deepEqual(saved.unknowns, []);
  assert.deepEqual(bridge.readPendingCalculatorSummary(), {
    ...summary,
    answers: {
      taskType: "site",
      siteFormat: "corporate-site",
      sitePages: "multi",
      siteMaterials: "idea",
    },
  });
  delete globalThis.window;
});

test("bridge не ломает переход при запрещённом sessionStorage", () => {
  const events = [];
  globalThis.window = {
    sessionStorage: {
      setItem: () => { throw new Error("storage disabled"); },
    },
    dispatchEvent: (event) => events.push(event),
  };

  assert.doesNotThrow(() => bridge.publishCalculatorSummary(summary));
  assert.equal(events.length, 1);
  delete globalThis.window;
});
