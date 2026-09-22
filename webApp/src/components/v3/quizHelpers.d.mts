export type ProjectType = "new-site" | "redesign" | "promo" | "other";
export type ProjectPackage = "start" | "brand" | "cinematic" | "unsure";
export type Budget = "60-100" | "100-180" | "180-plus";
export type Timing = "urgent" | "one-two-months" | "flexible";

export interface QuizAnswers {
  name: string;
  contact: string;
  projectType: ProjectType | "";
  goal: string;
  siteUrl: string;
  package: ProjectPackage | "";
  budget: Budget | "";
  timing: Timing | "";
  comment: string;
  consent: boolean;
  calculatorSummary?: CalculatorSummary | null;
}

export interface LeadPayload {
  name: string;
  contact: string;
  projectType: ProjectType;
  goal: string;
  siteUrl?: string;
  package: ProjectPackage;
  budget: Budget;
  timing: Timing;
  comment?: string;
  consent: true;
  utm?: Record<string, string>;
  pageUrl: string;
  calculatorSummary?: CalculatorSummary;
}

export type ValidationResult =
  | { valid: true }
  | { valid: false; firstInvalid: keyof QuizAnswers };

export function validateStep(step: number, answers: QuizAnswers): ValidationResult;
export function getStepProgress(stepIndex: number): {
  current: number;
  total: 5;
  label: string;
};
export function shapeLeadPayload(answers: QuizAnswers, pageUrl: string): LeadPayload;
export function buildTelegramUrl(payload: LeadPayload): string;
import type { CalculatorSummary } from "./calculatorHelpers.mjs";
