# Вторая версия сайта

Адрес: `/v2/`. Шесть страниц услуг: `/v2/services/<slug>/`.

Первая версия остаётся на `/`. Общий `BaseLayout.astro` сохраняет метаданные, аналитику и Schema.org; вариант `immersive` подключает отдельную навигацию, оформление и контроллер скролла.

## Запуск из webApp

```powershell
.\node_modules\.bin\astro.CMD dev --host 127.0.0.1 --port 4325
.\node_modules\.bin\astro.CMD check --minimumSeverity error
.\node_modules\.bin\astro.CMD build
```

## Где изменять

- `src/pages/v2/index.astro`: содержимое главной, проекты, этапы и FAQ.
- `src/pages/v2/services/[slug].astro`: страницы услуг на общих данных `src/data/services.ts`.
- `src/styles/immersive.css`: отдельные цвета, типографика, адаптив и CSS-стопка карточек.
- `src/components/immersive/Motion.astro`: GSAP ScrollTrigger и Lenis, очистка при уходе со страницы и восстановление из bfcache.
- `src/components/immersive/Navigation.tsx`: React-переключатель анимаций; выбор сохраняется на время сессии.
- `public/assets/immersive`: исходные фотографии и презентации из `raw/portfolio_new` под понятными именами.

На широком экране первый экран закрепляется, портрет меняет взгляд и масштаб; типографика проявляется по скроллу; проекты складываются в стопку; этапы движутся горизонтально. На телефоне этапы имеют нативный горизонтальный скролл и кнопки, а на достаточно высоком экране сохраняется компактная стопка проектов. При уменьшении движения отключаются закрепления и параллакс. Содержимое доступно без JavaScript.

Вдохновение: [Nakula](https://nakula.framer.website/). Интеграция скролла: [официальная документация Lenis](https://github.com/darkroomengineering/lenis/blob/main/README.md#gsap-scrolltrigger).

Публикация не выполнялась. Локальная сборка содержит обе версии.
