import type { CalculatorSummary } from "./calculatorHelpers.mjs";

export const CALCULATOR_SUMMARY_EVENT: "v3:calculator-summary-ready";
export function publishCalculatorSummary(summary: CalculatorSummary): void;
export function readPendingCalculatorSummary(): Partial<CalculatorSummary> | null;
export function clearPendingCalculatorSummary(): void;
