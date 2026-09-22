export type TaskType = "site" | "tool" | "web-app" | "support" | "unsure";

export type CalculatorAnswers = Record<string, string> & { taskType: TaskType | "" };

export type CalculatorSummary = {
  schemaVersion: 1;
  taskType: TaskType;
  answers: Record<string, string | string[]>;
  selectedOfferId: string | null;
  estimate:
    | { kind: "from"; priceLabel: string; offerId: string }
    | { kind: "discovery"; label: "Нужен discovery" };
  assumptions: string[];
  unknowns: string[];
  nextStep: "project-brief" | "telegram";
};

export function createInitialCalculatorAnswers(): CalculatorAnswers;
export function resetAnswersForTaskType(previousAnswers: CalculatorAnswers, taskType: TaskType | ""): CalculatorAnswers;
export function getBranchKeys(taskType: TaskType | ""): string[];
export function validateCalculatorStep(step: number, answers: CalculatorAnswers): { valid: true } | { valid: false; firstInvalid: string };
export function buildCalculatorSummary(answers: CalculatorAnswers, offerCatalog: Array<{ id: string; priceLabel: string }>): CalculatorSummary;
export function getPersistableAnswers(answers: CalculatorAnswers): Record<string, string>;
export function filterAnalyticsDetail(detail: Record<string, unknown>): Record<string, string | number>;
