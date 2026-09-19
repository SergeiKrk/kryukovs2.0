# V3 cinematic conversion landing

## Goal

Build a complete noindex prototype at `/v3/` that combines cinematic scroll storytelling with a clear conversion path for premium turnkey websites. Preserve `/` and `/v2/`.

## Global constraints

- Astro static output. Astro owns content and semantic HTML; React is limited to stateful navigation and quiz.
- Use real assets from `raw/`, copied into `webApp/public/assets/v3/` with stable ASCII names.
- Dark off-black stone aesthetic. Teal `#079c8c` is the functional accent. Purple `#7047eb` is ambient only.
- Display font Oswald Variable, body Manrope Variable.
- No fabricated testimonials or traffic claims. Use only verified facts: 5+ years production React/TypeScript, web/SEO/marketing since 2015, 30+ design-system components, 14 days support, SamogonCalc 12 calculators and 86 content pages.
- No WebGL. GSAP, ScrollTrigger and MotionPathPlugin only. Every animation has reduced-motion and mobile fallbacks.
- No em dash in visible page copy. No scroll cue. Content remains readable without JavaScript.
- The primary CTA opens or scrolls to a five-step project calculator. Submission remains a safe prototype until a server runtime and Telegram credentials are chosen; provide a Telegram fallback.

## Task 1: Foundation and static conversion page

Create the `/v3/` route, v3-specific components, content data and stylesheet. Implement the complete semantic page: fullscreen navigation, hero, capability scene, personal/process scene, portfolio, services, pricing, FAQ, quiz and footer. Copy and rename selected source assets. Add `noindex` via BaseLayout. Implement responsive static layouts with no dependence on animation.

Verification: `astro check`, `astro build`, and inspect generated `/v3/index.html` for title, noindex, hero H1, CTA, and no duplicated JSON-LD.

## Task 2: Quiz behavior and analytics contract

Implement a keyboard-accessible five-step React quiz with validation, back/next controls, sessionStorage recovery, UTM capture, a visible summary, Telegram fallback, and custom analytics events. Add testable pure quiz helpers and write tests first for validation, progress and payload shaping. Do not claim network delivery.

Verification: helper tests, `astro check`, `astro build`.

## Task 3: Cinematic motion system

Implement scoped GSAP controllers for hero reveal, outline-to-fill title, hero parallax, head MotionPath travel, deterministic stone-letter assembly, scroll-scrub video with final-image crossfade, process card stack, desktop horizontal portfolio, and restrained service reveals. Use `gsap.context`, `gsap.matchMedia`, teardown, image/font refresh, fine-pointer desktop Lenis only, and session motion preference. Mobile uses ordinary flow and portfolio scroll-snap. Reduced motion shows final readable states and disables pinning/scrub.

Verification: `astro check`, `astro build`, browser interaction inspection at desktop and mobile viewports.

## Task 4: Visual QA, accessibility and performance pass

Run local preview, capture and inspect desktop and mobile. Fix overflow, hierarchy, crop, focus, contrast, broken navigation/quiz states and animation collisions. Verify route reversals, resize safety, no-JS readability, reduced motion and failed-video fallback. Keep hero assets eager and all later media lazy.

Verification: final `astro check`, `astro build`, browser console clean for `/v3/`.

