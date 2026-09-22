const TASK_TYPES = new Set(["site", "tool", "web-app", "support", "unsure"]);

const BRANCH_KEYS = {
  site: ["siteFormat", "sitePages", "siteDesign", "siteEditor", "siteIntegrations", "siteMaterials"],
  tool: ["toolGoal", "toolInputs", "toolDataSource", "toolScenarios", "toolComplexity"],
  "web-app": ["webUsers", "webRoles", "webData", "webApi"],
  support: ["supportState", "supportProblem", "supportAccess", "supportMode"],
  unsure: ["unsureGoal", "unsureSituation", "unsureMaterials"],
};

const NON_PERSONAL_KEYS = new Set([
  "taskType",
  "siteFormat",
  "sitePages",
  "siteDesign",
  "siteEditor",
  "siteIntegrations",
  "siteMaterials",
  "toolComplexity",
  "webRoles",
  "webApi",
  "supportAccess",
  "supportMode",
]);

export function createInitialCalculatorAnswers() {
  return {
    taskType: "",
    siteFormat: "",
    sitePages: "",
    siteDesign: "",
    siteEditor: "",
    siteIntegrations: "",
    siteMaterials: "",
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

export function resetAnswersForTaskType(previousAnswers, taskType) {
  const next = createInitialCalculatorAnswers();
  if (!TASK_TYPES.has(taskType)) return next;
  next.taskType = taskType;
  return next;
}

export function getBranchKeys(taskType) {
  return TASK_TYPES.has(taskType) ? [...BRANCH_KEYS[taskType]] : [];
}

const hasText = (value) => typeof value === "string" && value.trim().length > 0;

export function validateCalculatorStep(step, answers) {
  if (step === 0 && !TASK_TYPES.has(answers.taskType)) {
    return { valid: false, firstInvalid: "taskType" };
  }

  if (step !== 1) return { valid: true };

  const requiredByBranch = {
    site: ["siteFormat", "sitePages", "siteDesign", "siteEditor", "siteIntegrations", "siteMaterials"],
    tool: ["toolGoal", "toolInputs", "toolDataSource", "toolScenarios", "toolComplexity"],
    "web-app": ["webUsers", "webRoles", "webData", "webApi"],
    support: ["supportState", "supportProblem", "supportAccess", "supportMode"],
    unsure: ["unsureGoal"],
  };

  for (const key of requiredByBranch[answers.taskType] ?? []) {
    if (!hasText(answers[key])) return { valid: false, firstInvalid: key };
  }

  return { valid: true };
}

function findOffer(offerCatalog, id) {
  return offerCatalog.find((offer) => offer.id === id) ?? null;
}

function fromOffer(offer) {
  return offer
    ? { kind: "from", priceLabel: offer.priceLabel, offerId: offer.id }
    : { kind: "discovery", label: "Нужен discovery" };
}

function pushUnknown(unknowns, value) {
  if (!unknowns.includes(value)) unknowns.push(value);
}

function buildSiteResult(answers, offerCatalog) {
  const offer = findOffer(offerCatalog, answers.siteFormat);
  const assumptions = [];
  const unknowns = [];

  const assumptionsByKey = {
    sitePages: {
      single: "Одна основная страница или короткая посадочная структура.",
      small: "Небольшой сайт с ограниченным числом разделов.",
      multi: "Многостраничная структура с несколькими разделами.",
      unknown: "Количество страниц ещё нужно определить.",
    },
    siteDesign: {
      existing: "Часть визуальных материалов уже подготовлена.",
      individual: "Нужна индивидуальная визуальная система.",
      unsure: "Формат дизайна нужно определить после просмотра материалов.",
    },
    siteEditor: {
      none: "Редактор контента на первом этапе не требуется.",
      need: "Нужно предусмотреть самостоятельное обновление контента.",
      unsure: "Потребность в редакторе нужно уточнить по процессу команды.",
    },
    siteIntegrations: {
      none: "Внешние интеграции на первом этапе не заявлены.",
      simple: "Нужны отдельные простые интеграции.",
      complex: "Интеграции могут заметно изменить объём работ.",
    },
    siteMaterials: {
      ready: "Основные материалы готовы к работе.",
      partial: "Часть материалов потребуется подготовить или доработать.",
      idea: "Проект начинается с идеи и discovery.",
    },
  };

  for (const key of Object.keys(assumptionsByKey)) {
    const value = assumptionsByKey[key][answers[key]];
    if (value) assumptions.push(value);
  }

  if (answers.siteIntegrations === "complex") {
    pushUnknown(unknowns, "Состав, доступы и ответственность за интеграции.");
  }
  if (answers.siteEditor === "unsure") pushUnknown(unknowns, "Редакторский процесс после запуска.");
  if (answers.siteMaterials === "idea") pushUnknown(unknowns, "Контент, структура и критерии готовности.");

  return {
    selectedOfferId: offer?.id ?? null,
    estimate: fromOffer(offer),
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
  if (answers.toolDataSource === "ready") assumptions.push("Источник данных уже известен или подготовлен.");
  if (answers.toolDataSource === "external") pushUnknown(unknowns, "Доступность и формат внешнего источника данных.");
  if (answers.toolDataSource === "unknown") pushUnknown(unknowns, "Источник данных и его ответственность.");
  if (answers.toolScenarios === "exceptions") pushUnknown(unknowns, "Исключения, ошибки и пограничные сценарии.");

  return {
    selectedOfferId: offer?.id ?? null,
    estimate: fromOffer(offer),
    assumptions,
    unknowns,
    nextStep: "project-brief",
  };
}

function buildWebAppResult(answers) {
  const unknowns = ["Границы frontend/backend и ответственность за API.", "Модель данных, роли и сценарии ошибок."];
  if (answers.webApi === "readyApi") unknowns.shift();
  return {
    selectedOfferId: null,
    estimate: { kind: "discovery", label: "Нужен discovery" },
    assumptions: ["Запрос относится к регулярной работе с данными, ролями или статусами."],
    unknowns,
    nextStep: "project-brief",
  };
}

function buildSupportResult(answers, offerCatalog) {
  const offerId = answers.supportMode === "recurring" ? "support" : "site-improvement";
  const offer = findOffer(offerCatalog, offerId);
  const unknowns = [];
  if (answers.supportAccess === "partialAccess") pushUnknown(unknowns, "Полный доступ к репозиторию и окружению.");
  if (answers.supportAccess === "noAccess") pushUnknown(unknowns, "Доступы для диагностики и безопасного внесения изменений.");
  return {
    selectedOfferId: offer?.id ?? null,
    estimate: fromOffer(offer),
    assumptions: [answers.supportMode === "recurring" ? "Речь идёт о регулярной поддержке по согласованному объёму." : "Речь идёт об отдельной доработке существующего проекта."],
    unknowns,
    nextStep: "project-brief",
  };
}

function buildUnsureResult() {
  return {
    selectedOfferId: null,
    estimate: { kind: "discovery", label: "Нужен discovery" },
    assumptions: ["Сначала нужно определить пользовательский результат и первый безопасный этап."],
    unknowns: ["Формат продукта, состав работ и критерии готовности."],
    nextStep: "project-brief",
  };
}

export function buildCalculatorSummary(answers, offerCatalog) {
  let result;
  switch (answers.taskType) {
    case "site":
      result = buildSiteResult(answers, offerCatalog);
      break;
    case "tool":
      result = buildToolResult(answers, offerCatalog);
      break;
    case "web-app":
      result = buildWebAppResult(answers);
      break;
    case "support":
      result = buildSupportResult(answers, offerCatalog);
      break;
    default:
      result = buildUnsureResult();
      break;
  }

  return {
    schemaVersion: 1,
    taskType: TASK_TYPES.has(answers.taskType) ? answers.taskType : "unsure",
    answers: { ...answers },
    selectedOfferId: result.selectedOfferId,
    estimate: result.estimate,
    assumptions: [...result.assumptions],
    unknowns: [...result.unknowns],
    nextStep: result.nextStep,
  };
}

export function getPersistableAnswers(answers) {
  return Object.fromEntries(
    Object.entries(answers).filter(([key, value]) => NON_PERSONAL_KEYS.has(key) && typeof value === "string" && value.length > 0),
  );
}

export function filterAnalyticsDetail(detail) {
  const allowed = new Set(["taskType", "selectedOfferId", "estimateKind", "branch"]);
  return Object.fromEntries(
    Object.entries(detail ?? {}).filter(([key, value]) => allowed.has(key) && (typeof value === "string" || typeof value === "number")),
  );
}
