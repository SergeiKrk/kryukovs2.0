import assert from "node:assert/strict";
import test from "node:test";

const helpers = await import("./quizHelpers.mjs").catch(() => ({}));

const call = (name, ...args) =>
  typeof helpers[name] === "function" ? helpers[name](...args) : undefined;

const completeAnswers = {
  name: "Сергей",
  contact: "@sergey",
  projectType: "new-site",
  goal: "Запустить продажи для новой аудитории",
  siteUrl: "https://example.com",
  package: "brand",
  budget: "100-180",
  timing: "one-two-months",
  comment: "Нужен запуск осенью",
  consent: true,
};

test("каждый шаг блокируется своим первым обязательным незаполненным полем", () => {
  const cases = [
    [1, { ...completeAnswers, projectType: "" }, "projectType"],
    [2, { ...completeAnswers, goal: "   " }, "goal"],
    [3, { ...completeAnswers, package: "" }, "package"],
    [4, { ...completeAnswers, budget: "" }, "budget"],
    [4, { ...completeAnswers, timing: "" }, "timing"],
    [5, { ...completeAnswers, name: "" }, "name"],
    [5, { ...completeAnswers, contact: "" }, "contact"],
    [5, { ...completeAnswers, consent: false }, "consent"],
  ];

  for (const [step, answers, firstInvalid] of cases) {
    assert.deepEqual(call("validateStep", step, answers), {
      valid: false,
      firstInvalid,
    });
  }
});

test("каждый шаг пропускает заполненные обязательные поля", () => {
  for (const step of [1, 2, 3, 4, 5]) {
    assert.deepEqual(call("validateStep", step, completeAnswers), { valid: true });
  }
});

test("необязательный URL принимается пустым", () => {
  assert.deepEqual(
    call("validateStep", 2, { ...completeAnswers, siteUrl: "   " }),
    { valid: true },
  );
});

test("необязательный URL отклоняется, если его формат некорректен", () => {
  assert.deepEqual(
    call("validateStep", 2, { ...completeAnswers, siteUrl: "мой сайт" }),
    { valid: false, firstInvalid: "siteUrl" },
  );
});

test("видимый прогресс ограничен пятью шагами и использует человеческую нумерацию", () => {
  assert.deepEqual(call("getStepProgress", -10), {
    current: 1,
    total: 5,
    label: "Шаг 1 из 5",
  });
  assert.deepEqual(call("getStepProgress", 1), {
    current: 2,
    total: 5,
    label: "Шаг 2 из 5",
  });
  assert.deepEqual(call("getStepProgress", 99), {
    current: 5,
    total: 5,
    label: "Шаг 5 из 5",
  });
});

test("payload обрезает строки, удаляет пустые optional-поля и включает только разрешённые UTM", () => {
  const pageUrl =
    "https://kryukovs.ru/?utm_source=profi&utm_medium=cpc&utm_campaign=autumn&utm_content=hero&utm_term=site&utm_private=secret";
  const payload = call(
    "shapeLeadPayload",
    {
      ...completeAnswers,
      name: "  Анна  ",
      contact: "  @anna  ",
      goal: "  Объяснить новый продукт  ",
      siteUrl: "  ",
      comment: "   ",
    },
    pageUrl,
  );

  assert.deepEqual(payload, {
    name: "Анна",
    contact: "@anna",
    projectType: "new-site",
    goal: "Объяснить новый продукт",
    package: "brand",
    budget: "100-180",
    timing: "one-two-months",
    consent: true,
    utm: {
      utm_source: "profi",
      utm_medium: "cpc",
      utm_campaign: "autumn",
      utm_content: "hero",
      utm_term: "site",
    },
    pageUrl,
  });
  assert.equal("siteUrl" in payload, false);
  assert.equal("comment" in payload, false);
});

test("Telegram URL содержит читаемую русскую сводку без consent и внутренних значений", () => {
  const payload = {
    ...completeAnswers,
    pageUrl: "https://kryukovs.ru/",
    utm: { utm_source: "profi" },
  };
  const telegramUrl = call("buildTelegramUrl", payload);

  assert.equal(typeof telegramUrl, "string");
  const parsed = new URL(telegramUrl);
  const message = parsed.searchParams.get("text") ?? "";

  assert.equal(`${parsed.origin}${parsed.pathname}`, "https://t.me/sergeikrk");
  assert.match(message, /Новый сайт/);
  assert.match(message, /Бренд-сайт/);
  assert.match(message, /100–180 тыс\. ₽/);
  assert.match(message, /1–2 месяца/);
  assert.match(message, /Запустить продажи для новой аудитории/);
  assert.doesNotMatch(message, /consent|согласие|true/i);
  assert.doesNotMatch(message, /new-site|one-two-months|100-180/);
});
