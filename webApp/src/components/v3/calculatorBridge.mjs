import { getPersistableAnswers } from "./calculatorHelpers.mjs";

export const CALCULATOR_SUMMARY_EVENT = "v3:calculator-summary-ready";
const STORAGE_KEY = "kryukovs-v3-calculator-summary";
const TASK_TYPES = new Set(["site", "tool", "web-app", "support", "unsure"]);

function persistableSummary(summary) {
  return {
    schemaVersion: summary.schemaVersion,
    taskType: summary.taskType,
    answers: getPersistableAnswers(summary.answers),
    selectedOfferId: summary.selectedOfferId,
    estimate: summary.estimate,
    assumptions: summary.assumptions,
    unknowns: summary.unknowns,
    nextStep: summary.nextStep,
  };
}

export function publishCalculatorSummary(summary) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(CALCULATOR_SUMMARY_EVENT, { detail: summary }));
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(persistableSummary(summary)));
  } catch {
    // The contact path must keep working when storage is disabled or full.
  }
}

export function readPendingCalculatorSummary() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.schemaVersion !== 1 || typeof parsed?.taskType !== "string" || !TASK_TYPES.has(parsed.taskType)) return null;
    return {
      schemaVersion: 1,
      taskType: parsed.taskType,
      answers: parsed.answers && typeof parsed.answers === "object" ? parsed.answers : {},
      selectedOfferId: typeof parsed.selectedOfferId === "string" ? parsed.selectedOfferId : null,
      estimate: parsed.estimate?.kind === "from" && typeof parsed.estimate.priceLabel === "string" && typeof parsed.estimate.offerId === "string"
        ? parsed.estimate
        : { kind: "discovery", label: "Нужен discovery" },
      assumptions: Array.isArray(parsed.assumptions) ? parsed.assumptions.filter((item) => typeof item === "string") : [],
      unknowns: Array.isArray(parsed.unknowns) ? parsed.unknowns.filter((item) => typeof item === "string") : [],
      nextStep: parsed.nextStep === "telegram" ? "telegram" : "project-brief",
    };
  } catch {
    return null;
  }
}

export function clearPendingCalculatorSummary() {
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage may be unavailable.
  }
}
