# Итог этапа 5: `/landing-direct/`

> Сводка по состоянию на 29.09.2026. На этапе 5 менялась только документация; коммита и публикации нет.

## Результат и файлы

Подготовлена отдельная страница «Лендинг + Яндекс.Директ»: шесть секций, 35 000 ₽ за работы и срок 4 дня после согласования задачи и получения материалов и доступов. Бюджет рекламы оплачивается отдельно. Есть адаптивный poster и локальная desktop-сцена на 107 кадрах. Кейсы представлены только как примеры разработки. Страница сохраняет canonical и `noindex`; JSON-LD для неё не выводится.

- `webApp/src/pages/landing-direct.astro` — route.
- `webApp/src/components/v3/DirectLanding.astro` — разметка и содержание.
- `webApp/src/components/v3/DirectLandingMotion.astro` — локальная покадровая сцена.
- `webApp/src/styles/direct-landing.css` — локальные стили.

## Реальные проверки из handoff этапов 2–4

- Astro `check`: 38 файлов, 0 ошибок, 0 предупреждений, 19 hints; количество hints совпало с baseline.
- Astro `build` прошёл для direct, WOW и остальных маршрутов. Отмечено предупреждение sitemap `No pages found!` при текущих noindex-страницах.
- Production preview вернул 200 для `/landing-direct/`, `/landing-wow/` и `/`. В HTML direct подтверждены canonical, `noindex,follow`, H1, цена, срок, CTA, три FAQ `details`, контакты и отсутствие JSON-LD.
- Этап 3 сообщил о desktop-кадрах 0/92/106, motion off и мобильном poster. Независимая QA этапа 4 эти сценарии повторно не проходила.
- Этап 4 проверил первый экран и canvas 0→92 в production preview; горизонтального overflow в измеренном окне 1309×818 не обнаружено. SHA256 защищённых файлов совпали с baseline.

На этапе 5 проверки не запускались повторно; данные выше переданы предыдущими handoff и не являются результатом нового прогона.

## Ограничения

Независимая QA не проверяла размеры 360/390/768 px, zoom 200%, клавиатурную навигацию, медленную сеть, отказ кадра и повторный вход. Пиксельного сравнения главной и WOW с baseline не было. Handoff этапа 3 также описывает устаревший dev-сервер с `FailedToLoadModuleSSR`; build и production preview проверялись отдельно.

Календарная трактовка срока, Метрика/цели, ведение, число правок и объявлений, производство контента, лиды, окупаемость, модерация и поддержка не обещаются. Страница не опубликована и остаётся `noindex`.

## Dirty tree

Текущий status содержит изменения вне этапа 5: modified `webApp/astro.config.mjs`, `ProjectCalculator.tsx`, `V3Sections.stories.tsx`, `calculatorHelpers.mjs`, `calculatorHelpers.test.mjs`, `data/v3.ts`, `pages/index.astro`; также untracked файлы реализации direct/WOW и `docs/`. Этап 5 их не менял и не устанавливает их происхождение. Перед последующими изменениями свериться с `git status`.

## Связанные материалы

- [План](../02-redesign-plan.md)
- [Спецификация](../03-design-spec.md)
- [Общий handoff](../HANDOFF.md)
- [Handoff QA этапа 4](04-handoff.md)
