import { PaperPlaneTilt, X } from "@phosphor-icons/react";
import QRCode from "qrcode";
import { useCallback, useEffect, useRef, useState } from "react";
import { offerCatalog, type Offer } from "../../data/v3";
import {
  buildCalculatorSummary,
  createInitialCalculatorAnswers,
  filterAnalyticsDetail,
  resetAnswersForTaskType,
  validateCalculatorStep,
  type CalculatorAnswers,
  type CalculatorSummary,
  type TaskType,
} from "./calculatorHelpers.mjs";
import { clearPendingCalculatorSummary, publishCalculatorSummary } from "./calculatorBridge.mjs";
import { getMessengersUrl, MAX_HREF, MESSENGERS_PATH, TELEGRAM_HREF } from "./messengerLinks";

declare global {
  interface Window {
    ym?: (...args: unknown[]) => void;
  }
}

type Choice = { value: string; label: string; hint?: string };

const METRIKA_ID = 112080682;
const MOBILE_MEDIA_QUERY = "(max-width: 52rem)";
const FOCUSABLE_DIALOG_SELECTOR = "button:not([disabled]), a[href], [tabindex]:not([tabindex=\"-1\"])";

const taskOptions: Choice[] = [
  { value: "site", label: "Сайт или лендинг", hint: "Публичный продукт для компании, услуги или кампании" },
  { value: "tool", label: "Сайт-калькулятор или конфигуратор", hint: "Расчёт, подбор, сравнение или интерактивный инструмент" },
  { value: "web-app", label: "Веб-сервис или SaaS", hint: "Регулярная работа с данными, ролями и состояниями" },
  { value: "support", label: "Поддержка существующего продукта", hint: "Исправление, ускорение, развитие или миграция" },
  { value: "unsure", label: "Не уверен", hint: "Опишем цель и выберем первый разумный шаг" },
];

const taskLabels: Record<TaskType, string> = {
  site: "Сайт или лендинг",
  tool: "Сайт-калькулятор или конфигуратор",
  "web-app": "Веб-сервис или SaaS",
  support: "Поддержка существующего продукта",
  unsure: "Формат пока не определён",
};

const answerLabels: Record<string, string> = {
  siteFormat: "Формат",
  sitePages: "Объём",
  siteDesign: "Дизайн",
  siteEditor: "Редактор",
  siteIntegrations: "Интеграции",
  siteMaterials: "Материалы",
  toolGoal: "Задача инструмента",
  toolInputs: "Входные данные",
  toolDataSource: "Источник данных",
  toolScenarios: "Сценарии",
  toolComplexity: "Сложность",
  webUsers: "Пользователи",
  webRoles: "Роли",
  webData: "Данные",
  webApi: "API и backend",
  supportState: "Текущее состояние",
  supportProblem: "Проблема",
  supportAccess: "Доступы",
  supportMode: "Формат работы",
  unsureGoal: "Цель",
  unsureSituation: "Текущая ситуация",
  unsureMaterials: "Материалы",
};

const choiceLabelsByKey: Record<string, Record<string, string>> = {
  siteFormat: {
    "landing-ad": "Рекламная посадочная",
    "landing-direct": "Посадочная + Яндекс.Директ",
    "custom-landing": "Индивидуальный лендинг",
    "animated-landing-direct": "Лендинг с анимацией + Директ",
    "corporate-site": "Корпоративный сайт",
  },
  sitePages: { single: "Одна основная страница", small: "Небольшой сайт", multi: "Многостраничный сайт", unknown: "Пока не определено" },
  siteDesign: { existing: "Есть исходная визуальная система", individual: "Нужен индивидуальный дизайн", unsure: "Нужна рекомендация" },
  siteEditor: { none: "Не требуется на первом этапе", need: "Нужен редактор", unsure: "Пока не знаю" },
  siteIntegrations: { none: "Не нужны", simple: "Есть отдельные простые интеграции", complex: "Есть сложные интеграции" },
  siteMaterials: { ready: "Готовы", partial: "Часть готова", idea: "Пока только идея" },
  toolDataSource: { ready: "Источник готов", external: "Внешний источник или API", unknown: "Пока не определён" },
  toolScenarios: { standard: "Основной сценарий понятен", exceptions: "Есть исключения и особые сценарии" },
  toolComplexity: { simple: "Понятный расчёт или подбор", complex: "Многошаговая логика и состояния" },
  webRoles: { roles: "Нужны роли и авторизация", noRoles: "Отдельные роли не нужны" },
  webApi: { readyApi: "API или backend уже есть", plannedApi: "API/backend нужно определить" },
  supportState: { working: "Сайт или сервис уже работает", partlyWorking: "Работает частично", broken: "Есть конкретная проблема" },
  supportAccess: { full: "Доступ к коду и окружению есть", partialAccess: "Доступы частичные", noAccess: "Доступов пока нет" },
  supportMode: { oneOff: "Разовая задача", recurring: "Регулярная поддержка" },
};

const errors: Record<string, string> = {
  taskType: "Выберите подходящий маршрут.",
  siteFormat: "Выберите формат сайта.",
  sitePages: "Выберите примерный объём.",
  siteDesign: "Укажите состояние дизайна.",
  siteEditor: "Укажите, нужен ли редактор.",
  siteIntegrations: "Укажите, нужны ли интеграции.",
  siteMaterials: "Укажите готовность материалов.",
  toolGoal: "Опишите, что должен рассчитывать или подбирать инструмент.",
  toolInputs: "Опишите основные входные данные.",
  toolDataSource: "Укажите источник данных.",
  toolScenarios: "Укажите основной набор сценариев.",
  toolComplexity: "Выберите сложность инструмента.",
  webUsers: "Укажите, кто будет пользоваться сервисом.",
  webRoles: "Укажите потребность в ролях и авторизации.",
  webData: "Укажите, с какими данными будут работать.",
  webApi: "Укажите состояние API или backend.",
  supportState: "Опишите текущее состояние продукта.",
  supportProblem: "Опишите проблему или нужное изменение.",
  supportAccess: "Укажите состояние доступов.",
  supportMode: "Выберите формат работы.",
  unsureGoal: "Опишите цель проекта.",
};

function sendAnalytics(name: string, detail: Record<string, unknown> = {}) {
  const safeDetail = filterAnalyticsDetail(detail);
  window.dispatchEvent(new CustomEvent(name, { detail: safeDetail }));
  if (typeof window.ym === "function") window.ym(METRIKA_ID, "reachGoal", name, safeDetail);
}

function getOffer(id: string | null): Offer | null {
  return id ? offerCatalog.find((offer) => offer.id === id) ?? null : null;
}

function getTaskType(value: string): TaskType | "" {
  return taskOptions.some((option) => option.value === value) ? (value as TaskType) : "";
}

function answerRows(summary: CalculatorSummary) {
  return Object.entries(summary.answers)
    .filter((entry): entry is [string, string] => entry[0] !== "taskType" && typeof entry[1] === "string" && entry[1].trim().length > 0)
    .map(([key, value]) => [answerLabels[key] ?? key, choiceLabelsByKey[key]?.[value] ?? value] as const);
}

function ChoiceGroup({
  name,
  value,
  options,
  invalid,
  onChange,
}: {
  name: string;
  value: string;
  options: Choice[];
  invalid: boolean;
  onChange: (value: string) => void;
}) {
  const errorId = `${name}-error`;
  return (
    <>
      <div className="v3-quiz__options">
        {options.map((option) => (
          <label key={option.value} className="v3-quiz__option">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              aria-invalid={invalid}
              aria-describedby={invalid ? errorId : undefined}
              onChange={() => onChange(option.value)}
            />
            <span>
              <strong>{option.label}</strong>
              {option.hint && <small>{option.hint}</small>}
            </span>
          </label>
        ))}
      </div>
      {invalid && <p id={errorId} className="v3-quiz__error">{errors[name]}</p>}
    </>
  );
}

function TextField({
  id,
  label,
  value,
  required = true,
  multiline = true,
  invalid,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  required?: boolean;
  multiline?: boolean;
  invalid: boolean;
  onChange: (value: string) => void;
}) {
  const errorId = `${id}-error`;
  const description = required ? errors[id] : "Можно оставить пустым, если пока нет ответа.";
  return (
    <div className="v3-quiz__field">
      <label htmlFor={id}>{label}{required ? <span aria-hidden="true"> *</span> : <span> · необязательно</span>}</label>
      {multiline ? (
        <textarea
          id={id}
          name={id}
          rows={3}
          value={value}
          required={required}
          aria-invalid={invalid}
          aria-describedby={invalid ? errorId : `${id}-hint`}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          id={id}
          name={id}
          type="text"
          value={value}
          required={required}
          aria-invalid={invalid}
          aria-describedby={invalid ? errorId : `${id}-hint`}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
      <p id={`${id}-hint`}>{description}</p>
      {invalid && <p id={errorId} className="v3-quiz__error">{errors[id]}</p>}
    </div>
  );
}

function ContactDialog({
  open,
  isMobile,
  onClose,
}: {
  open: boolean;
  isMobile: boolean;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [qrError, setQrError] = useState(false);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_DIALOG_SELECTOR);
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose, open]);

  useEffect(() => {
    if (!open || isMobile) return;

    let active = true;
    setQrDataUrl(null);
    setQrError(false);
    void QRCode.toDataURL(getMessengersUrl(window.location.origin), {
      errorCorrectionLevel: "M",
      margin: 1,
      width: 320,
      color: { dark: "#0c0e0f", light: "#f0f3ee" },
    })
      .then((dataUrl) => {
        if (active) setQrDataUrl(dataUrl);
      })
      .catch(() => {
        if (active) setQrError(true);
      });

    return () => {
      active = false;
    };
  }, [isMobile, open]);

  if (!open) return null;

  return (
    <div
      className="v3-contact-dialog"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div id="v3-contact-dialog" ref={dialogRef} className="v3-contact-dialog__panel" role="dialog" aria-modal="true" aria-labelledby="v3-contact-dialog-title" aria-describedby="v3-contact-dialog-description">
        <div className="v3-contact-dialog__header">
          <p className="v3-kicker">Прямой контакт</p>
          <button ref={closeButtonRef} className="v3-contact-dialog__close" type="button" onClick={onClose} aria-label="Закрыть окно">
            <X aria-hidden="true" weight="bold" />
          </button>
        </div>
        <div className="v3-contact-dialog__content">
          {!isMobile && (
            <div className="v3-contact-dialog__qr">
              {qrDataUrl ? <img src={qrDataUrl} alt="QR-код для открытия страницы выбора мессенджера" /> : <span aria-live="polite">{qrError ? "QR-код временно недоступен." : "Готовим QR-код…"}</span>}
              <a href={MESSENGERS_PATH}>Открыть страницу мессенджеров</a>
            </div>
          )}

          <div className="v3-contact-dialog__copy">
            <h2 id="v3-contact-dialog-title">Выберите мессенджер</h2>
            <p id="v3-contact-dialog-description" className="v3-contact-dialog__description">
              {isMobile ? "Откройте удобный канал, чтобы сразу обсудить задачу." : "Наведите камеру телефона на QR-код, чтобы открыть страницу выбора мессенджера."}
            </p>

            {isMobile && (
              <div className="v3-contact-dialog__actions">
                <a className="v3-button v3-button--primary v3-button--icon" href={TELEGRAM_HREF} target="_blank" rel="noreferrer">
                  <PaperPlaneTilt aria-hidden="true" weight="duotone" />
                  Телеграм
                </a>
                <a className="v3-button v3-button--quiet v3-button--icon" href={MAX_HREF} target="_blank" rel="noreferrer">
                  <img src="/assets/max-logo-colored.svg" alt="" width="80" height="32" />
                  MAX
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export type ProjectCalculatorProps = {
  initialAnswers?: Partial<CalculatorAnswers>;
  initialStep?: 0 | 1;
  initialInvalidField?: string | null;
  initialSummary?: CalculatorSummary | null;
  initialContactOpen?: boolean;
};

export default function ProjectCalculator({
  initialAnswers,
  initialStep = 0,
  initialInvalidField = null,
  initialSummary = null,
  initialContactOpen = false,
}: ProjectCalculatorProps = {}) {
  const [answers, setAnswers] = useState<CalculatorAnswers>(() => ({ ...createInitialCalculatorAnswers(), ...initialAnswers } as CalculatorAnswers));
  const [step, setStep] = useState(initialStep);
  const [invalidField, setInvalidField] = useState<string | null>(initialInvalidField);
  const [summary, setSummary] = useState<CalculatorSummary | null>(initialSummary);
  const [contactDialogOpen, setContactDialogOpen] = useState(initialContactOpen);
  const [isMobile, setIsMobile] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const contactTriggerRef = useRef<HTMLButtonElement>(null);
  const analyticsStartedRef = useRef(false);

  useEffect(() => {
    headingRef.current?.focus();
  }, [step, summary]);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);
    const syncMobileMode = () => setIsMobile(mediaQuery.matches);
    syncMobileMode();
    mediaQuery.addEventListener("change", syncMobileMode);
    return () => mediaQuery.removeEventListener("change", syncMobileMode);
  }, []);

  const markStarted = () => {
    if (analyticsStartedRef.current) return;
    analyticsStartedRef.current = true;
    sendAnalytics("site_cost_started", { taskType: getTaskType(answers.taskType) || "unknown", branch: "task-selection" });
  };

  const updateAnswer = (key: string, value: string) => {
    markStarted();
    setAnswers((current) => ({ ...current, [key]: value }));
    if (invalidField === key) setInvalidField(null);
  };

  const changeTaskType = (value: string) => {
    const taskType = getTaskType(value);
    if (!taskType) return;
    markStarted();
    setAnswers((current) => resetAnswersForTaskType(current, taskType));
    setSummary(null);
    setInvalidField(null);
  };

  const focusInvalid = (field: string) => {
    window.requestAnimationFrame(() => {
      const control = formRef.current?.elements.namedItem(field);
      if (control instanceof HTMLElement) control.focus();
      else if (control instanceof RadioNodeList) {
        const first = Array.from(control).find((item) => item instanceof HTMLElement);
        if (first instanceof HTMLElement) first.focus();
      }
    });
  };

  const moveForward = () => {
    const validation = validateCalculatorStep(step, answers);
    if (!validation.valid) {
      setInvalidField(validation.firstInvalid);
      focusInvalid(validation.firstInvalid);
      return;
    }

    if (step === 1) {
      const nextSummary = buildCalculatorSummary(answers, offerCatalog);
      setSummary(nextSummary);
      sendAnalytics("site_cost_result_viewed", {
        taskType: nextSummary.taskType,
        selectedOfferId: nextSummary.selectedOfferId ?? undefined,
        estimateKind: nextSummary.estimate.kind,
        branch: nextSummary.taskType,
      });
      return;
    }

    setInvalidField(null);
    setStep(1);
  };

  const moveBack = () => {
    setInvalidField(null);
    if (summary) {
      setSummary(null);
      setStep(1);
    } else {
      setStep(Math.max(0, step - 1) as 0 | 1);
    }
  };

  const reset = () => {
    setAnswers(createInitialCalculatorAnswers());
    setSummary(null);
    setInvalidField(null);
    setStep(0);
    analyticsStartedRef.current = false;
    clearPendingCalculatorSummary();
  };

  const discuss = () => {
    if (!summary) return;
    publishCalculatorSummary(summary);
    sendAnalytics("site_cost_to_brief", {
      taskType: summary.taskType,
      selectedOfferId: summary.selectedOfferId ?? undefined,
      estimateKind: summary.estimate.kind,
      branch: summary.taskType,
    });
    const contact = document.getElementById("project-brief");
    if (contact) {
      window.history.replaceState(null, "", "#project-brief");
      contact.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const closeContactDialog = useCallback(() => {
    setContactDialogOpen(false);
    window.requestAnimationFrame(() => contactTriggerRef.current?.focus());
  }, []);

  const taskType = getTaskType(answers.taskType);
  const fieldInvalid = (name: string) => invalidField === name;
  const selectedOffer = summary ? getOffer(summary.selectedOfferId) : null;

  return (
    <div className="v3-calculator">
      <aside className="v3-quiz__summary v3-calculator__aside" aria-labelledby="v3-calculator-summary-title">
        <p className="v3-kicker">До первого сообщения</p>
        <h3 id="v3-calculator-summary-title">Сначала разберём задачу</h3>
        <p>Калькулятор показывает стартовый ориентир только там, где состав можно объяснить. Для сложных проектов он соберёт неизвестные и предложит следующий шаг.</p>
        <p className="v3-calculator__or">или</p>
        <button ref={contactTriggerRef} className="v3-calculator__contact" type="button" aria-haspopup="dialog" aria-controls="v3-contact-dialog" onClick={() => setContactDialogOpen(true)}>Сразу обсудить задачу <span aria-hidden="true">↗</span></button>
      </aside>

      <form ref={formRef} className="v3-quiz__form v3-calculator__form" noValidate onSubmit={(event) => { event.preventDefault(); moveForward(); }}>
        <div className="v3-quiz__progress">
          <p aria-live="polite">{summary ? "Результат" : `Шаг ${step + 1} из 2`}</p>
          <span>Без отправки данных на сервер</span>
        </div>

        {!summary && step === 0 && (
          <>
            <h3 ref={headingRef} tabIndex={-1} className="v3-quiz__step-title">Что нужно сделать?</h3>
            <fieldset className="v3-quiz__fieldset">
              <legend className="v3-calculator__legend">Выберите маршрут</legend>
              <ChoiceGroup name="taskType" value={answers.taskType} options={taskOptions} invalid={fieldInvalid("taskType")} onChange={changeTaskType} />
            </fieldset>
          </>
        )}

        {!summary && step === 1 && taskType === "site" && (
          <div className="v3-calculator__branch">
            <h3 ref={headingRef} tabIndex={-1} className="v3-quiz__step-title">Параметры сайта</h3>
            <fieldset className="v3-quiz__fieldset"><legend>Формат</legend><ChoiceGroup name="siteFormat" value={answers.siteFormat} options={[
              { value: "landing-ad", label: "Рекламная посадочная" },
              { value: "landing-direct", label: "Посадочная + Директ" },
              { value: "custom-landing", label: "Индивидуальный лендинг" },
              { value: "animated-landing-direct", label: "Лендинг с анимацией + Директ" },
              { value: "corporate-site", label: "Корпоративный сайт" },
            ]} invalid={fieldInvalid("siteFormat")} onChange={(value) => updateAnswer("siteFormat", value)} /></fieldset>
            <fieldset className="v3-quiz__fieldset"><legend>Объём</legend><ChoiceGroup name="sitePages" value={answers.sitePages} options={[
              { value: "single", label: "Одна страница" },
              { value: "small", label: "Небольшой сайт" },
              { value: "multi", label: "Многостраничный сайт" },
              { value: "unknown", label: "Пока не знаю" },
            ]} invalid={fieldInvalid("sitePages")} onChange={(value) => updateAnswer("sitePages", value)} /></fieldset>
            <fieldset className="v3-quiz__fieldset"><legend>Дизайн</legend><ChoiceGroup name="siteDesign" value={answers.siteDesign} options={[
              { value: "existing", label: "Есть исходная система" },
              { value: "individual", label: "Нужен индивидуальный дизайн" },
              { value: "unsure", label: "Нужна рекомендация" },
            ]} invalid={fieldInvalid("siteDesign")} onChange={(value) => updateAnswer("siteDesign", value)} /></fieldset>
            <fieldset className="v3-quiz__fieldset"><legend>Редактор контента</legend><ChoiceGroup name="siteEditor" value={answers.siteEditor} options={[
              { value: "none", label: "Не нужен на первом этапе" },
              { value: "need", label: "Нужен редактор" },
              { value: "unsure", label: "Пока не знаю" },
            ]} invalid={fieldInvalid("siteEditor")} onChange={(value) => updateAnswer("siteEditor", value)} /></fieldset>
            <fieldset className="v3-quiz__fieldset"><legend>Интеграции</legend><ChoiceGroup name="siteIntegrations" value={answers.siteIntegrations} options={[
              { value: "none", label: "Не нужны" },
              { value: "simple", label: "Есть простые интеграции" },
              { value: "complex", label: "Есть сложные интеграции" },
            ]} invalid={fieldInvalid("siteIntegrations")} onChange={(value) => updateAnswer("siteIntegrations", value)} /></fieldset>
            <fieldset className="v3-quiz__fieldset"><legend>Материалы</legend><ChoiceGroup name="siteMaterials" value={answers.siteMaterials} options={[
              { value: "ready", label: "Готовы" },
              { value: "partial", label: "Часть готова" },
              { value: "idea", label: "Пока только идея" },
            ]} invalid={fieldInvalid("siteMaterials")} onChange={(value) => updateAnswer("siteMaterials", value)} /></fieldset>
          </div>
        )}

        {!summary && step === 1 && taskType === "tool" && (
          <div className="v3-calculator__branch"><h3 ref={headingRef} tabIndex={-1} className="v3-quiz__step-title">Параметры инструмента</h3>
            <TextField id="toolGoal" label="Что должен рассчитывать, подбирать или конфигурировать инструмент?" value={answers.toolGoal as string} invalid={fieldInvalid("toolGoal")} onChange={(value) => updateAnswer("toolGoal", value)} />
            <TextField id="toolInputs" label="Какие входные данные нужны?" value={answers.toolInputs as string} invalid={fieldInvalid("toolInputs")} onChange={(value) => updateAnswer("toolInputs", value)} />
            <fieldset className="v3-quiz__fieldset"><legend>Источник данных</legend><ChoiceGroup name="toolDataSource" value={answers.toolDataSource as string} options={[
              { value: "ready", label: "Источник готов" },
              { value: "external", label: "Внешний источник или API" },
              { value: "unknown", label: "Пока не определён" },
            ]} invalid={fieldInvalid("toolDataSource")} onChange={(value) => updateAnswer("toolDataSource", value)} /></fieldset>
            <fieldset className="v3-quiz__fieldset"><legend>Сценарии</legend><ChoiceGroup name="toolScenarios" value={answers.toolScenarios as string} options={[
              { value: "standard", label: "Основной сценарий понятен" },
              { value: "exceptions", label: "Есть исключения и особые сценарии" },
            ]} invalid={fieldInvalid("toolScenarios")} onChange={(value) => updateAnswer("toolScenarios", value)} /></fieldset>
            <fieldset className="v3-quiz__fieldset"><legend>Сложность</legend><ChoiceGroup name="toolComplexity" value={answers.toolComplexity as string} options={[
              { value: "simple", label: "Понятный расчёт или подбор" },
              { value: "complex", label: "Многошаговая логика и состояния" },
            ]} invalid={fieldInvalid("toolComplexity")} onChange={(value) => updateAnswer("toolComplexity", value)} /></fieldset>
          </div>
        )}

        {!summary && step === 1 && taskType === "web-app" && (
          <div className="v3-calculator__branch"><h3 ref={headingRef} tabIndex={-1} className="v3-quiz__step-title">Контекст сервиса</h3>
            <TextField id="webUsers" label="Кто будет пользоваться сервисом?" value={answers.webUsers as string} invalid={fieldInvalid("webUsers")} onChange={(value) => updateAnswer("webUsers", value)} />
            <fieldset className="v3-quiz__fieldset"><legend>Роли и авторизация</legend><ChoiceGroup name="webRoles" value={answers.webRoles as string} options={[{ value: "roles", label: "Нужны роли и авторизация" }, { value: "noRoles", label: "Отдельные роли не нужны" }]} invalid={fieldInvalid("webRoles")} onChange={(value) => updateAnswer("webRoles", value)} /></fieldset>
            <TextField id="webData" label="С какими данными будут работать?" value={answers.webData as string} invalid={fieldInvalid("webData")} onChange={(value) => updateAnswer("webData", value)} />
            <fieldset className="v3-quiz__fieldset"><legend>API и backend</legend><ChoiceGroup name="webApi" value={answers.webApi as string} options={[{ value: "readyApi", label: "API или backend уже есть" }, { value: "plannedApi", label: "Контур нужно определить" }]} invalid={fieldInvalid("webApi")} onChange={(value) => updateAnswer("webApi", value)} /></fieldset>
          </div>
        )}

        {!summary && step === 1 && taskType === "support" && (
          <div className="v3-calculator__branch"><h3 ref={headingRef} tabIndex={-1} className="v3-quiz__step-title">Состояние продукта</h3>
            <fieldset className="v3-quiz__fieldset"><legend>Что уже работает?</legend><ChoiceGroup name="supportState" value={answers.supportState as string} options={[{ value: "working", label: "Сайт или сервис работает" }, { value: "partlyWorking", label: "Работает частично" }, { value: "broken", label: "Есть конкретная проблема" }]} invalid={fieldInvalid("supportState")} onChange={(value) => updateAnswer("supportState", value)} /></fieldset>
            <TextField id="supportProblem" label="Что нужно исправить или изменить?" value={answers.supportProblem as string} invalid={fieldInvalid("supportProblem")} onChange={(value) => updateAnswer("supportProblem", value)} />
            <fieldset className="v3-quiz__fieldset"><legend>Доступы</legend><ChoiceGroup name="supportAccess" value={answers.supportAccess as string} options={[{ value: "full", label: "Код и окружение доступны" }, { value: "partialAccess", label: "Доступы частичные" }, { value: "noAccess", label: "Доступов пока нет" }]} invalid={fieldInvalid("supportAccess")} onChange={(value) => updateAnswer("supportAccess", value)} /></fieldset>
            <fieldset className="v3-quiz__fieldset"><legend>Формат работы</legend><ChoiceGroup name="supportMode" value={answers.supportMode as string} options={[{ value: "oneOff", label: "Разовая задача" }, { value: "recurring", label: "Регулярная поддержка" }]} invalid={fieldInvalid("supportMode")} onChange={(value) => updateAnswer("supportMode", value)} /></fieldset>
          </div>
        )}

        {!summary && step === 1 && taskType === "unsure" && (
          <div className="v3-calculator__branch"><h3 ref={headingRef} tabIndex={-1} className="v3-quiz__step-title">С чего начать?</h3>
            <TextField id="unsureGoal" label="Какую цель нужно решить?" value={answers.unsureGoal as string} invalid={fieldInvalid("unsureGoal")} onChange={(value) => updateAnswer("unsureGoal", value)} />
            <TextField id="unsureSituation" label="Что происходит сейчас?" value={answers.unsureSituation as string} required={false} invalid={fieldInvalid("unsureSituation")} onChange={(value) => updateAnswer("unsureSituation", value)} />
            <TextField id="unsureMaterials" label="Что уже есть?" value={answers.unsureMaterials as string} required={false} invalid={fieldInvalid("unsureMaterials")} onChange={(value) => updateAnswer("unsureMaterials", value)} />
          </div>
        )}

        {summary && (
          <div className="v3-calculator__result" aria-live="polite">
            <p className="v3-kicker">Предварительный ориентир</p>
            <h3 ref={headingRef} tabIndex={-1} className="v3-quiz__step-title">{taskLabels[summary.taskType]}</h3>
            {selectedOffer ? <><strong className="v3-calculator__price">{selectedOffer.priceLabel}</strong><p className="v3-calculator__result-note">Стартовый ориентир по выбранному формату. Это не финальная смета.</p></> : <p className="v3-calculator__discovery">Нужно провести небольшое исследование, чтобы определить состав работ и границы ответственности.</p>}
            {selectedOffer && <><p className="v3-calculator__result-label">В выбранный формат входит</p><ul>{selectedOffer.includes.map((item) => <li key={item}>{item}</li>)}</ul></>}
            <div className="v3-calculator__result-grid">
              <div><p className="v3-calculator__result-label">Допущения</p><ul>{summary.assumptions.map((item) => <li key={item}>{item}</li>)}</ul></div>
              <div><p className="v3-calculator__result-label">Нужно уточнить</p><ul>{summary.unknowns.map((item) => <li key={item}>{item}</li>)}</ul></div>
            </div>
            <dl className="v3-calculator__answers">{answerRows(summary).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
          </div>
        )}

        <p className="v3-quiz__status" role="status" aria-live="polite">{invalidField ? errors[invalidField] : ""}</p>
        <div className="v3-quiz__controls">
          {summary ? <>
            <button className="v3-button v3-button--quiet" type="button" onClick={moveBack}>Изменить ответы</button>
            <button className="v3-button v3-button--primary" type="button" onClick={discuss}>Обсудить результат</button>
          </> : <>
            <button className="v3-button v3-button--quiet" type="button" onClick={() => setStep(Math.max(0, step - 1) as 0 | 1)} disabled={step === 0}>Назад</button>
            <button className="v3-button v3-button--primary" type="submit">{step === 0 ? "Продолжить" : "Показать ориентир"}</button>
          </>}
        </div>
        {summary && <button className="v3-calculator__reset" type="button" onClick={reset}>Начать заново</button>}
      </form>

      <ContactDialog open={contactDialogOpen} isMobile={isMobile} onClose={closeContactDialog} />
    </div>
  );
}
