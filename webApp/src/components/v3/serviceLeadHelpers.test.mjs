import assert from "node:assert/strict";
import test from "node:test";
import { validateLeadPhone } from "./serviceLeadHelpers.mjs";

test("пустое поле получает понятное сообщение об обязательности", () => {
  assert.deepEqual(validateLeadPhone("   "), {
    valid: false,
    normalized: "",
    error: "Введите телефон.",
  });
});

test("телефон принимает международный номер с привычным форматированием", () => {
  assert.deepEqual(validateLeadPhone("+7 (999) 123-45-67"), {
    valid: true,
    normalized: "+79991234567",
    error: "",
  });
});

test("телефон отклоняет значение короче десяти цифр", () => {
  assert.deepEqual(validateLeadPhone("+7 999 12"), {
    valid: false,
    normalized: "",
    error: "Введите телефон: от 10 до 15 цифр.",
  });
});

test("телефон отклоняет буквы и посторонние символы", () => {
  assert.deepEqual(validateLeadPhone("+7 call-me-123456789"), {
    valid: false,
    normalized: "",
    error: "Используйте цифры, пробелы, скобки, дефисы и знак + в начале.",
  });
});

test("телефон отклоняет знак + внутри номера", () => {
  assert.equal(validateLeadPhone("7 999+123-45-67").valid, false);
});
