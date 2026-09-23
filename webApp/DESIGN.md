# Design System: Kryukovs Services — V3

> Visual contract for the noindex V3 root page of kryukovs.ru. V3 is the only active visual system and presents Sergey Kryukov as one accountable partner for a business website, tool, or product: dark, material, editorial and direct.

## Visual direction

V3 uses an off-black stone environment with real project interfaces, a portrait of the author and restrained teal interaction states. The large display type has the role of a carved title; the rest of the page stays quiet enough for verified facts, prices and project context.

- **Audience:** founders and small teams looking for a responsible technical partner.
- **Primary action:** open the project calculator in a modal or open a direct conversation.
- **Signature:** outlined Serati display titles in the Hero and capability scene, carried through all primary H2 headings.
- **Motion:** cinematic desktop scenes are additive. Content, hierarchy and controls must remain complete without JavaScript and under reduced motion.

## Palette and surfaces

| Role | Token | Value |
|---|---|---|
| Canvas | `--v3-bg` | `#0c0e0f` |
| Panel | `--v3-panel` | `#151819` |
| Raised panel | `--v3-panel-light` | `#1d2121` |
| Main text | `--v3-text` | `#f0f3ee` |
| Secondary text | `--v3-muted` | `#9ea7a2` |
| Structural line | `--v3-line` | `#343a38` |
| Functional accent | `--v3-accent` | `#079c8c` |
| Focus and active accent | `--v3-accent-bright` | `#20b9a8` |
| Ambient color | `--v3-ambient` | `#7047eb` |

Teal communicates action, selection and focus. Purple belongs only to ambient artwork. Large text remains light or outlined; do not use gradients as text fill.

## Typography

The runtime tokens live in `src/styles/v3.css`. This table is the source of visual intent; new V3 components must consume the tokens instead of adding one-off font declarations.

| Role | Family | Runtime token | Rule |
|---|---|---|---|
| Hero H1 | Serati | `--v3-type-hero` | Keep the existing outlined composition and responsive scale. |
| Main H2 | Serati | `--v3-type-section` | Use for section themes, FAQ, calculator and footer. The footer may increase its size for the final CTA. H2 uses transparent fill with a `1.5px` outline: `--v3-title-stroke-light` on dark surfaces and `--v3-title-stroke-dark` in the footer. |
| Card H3 | Oswald Variable | `--v3-type-card` | Use for process, services, projects and quiz headings. It must stay visually below H2. |
| Prices and proof values | Oswald Variable | `--v3-type-price` | Use for numbers and compact proof statements. |
| Lead | Manrope Variable | `--v3-type-lead` | Use for explanatory text paired with a section title. |
| Body and controls | Manrope Variable | `--v3-type-body` | Minimum 16 CSS px on mobile. |
| Labels and captions | Manrope Variable | `--v3-type-label`, `--v3-type-caption` | Minimum 14 CSS px in normal reading contexts. |

Sergey’s signature is the only decorative exception. It may use Serati without becoming a reusable body or UI style.

The Hero H1 keeps its stronger `2px` outline. All primary V3 H2 elements inherit the capabilities-scene outline treatment. Card H3, prices, labels, lead copy, body copy and controls remain filled text without an outline. Browsers without `text-stroke` receive a filled-color fallback; forced-colors mode disables transparent fill and uses `CanvasText`.

All headline blocks use `text-wrap: balance`; prose uses `text-wrap: pretty`. Prefer semantic containers and a sensible `max-width` over manual `<br>` elements. Body copy should normally stay within 60–68 characters per line. Use uppercase only for short labels, card headings, prices and intentional display scenes; do not uppercase paragraphs, form instructions or answers.

## Layout and responsive rules

- The shared V3 shell is `min(100% - responsive gutters, 96rem)`.
- Multi-column scenes collapse to a single readable flow below 52rem.
- Hero H1 retains its existing breakpoint-specific scale. Main H2 has a 3rem minimum. Card H3 begins at 2rem. Prices begin at 2.8rem.
- No section may introduce horizontal scrolling through text. Long Russian labels, prices and form values need natural wrapping and `overflow-wrap` where values can be user-entered.
- Text and form inputs use at least 16 CSS px on mobile. Supporting captions and labels use 14 CSS px or larger.
- Interactive controls keep a visible focus ring and a minimum comfortable touch target. Typography must not rely on color alone to convey importance or errors.

## Component use

- `v3-section-heading` pairs a main H2 with one lead; its typography establishes section hierarchy.
- Project, service and process cards use the shared Oswald card level, then Manrope body copy.
- Pricing groups use Manrope labels, Oswald numbers and Manrope boundaries.
- Quiz forms use Manrope for questions, labels, values, hints and errors. The H3 titles remain card-level headings.
- Storybook includes `V3 / Sections / Typography` as the visual regression specimen for long Russian headings, lead/body copy, captions, price and an input.

## Accessibility and review

- Preserve document heading order independently of visual size.
- Check 360, 390, 768 and 1440 px widths plus 200% browser zoom after changes.
- Confirm that Hero H1 and the capabilities H2 preserve their established composition before approving a typography change.
- Verify keyboard focus, readable line lengths, no clipped text and no unintended horizontal overflow.
- Keep the V3 root page `noindex` until the release gates in the project knowledge base are closed; this design document does not change public-release readiness.
