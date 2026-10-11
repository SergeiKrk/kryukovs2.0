export const WOW_CONTACT_MESSAGE =
  "Здравствуйте! Хочу обсудить лендинг с wow-эффектом за 35 000 ₽ и 2 дня. Расскажите, какие сведения о бизнесе и продукте и данные для регистрации домена и хостинга понадобятся для старта.";

const EMAIL = "ksv.progect@gmail.com";
const EMAIL_SUBJECT = "Обсудить лендинг с wow-эффектом";

export function getWowContactLinks({ telegramHref, maxShareHref = "https://max.ru/:share" }) {
  const telegram = new URL(telegramHref);
  telegram.searchParams.set("text", WOW_CONTACT_MESSAGE);

  const max = new URL(maxShareHref);
  max.searchParams.set("text", WOW_CONTACT_MESSAGE);

  const email = new URL(`mailto:${EMAIL}`);
  email.searchParams.set("subject", EMAIL_SUBJECT);
  email.searchParams.set("body", WOW_CONTACT_MESSAGE);

  return { telegram: telegram.toString(), max: max.toString(), email: email.toString() };
}

export function getWowCtaEvent(position) {
  const allowedPositions = new Set(["navigation", "hero", "cases", "process", "author", "footer", "mobile-sticky", "telegram", "max", "email"]);
  if (!allowedPositions.has(position)) return null;
  return { name: "landing_wow_cta_click", params: { position } };
}
