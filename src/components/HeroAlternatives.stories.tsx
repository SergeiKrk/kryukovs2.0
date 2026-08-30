import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ArrowRight,
  Article,
  Bell,
  Browsers,
  ChartLineUp,
  CheckCircle,
  Code,
  CursorClick,
  DeviceMobile,
  Gauge,
  MagnifyingGlass,
  Megaphone,
  PaperPlaneTilt,
  RocketLaunch,
  StackSimple,
} from "@phosphor-icons/react";
import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from "react";
import "./hero-alternatives.css";

const heroCopy = {
  eyebrow: "Разработка сайтов и веб-сервисов",
  promise: (
    <>
      Создаю <span className="hero-concept__teal">удобные</span> сайты, которые превращают посетителей в{" "}
      <span className="hero-concept__violet">покупателей</span>
    </>
  ),
  lead:
    "Делаю быстрые и понятные сайты и веб-сервисы на React и Astro. Подключаю SEO, аналитику и помогаю привлекать трафик. После запуска — 14 дней поддержки.",
};

function HeroActions() {
  return (
    <div className="hero-concept__actions">
      <a className="button button-primary" href="#contact">
        <PaperPlaneTilt aria-hidden="true" weight="duotone" /> Обсудить проект
      </a>
      <a className="button button-link" href="#cases">
        Смотреть кейсы <ArrowRight aria-hidden="true" />
      </a>
    </div>
  );
}

function HeroIntro() {
  return (
    <>
      <p className="eyebrow hero-concept__eyebrow">{heroCopy.eyebrow}</p>
      <h1 className="hero-concept__promise">{heroCopy.promise}</h1>
      <p className="hero-concept__lead">{heroCopy.lead}</p>
      <HeroActions />
    </>
  );
}

function Metric({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`hero-concept__metric${compact ? " hero-concept__metric--compact" : ""}`} aria-label="До 98,6 тысяч посетителей в месяц">
      <ChartLineUp aria-hidden="true" weight="duotone" />
      <p>
        до <strong>98,6 тыс.</strong> <span>посетителей в месяц</span>
      </p>
    </div>
  );
}

function BaselineHeroCopy() {
  return (
    <div className="hero-copy">
      <h1 className="eyebrow hero-service-title">Разработка сайтов и веб-сервисов</h1>
      <p className="hero-promise">
        Создаю <span className="accent-primary hero-gradient-teal">удобные</span> сайты, которые превращают посетителей в <span className="accent-violet hero-gradient-violet">покупателей</span>
      </p>
      <p className="lead">Делаю быстрые и понятные сайты и веб-сервисы на React и Astro. Подключаю SEO, аналитику и помогаю привлекать трафик. После запуска — 14 дней поддержки.</p>
      <div className="hero-actions">
        <a className="button button-primary" href="#contact"><PaperPlaneTilt aria-hidden="true" weight="duotone" /> Обсудить проект</a>
        <a className="button button-link" href="#cases">Смотреть кейсы <ArrowRight aria-hidden="true" /></a>
      </div>
      <div className="hero-metric" aria-label="До 98,6 тысяч посетителей в месяц">
        <strong>до 98,6 <span>тыс.</span></strong>
        <small>посетителей в месяц</small>
      </div>
    </div>
  );
}

function BaselineHeroSection() {
  return (
    <section className="hero">
      <div className="container hero-grid">
        <BaselineHeroCopy />
        <div className="portrait-swap" aria-label="Сергей Крюков, Product Engineer и frontend-разработчик">
          <img className="portrait-front" src="/assets/sergey-front.webp" alt="Сергей Крюков смотрит прямо" width="832" height="900" />
        </div>
        <figure className="analytics-card">
          <img src="/assets/analytics.jpg" alt="Показатели просмотров, визитов и посетителей в аналитике" width="1785" height="1110" />
          <figcaption className="analytics-caption"><strong>Показатели</strong></figcaption>
        </figure>
      </div>
    </section>
  );
}

function TiltWorkbenchScene() {
  const analyticsScreenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const screen = analyticsScreenRef.current;
    if (!screen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const scene = screen.closest<HTMLElement>(".hero-hybrid__scene");
    if (!scene) return;

    let frame = 0;
    const updateParallax = () => {
      frame = 0;
      const bounds = scene.getBoundingClientRect();
      const distanceFromCenter = (window.innerHeight / 2) - (bounds.top + bounds.height / 2);
      const verticalOffset = Math.max(-28, Math.min(44, distanceFromCenter * 0.075));
      const horizontalOffset = Math.max(-48, Math.min(112, distanceFromCenter * 0.21));
      screen.style.setProperty("--parallax-x", `${horizontalOffset}px`);
      screen.style.setProperty("--parallax-y", `${verticalOffset}px`);
    };
    const queueParallax = () => {
      if (!frame) frame = window.requestAnimationFrame(updateParallax);
    };

    updateParallax();
    window.addEventListener("scroll", queueParallax, { passive: true });
    window.addEventListener("resize", queueParallax, { passive: true });

    return () => {
      window.removeEventListener("scroll", queueParallax);
      window.removeEventListener("resize", queueParallax);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const updateTilt = (event: ReactPointerEvent<HTMLElement>) => {
    if (
      event.pointerType !== "mouse" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) return;

    const scene = event.currentTarget;
    const bounds = scene.getBoundingClientRect();
    const pointerX = (event.clientX - bounds.left) / bounds.width;
    const pointerY = (event.clientY - bounds.top) / bounds.height;

    scene.style.setProperty("--tilt-x", `${(0.5 - pointerY) * 7}deg`);
    scene.style.setProperty("--tilt-y", `${(pointerX - 0.5) * 9}deg`);
    scene.style.setProperty("--glow-x", `${pointerX * 100}%`);
    scene.style.setProperty("--glow-y", `${pointerY * 100}%`);
    scene.dataset.tilting = "true";
  };

  const resetTilt = (event: ReactPointerEvent<HTMLElement>) => {
    const scene = event.currentTarget;
    scene.style.setProperty("--tilt-x", "0deg");
    scene.style.setProperty("--tilt-y", "0deg");
    scene.style.setProperty("--glow-x", "50%");
    scene.style.setProperty("--glow-y", "42%");
    delete scene.dataset.tilting;
  };

  return (
    <figure
      className="hero-hybrid__scene"
      onPointerMove={updateTilt}
      onPointerLeave={resetTilt}
      onPointerCancel={resetTilt}
    >
      <div className="hero-hybrid__tilt">
        <div ref={analyticsScreenRef} className="hero-workbench__screen hero-hybrid__screen">
          <div className="hero-hybrid__parallax-layer">
            <img src="/assets/analytics.jpg" alt="Рост трафика проекта в аналитике" width="1785" height="1110" />
            <figcaption>Аналитика проекта · поисковый трафик растёт</figcaption>
          </div>
        </div>
      </div>
      <img className="hero-workbench__portrait hero-hybrid__portrait" src="/assets/sergey-front.webp" alt="Сергей Крюков представляет результат проекта" width="832" height="900" />
      <div className="hero-metric hero-hybrid__identity" aria-label="Сергей Крюков — Full-stack разработчик, маркетинг и SEO">
        <strong>Сергей Крюков</strong>
        <small>Full-stack разработчик · маркетинг и SEO</small>
      </div>
    </figure>
  );
}

function AnalyticsTiltHero() {
  return (
    <section className="hero hero-hybrid" aria-label="Hero с интерактивной аналитикой">
      <div className="container hero-hybrid__layout">
        <BaselineHeroCopy />
        <TiltWorkbenchScene />
      </div>
    </section>
  );
}

function PortraitSignature() {
  return (
    <section className="hero-concept hero-concept--signature" aria-label="Hero — портрет как подпись">
      <div className="hero-concept__container hero-signature__layout">
        <div className="hero-concept__copy hero-signature__copy">
          <HeroIntro />
          <div className="hero-signature__proof">
            <Metric compact />
            <figure className="hero-signature__analytics">
              <img src="/assets/analytics.jpg" alt="Рост просмотров, визитов и посетителей в аналитике" width="1785" height="1110" />
              <figcaption>Результат проекта в аналитике</figcaption>
            </figure>
          </div>
        </div>
        <figure className="hero-signature__portrait">
          <img src="/assets/sergey-front.webp" alt="Сергей Крюков смотрит прямо" width="832" height="900" />
          <figcaption>Сергей Крюков · frontend-разработчик</figcaption>
        </figure>
      </div>
    </section>
  );
}

function EditorialFrame() {
  return (
    <section className="hero-concept hero-concept--editorial" aria-label="Hero — редакционная рамка">
      <div className="hero-concept__container hero-editorial__layout">
        <div className="hero-concept__copy hero-editorial__copy">
          <HeroIntro />
          <Metric />
        </div>
        <div className="hero-editorial__proof">
          <figure className="hero-editorial__portrait">
            <div className="hero-editorial__portrait-window">
              <img src="/assets/sergey-look.webp" alt="Сергей Крюков смотрит в сторону текста" width="832" height="900" />
            </div>
            <figcaption>
              <strong>Сергей Крюков</strong>
              <span>frontend-разработчик · один специалист на весь проект</span>
            </figcaption>
          </figure>
          <figure className="hero-editorial__analytics">
            <img src="/assets/analytics.jpg" alt="Показатели просмотров, визитов и посетителей в аналитике" width="1785" height="1110" />
            <figcaption>
              <strong>Не обещания, а цифры</strong>
              <span>Реальный проект после SEO и развития</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

function WorkbenchScene() {
  return (
    <section className="hero-concept hero-concept--workbench" aria-label="Hero — рабочая сцена">
      <div className="hero-concept__container hero-workbench__layout">
        <div className="hero-concept__copy hero-workbench__copy">
          <HeroIntro />
          <Metric />
        </div>
        <figure className="hero-workbench__scene">
          <div className="hero-workbench__screen">
            <img src="/assets/analytics.jpg" alt="Рост трафика проекта в аналитике" width="1785" height="1110" />
            <figcaption>Аналитика проекта · поисковый трафик растёт</figcaption>
          </div>
          <img className="hero-workbench__portrait" src="/assets/sergey-look.webp" alt="Сергей Крюков представляет результат проекта" width="832" height="900" />
        </figure>
      </div>
    </section>
  );
}

const workshopStageLabels = ["Задача", "Структура", "Интерфейс", "Разработка", "Запуск"];

const clampWorkshopProgress = (value: number) => Math.max(0, Math.min(1, value));

const easeWorkshopProgress = (value: number) => {
  const progress = clampWorkshopProgress(value);
  return progress * progress * (3 - (2 * progress));
};

const addWorkshopStops = (rawProgress: number) => {
  const progress = clampWorkshopProgress(rawProgress);
  if (progress === 1) return 1;

  const segmentCount = workshopStageLabels.length - 1;
  const scaled = progress * segmentCount;
  const segment = Math.min(segmentCount - 1, Math.floor(scaled));
  const localProgress = scaled - segment;
  const plateau = 0.32;
  const movingProgress = clampWorkshopProgress((localProgress - plateau) / (1 - (plateau * 2)));

  return (segment + easeWorkshopProgress(movingProgress)) / segmentCount;
};

function ModularWorkshopScene() {
  return (
    <figure className="workshop-scene" aria-labelledby="workshop-scene-caption">
      <div className="workshop-scene__board" aria-hidden="true">
        <div className="workshop-stage-rail">
          {workshopStageLabels.map((label, index) => (
            <span key={label} data-stage-index={index}>
              <i>{index + 1}</i>
              {label}
            </span>
          ))}
        </div>

        <div className="workshop-module workshop-module--brief">
          <Article weight="duotone" />
          <div>
            <strong>Бриф проекта</strong>
            <span>Цель и задачи</span>
            <span>Целевая аудитория</span>
            <span>Ключевое действие</span>
          </div>
        </div>

        <div className="workshop-module workshop-module--prototype">
          <StackSimple weight="duotone" />
          <div>
            <strong>Прототип</strong>
            <span>Логика экранов</span>
            <span>Путь пользователя</span>
            <span>Ключевые состояния</span>
          </div>
        </div>

        <div className="workshop-module workshop-module--navigation">
          <Browsers weight="duotone" />
          <strong>Навигация сайта</strong>
          <span>Главная</span>
          <span>Услуги</span>
          <span>Контакты</span>
        </div>

        <div className="workshop-module workshop-module--form">
          <RocketLaunch weight="duotone" />
          <strong>Форма заявки</strong>
          <span className="workshop-field">Имя</span>
          <span className="workshop-field">Телефон</span>
          <span className="workshop-submit">Отправить</span>
        </div>

        <div className="workshop-module workshop-module--analytics">
          <ChartLineUp weight="duotone" />
          <div>
            <strong>Аналитика</strong>
            <span>События подключены</span>
          </div>
        </div>

        <div className="workshop-browser">
          <div className="workshop-browser__chrome">
            <span></span><span></span><span></span>
            <small>demo-service.ru</small>
          </div>
          <div className="workshop-browser__wireframe">
            <span className="workshop-wire workshop-wire--headline"></span>
            <span className="workshop-wire workshop-wire--copy"></span>
            <span className="workshop-wire workshop-wire--button"></span>
            <span className="workshop-wire workshop-wire--media"></span>
          </div>
          <div className="workshop-browser__surface">
            <header>
              <strong>Демо-проект</strong>
              <nav><span>Главная</span><span>Решения</span><span>Контакты</span></nav>
              <span className="workshop-browser__action">Связаться</span>
            </header>
            <main>
              <div>
                <span className="workshop-browser__eyebrow">Сервис для бизнеса</span>
                <h2>Решения для роста вашего бизнеса</h2>
                <p>Понятный сайт, личный кабинет и автоматизация обращений.</p>
                <span className="workshop-browser__action">Оставить заявку</span>
              </div>
              <aside>
                <Gauge weight="duotone" />
                <strong>Всё измеримо</strong>
                <span>Цели и события настроены</span>
              </aside>
            </main>
            <footer>
              <span><CheckCircle weight="fill" /> Быстрый запуск</span>
              <span><CheckCircle weight="fill" /> Адаптивный интерфейс</span>
              <span><CheckCircle weight="fill" /> Поддержка после релиза</span>
            </footer>
          </div>
        </div>

        <div className="workshop-code">
          <div><Code weight="duotone" /> React / TypeScript / Astro</div>
          <code><span>&lt;section</span> className="service"&gt;</code>
          <code>&nbsp;&nbsp;&lt;LeadForm analytics="connected" /&gt;</code>
          <code><span>&lt;/section&gt;</span></code>
        </div>

        <div className="workshop-phone">
          <div className="workshop-phone__speaker"></div>
          <div className="workshop-phone__header"><strong>Демо</strong><span>•••</span></div>
          <DeviceMobile weight="duotone" />
          <strong>Mini App</strong>
          <span>Заявка в два шага</span>
          <span className="workshop-phone__action">Продолжить</span>
        </div>

        <div className="workshop-integrations">
          <span><MagnifyingGlass weight="duotone" /><strong>SEO</strong><small>Готово</small></span>
          <span><ChartLineUp weight="duotone" /><strong>Аналитика</strong><small>Подключена</small></span>
          <span><Bell weight="duotone" /><strong>Уведомления</strong><small>Работают</small></span>
          <span className="workshop-integration--ads"><Megaphone weight="duotone" /><strong>Реклама</strong><small>Маркетинг</small></span>
        </div>

        <CursorClick className="workshop-cursor" weight="fill" />
        <div className="workshop-launch-status">
          <CheckCircle weight="fill" />
          <div><strong>Проект запущен</strong><span>Все системы работают</span></div>
        </div>
      </div>

      <img
        className="workshop-scene__portrait"
        src="/assets/sergey-front.webp"
        alt="Сергей Крюков, разработчик проекта"
        width="832"
        height="900"
      />
      <div className="hero-metric workshop-portrait__metric" aria-label="Сергей Крюков — Full-stack разработчик, маркетинг и SEO">
        <strong>Сергей Крюков</strong>
        <small>Full-stack разработчик · маркетинг и SEO</small>
      </div>
      <figcaption id="workshop-scene-caption" className="workshop-visually-hidden">
        Демонстрационная сцена: из брифа и прототипа собираются сайт, мобильное приложение и подключения SEO, аналитики, уведомлений и рекламы.
      </figcaption>
    </figure>
  );
}

function ScrollWorkshopHero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compactLayout = window.matchMedia("(max-width: 68rem)");
    let animationFrame = 0;

    const renderProgress = () => {
      animationFrame = 0;
      const bounds = hero.getBoundingClientRect();
      let progress = 1;

      if (!reducedMotion.matches) {
        if (compactLayout.matches) {
          const sceneBounds = hero.querySelector<HTMLElement>(".workshop-scene")?.getBoundingClientRect();
          const sceneDistance = Math.max(1, window.innerHeight + (sceneBounds?.height ?? 0));
          progress = easeWorkshopProgress((window.innerHeight - (sceneBounds?.top ?? window.innerHeight)) / sceneDistance);
        } else {
          const scrollDistance = Math.max(1, hero.offsetHeight - window.innerHeight);
          progress = addWorkshopStops((-bounds.top) / scrollDistance);
        }
      }

      const normalizedProgress = clampWorkshopProgress(progress);
      const activeStage = Math.min(workshopStageLabels.length - 1, Math.round(normalizedProgress * (workshopStageLabels.length - 1)));
      hero.style.setProperty("--workshop-progress", normalizedProgress.toFixed(4));
      hero.dataset.workshopStage = String(activeStage);
    };

    const queueProgress = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(renderProgress);
    };

    renderProgress();
    window.addEventListener("scroll", queueProgress, { passive: true });
    window.addEventListener("resize", queueProgress, { passive: true });
    reducedMotion.addEventListener("change", queueProgress);
    compactLayout.addEventListener("change", queueProgress);

    return () => {
      window.removeEventListener("scroll", queueProgress);
      window.removeEventListener("resize", queueProgress);
      reducedMotion.removeEventListener("change", queueProgress);
      compactLayout.removeEventListener("change", queueProgress);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <section ref={heroRef} className="hero-workshop" aria-label="Hero — цифровая мастерская" data-workshop-stage="0">
      <div className="hero-workshop__sticky">
        <div className="container hero-workshop__layout">
          <BaselineHeroCopy />
          <ModularWorkshopScene />
        </div>
      </div>
    </section>
  );
}

function ExplodedProductScene() {
  return (
    <figure className="exploded-scene" aria-labelledby="exploded-scene-caption">
      <div className="exploded-scene__board" aria-hidden="true">
        <div className="exploded-node exploded-node--analytics">
          <ChartLineUp weight="duotone" />
          <div><strong>Аналитика</strong><span>Цели и события</span></div>
        </div>
        <div className="exploded-node exploded-node--brief">
          <Article weight="duotone" />
          <div><strong>Бриф</strong><span>Задача согласована</span></div>
        </div>
        <div className="exploded-node exploded-node--notifications">
          <Bell weight="duotone" />
          <div><strong>Уведомления</strong><span>Telegram и MAX</span></div>
        </div>
        <div className="exploded-node exploded-node--seo">
          <MagnifyingGlass weight="duotone" />
          <div><strong>SEO-настройки</strong><span>Страницы готовы</span></div>
        </div>
        <div className="exploded-node exploded-node--structure">
          <Browsers weight="duotone" />
          <div><strong>Структура</strong><span>Связи экранов</span></div>
        </div>

        <span className="exploded-anchor exploded-anchor--brief"></span>
        <span className="exploded-anchor exploded-anchor--structure"></span>
        <span className="exploded-anchor exploded-anchor--analytics"></span>
        <span className="exploded-anchor exploded-anchor--seo"></span>
        <span className="exploded-anchor exploded-anchor--notifications"></span>

        <div className="exploded-stack">
          <section className="exploded-layer exploded-layer--browser">
            <div className="exploded-browser__chrome">
              <span></span><span></span><span></span>
              <small>kryukovs.ru</small>
            </div>
            <header>
              <strong>Главная</strong>
              <nav><span>Услуги</span><span>Кейсы</span><span>Процесс</span></nav>
              <span className="exploded-layer__action">Обсудить проект</span>
            </header>
            <div className="exploded-browser__content">
              <div>
                <span className="exploded-layer__eyebrow">Сайт для бизнеса</span>
                <h2>Разработка сайтов<br />и веб-сервисов</h2>
                <p>Понятный продукт, аналитика и поддержка после запуска.</p>
                <span className="exploded-layer__action exploded-layer__action--violet">Оставить заявку</span>
              </div>
              <img src="/assets/green-crown-desktop.png" alt="" width="1440" height="900" />
            </div>
          </section>

          <section className="exploded-layer exploded-layer--wireframe">
            <strong>Структура интерфейса</strong>
            <div className="exploded-wireframe__grid">
              <span></span><span></span><span></span>
              <span></span><span></span><span></span>
            </div>
          </section>

          <section className="exploded-layer exploded-layer--system">
            <div className="exploded-system__swatches"><i></i><i></i><i></i><i></i></div>
            <div className="exploded-system__type"><strong>Manrope</strong><span>Заголовки, текст и интерфейсные подписи</span></div>
            <div className="exploded-system__preview"><span></span><span></span><span></span></div>
          </section>

          <section className="exploded-layer exploded-layer--code">
            <div><Code weight="duotone" /> Компонент Hero</div>
            <code><span>&lt;Hero</span> analytics="connected" seo="ready" <span>/&gt;</span></code>
          </section>

          <section className="exploded-layer exploded-layer--miniapp">
            <div><DeviceMobile weight="duotone" /><strong>Mini App</strong></div>
            <span>Заявка отправляется в два шага</span>
            <span className="exploded-miniapp__action">Обсудить проект</span>
          </section>
        </div>

        <div className="exploded-selection exploded-selection--primary">
          <span></span><span></span><span></span><span></span>
        </div>
        <CursorClick
          className="exploded-cursor exploded-cursor--primary"
          data-exploded-cursor="primary"
          weight="fill"
        />

        <div className="exploded-selection exploded-selection--secondary">
          <span></span><span></span><span></span><span></span>
        </div>
        <CursorClick
          className="exploded-cursor exploded-cursor--secondary"
          data-exploded-cursor="secondary"
          weight="fill"
        />
      </div>

      <img
        className="exploded-scene__portrait"
        src="/assets/sergey-front.webp"
        alt="Сергей Крюков, разработчик проекта"
        width="832"
        height="900"
      />
      <figcaption id="exploded-scene-caption" className="workshop-visually-hidden">
        Демонстрационная сцена: сайт разложен на структуру, визуальную систему, код, Mini App и подключения аналитики, SEO и уведомлений.
      </figcaption>
    </figure>
  );
}

function ExplodedLayersHero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compactLayout = window.matchMedia("(max-width: 54rem)");
    let animationFrame = 0;

    const renderProgress = () => {
      animationFrame = 0;
      const bounds = hero.getBoundingClientRect();
      const scrollDistance = Math.max(1, hero.offsetHeight - window.innerHeight);
      const progress = reducedMotion.matches || compactLayout.matches
        ? 1
        : addWorkshopStops((-bounds.top) / scrollDistance);
      const normalizedProgress = clampWorkshopProgress(progress);
      const activeStage = Math.min(
        workshopStageLabels.length - 1,
        Math.round(normalizedProgress * (workshopStageLabels.length - 1)),
      );

      hero.style.setProperty("--exploded-progress", normalizedProgress.toFixed(4));
      hero.dataset.explodedStage = String(activeStage);
    };

    const queueProgress = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(renderProgress);
    };

    renderProgress();
    window.addEventListener("scroll", queueProgress, { passive: true });
    window.addEventListener("resize", queueProgress, { passive: true });
    reducedMotion.addEventListener("change", queueProgress);
    compactLayout.addEventListener("change", queueProgress);

    return () => {
      window.removeEventListener("scroll", queueProgress);
      window.removeEventListener("resize", queueProgress);
      reducedMotion.removeEventListener("change", queueProgress);
      compactLayout.removeEventListener("change", queueProgress);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="hero hero-exploded"
      aria-label="Hero — слои цифрового продукта"
      data-exploded-stage="0"
    >
      <div className="hero-exploded__sticky">
        <div className="container hero-exploded__layout">
          <BaselineHeroCopy />
          <ExplodedProductScene />
        </div>
      </div>
    </section>
  );
}

const meta = {
  title: "Секции главной/Hero — альтернативы",
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "canvas" },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const BaselineHero: Story = {
  name: "0 · Портрет и аналитика",
  render: () => <BaselineHeroSection />,
};

export const PortraitAsSignature: Story = {
  name: "1 · Портрет как подпись",
  render: () => <PortraitSignature />,
};

export const EditorialPortrait: Story = {
  name: "2 · Редакционная рамка",
  render: () => <EditorialFrame />,
};

export const WorkbenchPortrait: Story = {
  name: "3 · Рабочая сцена",
  render: () => <WorkbenchScene />,
};

export const AnalyticsTiltScene: Story = {
  name: "4 · 3D-аналитика",
  render: () => <AnalyticsTiltHero />,
};

export const ScrollWorkshopScene: Story = {
  name: "5 · Scroll-мастерская",
  render: () => <ScrollWorkshopHero />,
};

export const ExplodedProductLayers: Story = {
  name: "6 · Слои продукта",
  render: () => <ExplodedLayersHero />,
};
