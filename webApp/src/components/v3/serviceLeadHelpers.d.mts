export type LeadPhoneValidation = {
  valid: boolean;
  normalized: string;
  error: string;
};

export function validateLeadPhone(value: unknown): LeadPhoneValidation;
