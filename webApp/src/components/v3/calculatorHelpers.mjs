const TASK_TYPES = new Set(["site", "tool", "web-app", "support", "unsure"]);

export const SITE_FORMATS = [
  {
    id: "landing",
    title: "Лендинг",
    priceFrom: 25000,
    priceLabel: "25 000 ₽",
    shortDescription: "Одна страница для одной услуги или товара.",
    basePages: 1,
    volume: false,
    tooltip: "Одностраничный сайт для продажи одной услуги или товара. Включает структуру, индивидуальный дизайн, адаптивную разработку и подготовку к запуску.",
  },
  {
    id: "landing-direct",
    title: "Лендинг + Яндекс.Директ",
    priceFrom: 35000,
    priceLabel: "35 000 ₽",
    shortDescription: "Лендинг и запуск рекламы для одного предложения.",
    basePages: 1,
    volume: false,
    skipsPromotion: true,
    tooltip: "Лендинг для одной услуги или товара вместе с настройкой рекламы в Яндекс.Директе. Включена реклама одной услуги или одного товара. Рекламный бюджет оплачивается отдельно.",
  },
  {
    id: "business-card",
    title: "Сайт-визитка",
    priceFrom: 30000,
    priceLabel: "от 30 000 ₽",
    shortDescription: "Небольшой сайт о специалисте, компании или услуге.",
    basePages: 3,
    volume: true,
    tooltip: "Небольшой многостраничный сайт для представления специалиста, компании или услуги.",
  },
  {
    id: "catalog",
    title: "Каталог услуг / товаров",
    priceFrom: 40000,
    priceLabel: "от 40 000 ₽",
    shortDescription: "Отдельные страницы для услуг или товаров.",
    basePages: 4,
    volume: true,
    tooltip: "Многостраничный сайт, на котором услуги или товары представлены отдельными страницами.",
  },
  {
    id: "corporate",
    title: "Корпоративный сайт",
    priceFrom: 50000,
    priceLabel: "от 50 000 ₽",
    shortDescription: "Направления, услуги, экспертиза и блог компании.",
    basePages: 6,
    volume: true,
    hasArticles: true,
    tooltip: "Многостраничный сайт компании с подробным представлением направлений работы, услуг, экспертизы и материалов блога.",
  },
];

export const SITE_DESIGNS = [
  { id: "individual", title: "Индивидуальный", multiplier: 0, hint: "Визуальная система входит в базовую стоимость." },
  { id: "animated", title: "Индивидуальный с анимацией и wow-эффектом", multiplier: 0.4, hint: "Сложная анимация, переходы и дополнительная визуальная проработка: доплата 40% от базовой стоимости сайта." },
];

export const SITE_INTEGRATIONS = [
  { id: "crm", title: "CRM или система заявок" },
  { id: "payments", title: "Платёжная система" },
  { id: "analytics", title: "Аналитика и рекламные кабинеты" },
  { id: "api", title: "Внешний API или сервис" },
];

const SITE_FORMAT_IDS = new Set(SITE_FORMATS.map((format) => format.id));
const SITE_DESIGN_IDS = new Set(SITE_DESIGNS.map((design) => design.id));
const SITE_INTEGRATION_IDS = new Set(SITE_INTEGRATIONS.map((integration) => integration.id));
const SITE_VOLUME_MIN = 3;
const SITE_VOLUME_MAX = 300;
const ARTICLE_MAX = 300;
const DIRECT_MIN = 1;
const DIRECT_MAX = 20;
const SEO_MIN = 14000;
const SEO_MAX = 50000;

const NON_SITE_BRANCH_KEYS = {
  tool: ["toolGoal", "toolInputs", "toolDataSource", "toolScenarios", "toolComplexity"],
  "web-app": ["webUsers", "webRoles", "webData", "webApi"],
  support: ["supportState", "supportProblem", "supportAccess", "supportMode"],
  unsure: ["unsureGoal", "unsureSituation", "unsureMaterials"],
};

const SITE_KEYS = [
  "siteFormat",
  "sitePageCount",
  "siteArticleCount",
  "promotionDirect",
  "promotionDirectCount",
  "promotionSemantic",
  "promotionSeo",
  "promotionSeoBudget",
  "siteDesign",
  "siteIntegrations",
];

const NON_PERSONAL_KEYS = new Set([
  "taskType",
  ...SITE_KEYS,
  "toolDataSource",
  "toolScenarios",
  "toolComplexity",
  "webRoles",
  "webApi",
  "supportState",
  "supportAccess",
  "supportMode",
]);

const hasText = (value) => typeof value === "string" && value.trim().length > 0;

export function createInitialCalculatorAnswers() {
  return {
    taskType: "",
    siteFormat: "",
    sitePageCount: 0,
    siteArticleCount: 0,
    promotionDirect: false,
    promotionDirectCount: DIRECT_MIN,
    promotionSemantic: false,
    promotionSeo: false,
    promotionSeoBudget: SEO_MIN,
    siteDesign: "",
    siteIntegrations: [],
    toolGoal: "",
    toolInputs: "",
    toolDataSource: "",
    toolScenarios: "",
    toolComplexity: "",
    webUsers: "",
    webRoles: "",
    webData: "",
    webApi: "",
    supportState: "",
    supportProblem: "",
    supportAccess: "",
    supportMode: "",
    unsureGoal: "",
    unsureSituation: "",
    unsureMaterials: "",
  };
}

export function getSiteFormat(formatId) {
  return SITE_FORMATS.find((format) => format.id === formatId) ?? null;
}

export function getSiteDesign(designId) {
  return SITE_DESIGNS.find((design) => design.id === designId) ?? null;
}

export function siteFormatNeedsVolume(formatId) {
  return Boolean(getSiteFormat(formatId)?.volume);
}

export function siteFormatSkipsPromotion(formatId) {
  return getSiteFormat(formatId)?.skipsPromotion === true;
}

export function getSiteVolumeMinimum(formatId) {
  return getSiteFormat(formatId)?.basePages ?? SITE_VOLUME_MIN;
}

export function clampNumber(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.min(max, Math.max(min, Math.round(number)));
}

// The scale gives precise control near the minimum and larger value steps near the maximum.
export function sliderPositionToValue(position, min, max) {
  const normalized = Math.min(1, Math.max(0, Number(position) || 0));
  const eased = Math.pow(normalized, 2);
  return clampNumber(min + (max - min) * eased, min, max);
}

export function sliderValueToPosition(value, min, max) {
  const normalized = (clampNumber(value, min, max) - min) / Math.max(1, max - min);
  return Math.sqrt(normalized);
}

export function getSiteStepIds(answers) {
  if (answers.taskType !== "site") return ["task", "context"];
  const steps = ["task", "format"];
  if (siteFormatNeedsVolume(answers.siteFormat)) steps.push("pages");
  if (!siteFormatSkipsPromotion(answers.siteFormat)) steps.push("promotion");
  steps.push("design", "integrations");
  return steps;
}

export function getBranchKeys(taskType) {
  if (taskType === "site") return [...SITE_KEYS];
  return NON_SITE_BRANCH_KEYS[taskType] ? [...NON_SITE_BRANCH_KEYS[taskType]] : [];
}

export function resetAnswersForTaskType(previousAnswers, taskType) {
  const next = createInitialCalculatorAnswers();
  if (!TASK_TYPES.has(taskType)) return next;
  next.taskType = taskType;
  return next;
}

export function resetAnswersForSiteFormat(previousAnswers, formatId) {
  const format = getSiteFormat(formatId);
  const next = { ...createInitialCalculatorAnswers(), ...previousAnswers, taskType: "site", siteFormat: format?.id ?? "" };
  if (!format) return next;

  next.sitePageCount = format.volume ? getSiteVolumeMinimum(format.id) : 0;
  next.siteArticleCount = format.hasArticles ? clampNumber(previousAnswers?.siteArticleCount, 0, ARTICLE_MAX) : 0;
  next.promotionDirect = format.id === "landing-direct" ? false : Boolean(previousAnswers?.promotionDirect);
  next.promotionDirectCount = format.id === "landing" ? DIRECT_MIN : clampNumber(previousAnswers?.promotionDirectCount, DIRECT_MIN, DIRECT_MAX);
  next.promotionSemantic = format.volume ? Boolean(previousAnswers?.promotionSemantic) : false;
  next.promotionSeo = Boolean(previousAnswers?.promotionSeo);
  next.promotionSeoBudget = clampNumber(previousAnswers?.promotionSeoBudget, SEO_MIN, SEO_MAX);
  next.siteDesign = SITE_DESIGN_IDS.has(previousAnswers?.siteDesign) ? previousAnswers.siteDesign : "";
  next.siteIntegrations = Array.isArray(previousAnswers?.siteIntegrations)
    ? previousAnswers.siteIntegrations.filter((id) => SITE_INTEGRATION_IDS.has(id))
    : [];

  if (format.skipsPromotion) {
    next.promotionDirect = false;
    next.promotionDirectCount = DIRECT_MIN;
    next.promotionSemantic = false;
    next.promotionSeo = false;
    next.promotionSeoBudget = SEO_MIN;
  }
  return next;
}

export function normalizeCalculatorAnswers(answers) {
  const next = { ...createInitialCalculatorAnswers(), ...answers };
  if (next.taskType !== "site") return next;
  return resetAnswersForSiteFormat(next, next.siteFormat);
}

export function validateCalculatorStep(step, answers) {
  const steps = getSiteStepIds(answers);
  const stepId = steps[step];
  if (stepId === "task" && !TASK_TYPES.has(answers.taskType)) return { valid: false, firstInvalid: "taskType" };
  if (stepId === "format" && !SITE_FORMAT_IDS.has(answers.siteFormat)) return { valid: false, firstInvalid: "siteFormat" };
  if (stepId === "pages") {
    const minimum = getSiteVolumeMinimum(answers.siteFormat);
    if (clampNumber(answers.sitePageCount, minimum, SITE_VOLUME_MAX) < minimum) return { valid: false, firstInvalid: "sitePageCount" };
    if (clampNumber(answers.siteArticleCount, 0, ARTICLE_MAX) < 0) return { valid: false, firstInvalid: "siteArticleCount" };
  }
  if (stepId === "design" && !SITE_DESIGN_IDS.has(answers.siteDesign)) return { valid: false, firstInvalid: "siteDesign" };
  if (stepId === "context") {
    const required = answers.taskType === "tool" ? ["toolGoal"] : answers.taskType === "support" ? ["supportProblem"] : answers.taskType === "unsure" ? ["unsureGoal"] : [];
    for (const key of required) if (!hasText(answers[key])) return { valid: false, firstInvalid: key };
  }
  return { valid: true };
}

function findOffer(offerCatalog, id) {
  return offerCatalog.find((offer) => offer.id === id) ?? null;
}

function formatMoney(value) {
  return `${Math.round(value).toLocaleString("ru-RU")} ₽`;
}

function fromOffer(offer) {
  return offer
    ? { kind: "from", priceLabel: offer.priceLabel, offerId: offer.id }
    : { kind: "discovery", label: "Нужен discovery" };
}

function pushUnknown(unknowns, value) {
  if (!unknowns.includes(value)) unknowns.push(value);
}

function getSiteCost(answers) {
  const format = getSiteFormat(answers.siteFormat);
  if (!format) return null;

  const pageCount = format.volume ? clampNumber(answers.sitePageCount, format.basePages, SITE_VOLUME_MAX) : format.basePages;
  const articleCount = format.hasArticles ? clampNumber(answers.siteArticleCount, 0, ARTICLE_MAX) : 0;
  const extraPages = Math.max(0, pageCount - format.basePages);
  const pagesCost = extraPages * 2000;
  const articlesCost = articleCount * 2000;
  const contentBase = format.priceFrom + pagesCost + articlesCost;
  const semantic = format.volume && answers.promotionSemantic === true;
  const semanticBase = semantic ? contentBase * 1.5 : contentBase;
  const animated = answers.siteDesign === "animated";
  const animationCost = animated ? format.priceFrom * 0.4 : 0;
  const siteSubtotal = semanticBase + animationCost;
  const directIncluded = format.id === "landing-direct";
  const directCount = format.id === "landing" ? DIRECT_MIN : clampNumber(answers.promotionDirectCount, DIRECT_MIN, DIRECT_MAX);
  const directSelected = !directIncluded && answers.promotionDirect === true;
  const directCost = directSelected ? 10000 + Math.max(0, directCount - 1) * 7500 : 0;
  const seoMonthly = answers.promotionSeo === true && !directIncluded ? clampNumber(answers.promotionSeoBudget, SEO_MIN, SEO_MAX) : null;
  const integrations = Array.isArray(answers.siteIntegrations) ? answers.siteIntegrations.filter((id) => SITE_INTEGRATION_IDS.has(id)) : [];

  const lines = [
    { id: "base", label: format.title, amount: format.priceFrom, note: format.priceLabel },
  ];
  if (pagesCost > 0) lines.push({ id: "pages", label: `Дополнительные страницы: ${extraPages}`, amount: pagesCost });
  if (articlesCost > 0) lines.push({ id: "articles", label: `Дополнительные статьи: ${articleCount}`, amount: articlesCost });
  if (semantic) lines.push({ id: "semantic", label: "Глубокая смысловая архитектура × 1,5", amount: semanticBase - contentBase });
  if (animated) lines.push({ id: "animation", label: "Дизайн с анимацией: +40% от базы", amount: animationCost });
  if (directIncluded) lines.push({ id: "direct-included", label: "Настройка Яндекс.Директа включена в формат", amount: 0, note: "Бюджет рекламы отдельно" });
  if (directCost > 0) lines.push({ id: "direct", label: `Яндекс.Директ: ${directCount} ${directCount === 1 ? "услуга или товар" : "услуги или товара"}`, amount: directCost, note: "Рекламный бюджет отдельно" });
  if (seoMonthly !== null) lines.push({ id: "seo", label: "SEO-продвижение", amount: seoMonthly, unit: "month", note: "Ежемесячный платёж: 50% время, 50% размещения" });

  const oneTimeTotal = siteSubtotal + directCost;
  return { format, pageCount, articleCount, extraPages, pagesCost, articlesCost, contentBase, semantic, semanticBase, animated, animationCost, siteSubtotal, directCount, directCost, directIncluded, seoMonthly, integrations, oneTimeTotal, lines };
}

function buildSiteResult(answers) {
  const cost = getSiteCost(answers);
  if (!cost) return { selectedOfferId: null, estimate: { kind: "discovery", label: "Нужен discovery" }, assumptions: [], unknowns: ["Формат сайта и состав работ."], nextStep: "project-brief" };

  const assumptions = ["Контент, изображения и исходные материалы уточняются отдельно.", "Итоговая сумма является предварительным ориентиром, а не публичной офертой."];
  const unknowns = [];
  if (cost.integrations.length > 0) pushUnknown(unknowns, "Системы, API, объём данных и сценарии интеграций.");
  if (cost.seoMonthly !== null) assumptions.push("SEO-продвижение показано отдельной ежемесячной строкой и не входит в разовую стоимость сайта.");
  if (cost.directCost > 0 || cost.directIncluded) assumptions.push("Рекламный бюджет оплачивается клиентом отдельно в собственном кабинете.");

  return {
    selectedOfferId: cost.format.id,
    estimate: {
      kind: "from",
      priceLabel: formatMoney(cost.oneTimeTotal),
      offerId: cost.format.id,
      totalOneTime: cost.oneTimeTotal,
      monthlySeo: cost.seoMonthly,
      hasIntegrations: cost.integrations.length > 0,
      lines: cost.lines,
    },
    assumptions,
    unknowns,
    nextStep: "project-brief",
  };
}

function buildToolResult(answers, offerCatalog) {
  const offerId = answers.toolComplexity === "complex" ? "complex-calculator" : "calculator";
  const offer = findOffer(offerCatalog, offerId);
  const assumptions = [];
  const unknowns = [];
  if (hasText(answers.toolGoal)) assumptions.push("Задача инструмента описана на уровне первого сценария.");
  if (answers.toolDataSource === "external") pushUnknown(unknowns, "Доступность и формат внешнего источника данных.");
  if (answers.toolDataSource === "unknown") pushUnknown(unknowns, "Источник данных и его ответственность.");
  if (answers.toolScenarios === "exceptions") pushUnknown(unknowns, "Исключения, ошибки и пограничные сценарии.");
  return { selectedOfferId: offer?.id ?? null, estimate: fromOffer(offer), assumptions, unknowns, nextStep: "project-brief" };
}

function buildWebAppResult(answers) {
  const unknowns = ["Границы frontend/backend и ответственность за API.", "Модель данных, роли и сценарии ошибок."];
  if (answers.webApi === "readyApi") unknowns.shift();
  return { selectedOfferId: null, estimate: { kind: "discovery", label: "Нужен discovery" }, assumptions: ["Запрос относится к регулярной работе с данными, ролями или статусами."], unknowns, nextStep: "project-brief" };
}

function buildSupportResult(answers, offerCatalog) {
  const offerId = answers.supportMode === "recurring" ? "support" : "site-improvement";
  const offer = findOffer(offerCatalog, offerId);
  const unknowns = [];
  if (answers.supportAccess !== "full") pushUnknown(unknowns, "Полный доступ к репозиторию и окружению.");
  return { selectedOfferId: offer?.id ?? null, estimate: fromOffer(offer), assumptions: [answers.supportMode === "recurring" ? "Речь идёт о регулярной поддержке по согласованному объёму." : "Речь идёт об отдельной доработке существующего проекта."], unknowns, nextStep: "project-brief" };
}

function buildUnsureResult() {
  return { selectedOfferId: null, estimate: { kind: "discovery", label: "Нужен discovery" }, assumptions: ["Сначала нужно определить пользовательский результат и первый безопасный этап."], unknowns: ["Формат продукта, состав работ и критерии готовности."], nextStep: "project-brief" };
}

function getRelevantAnswers(answers) {
  if (answers.taskType !== "site") {
    const keys = ["taskType", ...(NON_SITE_BRANCH_KEYS[answers.taskType] ?? [])];
    return Object.fromEntries(keys.map((key) => [key, answers[key]]).filter(([, value]) => (Array.isArray(value) ? value.length > 0 : value !== "" && value !== 0 && value !== false)));
  }

  const format = getSiteFormat(answers.siteFormat);
  const relevant = { taskType: "site" };
  if (!format) return relevant;

  relevant.siteFormat = format.id;
  if (format.volume) {
    relevant.sitePageCount = clampNumber(answers.sitePageCount, format.basePages, SITE_VOLUME_MAX);
    if (format.hasArticles && clampNumber(answers.siteArticleCount, 0, ARTICLE_MAX) > 0) {
      relevant.siteArticleCount = clampNumber(answers.siteArticleCount, 0, ARTICLE_MAX);
    }
  }
  if (!format.skipsPromotion) {
    if (answers.promotionDirect === true) {
      relevant.promotionDirect = true;
      if (format.id !== "landing") relevant.promotionDirectCount = clampNumber(answers.promotionDirectCount, DIRECT_MIN, DIRECT_MAX);
    }
    if (format.volume && answers.promotionSemantic === true) relevant.promotionSemantic = true;
    if (answers.promotionSeo === true) {
      relevant.promotionSeo = true;
      relevant.promotionSeoBudget = clampNumber(answers.promotionSeoBudget, SEO_MIN, SEO_MAX);
    }
  }
  if (SITE_DESIGN_IDS.has(answers.siteDesign)) relevant.siteDesign = answers.siteDesign;
  const integrations = Array.isArray(answers.siteIntegrations) ? answers.siteIntegrations.filter((id) => SITE_INTEGRATION_IDS.has(id)) : [];
  if (integrations.length > 0) relevant.siteIntegrations = integrations;
  return relevant;
}

export function buildCalculatorSummary(answers, offerCatalog) {
  let result;
  switch (answers.taskType) {
    case "site": result = buildSiteResult(answers); break;
    case "tool": result = buildToolResult(answers, offerCatalog); break;
    case "web-app": result = buildWebAppResult(answers); break;
    case "support": result = buildSupportResult(answers, offerCatalog); break;
    default: result = buildUnsureResult(); break;
  }
  return {
    schemaVersion: 2,
    taskType: TASK_TYPES.has(answers.taskType) ? answers.taskType : "unsure",
    answers: getRelevantAnswers(answers),
    selectedOfferId: result.selectedOfferId,
    estimate: result.estimate,
    assumptions: [...result.assumptions],
    unknowns: [...result.unknowns],
    nextStep: result.nextStep,
  };
}

export function getPersistableAnswers(answers) {
  const relevant = getRelevantAnswers(answers);
  return Object.fromEntries(Object.entries(relevant).filter(([key, value]) => NON_PERSONAL_KEYS.has(key) && (Array.isArray(value) ? value.length > 0 : typeof value === "number" ? value > 0 : typeof value === "boolean" ? value : value.length > 0)));
}

export function filterAnalyticsDetail(detail) {
  const allowed = new Set(["taskType", "selectedOfferId", "estimateKind", "branch"]);
  return Object.fromEntries(Object.entries(detail ?? {}).filter(([key, value]) => allowed.has(key) && (typeof value === "string" || typeof value === "number")));
}
