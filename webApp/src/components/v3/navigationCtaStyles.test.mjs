import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [navigation, styles] = await Promise.all([
  readFile(new URL("./Navigation.tsx", import.meta.url), "utf8"),
  readFile(new URL("../../styles/v3.css", import.meta.url), "utf8"),
]);

test("header CTA keeps its text and border tokens while clipping the two-second sheen to its bounds", () => {
  assert.match(navigation, /className="v3-nav__cta v3-nav__cta--featured"/);
  assert.match(styles, /\.v3-nav__cta--featured\s*\{[^}]*overflow:\s*hidden[^}]*border-color:\s*var\(--v3-line\)[^}]*color:\s*var\(--v3-text\)[^}]*background-color:\s*transparent/s);
  assert.match(styles, /\.v3-nav__cta--featured::after\s*\{[^}]*animation:\s*v3-nav-cta-sheen\s+2000ms/s);
  assert.doesNotMatch(styles, /@keyframes\s+v3-nav-cta-pulse/);
  assert.doesNotMatch(styles, /animation:\s*v3-nav-cta-pulse/);
  assert.match(styles, /\.v3-nav__cta--featured:focus-visible\s*\{[^}]*outline-offset:\s*-3px/s);
  assert.match(styles, /prefers-reduced-motion:\s*reduce\)[\s\S]*?\.v3-nav__cta--featured/);
  assert.match(styles, /html\[data-motion="off"\]\s+\.v3-nav__cta--featured/);
});
