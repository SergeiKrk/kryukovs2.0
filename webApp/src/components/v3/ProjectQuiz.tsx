import { useEffect, useRef, useState } from "react";
import {
  buildTelegramUrl,
  getStepProgress,
  shapeLeadPayload,
  validateStep,
  type Budget,
  type ProjectPackage,
  type ProjectType,
  type QuizAnswers,
  type Timing,
} from "./quizHelpers.mjs";

declare global {
  interface Window {
    ym?: (...args: unknown[]) => void;
  }
}

const STORAGE_KEY = "kryukovs-v3-project-calculator";
const METRIKA_ID = 112080682;
const MIN_FILL_TIME_MS = 3000;

const projectTypeOptions: Array<[ProjectType, string, string]> = [
  ["new-site", "Новый сайт", "Создание с нуля под продукт или компанию"],
  ["redesign", "Редизайн", "Новая структура и визуальная система"],
  ["promo", "Лендинг / Промо", "Одна выразительная страница под запуск"],
  ["other", "Другая задача", "Обсудим нестандартный формат"],
];

const packageOptions: Array<[ProjectPackage, string, string]> = [
  ["start", "Старт", "Понятная основа для быстрого запуска"],
  ["brand", "Бренд-сайт", "Система, которая раскрывает характер бренда"],
  ["cinematic", "Кинематографичный", "Выразительная арт-дирекция и аккуратное движение"],
  ["unsure", "Нужна рекомендация", "Подберём состав после разговора"],
];

const budgetOptions: Array<[Budget, string]> = [
  ["60-100", "60-100 тыс. ₽"],
  ["100-180", "100-180 тыс. ₽"],
  ["180-plus", "От 180 тыс. ₽"],
];

const timingOptions: Array<[Timing, string]> = [
  ["urgent", "Как можно скорее"],
  ["one-two-months", "1-2 месяца"],
  ["flexible", "Срок гибкий"],
];

const stepTitles = [
  "Какой проект нужен",
  "Что сайт должен изменить",
  "Какой уровень решения подходит",
  "Бюджет и сроки",
  "Куда вернуться с предложением",
];

const errorMessages: Partial<Record<keyof QuizAnswers, string>> = {
  projectType: "Выберите тип проекта.",
  goal: "Расскажите о цели и аудитории проекта.",
  siteUrl: "Укажите полный адрес вида https://example.ru или оставьте поле пустым.",
  package: "Выберите пакет или вариант с рекомендацией.",
  budget: "Выберите ориентир по бюджету.",
  timing: "Выберите подходящий срок.",
  name: "Укажите, как к вам обращаться.",
  contact: "Оставьте Telegram, телефон или email.",
  consent: "Нужно согласие на обработку данных для связи по проекту.",
};

const initialAnswers: QuizAnswers = {
  name: "",
  contact: "",
  projectType: "",
  goal: "",
  siteUrl: "",
  package: "",
  budget: "",
  timing: "",
  comment: "",
  consent: false,
};

const allowedProjectTypes = new Set(projectTypeOptions.map(([value]) => value));
const allowedPackages = new Set(packageOptions.map(([value]) => value));
const allowedBudgets = new Set(budgetOptions.map(([value]) => value));
const allowedTimings = new Set(timingOptions.map(([value]) => value));

type AnalyticsEventName =
  | "quiz_start"
  | "quiz_step_complete"
  | "quiz_submit_success"
  | "quiz_submit_error";

type SubmissionResult = {
  telegramUrl: string;
  message: string;
  opened: boolean;
};

function sendAnalytics(name: AnalyticsEventName, detail: Record<string, string | number>) {
  window.dispatchEvent(new CustomEvent(name, { detail }));
  if (typeof window.ym === "function") {
    window.ym(METRIKA_ID, "reachGoal", name, detail);
  }
}

function optionLabel<T extends string>(options: Array<[T, string, ...string[]]>, value: T | "") {
  return options.find(([optionValue]) => optionValue === value)?.[1] ?? "Не выбрано";
}

export default function ProjectQuiz() {
  const [answers, setAnswers] = useState<QuizAnswers>(initialAnswers);
  const [stepIndex, setStepIndex] = useState(0);
  const [invalidField, setInvalidField] = useState<keyof QuizAnswers | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState("");
  const [submission, setSubmission] = useState<SubmissionResult | null>(null);
  const [storageReady, setStorageReady] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const startedAtRef = useRef(Date.now());
  const analyticsStartedRef = useRef(false);
  const shouldFocusHeadingRef = useRef(false);

  const progress = getStepProgress(stepIndex);
  const stepNumber = stepIndex + 1;

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Record<string, unknown>;
        const savedStep = typeof saved.stepIndex === "number" ? Math.trunc(saved.stepIndex) : 0;
        const text = (key: string) =>
          typeof saved[key] === "string" ? String(saved[key]).slice(0, 2000) : "";

        setAnswers((current) => ({
          ...current,
          projectType: allowedProjectTypes.has(saved.projectType as ProjectType)
            ? (saved.projectType as ProjectType)
            : "",
          goal: text("goal"),
          siteUrl: text("siteUrl"),
          package: allowedPackages.has(saved.package as ProjectPackage)
            ? (saved.package as ProjectPackage)
            : "",
          budget: allowedBudgets.has(saved.budget as Budget) ? (saved.budget as Budget) : "",
          timing: allowedTimings.has(saved.timing as Timing) ? (saved.timing as Timing) : "",
        }));
        setStepIndex(Math.min(4, Math.max(0, savedStep)));
      }
    } catch {
      try {
        window.sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        // Storage can be fully unavailable in hardened browser modes.
      }
    } finally {
      setStorageReady(true);
    }
  }, []);

  useEffect(() => {
    if (!storageReady || submission) return;

    try {
      window.sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          stepIndex,
          projectType: answers.projectType,
          goal: answers.goal,
          siteUrl: answers.siteUrl,
          package: answers.package,
          budget: answers.budget,
          timing: answers.timing,
        }),
      );
    } catch {
      // The calculator remains usable when storage is unavailable.
    }
  }, [answers, stepIndex, storageReady, submission]);

  useEffect(() => {
    if (!shouldFocusHeadingRef.current) return;
    shouldFocusHeadingRef.current = false;
    headingRef.current?.focus();
  }, [stepIndex]);

  const markStarted = () => {
    if (analyticsStartedRef.current) return;
    analyticsStartedRef.current = true;
    sendAnalytics("quiz_start", { step: stepNumber });
  };

  const updateAnswer = <Key extends keyof QuizAnswers>(key: Key, value: QuizAnswers[Key]) => {
    markStarted();
    setAnswers((current) => ({ ...current, [key]: value }));
    if (invalidField === key) setInvalidField(null);
    if (status) setStatus("");
  };

  const focusInvalid = (field: keyof QuizAnswers) => {
    window.requestAnimationFrame(() => {
      const control = formRef.current?.elements.namedItem(field);
      if (control instanceof HTMLElement) control.focus();
      else if (control instanceof RadioNodeList) {
        const first = Array.from(control).find((item) => item instanceof HTMLElement);
        if (first instanceof HTMLElement) first.focus();
      }
    });
  };

  const validateCurrentStep = () => {
    const validation = validateStep(stepNumber, answers);
    if (validation.valid) return true;

    setInvalidField(validation.firstInvalid);
    setStatus(errorMessages[validation.firstInvalid] ?? "Проверьте заполнение шага.");
    focusInvalid(validation.firstInvalid);
    return false;
  };

  const moveToStep = (nextIndex: number) => {
    setInvalidField(null);
    setStatus("");
    shouldFocusHeadingRef.current = true;
    setStepIndex(nextIndex);
  };

  const handleNext = () => {
    markStarted();
    if (!validateCurrentStep()) return;
    sendAnalytics("quiz_step_complete", { step: stepNumber });
    moveToStep(Math.min(4, stepIndex + 1));
  };

  const handleBack = () => {
    markStarted();
    moveToStep(Math.max(0, stepIndex - 1));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing) return;
    const target = event.target;
    if (target instanceof HTMLTextAreaElement || target instanceof HTMLButtonElement) return;
    if (stepIndex < 4) {
      event.preventDefault();
      handleNext();
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    markStarted();
    if (!validateCurrentStep()) return;

    if (honeypot.trim() || Date.now() - startedAtRef.current < MIN_FILL_TIME_MS) {
      setStatus("Не получилось подготовить сообщение. Проверьте данные и попробуйте ещё раз.");
      sendAnalytics("quiz_submit_error", { step: 5, reason: "retry_required" });
      return;
    }

    try {
      sendAnalytics("quiz_step_complete", { step: 5 });
      const payload = shapeLeadPayload(answers, window.location.href);
      const telegramUrl = buildTelegramUrl(payload);
      const message = new URL(telegramUrl).searchParams.get("text") ?? "";
      const telegramWindow = window.open(telegramUrl, "_blank");
      if (telegramWindow) telegramWindow.opener = null;

      setSubmission({ telegramUrl, message, opened: Boolean(telegramWindow) });
      setStatus(
        telegramWindow
          ? "Сообщение подготовлено. Проверьте Telegram и отправьте его Сергею."
          : "Telegram не открылся автоматически. Скопируйте сообщение или откройте ссылку ниже.",
      );
      window.sessionStorage.removeItem(STORAGE_KEY);

      if (navigator.clipboard?.writeText) {
        void navigator.clipboard.writeText(message).catch(() => undefined);
      }

      sendAnalytics(
        telegramWindow ? "quiz_submit_success" : "quiz_submit_error",
        telegramWindow
          ? { step: 5, handoff: "telegram" }
          : { step: 5, reason: "popup_blocked" },
      );
    } catch {
      setStatus("Не получилось подготовить сообщение. Проверьте данные и попробуйте ещё раз.");
      sendAnalytics("quiz_submit_error", { step: 5, reason: "unexpected" });
    }
  };

  const copyMessage = async () => {
    if (!submission) return;
    try {
      await navigator.clipboard.writeText(submission.message);
      setStatus("Сообщение скопировано. Вставьте его в диалог с Сергеем.");
    } catch {
      setStatus("Выделите текст сообщения ниже и скопируйте его вручную.");
    }
  };

  return (
    <div className="v3-quiz__layout">
      <form
        ref={formRef}
        className="v3-quiz__form"
        noValidate
        onFocus={markStarted}
        onKeyDown={handleKeyDown}
        onSubmit={handleSubmit}
      >
        <div className="v3-quiz__progress">
          <p aria-live="polite">{progress.label}</p>
          <span>Короткий бриф без отправки на сервер</span>
        </div>

        <h3 ref={headingRef} tabIndex={-1} className="v3-quiz__step-title">
          {stepTitles[stepIndex]}
        </h3>

        {stepIndex === 0 && (
          <fieldset className="v3-quiz__fieldset">
            <legend>Тип проекта</legend>
            <div className="v3-quiz__options">
              {projectTypeOptions.map(([value, label, hint]) => (
                <label key={value} className="v3-quiz__option">
                  <input
                    type="radio"
                    name="projectType"
                    value={value}
                    checked={answers.projectType === value}
                    aria-invalid={invalidField === "projectType"}
                    aria-describedby={invalidField === "projectType" ? "projectType-error" : undefined}
                    onChange={() => updateAnswer("projectType", value)}
                  />
                  <span><strong>{label}</strong><small>{hint}</small></span>
                </label>
              ))}
            </div>
            {invalidField === "projectType" && <p id="projectType-error" className="v3-quiz__error">{errorMessages.projectType}</p>}
          </fieldset>
        )}

        {stepIndex === 1 && (
          <div className="v3-quiz__fields">
            <div className="v3-quiz__field">
              <label htmlFor="goal">Цель и аудитория <span aria-hidden="true">*</span></label>
              <textarea
                id="goal"
                name="goal"
                rows={5}
                required
                value={answers.goal}
                aria-invalid={invalidField === "goal"}
                aria-describedby={invalidField === "goal" ? "goal-hint goal-error" : "goal-hint"}
                onChange={(event) => updateAnswer("goal", event.target.value)}
              />
              <p id="goal-hint">Что должен понять или сделать посетитель и для кого создаётся сайт?</p>
              {invalidField === "goal" && <p id="goal-error" className="v3-quiz__error">{errorMessages.goal}</p>}
            </div>
            <div className="v3-quiz__field">
              <label htmlFor="siteUrl">Текущий сайт <span>необязательно</span></label>
              <input
                id="siteUrl"
                name="siteUrl"
                type="url"
                inputMode="url"
                placeholder="https://example.ru"
                value={answers.siteUrl}
                aria-invalid={invalidField === "siteUrl"}
                aria-describedby={invalidField === "siteUrl" ? "siteUrl-error" : undefined}
                onChange={(event) => updateAnswer("siteUrl", event.target.value)}
              />
              {invalidField === "siteUrl" && <p id="siteUrl-error" className="v3-quiz__error">{errorMessages.siteUrl}</p>}
            </div>
          </div>
        )}

        {stepIndex === 2 && (
          <fieldset className="v3-quiz__fieldset">
            <legend>Пакет</legend>
            <div className="v3-quiz__options">
              {packageOptions.map(([value, label, hint]) => (
                <label key={value} className="v3-quiz__option">
                  <input
                    type="radio"
                    name="package"
                    value={value}
                    checked={answers.package === value}
                    aria-invalid={invalidField === "package"}
                    aria-describedby={invalidField === "package" ? "package-error" : undefined}
                    onChange={() => updateAnswer("package", value)}
                  />
                  <span><strong>{label}</strong><small>{hint}</small></span>
                </label>
              ))}
            </div>
            {invalidField === "package" && <p id="package-error" className="v3-quiz__error">{errorMessages.package}</p>}
          </fieldset>
        )}

        {stepIndex === 3 && (
          <div className="v3-quiz__fields">
            <fieldset className="v3-quiz__fieldset">
              <legend>Бюджет</legend>
              <div className="v3-quiz__options v3-quiz__options--compact">
                {budgetOptions.map(([value, label]) => (
                  <label key={value} className="v3-quiz__option">
                    <input
                      type="radio"
                      name="budget"
                      value={value}
                      checked={answers.budget === value}
                      aria-invalid={invalidField === "budget"}
                      aria-describedby={invalidField === "budget" ? "budget-error" : undefined}
                      onChange={() => updateAnswer("budget", value)}
                    />
                    <span><strong>{label}</strong></span>
                  </label>
                ))}
              </div>
              {invalidField === "budget" && <p id="budget-error" className="v3-quiz__error">{errorMessages.budget}</p>}
            </fieldset>
            <fieldset className="v3-quiz__fieldset">
              <legend>Срок</legend>
              <div className="v3-quiz__options v3-quiz__options--compact">
                {timingOptions.map(([value, label]) => (
                  <label key={value} className="v3-quiz__option">
                    <input
                      type="radio"
                      name="timing"
                      value={value}
                      checked={answers.timing === value}
                      aria-invalid={invalidField === "timing"}
                      aria-describedby={invalidField === "timing" ? "timing-error" : undefined}
                      onChange={() => updateAnswer("timing", value)}
                    />
                    <span><strong>{label}</strong></span>
                  </label>
                ))}
              </div>
              {invalidField === "timing" && <p id="timing-error" className="v3-quiz__error">{errorMessages.timing}</p>}
            </fieldset>
          </div>
        )}

        {stepIndex === 4 && (
          <div className="v3-quiz__fields">
            <div className="v3-quiz__field">
              <label htmlFor="name">Имя <span aria-hidden="true">*</span></label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={answers.name}
                aria-invalid={invalidField === "name"}
                aria-describedby={invalidField === "name" ? "name-error" : undefined}
                onChange={(event) => updateAnswer("name", event.target.value)}
              />
              {invalidField === "name" && <p id="name-error" className="v3-quiz__error">{errorMessages.name}</p>}
            </div>
            <div className="v3-quiz__field">
              <label htmlFor="contact">Telegram, телефон или email <span aria-hidden="true">*</span></label>
              <input
                id="contact"
                name="contact"
                type="text"
                autoComplete="email"
                required
                value={answers.contact}
                aria-invalid={invalidField === "contact"}
                aria-describedby={invalidField === "contact" ? "contact-error" : undefined}
                onChange={(event) => updateAnswer("contact", event.target.value)}
              />
              {invalidField === "contact" && <p id="contact-error" className="v3-quiz__error">{errorMessages.contact}</p>}
            </div>
            <div className="v3-quiz__field">
              <label htmlFor="comment">Комментарий <span>необязательно</span></label>
              <textarea
                id="comment"
                name="comment"
                rows={4}
                value={answers.comment}
                onChange={(event) => updateAnswer("comment", event.target.value)}
              />
            </div>
            <div className="v3-quiz__honeypot" aria-hidden="true">
              <label htmlFor="companyWebsite">Сайт компании</label>
              <input
                id="companyWebsite"
                name="companyWebsite"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(event) => setHoneypot(event.target.value)}
              />
            </div>
            <label className="v3-quiz__consent">
              <input
                type="checkbox"
                name="consent"
                required
                checked={answers.consent}
                aria-invalid={invalidField === "consent"}
                aria-describedby={invalidField === "consent" ? "consent-error" : undefined}
                onChange={(event) => updateAnswer("consent", event.target.checked)}
              />
              <span>Согласен на обработку указанных данных для связи по проекту.</span>
            </label>
            {invalidField === "consent" && <p id="consent-error" className="v3-quiz__error">{errorMessages.consent}</p>}
          </div>
        )}

        <p className="v3-quiz__status" role="status" aria-live="polite">{status}</p>

        {submission && (
          <div className="v3-quiz__handoff">
            <label htmlFor="telegram-message">Готовое сообщение для Telegram</label>
            <textarea id="telegram-message" rows={9} readOnly value={submission.message} />
            <div className="v3-quiz__handoff-actions">
              <button className="v3-button v3-button--quiet" type="button" onClick={copyMessage}>Скопировать сообщение</button>
              <a className="v3-button v3-button--primary" href={submission.telegramUrl} target="_blank" rel="noreferrer">Открыть @sergeikrk <span aria-hidden="true">↗</span></a>
            </div>
          </div>
        )}

        {!submission && (
          <div className="v3-quiz__controls">
            <button className="v3-button v3-button--quiet" type="button" onClick={handleBack} disabled={stepIndex === 0}>Назад</button>
            {stepIndex < 4 ? (
              <button className="v3-button v3-button--primary" type="button" onClick={handleNext}>Далее</button>
            ) : (
              <button className="v3-button v3-button--primary" type="submit">Подготовить сообщение</button>
            )}
          </div>
        )}
      </form>

      <aside className="v3-quiz__summary" aria-labelledby="v3-quiz-summary-title">
        <p className="v3-kicker">Сводка</p>
        <h3 id="v3-quiz-summary-title">Контекст проекта</h3>
        <dl>
          <div><dt>Тип</dt><dd>{optionLabel(projectTypeOptions, answers.projectType)}</dd></div>
          <div><dt>Цель и аудитория</dt><dd>{answers.goal.trim() || "Пока не описаны"}</dd></div>
          {answers.siteUrl.trim() && <div><dt>Текущий сайт</dt><dd>{answers.siteUrl.trim()}</dd></div>}
          <div><dt>Пакет</dt><dd>{optionLabel(packageOptions, answers.package)}</dd></div>
          <div><dt>Бюджет</dt><dd>{optionLabel(budgetOptions, answers.budget)}</dd></div>
          <div><dt>Срок</dt><dd>{optionLabel(timingOptions, answers.timing)}</dd></div>
        </dl>
        <p>Ответы сохраняются только в этой вкладке. Имя, контакт и комментарий не сохраняются.</p>
        <a href="https://t.me/sergeikrk" target="_blank" rel="noreferrer">Прямой контакт в Telegram <span aria-hidden="true">↗</span></a>
      </aside>
    </div>
  );
}
