const ALLOWED_PHONE_CHARACTERS = /^\+?[\d\s()-]+$/;

export function validateLeadPhone(value) {
  const phone = typeof value === "string" ? value.trim() : "";
  if (!phone) {
    return {
      valid: false,
      normalized: "",
      error: "Введите телефон.",
    };
  }

  if (!ALLOWED_PHONE_CHARACTERS.test(phone)) {
    return {
      valid: false,
      normalized: "",
      error: "Используйте цифры, пробелы, скобки, дефисы и знак + в начале.",
    };
  }

  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15) {
    return {
      valid: false,
      normalized: "",
      error: "Введите телефон: от 10 до 15 цифр.",
    };
  }

  return {
    valid: true,
    normalized: `+${digits}`,
    error: "",
  };
}
