import assert from "node:assert/strict";
import test from "node:test";
import { getWowContactLinks, getWowCtaEvent, WOW_CONTACT_MESSAGE } from "./wowContact.mjs";

test("контактные черновики сохраняют адреса и кодируют текст без потери символов", () => {
  const links = getWowContactLinks({ telegramHref: "https://t.me/sergeikrk" });
  const telegram = new URL(links.telegram);
  const max = new URL(links.max);
  const email = new URL(links.email);

  assert.equal(`${telegram.origin}${telegram.pathname}`, "https://t.me/sergeikrk");
  assert.equal(telegram.searchParams.get("text"), WOW_CONTACT_MESSAGE);
  assert.match(max.href, /^https:\/\/max\.ru\/:share\?text=/);
  assert.equal(/\s/.test(max.href), false);
  assert.equal(max.searchParams.get("text"), WOW_CONTACT_MESSAGE);
  assert.equal(email.pathname, "ksv.progect@gmail.com");
  assert.equal(email.searchParams.get("subject"), "Обсудить лендинг с wow-эффектом");
  assert.equal(email.searchParams.get("body"), WOW_CONTACT_MESSAGE);
});

test("событие CTA содержит только допустимую позицию и не принимает свободные данные", () => {
  assert.deepEqual(getWowCtaEvent("hero"), {
    name: "landing_wow_cta_click",
    params: { position: "hero" },
  });
  assert.equal(getWowCtaEvent("секретные данные"), null);
});
