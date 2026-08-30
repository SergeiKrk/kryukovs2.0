import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowRight, ChartLineUp, PaperPlaneTilt } from "@phosphor-icons/react";
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
