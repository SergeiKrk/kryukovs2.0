import { ArrowDown, ArrowRight, CaretLeft, Info, X } from "@phosphor-icons/react";
import { gsap } from "gsap";
import QRCode from "qrcode";
import { useCallback, useEffect, useRef, useState } from "react";
import { offerCatalog } from "../../data/v3";
import {
  buildCalculatorSummary,
  clampNumber,
  createInitialCalculatorAnswers,
  getSiteFormat,
  getSiteStepIds,
  resetAnswersForSiteFormat,
  resetAnswersForTaskType,
  SITE_DESIGNS,
  SITE_FORMATS,
  SITE_INTEGRATIONS,
  sliderPositionToValue,
  sliderValueToPosition,
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
  sitePageCount: "Страницы",
  siteArticleCount: "Статьи",
  promotionDirect: "Директ",
  promotionSemantic: "Архитектура",
  promotionSeo: "SEO-продвижение",
  siteDesign: "Дизайн",
  siteIntegrations: "Интеграции",
  toolDataSource: "Источник данных",
  toolScenarios: "Сценарии",
  toolComplexity: "Сложность",
  webRoles: "Роли",
  webApi: "API и backend",
  supportState: "Состояние",
  supportAccess: "Доступы",
  supportMode: "Формат работы",
};

const choiceLabelsByKey: Record<string, Record<string, string>> = {
  toolDataSource: { ready: "Источник готов", external: "Внешний источник или API", unknown: "Пока не определён" },
  toolScenarios: { standard: "Основной сценарий понятен", exceptions: "Есть исключения и особые сценарии" },
  toolComplexity: { simple: "Понятный расчёт или подбор", complex: "Многошаговая логика и состояния" },
  webRoles: { roles: "Нужны роли и авторизация", noRoles: "Отдельные роли не нужны" },
  webApi: { readyApi: "API или backend уже есть", plannedApi: "Контур нужно определить" },
  supportState: { working: "Сайт или сервис работает", partlyWorking: "Работает частично", broken: "Есть конкретная проблема" },
  supportAccess: { full: "Код и окружение доступны", partialAccess: "Доступы частичные", noAccess: "Доступов пока нет" },
  supportMode: { oneOff: "Разовая задача", recurring: "Регулярная поддержка" },
};

const errors: Record<string, string> = {
  taskType: "Выберите подходящий маршрут.",
  siteFormat: "Выберите формат сайта.",
  sitePageCount: "Укажите объём сайта.",
  siteArticleCount: "Укажите количество статей.",
  siteDesign: "Выберите вариант дизайна.",
  toolGoal: "Опишите, что должен рассчитывать или подбирать инструмент.",
  supportProblem: "Опишите проблему или нужное изменение.",
  unsureGoal: "Опишите цель проекта.",
};

function formatMoney(value: number) {
  return `${Math.round(value).toLocaleString("ru-RU")} ₽`;
}

function sendAnalytics(name: string, detail: Record<string, unknown> = {}) {
  const safeDetail = Object.fromEntries(Object.entries(detail).filter(([key, value]) => ["taskType", "selectedOfferId", "estimateKind", "branch"].includes(key) && (typeof value === "string" || typeof value === "number")));
  window.dispatchEvent(new CustomEvent(name, { detail: safeDetail }));
  if (typeof window.ym === "function") window.ym(METRIKA_ID, "reachGoal", name, safeDetail);
}

function getTaskType(value: unknown): TaskType | "" {
  return taskOptions.some((option) => option.value === value) ? (value as TaskType) : "";
}

function answerRows(summary: CalculatorSummary) {
  return Object.entries(summary.answers)
    .filter(([key, value]) => key !== "taskType" && value !== "" && value !== false && value !== 0 && !(Array.isArray(value) && value.length === 0))
    .map(([key, value]) => {
      const label = answerLabels[key] ?? key;
      if (key === "siteFormat") return [label, getSiteFormat(String(value))?.title ?? String(value)] as const;
      if (key === "siteDesign") return [label, SITE_DESIGNS.find((design) => design.id === value)?.title ?? String(value)] as const;
      if (key === "siteIntegrations" && Array.isArray(value)) return [label, value.map((id) => SITE_INTEGRATIONS.find((item) => item.id === id)?.title ?? id).join(", ")] as const;
      if (key === "sitePageCount") return [label, `${value} ${value === 1 ? "страница" : "страниц"}`] as const;
      if (key === "siteArticleCount") return [label, `${value} ${value === 1 ? "статья" : "статей"}`] as const;
      if (key === "promotionDirectCount") return [label, `${value} ${value === 1 ? "услуга или товар" : "услуг или товаров"}`] as const;
      if (key === "promotionSeoBudget") return [label, `${formatMoney(Number(value))} / мес.`] as const;
      if (typeof value === "boolean") return [label, value ? "Да" : "Нет"] as const;
      if (typeof value === "number") return [label, formatMoney(value)] as const;
      return [label, choiceLabelsByKey[key]?.[String(value)] ?? String(value)] as const;
    });
}

function ChoiceGroup({ name, value, options, invalid, onChange }: { name: string; value: string; options: Choice[]; invalid: boolean; onChange: (value: string) => void }) {
  const errorId = `${name}-error`;
  return (
    <>
      <div className="v3-quiz__options">
        {options.map((option) => (
          <label key={option.value} className="v3-quiz__option">
            <input type="radio" name={name} value={option.value} checked={value === option.value} aria-invalid={invalid} aria-describedby={invalid ? errorId : undefined} onChange={() => onChange(option.value)} />
            <span><strong>{option.label}</strong>{option.hint && <small>{option.hint}</small>}</span>
          </label>
        ))}
      </div>
      {invalid && <p id={errorId} className="v3-quiz__error">{errors[name] ?? "Проверьте выбор."}</p>}
    </>
  );
}

function TextField({ id, label, value, required = true, multiline = true, invalid, onChange }: { id: string; label: string; value: unknown; required?: boolean; multiline?: boolean; invalid: boolean; onChange: (value: string) => void }) {
  const errorId = `${id}-error`;
  const stringValue = typeof value === "string" ? value : "";
  return (
    <div className="v3-quiz__field">
      <label htmlFor={id}>{label}{required ? <span aria-hidden="true"> *</span> : <span> · необязательно</span>}</label>
      {multiline ? <textarea id={id} name={id} rows={3} value={stringValue} required={required} aria-invalid={invalid} aria-describedby={invalid ? errorId : undefined} onChange={(event) => onChange(event.target.value)} /> : <input id={id} name={id} type="text" value={stringValue} required={required} aria-invalid={invalid} aria-describedby={invalid ? errorId : undefined} onChange={(event) => onChange(event.target.value)} />}
      {invalid && <p id={errorId} className="v3-quiz__error">{errors[id] ?? "Проверьте поле."}</p>}
    </div>
  );
}

function Tooltip({ id, text }: { id: string; text: string }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<number | null>(null);
  const clearCloseTimer = () => {
    if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
  };
  const closeSoon = () => {
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => setOpen(false), 120);
  };

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (open && rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      clearCloseTimer();
    };
  }, [open]);

  return (
    <div ref={rootRef} className="v3-calculator__tooltip-wrap" onMouseEnter={() => { clearCloseTimer(); setOpen(true); }} onMouseLeave={closeSoon}>
      <button type="button" className="v3-calculator__tooltip-trigger" aria-label="Подробнее о формате" aria-expanded={open} aria-controls={id} onFocus={() => { clearCloseTimer(); setOpen(true); }} onBlur={(event) => { if (!rootRef.current?.contains(event.relatedTarget as Node)) closeSoon(); }} onPointerDown={(event) => { if (event.pointerType === "touch") { event.preventDefault(); clearCloseTimer(); setOpen((current) => !current); } }}><Info aria-hidden="true" weight="bold" /></button>
      {open && <div id={id} className="v3-calculator__tooltip" role="tooltip">{text}</div>}
    </div>
  );
}

function FormatOption({ format, selected, onChange }: { format: (typeof SITE_FORMATS)[number]; selected: boolean; onChange: (id: string) => void }) {
  return (
    <div className={`v3-calculator__format-option${selected ? " is-selected" : ""}`}>
      <label htmlFor={`site-format-${format.id}`} className="v3-quiz__option">
        <input id={`site-format-${format.id}`} type="radio" name="siteFormat" value={format.id} checked={selected} onChange={() => onChange(format.id)} />
        <span><strong>{format.title}</strong><small>{format.shortDescription}</small></span>
      </label>
      <Tooltip id={`site-format-${format.id}-tip`} text={format.tooltip} />
    </div>
  );
}

function LogRange({ id, label, min, max, value, onChange, formatValue = (number: number) => String(number), scale = "progressive" }: { id: string; label: string; min: number; max: number; value: number; onChange: (value: number) => void; formatValue?: (value: number) => string; scale?: "progressive" | "linear" }) {
  const normalizedValue = (clampNumber(value, min, max) - min) / Math.max(1, max - min);
  const sliderPosition = Math.round((scale === "linear" ? normalizedValue : sliderValueToPosition(value, min, max)) * 1000);
  return (
    <div className="v3-calculator__range-field">
      <div className="v3-calculator__range-heading"><label htmlFor={id}>{label}</label><strong>{formatValue(value)}</strong></div>
      <input id={id} className="v3-calculator__range" type="range" min="0" max="1000" step="1" value={sliderPosition} aria-valuemin={min} aria-valuemax={max} aria-valuenow={value} aria-valuetext={formatValue(value)} onChange={(event) => { const position = Number(event.target.value) / 1000; onChange(scale === "linear" ? clampNumber(min + (max - min) * position, min, max) : sliderPositionToValue(position, min, max)); }} />
      <div className="v3-calculator__range-limits" aria-hidden="true"><span>{formatValue(min)}</span><span>{formatValue(max)}</span></div>
    </div>
  );
}

function ContactDialog({ open, isMobile, onClose }: { open: boolean; isMobile: boolean; onClose: () => void }) {
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
      if (event.key === "Escape") { event.preventDefault(); onClose(); return; }
      if (event.key !== "Tab") return;
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_DIALOG_SELECTOR);
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => { window.cancelAnimationFrame(focusFrame); window.removeEventListener("keydown", onKeyDown); document.body.style.overflow = previousOverflow; };
  }, [onClose, open]);

  useEffect(() => {
    if (!open || isMobile) return;
    let active = true;
    setQrDataUrl(null);
    setQrError(false);
    void QRCode.toDataURL(getMessengersUrl(window.location.origin), { errorCorrectionLevel: "M", margin: 1, width: 320, color: { dark: "#0c0e0f", light: "#f0f3ee" } })
      .then((dataUrl) => { if (active) setQrDataUrl(dataUrl); })
      .catch(() => { if (active) setQrError(true); });
    return () => { active = false; };
  }, [isMobile, open]);

  if (!open) return null;
  return (
    <div className="v3-contact-dialog" role="presentation" onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div id="v3-contact-dialog" ref={dialogRef} className="v3-contact-dialog__panel" role="dialog" aria-modal="true" aria-labelledby="v3-contact-dialog-title" aria-describedby="v3-contact-dialog-description">
        <div className="v3-contact-dialog__header"><p className="v3-kicker">Прямой контакт</p><button ref={closeButtonRef} className="v3-contact-dialog__close" type="button" onClick={onClose} aria-label="Закрыть окно"><X aria-hidden="true" weight="bold" /></button></div>
        <div className="v3-contact-dialog__content">
          {!isMobile && <div className="v3-contact-dialog__qr">{qrDataUrl ? <img src={qrDataUrl} alt="QR-код для открытия страницы выбора мессенджера" /> : <span aria-live="polite">{qrError ? "QR-код временно недоступен." : "Готовим QR-код…"}</span>}<a href={MESSENGERS_PATH}>Открыть страницу мессенджеров</a></div>}
          <div className="v3-contact-dialog__copy"><h2 id="v3-contact-dialog-title">Выберите мессенджер</h2><p id="v3-contact-dialog-description" className="v3-contact-dialog__description">{isMobile ? "Откройте удобный канал, чтобы сразу обсудить задачу." : "Наведите камеру телефона на QR-код, чтобы открыть страницу выбора мессенджера."}</p>{isMobile && <div className="v3-contact-dialog__actions"><a className="v3-button v3-button--primary v3-button--icon" href={TELEGRAM_HREF} target="_blank" rel="noreferrer"><img src="/assets/telegram-new.svg" alt="" width="32" height="32" />Телеграм</a><a className="v3-button v3-button--quiet v3-button--icon" href={MAX_HREF} target="_blank" rel="noreferrer"><img src="/assets/max-logo-colored.svg" alt="" width="80" height="32" />MAX</a></div>}</div>
        </div>
      </div>
    </div>
  );
}

export type ProjectCalculatorProps = {
  initialAnswers?: Partial<CalculatorAnswers>;
  initialStep?: number;
  initialInvalidField?: string | null;
  initialSummary?: CalculatorSummary | null;
  initialContactOpen?: boolean;
};

export default function ProjectCalculator({ initialAnswers, initialStep = 0, initialInvalidField = null, initialSummary = null, initialContactOpen = false }: ProjectCalculatorProps = {}) {
  const [answers, setAnswers] = useState<CalculatorAnswers>(() => ({ ...createInitialCalculatorAnswers(), ...initialAnswers } as CalculatorAnswers));
  const [step, setStep] = useState(initialStep);
  const [invalidField, setInvalidField] = useState<string | null>(initialInvalidField);
  const [summary, setSummary] = useState<CalculatorSummary | null>(initialSummary);
  const [contactDialogOpen, setContactDialogOpen] = useState(initialContactOpen);
  const [isMobile, setIsMobile] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isAtCalculatorBottom, setIsAtCalculatorBottom] = useState(false);
  const [scrollHint, setScrollHint] = useState<{ step: number; revision: number } | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const scrollHintRef = useRef<HTMLSpanElement>(null);
  const scrollHintRevisionRef = useRef(0);
  const focusHeadingAfterTransitionRef = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const contactTriggerRef = useRef<HTMLButtonElement>(null);
  const analyticsStartedRef = useRef(false);

  const stepIds = getSiteStepIds(answers);
  const currentStep = Math.min(Math.max(0, step), stepIds.length - 1);
  const stepId = stepIds[currentStep];
  const taskType = getTaskType(answers.taskType);

  useEffect(() => { if (step !== currentStep) setStep(currentStep); }, [currentStep, step]);
  useEffect(() => {
    if (!focusHeadingAfterTransitionRef.current) return;
    focusHeadingAfterTransitionRef.current = false;
    headingRef.current?.focus();
  }, [currentStep, summary]);
  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);
    const syncMobileMode = () => setIsMobile(mediaQuery.matches);
    syncMobileMode();
    mediaQuery.addEventListener("change", syncMobileMode);
    return () => mediaQuery.removeEventListener("change", syncMobileMode);
  }, []);
  useEffect(() => {
    const onOpen = () => setIsCalculatorOpen(true);
    const onClose = () => { setIsCalculatorOpen(false); setScrollHint(null); };
    window.addEventListener("v3:modal-open", onOpen);
    window.addEventListener("v3:modal-close", onClose);
    if (document.querySelector<HTMLDialogElement>("#calculator")?.open) onOpen();
    return () => {
      window.removeEventListener("v3:modal-open", onOpen);
      window.removeEventListener("v3:modal-close", onClose);
    };
  }, []);
  useEffect(() => {
    const dialog = document.querySelector<HTMLDialogElement>("#calculator");
    if (!dialog || !isCalculatorOpen || !isMobile) {
      setIsAtCalculatorBottom(false);
      return;
    }

    const updateScrollBoundary = () => {
      const atBottom = dialog.scrollTop + dialog.clientHeight >= dialog.scrollHeight - 2;
      setIsAtCalculatorBottom((current) => current === atBottom ? current : atBottom);
    };
    updateScrollBoundary();
    const frame = window.requestAnimationFrame(updateScrollBoundary);
    dialog.addEventListener("scroll", updateScrollBoundary, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      dialog.removeEventListener("scroll", updateScrollBoundary);
    };
  }, [currentStep, isCalculatorOpen, isMobile, summary]);
  useEffect(() => {
    const hint = scrollHintRef.current;
    if (!hint || !isCalculatorOpen || !isMobile || isAtCalculatorBottom || !scrollHint || scrollHint.step !== currentStep || summary) return;

    const context = gsap.context(() => {
      const motionDisabled = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        || document.documentElement.dataset.motion === "off"
        || document.body.dataset.v3Motion === "off";
      if (motionDisabled) {
        gsap.set(hint, { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.timeline({ repeat: -1, repeatDelay: 1 })
        .set(hint, { autoAlpha: 1, y: 0 })
        .to(hint, { y: 9, duration: 0.22, ease: "power2.out" })
        .to(hint, { y: 0, duration: 0.22, ease: "power2.inOut" })
        .to(hint, { autoAlpha: 0, duration: 0.16, ease: "power1.out" });
    }, hint);

    return () => context.revert();
  }, [currentStep, isAtCalculatorBottom, isCalculatorOpen, isMobile, scrollHint, summary]);

  const showScrollHint = (stepToShow = currentStep) => {
    scrollHintRevisionRef.current += 1;
    setScrollHint({ step: stepToShow, revision: scrollHintRevisionRef.current });
  };

  const markStarted = () => {
    if (analyticsStartedRef.current) return;
    analyticsStartedRef.current = true;
    sendAnalytics("site_cost_started", { taskType: taskType || "unknown", branch: stepId });
  };

  const updateAnswer = (key: string, value: unknown) => {
    markStarted();
    setAnswers((current) => ({ ...current, [key]: value } as CalculatorAnswers));
    if (invalidField === key) setInvalidField(null);
  };

  const changeTaskType = (value: string) => {
    const nextTaskType = getTaskType(value);
    if (!nextTaskType) return;
    markStarted();
    setAnswers(resetAnswersForTaskType(answers, nextTaskType));
    setSummary(null);
    setInvalidField(null);
    focusHeadingAfterTransitionRef.current = true;
    showScrollHint(1);
    setStep(1);
  };

  const changeSiteFormat = (value: string) => {
    markStarted();
    setAnswers(resetAnswersForSiteFormat(answers, value));
    setSummary(null);
    setInvalidField(null);
    showScrollHint();
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
    const validation = validateCalculatorStep(currentStep, answers);
    if (!validation.valid) { setInvalidField(validation.firstInvalid); focusInvalid(validation.firstInvalid); return; }
    setInvalidField(null);
    if (currentStep >= stepIds.length - 1) {
      const nextSummary = buildCalculatorSummary(answers, offerCatalog);
      focusHeadingAfterTransitionRef.current = true;
      setSummary(nextSummary);
      sendAnalytics("site_cost_result_viewed", { taskType: nextSummary.taskType, selectedOfferId: nextSummary.selectedOfferId ?? undefined, estimateKind: nextSummary.estimate.kind, branch: nextSummary.taskType });
      return;
    }
    focusHeadingAfterTransitionRef.current = true;
    setStep(currentStep + 1);
  };

  const moveBack = () => {
    setInvalidField(null);
    if (summary) { focusHeadingAfterTransitionRef.current = true; setSummary(null); setStep(Math.max(0, stepIds.length - 1)); return; }
    focusHeadingAfterTransitionRef.current = true;
    setStep(Math.max(0, currentStep - 1));
  };

  const reset = () => {
    setAnswers(createInitialCalculatorAnswers());
    setSummary(null);
    setInvalidField(null);
    focusHeadingAfterTransitionRef.current = true;
    setStep(0);
    analyticsStartedRef.current = false;
    clearPendingCalculatorSummary();
  };

  const discuss = () => {
    if (!summary) return;
    publishCalculatorSummary(summary);
    sendAnalytics("site_cost_to_brief", { taskType: summary.taskType, selectedOfferId: summary.selectedOfferId ?? undefined, estimateKind: summary.estimate.kind, branch: summary.taskType });
    const contact = document.getElementById("project-brief");
    const calculatorDialog = document.getElementById("calculator");
    if (calculatorDialog instanceof HTMLDialogElement && calculatorDialog.open) calculatorDialog.close("handoff");
    if (contact) {
      window.history.replaceState(null, "", "#project-brief");
      window.requestAnimationFrame(() => contact.scrollIntoView({ behavior: "smooth", block: "start" }));
    }
  };

  const closeContactDialog = useCallback(() => { setContactDialogOpen(false); window.requestAnimationFrame(() => contactTriggerRef.current?.focus()); }, []);
  const selectedFormat = getSiteFormat(answers.siteFormat);
  const fieldInvalid = (name: string) => invalidField === name;

  const renderNonSiteContext = () => {
    if (taskType === "tool") return <div className="v3-calculator__branch"><h3 ref={headingRef} tabIndex={-1} className="v3-quiz__step-title">Параметры инструмента</h3><TextField id="toolGoal" label="Что должен рассчитывать, подбирать или конфигурировать инструмент?" value={answers.toolGoal} invalid={fieldInvalid("toolGoal")} onChange={(value) => updateAnswer("toolGoal", value)} /><TextField id="toolInputs" label="Какие входные данные нужны?" value={answers.toolInputs} required={false} invalid={fieldInvalid("toolInputs")} onChange={(value) => updateAnswer("toolInputs", value)} /><fieldset className="v3-quiz__fieldset"><legend>Источник данных</legend><ChoiceGroup name="toolDataSource" value={String(answers.toolDataSource ?? "")} options={[{ value: "ready", label: "Источник готов" }, { value: "external", label: "Внешний источник или API" }, { value: "unknown", label: "Пока не определён" }]} invalid={fieldInvalid("toolDataSource")} onChange={(value) => updateAnswer("toolDataSource", value)} /></fieldset><fieldset className="v3-quiz__fieldset"><legend>Сценарии</legend><ChoiceGroup name="toolScenarios" value={String(answers.toolScenarios ?? "")} options={[{ value: "standard", label: "Основной сценарий понятен" }, { value: "exceptions", label: "Есть исключения и особые сценарии" }]} invalid={fieldInvalid("toolScenarios")} onChange={(value) => updateAnswer("toolScenarios", value)} /></fieldset><fieldset className="v3-quiz__fieldset"><legend>Сложность</legend><ChoiceGroup name="toolComplexity" value={String(answers.toolComplexity ?? "")} options={[{ value: "simple", label: "Понятный расчёт или подбор" }, { value: "complex", label: "Многошаговая логика и состояния" }]} invalid={fieldInvalid("toolComplexity")} onChange={(value) => updateAnswer("toolComplexity", value)} /></fieldset></div>;
    if (taskType === "web-app") return <div className="v3-calculator__branch"><h3 ref={headingRef} tabIndex={-1} className="v3-quiz__step-title">Контекст сервиса</h3><TextField id="webUsers" label="Кто будет пользоваться сервисом?" value={answers.webUsers} invalid={fieldInvalid("webUsers")} onChange={(value) => updateAnswer("webUsers", value)} /><fieldset className="v3-quiz__fieldset"><legend>Роли и авторизация</legend><ChoiceGroup name="webRoles" value={String(answers.webRoles ?? "")} options={[{ value: "roles", label: "Нужны роли и авторизация" }, { value: "noRoles", label: "Отдельные роли не нужны" }]} invalid={fieldInvalid("webRoles")} onChange={(value) => updateAnswer("webRoles", value)} /></fieldset><TextField id="webData" label="С какими данными будут работать?" value={answers.webData} invalid={fieldInvalid("webData")} onChange={(value) => updateAnswer("webData", value)} /><fieldset className="v3-quiz__fieldset"><legend>API и backend</legend><ChoiceGroup name="webApi" value={String(answers.webApi ?? "")} options={[{ value: "readyApi", label: "API или backend уже есть" }, { value: "plannedApi", label: "Контур нужно определить" }]} invalid={fieldInvalid("webApi")} onChange={(value) => updateAnswer("webApi", value)} /></fieldset></div>;
    if (taskType === "support") return <div className="v3-calculator__branch"><h3 ref={headingRef} tabIndex={-1} className="v3-quiz__step-title">Состояние продукта</h3><fieldset className="v3-quiz__fieldset"><legend>Что уже работает?</legend><ChoiceGroup name="supportState" value={String(answers.supportState ?? "")} options={[{ value: "working", label: "Сайт или сервис работает" }, { value: "partlyWorking", label: "Работает частично" }, { value: "broken", label: "Есть конкретная проблема" }]} invalid={fieldInvalid("supportState")} onChange={(value) => updateAnswer("supportState", value)} /></fieldset><TextField id="supportProblem" label="Что нужно исправить или изменить?" value={answers.supportProblem} invalid={fieldInvalid("supportProblem")} onChange={(value) => updateAnswer("supportProblem", value)} /><fieldset className="v3-quiz__fieldset"><legend>Доступы</legend><ChoiceGroup name="supportAccess" value={String(answers.supportAccess ?? "")} options={[{ value: "full", label: "Код и окружение доступны" }, { value: "partialAccess", label: "Доступы частичные" }, { value: "noAccess", label: "Доступов пока нет" }]} invalid={fieldInvalid("supportAccess")} onChange={(value) => updateAnswer("supportAccess", value)} /></fieldset><fieldset className="v3-quiz__fieldset"><legend>Формат работы</legend><ChoiceGroup name="supportMode" value={String(answers.supportMode ?? "")} options={[{ value: "oneOff", label: "Разовая задача" }, { value: "recurring", label: "Регулярная поддержка" }]} invalid={fieldInvalid("supportMode")} onChange={(value) => updateAnswer("supportMode", value)} /></fieldset></div>;
    return <div className="v3-calculator__branch"><h3 ref={headingRef} tabIndex={-1} className="v3-quiz__step-title">С чего начать?</h3><TextField id="unsureGoal" label="Какую цель нужно решить?" value={answers.unsureGoal} invalid={fieldInvalid("unsureGoal")} onChange={(value) => updateAnswer("unsureGoal", value)} /><TextField id="unsureSituation" label="Что происходит сейчас?" value={answers.unsureSituation} required={false} invalid={fieldInvalid("unsureSituation")} onChange={(value) => updateAnswer("unsureSituation", value)} /><TextField id="unsureMaterials" label="Что уже есть?" value={answers.unsureMaterials} required={false} invalid={fieldInvalid("unsureMaterials")} onChange={(value) => updateAnswer("unsureMaterials", value)} /></div>;
  };

  const renderSiteStep = () => {
    if (stepId === "format") return <><h3 ref={headingRef} tabIndex={-1} className="v3-quiz__step-title">Формат сайта</h3><fieldset className="v3-quiz__fieldset"><legend>Один формат на первый расчёт</legend><div className="v3-calculator__format-list">{SITE_FORMATS.map((format) => <FormatOption key={format.id} format={format} selected={answers.siteFormat === format.id} onChange={changeSiteFormat} />)}</div>{fieldInvalid("siteFormat") && <p className="v3-quiz__error">{errors.siteFormat}</p>}</fieldset></>;
    if (stepId === "pages" && selectedFormat) return <><h3 ref={headingRef} tabIndex={-1} className="v3-quiz__step-title">Объём сайта</h3><div className="v3-calculator__branch"><LogRange id="site-page-count" label="Общее количество страниц" min={selectedFormat.basePages} max={300} value={Number(answers.sitePageCount) || selectedFormat.basePages} onChange={(value) => updateAnswer("sitePageCount", value)} /><p className="v3-calculator__field-note">В базовый объём входят {selectedFormat.basePages} страницы. Дополнительная страница стоит 2 000 ₽.</p>{selectedFormat.hasArticles && <><LogRange id="site-article-count" label="Дополнительные статьи" min={0} max={300} value={Number(answers.siteArticleCount) || 0} onChange={(value) => updateAnswer("siteArticleCount", value)} formatValue={(value) => `${value} ${value === 1 ? "статья" : "статей"}`} /><p className="v3-calculator__field-note">Статья считается отдельным материалом и добавляется по 2 000 ₽.</p></>}{fieldInvalid("sitePageCount") && <p className="v3-quiz__error">{errors.sitePageCount}</p>}</div></>;
    if (stepId === "promotion" && selectedFormat) return <><h3 ref={headingRef} tabIndex={-1} className="v3-quiz__step-title">Реклама и продвижение</h3><div className="v3-calculator__branch"><label className="v3-calculator__check-option"><input type="checkbox" checked={Boolean(answers.promotionDirect)} onChange={(event) => updateAnswer("promotionDirect", event.target.checked)} /><span><strong>Яндекс.Директ</strong><small>Первая рекламируемая услуга или товар: 10 000 ₽. Следующая: 7 500 ₽.</small></span></label>{answers.promotionDirect && selectedFormat.id !== "landing" && <LogRange id="direct-count" label="Рекламируемые услуги или товары" min={1} max={20} value={Number(answers.promotionDirectCount) || 1} onChange={(value) => updateAnswer("promotionDirectCount", value)} formatValue={(value) => `${value} ${value === 1 ? "услуга или товар" : "услуг или товаров"}`} scale="linear" />}{answers.promotionDirect && selectedFormat.id === "landing" && <p className="v3-calculator__field-note">Для лендинга автоматически учитывается одна услуга или один товар: +10 000 ₽. Рекламный бюджет отдельно.</p>} {selectedFormat.volume && <label className="v3-calculator__check-option"><input type="checkbox" checked={Boolean(answers.promotionSemantic)} onChange={(event) => updateAnswer("promotionSemantic", event.target.checked)} /><span><strong>Глубокая смысловая архитектура</strong><small>Исследование конкурентов, семантические коконы и методология GIST. Коэффициент × 1,5.</small></span></label>}<label className="v3-calculator__check-option"><input type="checkbox" checked={Boolean(answers.promotionSeo)} onChange={(event) => updateAnswer("promotionSeo", event.target.checked)} /><span><strong>SEO-продвижение</strong><small>Регулярная работа над видимостью сайта в поиске: технические улучшения, контент и внешние размещения.</small></span></label>{answers.promotionSeo && <LogRange id="seo-budget" label="Ежемесячный бюджет SEO-продвижения" min={14000} max={50000} value={Number(answers.promotionSeoBudget) || 14000} onChange={(value) => updateAnswer("promotionSeoBudget", value)} formatValue={(value) => `${formatMoney(value)} / мес.`} />}</div></>;
    if (stepId === "design") return <><h3 ref={headingRef} tabIndex={-1} className="v3-quiz__step-title">Дизайн</h3><fieldset className="v3-quiz__fieldset"><legend>Один вариант дизайна</legend><ChoiceGroup name="siteDesign" value={String(answers.siteDesign ?? "")} options={SITE_DESIGNS.map((design) => ({ value: design.id, label: design.title, hint: design.hint }))} invalid={fieldInvalid("siteDesign")} onChange={(value) => updateAnswer("siteDesign", value)} /></fieldset></>;
    if (stepId === "integrations") return <><h3 ref={headingRef} tabIndex={-1} className="v3-quiz__step-title">Интеграции</h3><fieldset className="v3-quiz__fieldset"><legend>Можно выбрать несколько</legend><div className="v3-calculator__integration-list">{SITE_INTEGRATIONS.map((integration) => <label key={integration.id} className="v3-calculator__check-option"><input type="checkbox" checked={Array.isArray(answers.siteIntegrations) && answers.siteIntegrations.includes(integration.id)} onChange={(event) => { const current = Array.isArray(answers.siteIntegrations) ? answers.siteIntegrations : []; updateAnswer("siteIntegrations", event.target.checked ? [...current, integration.id] : current.filter((id) => id !== integration.id)); }} /><span><strong>{integration.title}</strong><small>Стоимость оценивается отдельно после уточнения системы, API, данных и сценариев.</small></span></label>)}</div></fieldset></>;
    return null;
  };

  return (
    <div className="v3-calculator" tabIndex={-1}>
      <button className="v3-contact-dialog__close v3-calculator__close" type="button" aria-label="Закрыть калькулятор" onClick={() => document.getElementById("calculator")?.close()}><X aria-hidden="true" weight="bold" /></button>
      <aside className="v3-quiz__summary v3-calculator__aside" aria-labelledby="v3-calculator-summary-title"><p className="v3-kicker">До первого сообщения</p><h3 id="v3-calculator-summary-title">Сначала разберём задачу</h3><p>Выберите формат и добавьте только те услуги, которые меняют состав работы. Для сложных проектов калькулятор предложит следующий шаг.</p><p className="v3-calculator__or">или</p><button ref={contactTriggerRef} className="v3-calculator__contact" type="button" aria-haspopup="dialog" aria-controls="v3-contact-dialog" onClick={() => setContactDialogOpen(true)}>Сразу обсудить задачу <ArrowRight aria-hidden="true" /></button></aside>
      <form ref={formRef} className="v3-quiz__form v3-calculator__form" noValidate onChangeCapture={(event) => {
        const target = event.target;
        if (target instanceof HTMLInputElement && (target.type === "radio" || target.type === "checkbox") && target.checked) showScrollHint();
      }} onSubmit={(event) => { event.preventDefault(); moveForward(); }}>
        <div className="v3-quiz__progress"><p aria-live="polite">{summary ? "Результат" : `Шаг ${currentStep + 1} из ${stepIds.length}`}</p><span>Без отправки данных на сервер</span></div>
        {!summary && currentStep === 0 && <><h3 ref={headingRef} tabIndex={-1} className="v3-quiz__step-title">Что нужно сделать?</h3><fieldset className="v3-quiz__fieldset"><legend>Выберите маршрут</legend><ChoiceGroup name="taskType" value={String(answers.taskType ?? "")} options={taskOptions} invalid={fieldInvalid("taskType")} onChange={changeTaskType} /></fieldset></>}
        {!summary && currentStep > 0 && taskType === "site" && renderSiteStep()}
        {!summary && currentStep > 0 && taskType !== "site" && stepId === "context" && renderNonSiteContext()}
        {summary && <div className="v3-calculator__result" aria-live="polite"><p className="v3-kicker">Предварительный ориентир</p><h3 ref={headingRef} tabIndex={-1} className="v3-quiz__step-title">{taskLabels[summary.taskType]}</h3>{summary.estimate.kind === "from" ? <><div className="v3-calculator__total"><span>Разовая стоимость создания</span><strong>{summary.estimate.priceLabel}{summary.estimate.hasIntegrations ? " плюс интеграции" : ""}</strong></div><p className="v3-calculator__result-note">Это предварительный расчёт, а не публичная оферта.</p>{summary.estimate.lines && <dl className="v3-calculator__cost-lines">{summary.estimate.lines.map((line) => <div key={line.id} className={line.unit === "month" ? "is-monthly" : ""}><dt>{line.label}{line.unit === "month" ? " · в месяц" : ""}</dt><dd>{line.amount > 0 ? formatMoney(line.amount) : "включено"}{line.note && <small>{line.note}</small>}</dd></div>)}</dl>}</> : <p className="v3-calculator__discovery">Нужно провести небольшое исследование, чтобы определить состав работ и границы ответственности.</p>}<p className="v3-calculator__result-label">Что нужно учитывать</p><ul>{summary.assumptions.map((item) => <li key={item}>{item}</li>)}</ul>{summary.unknowns.length > 0 && <><p className="v3-calculator__result-label">Нужно уточнить</p><ul>{summary.unknowns.map((item) => <li key={item}>{item}</li>)}</ul></>}<dl className="v3-calculator__answers">{answerRows(summary).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></div>}
        <p className="v3-quiz__status" role="status" aria-live="polite">{invalidField ? errors[invalidField] ?? "Проверьте заполнение шага." : ""}</p>
        {!summary && currentStep > 0 && <div className="v3-quiz__controls"><button className="v3-button v3-button--quiet" type="button" onClick={moveBack}><CaretLeft aria-hidden="true" />Назад</button><button className="v3-button v3-button--primary" type="submit">{currentStep === stepIds.length - 1 ? "Показать ориентир" : "Продолжить"}</button></div>}
        {summary && <div className="v3-quiz__controls"><button className="v3-button v3-button--quiet" type="button" onClick={moveBack}><CaretLeft aria-hidden="true" />Изменить ответы</button><button className="v3-button v3-button--primary" type="button" onClick={discuss}>Обсудить результат <ArrowRight aria-hidden="true" /></button></div>}
        {summary && <button className="v3-calculator__reset" type="button" onClick={reset}>Начать заново</button>}
      </form>
      {isCalculatorOpen && isMobile && !summary && <span ref={scrollHintRef} className="v3-calculator__scroll-hint" aria-hidden="true"><ArrowDown weight="bold" /></span>}
      <ContactDialog open={contactDialogOpen} isMobile={isMobile} onClose={closeContactDialog} />
    </div>
  );
}
