export type TaskType = "site" | "tool" | "web-app" | "support" | "unsure";
export type SiteFormatId = "landing" | "landing-direct" | "business-card" | "catalog" | "corporate";
export type SiteDesignId = "individual" | "animated";

export type CalculatorAnswers = Record<string, unknown> & {
  taskType: TaskType | "";
  siteFormat: SiteFormatId | "";
  sitePageCount: number;
  siteArticleCount: number;
  promotionDirect: boolean;
  promotionDirectCount: number;
  promotionSemantic: boolean;
  promotionSeo: boolean;
  promotionSeoBudget: number;
  siteDesign: SiteDesignId | "";
  siteIntegrations: string[];
};

export type CalculatorCostLine = {
  id: string;
  label: string;
  amount: number;
  unit?: "month";
  note?: string;
};

export type CalculatorSummary = {
  schemaVersion: 2;
  taskType: TaskType;
  answers: Record<string, unknown>;
  selectedOfferId: string | null;
  estimate:
    | {
        kind: "from";
        priceLabel: string;
        offerId: string;
        totalOneTime?: number;
        monthlySeo?: number | null;
        hasIntegrations?: boolean;
        lines?: CalculatorCostLine[];
      }
    | { kind: "discovery"; label: "Нужен discovery" };
  assumptions: string[];
  unknowns: string[];
  nextStep: "project-brief" | "telegram";
};

export const SITE_FORMATS: Array<{ id: SiteFormatId; title: string; priceFrom: number; priceLabel: string; shortDescription: string; basePages: number; volume: boolean; hasArticles?: boolean; skipsPromotion?: boolean; tooltip: string }>;
export const SITE_DESIGNS: Array<{ id: SiteDesignId; title: string; multiplier: number; hint: string }>;
export const SITE_INTEGRATIONS: Array<{ id: string; title: string }>;
export function createInitialCalculatorAnswers(): CalculatorAnswers;
export function getSiteFormat(formatId: string): (typeof SITE_FORMATS)[number] | null;
export function getSiteDesign(designId: string): (typeof SITE_DESIGNS)[number] | null;
export function siteFormatNeedsVolume(formatId: string): boolean;
export function siteFormatSkipsPromotion(formatId: string): boolean;
export function getSiteVolumeMinimum(formatId: string): number;
export function clampNumber(value: unknown, min: number, max: number): number;
export function sliderPositionToValue(position: number, min: number, max: number): number;
export function sliderValueToPosition(value: number, min: number, max: number): number;
export function getSiteStepIds(answers: CalculatorAnswers): string[];
export function getBranchKeys(taskType: TaskType | ""): string[];
export function resetAnswersForTaskType(previousAnswers: CalculatorAnswers, taskType: TaskType | ""): CalculatorAnswers;
export function resetAnswersForSiteFormat(previousAnswers: CalculatorAnswers, formatId: string): CalculatorAnswers;
export function normalizeCalculatorAnswers(answers: Partial<CalculatorAnswers>): CalculatorAnswers;
export function validateCalculatorStep(step: number, answers: CalculatorAnswers): { valid: true } | { valid: false; firstInvalid: string };
export function buildCalculatorSummary(answers: CalculatorAnswers, offerCatalog: Array<{ id: string; priceLabel: string }>): CalculatorSummary;
export function getPersistableAnswers(answers: CalculatorAnswers): Record<string, unknown>;
export function filterAnalyticsDetail(detail: Record<string, unknown>): Record<string, string | number>;
