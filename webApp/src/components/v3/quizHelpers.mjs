const PROJECT_TYPES = new Set(["new-site", "redesign", "promo", "other"]);
const PACKAGES = new Set(["start", "brand", "cinematic", "unsure"]);
const BUDGETS = new Set(["60-100", "100-180", "180-plus"]);
const TIMINGS = new Set(["urgent", "one-two-months", "flexible"]);
const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
];

const projectTypeLabels = {
  "new-site": "Новый сайт",
  redesign: "Редизайн",
  promo: "Лендинг / Промо",
  other: "Другая задача",
};

const packageLabels = {
  start: "Старт",
  brand: "Бренд-сайт",
  cinematic: "Кинематографичный",
  unsure: "Нужна рекомендация",
};

const budgetLabels = {
  "60-100": "60–100 тыс. ₽",
  "100-180": "100–180 тыс. ₽",
  "180-plus": "От 180 тыс. ₽",
};

const timingLabels = {
  urgent: "Как можно скорее",
  "one-two-months": "1–2 месяца",
  flexible: "Срок гибкий",
};

const hasText = (value) => typeof value === "string" && value.trim().length > 0;

const isOptionalHttpUrl = (value) => {
  if (!hasText(value)) return true;

  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

export function validateStep(step, answers) {
  if (step === 1 && !PROJECT_TYPES.has(answers.projectType)) {
    return { valid: false, firstInvalid: "projectType" };
  }

  if (step === 2) {
    if (!hasText(answers.goal)) return { valid: false, firstInvalid: "goal" };
    if (!isOptionalHttpUrl(answers.siteUrl)) {
      return { valid: false, firstInvalid: "siteUrl" };
    }
  }

  if (step === 3 && !PACKAGES.has(answers.package)) {
    return { valid: false, firstInvalid: "package" };
  }

  if (step === 4) {
    if (!BUDGETS.has(answers.budget)) {
      return { valid: false, firstInvalid: "budget" };
    }
    if (!TIMINGS.has(answers.timing)) {
      return { valid: false, firstInvalid: "timing" };
    }
  }

  if (step === 5) {
    if (!hasText(answers.name)) return { valid: false, firstInvalid: "name" };
    if (!hasText(answers.contact)) return { valid: false, firstInvalid: "contact" };
    if (answers.consent !== true) return { valid: false, firstInvalid: "consent" };
  }

  return { valid: true };
}

export function getStepProgress(stepIndex) {
  const total = 5;
  const normalized = Number.isFinite(stepIndex) ? Math.trunc(stepIndex) : 0;
  const current = Math.min(total, Math.max(1, normalized + 1));

  return { current, total, label: `Шаг ${current} из ${total}` };
}

export function shapeLeadPayload(answers, pageUrl) {
  const payload = {
    name: answers.name.trim(),
    contact: answers.contact.trim(),
    projectType: answers.projectType,
    goal: answers.goal.trim(),
    package: answers.package,
    budget: answers.budget,
    timing: answers.timing,
    consent: true,
    pageUrl,
  };

  const siteUrl = answers.siteUrl?.trim();
  const comment = answers.comment?.trim();
  if (siteUrl) payload.siteUrl = siteUrl;
  if (comment) payload.comment = comment;

  try {
    const url = new URL(pageUrl);
    const utm = {};
    for (const key of UTM_KEYS) {
      const value = url.searchParams.get(key)?.trim();
      if (value) utm[key] = value;
    }
    if (Object.keys(utm).length > 0) payload.utm = utm;
  } catch {
    // pageUrl remains useful even when a non-standard browser location is supplied.
  }

  return payload;
}

export function buildTelegramUrl(payload) {
  const lines = [
    "Здравствуйте! Хочу обсудить проект.",
    `Тип: ${projectTypeLabels[payload.projectType]}`,
    `Цель и аудитория: ${payload.goal}`,
    `Пакет: ${packageLabels[payload.package]}`,
    `Бюджет: ${budgetLabels[payload.budget]}`,
    `Срок: ${timingLabels[payload.timing]}`,
  ];

  if (payload.siteUrl) lines.push(`Текущий сайт: ${payload.siteUrl}`);
  if (payload.comment) lines.push(`Комментарий: ${payload.comment}`);
  lines.push(`Имя: ${payload.name}`, `Контакт: ${payload.contact}`);

  const url = new URL("https://t.me/sergeikrk");
  url.searchParams.set("text", lines.join("\n"));
  return url.toString();
}
