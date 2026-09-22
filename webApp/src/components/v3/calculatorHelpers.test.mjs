import assert from "node:assert/strict";
import test from "node:test";

import {
  buildCalculatorSummary,
  createInitialCalculatorAnswers,
  filterAnalyticsDetail,
  getPersistableAnswers,
  resetAnswersForTaskType,
  validateCalculatorStep,
} from "./calculatorHelpers.mjs";

const catalog = [
  { id: "landing-direct", priceLabel: "от 35 000 ₽" },
  { id: "calculator", priceLabel: "от 50 000 ₽" },
  { id: "complex-calculator", priceLabel: "от 80 000 ₽" },
  { id: "site-improvement", priceLabel: "от 5 000 ₽" },
  { id: "support", priceLabel: "от 35 000 ₽/мес." },
];

test("смена ветки очищает нерелевантные ответы", () => {
  const answers = {
    ...createInitialCalculatorAnswers(),
    taskType: "site",
    siteFormat: "landing-direct",
    sitePages: "single",
    toolGoal: "старый текст",
  };

  const next = resetAnswersForTaskType(answers, "tool");
  assert.equal(next.taskType, "tool");
  assert.equal(next.siteFormat, "");
  assert.equal(next.toolGoal, "");
});

test("ветка сайта выбирает цену только из каталога", () => {
  const answers = {
    ...createInitialCalculatorAnswers(),
    taskType: "site",
    siteFormat: "landing-direct",
    sitePages: "single",
    siteDesign: "individual",
    siteEditor: "none",
    siteIntegrations: "none",
    siteMaterials: "ready",
  };

  assert.deepEqual(validateCalculatorStep(1, answers), { valid: true });
  const summary = buildCalculatorSummary(answers, catalog);
  assert.deepEqual(summary.estimate, { kind: "from", priceLabel: "от 35 000 ₽", offerId: "landing-direct" });
  assert.equal(summary.unknowns.length, 0);
  assert.equal(summary.schemaVersion, 1);
  assert.equal(summary.nextStep, "project-brief");
});

test("сложный веб-сервис возвращает discovery без выдуманного диапазона", () => {
  const answers = {
    ...createInitialCalculatorAnswers(),
    taskType: "web-app",
    webUsers: "Клиенты",
    webRoles: "roles",
    webData: "Заказы и статусы",
    webApi: "plannedApi",
  };

  const summary = buildCalculatorSummary(answers, catalog);
  assert.equal(summary.estimate.kind, "discovery");
  assert.equal(summary.selectedOfferId, null);
  assert.match(summary.estimate.label, /discovery/);
});

test("доступы поддержки попадают в неизвестные без изменения цены", () => {
  const answers = {
    ...createInitialCalculatorAnswers(),
    taskType: "support",
    supportState: "broken",
    supportProblem: "Не открывается форма",
    supportAccess: "noAccess",
    supportMode: "oneOff",
  };

  const summary = buildCalculatorSummary(answers, catalog);
  assert.deepEqual(summary.estimate, { kind: "from", priceLabel: "от 5 000 ₽", offerId: "site-improvement" });
  assert.deepEqual(summary.unknowns, ["Доступы для диагностики и безопасного внесения изменений."]);
});

test("аналитика оставляет только безопасные параметры", () => {
  assert.deepEqual(
    filterAnalyticsDetail({
      taskType: "site",
      selectedOfferId: "corporate-site",
      estimateKind: "from",
      branch: "site",
      goal: "личный текст",
      contact: "@user",
    }),
    { taskType: "site", selectedOfferId: "corporate-site", estimateKind: "from", branch: "site" },
  );
});

test("черновик сохраняет только enum-ответы и ID выбора", () => {
  const persistable = getPersistableAnswers({
    taskType: "site",
    siteFormat: "corporate-site",
    sitePages: "multi",
    toolGoal: "личный текст",
    supportProblem: "личный текст",
  });

  assert.deepEqual(persistable, { taskType: "site", siteFormat: "corporate-site", sitePages: "multi" });
});
