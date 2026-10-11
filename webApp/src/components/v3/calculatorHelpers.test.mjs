import assert from "node:assert/strict";
import test from "node:test";

import {
  SITE_FORMATS,
  buildCalculatorSummary,
  createInitialCalculatorAnswers,
  getPersistableAnswers,
  getSiteStepIds,
  resetAnswersForSiteFormat,
  sliderPositionToValue,
  sliderValueToPosition,
} from "./calculatorHelpers.mjs";

const site = (overrides = {}) => ({
  ...createInitialCalculatorAnswers(),
  taskType: "site",
  siteFormat: "landing",
  siteDesign: "individual",
  ...overrides,
});

test("пять форматов используют стабильные ID, цены и базовый объём", () => {
  assert.deepEqual(SITE_FORMATS.map(({ id }) => id), ["landing", "landing-direct", "business-card", "catalog", "corporate"]);
  assert.deepEqual(SITE_FORMATS.map(({ priceFrom }) => priceFrom), [25000, 35000, 40000, 45000, 60000]);
  assert.deepEqual(SITE_FORMATS.map(({ basePages }) => basePages), [1, 1, 3, 4, 6]);
});

test("условные шаги скрывают объём и продвижение у пакета лендинг + Директ", () => {
  assert.deepEqual(getSiteStepIds(site()), ["task", "format", "promotion", "design", "integrations"]);
  assert.deepEqual(getSiteStepIds(site({ siteFormat: "landing-direct" })), ["task", "format", "design", "integrations"]);
  assert.deepEqual(getSiteStepIds(site({ siteFormat: "corporate" })), ["task", "format", "pages", "promotion", "design", "integrations"]);
});

test("смена формата очищает значения, которые стали скрытыми", () => {
  const result = resetAnswersForSiteFormat(site({
    siteFormat: "corporate", sitePageCount: 24, siteArticleCount: 12,
    promotionDirect: true, promotionDirectCount: 4, promotionSemantic: true,
    promotionSeo: true, promotionSeoBudget: 30000,
  }), "landing-direct");
  assert.equal(result.sitePageCount, 0);
  assert.equal(result.siteArticleCount, 0);
  assert.equal(result.promotionDirect, false);
  assert.equal(result.promotionSemantic, false);
  assert.equal(result.promotionSeo, false);
});

test("прогрессивная шкала точна в начале и ускоряется к правому краю", () => {
  assert.equal(sliderPositionToValue(0, 3, 300), 3);
  assert.equal(sliderPositionToValue(1, 3, 300), 300);
  assert.equal(sliderValueToPosition(3, 3, 300), 0);
  assert.equal(sliderValueToPosition(300, 3, 300), 1);
  assert.ok(sliderPositionToValue(0.9, 3, 300) - sliderPositionToValue(0.8, 3, 300) > sliderPositionToValue(0.2, 3, 300) - sliderPositionToValue(0.1, 3, 300));
});

test("обычный лендинг добавляет Директ после стоимости сайта", () => {
  const summary = buildCalculatorSummary(site({ promotionDirect: true }), []);
  assert.equal(summary.schemaVersion, 2);
  assert.equal(summary.estimate.totalOneTime, 35000);
  assert.equal(summary.answers.promotionDirectCount, undefined);
});

test("пакет лендинг + Директ учитывает включённую настройку", () => {
  const summary = buildCalculatorSummary(site({ siteFormat: "landing-direct" }), []);
  assert.equal(summary.estimate.totalOneTime, 35000);
  assert.equal(summary.answers.promotionDirect, undefined);
  assert.ok(summary.estimate.lines.some((line) => line.id === "direct-included"));
});

test("анимация лендинга с включённым Директом считается от обычного лендинга", () => {
  const summary = buildCalculatorSummary(site({ siteFormat: "landing-direct", siteDesign: "animated" }), []);
  assert.equal(summary.estimate.totalOneTime, 45000);
  assert.equal(summary.estimate.lines.find(({ id }) => id === "animation")?.amount, 10000);
  assert.equal(summary.estimate.lines.some(({ id }) => id === "direct"), false);
});

test("отдельно выбранный Директ и анимация лендинга дают ту же цену без двойного начисления", () => {
  const summary = buildCalculatorSummary(site({ promotionDirect: true, siteDesign: "animated" }), []);
  assert.equal(summary.estimate.totalOneTime, 45000);
  assert.equal(summary.estimate.lines.find(({ id }) => id === "animation")?.amount, 10000);
  assert.equal(summary.estimate.lines.find(({ id }) => id === "direct")?.amount, 10000);
});

test("дополнительная страница стоит 2 500 ₽ сверх включённого объёма", () => {
  for (const [siteFormat, includedPages, basePrice] of [
    ["business-card", 3, 40000],
    ["catalog", 4, 45000],
    ["corporate", 6, 60000],
  ]) {
    const summary = buildCalculatorSummary(site({ siteFormat, sitePageCount: includedPages + 1 }), []);
    assert.equal(summary.estimate.totalOneTime, basePrice + 2500);
    assert.equal(summary.estimate.lines.find(({ id }) => id === "pages")?.amount, 2500);
  }
});

test("смысловая архитектура, анимация, SEO и интеграции не смешивают разовые и месячные суммы", () => {
  const summary = buildCalculatorSummary(site({
    siteFormat: "corporate", sitePageCount: 16, siteArticleCount: 10,
    promotionSemantic: true, siteDesign: "animated", promotionSeo: true,
    promotionSeoBudget: 20000, siteIntegrations: ["crm"],
  }), []);
  assert.equal(summary.estimate.totalOneTime, 181500);
  assert.equal(summary.estimate.monthlySeo, 20000);
  assert.equal(summary.estimate.hasIntegrations, true);
});

test("черновик не хранит личный текст и скрытые значения", () => {
  const answers = site({ siteFormat: "corporate", sitePageCount: 12, toolGoal: "личный текст" });
  assert.deepEqual(getPersistableAnswers(answers), { taskType: "site", siteFormat: "corporate", sitePageCount: 12, siteDesign: "individual" });
});
