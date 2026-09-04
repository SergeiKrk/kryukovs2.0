import { useEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { ArrowLeft, ArrowRight, Calculator, ChartLineUp, Files, RocketLaunch } from "@phosphor-icons/react";

const cases = [
  {
    name: "Зелёная крона",
    type: "Корпоративный сайт",
    title: "Служба ухода за зелёными насаждениями",
    text: "Коммерческий сайт с каталогом услуг, контентной структурой и последующим SEO-аудитом.",
    metrics: [
      { value: "23", label: "услуги", icon: Calculator },
      { value: "27+", label: "страниц", icon: Files },
      { value: "≈1,6 тыс.", label: "посетителей/мес*", icon: ChartLineUp },
    ],
    desktop: "/assets/green-crown-desktop.png",
    mobile: "/assets/green-crown-mobile.png",
    href: "https://green-crown.ru/",
    accent: "#3b936b",
    tint: "#edf8f1",
  },
  {
    name: "SamogonCalc",
    type: "Веб-сервис",
    title: "Расчёты для винокуров и самогонщиков",
    text: "Собственный контентный продукт: калькуляторы, статьи и поисковая архитектура.",
    metrics: [
      { value: "12", label: "калькуляторов", icon: Calculator },
      { value: "86", label: "страниц", icon: Files },
      { value: "до 98,6 тыс.", label: "посетителей/мес", icon: ChartLineUp },
    ],
    desktop: "/assets/samogoncalc-desktop.png",
    mobile: "/assets/samogoncalc-mobile.png",
    href: "https://samogoncalc.ru/",
    accent: "#08a894",
    tint: "#eafaf7",
  },
  {
    name: "СЭС МСК",
    type: "Сайт услуг",
    title: "Сайт городской службы дезинфекции",
    text: "Разветвлённая структура услуг, адаптивные формы обращения и быстрый мобильный сценарий.",
    metrics: [
      { value: "22", label: "направления", icon: Calculator },
      { value: "25+", label: "страниц", icon: Files },
      { value: "≈2,8 тыс.", label: "посетителей/мес*", icon: ChartLineUp },
    ],
    desktop: "/assets/sesmsk-desktop.png",
    mobile: "/assets/sesmsk-mobile.png",
    href: "https://sesmsk.su/",
    accent: "#EB6128",
    tint: "#fff0f4",
  },
  {
    name: "Росснаб73",
    type: "Лендинг",
    title: "Лендинг медицинского оборудования",
    text: "Один экран продаж превращён в структурированную презентацию продуктовой линейки.",
    metrics: [
      { value: "1", label: "лендинг", icon: Calculator },
      { value: "16", label: "товаров", icon: Files },
      { value: "≈900", label: "посетителей/мес*", icon: ChartLineUp },
    ],
    desktop: "/assets/medicaequip-desktop.png",
    mobile: "/assets/medicaequip-mobile.png",
    href: "https://medicaequip.netlify.app/",
    accent: "#2778c8",
    tint: "#eef6ff",
  },
  {
    name: "Промышленные альпинисты",
    type: "Сайт услуг",
    title: "Высотные работы в Ульяновске",
    text: "Сайт услуг с быстрым сценарием заявки и адаптивной подачей на мобильном устройстве.",
    metrics: [
      { value: "15+", label: "услуг", icon: Calculator },
      { value: "1 200", label: "объектов", icon: Files },
      { value: "≈1,2 тыс.", label: "посетителей/мес*", icon: ChartLineUp },
    ],
    desktop: "/assets/uslugialpinista-desktop.png",
    mobile: "/assets/uslugialpinista-mobile.png",
    href: "https://uslugialpinista.ru/",
    accent: "#ef7b27",
    tint: "#fff4e9",
  },
];

export default function CaseSlider() {
  const [active, setActive] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);
  const [direction, setDirection] = useState<"next" | "previous">("next");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (transitionTimer.current) clearTimeout(transitionTimer.current);
  }, []);

  const select = (next: number, focusTab = true) => {
    const normalized = (next + cases.length) % cases.length;
    if (normalized === active) return;

    const isPrevious = normalized === (active - 1 + cases.length) % cases.length
      || (normalized < active && !(active === cases.length - 1 && normalized === 0));

    if (transitionTimer.current) clearTimeout(transitionTimer.current);
    setDirection(isPrevious ? "previous" : "next");
    setPrevious(active);
    setActive(normalized);
    transitionTimer.current = setTimeout(() => setPrevious(null), 760);

    if (focusTab) tabRefs.current[normalized]?.focus();
  };

  const tiltDevice = (event: ReactPointerEvent<HTMLElement>, intensity: number) => {
    if (event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    event.currentTarget.style.setProperty("--device-tilt-x", `${(-y * intensity).toFixed(2)}deg`);
    event.currentTarget.style.setProperty("--device-tilt-y", `${(x * intensity).toFixed(2)}deg`);
    event.currentTarget.style.setProperty("--device-glow-x", `${((x + 1) / 2 * 100).toFixed(1)}%`);
    event.currentTarget.style.setProperty("--device-glow-y", `${((y + 1) / 2 * 100).toFixed(1)}%`);
  };

  const resetDeviceTilt = (event: ReactPointerEvent<HTMLElement>) => {
    event.currentTarget.style.removeProperty("--device-tilt-x");
    event.currentTarget.style.removeProperty("--device-tilt-y");
    event.currentTarget.style.removeProperty("--device-glow-x");
    event.currentTarget.style.removeProperty("--device-glow-y");
  };

  const renderSlide = (index: number, state: "current" | "previous") => {
    const item = cases[index];
    const slideClass = `case-slide is-${state} case-direction-${direction}`;

    return (
      <div
        key={`${state}-${item.name}`}
        className={slideClass}
        aria-hidden={state === "previous" ? "true" : undefined}
        style={{ "--case-accent": item.accent, "--case-tint": item.tint } as CSSProperties}
      >
        <div className="case-copy">
          <p className="case-type">{item.type}</p>
          <h3>{item.name}</h3>
          <p className="case-title">{item.title}</p>
          <p className="case-description">{item.text}</p>
          <ul className="case-metrics" aria-label="Показатели проекта">
            {item.metrics.map((metric) => {
              const MetricIcon = metric.icon;
              return (
                <li key={metric.label}>
                  <MetricIcon aria-hidden="true" weight="duotone" />
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="case-media" aria-label={`Скриншоты проекта ${item.name}`}>
          <RocketLaunch className="case-rocket" aria-hidden="true" weight="duotone" />
          <figure
            className="desktop-shot"
            onPointerMove={(event) => tiltDevice(event, 5.5)}
            onPointerLeave={resetDeviceTilt}
          >
            <div className="desktop-screen"><img src={item.desktop} alt={`${item.name}: версия для компьютера`} width="1440" height="900" /></div>
            <div className="laptop-hinge" aria-hidden="true" />
            <div className="laptop-base" aria-hidden="true" />
          </figure>
          <figure
            className="mobile-shot"
            onPointerMove={(event) => tiltDevice(event, 8)}
            onPointerLeave={resetDeviceTilt}
          >
            <div className="phone-screen"><img src={item.mobile} alt={`${item.name}: мобильная версия`} width="390" height="844" /></div>
            <span className="phone-controls" aria-hidden="true" />
          </figure>
        </div>
      </div>
    );
  };

  const handleTabsKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      select(active + 1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      select(active - 1);
    }
  };

  return (
    <div className="case-slider">
      <div className="case-tabs" role="tablist" aria-label="Выбрать кейс" onKeyDown={handleTabsKeyDown}>
        {cases.map((item, index) => (
          <button
            key={item.name}
            ref={(node) => { tabRefs.current[index] = node; }}
            type="button"
            id={`case-tab-${index}`}
            role="tab"
            aria-selected={index === active}
            aria-controls="case-panel"
            tabIndex={index === active ? 0 : -1}
            className={index === active ? "is-active" : ""}
            onClick={() => select(index, false)}
          >
            <span aria-hidden="true" />{item.name}
          </button>
        ))}
      </div>

      <div
        id="case-panel"
        className="case-panel"
        role="tabpanel"
        aria-labelledby={`case-tab-${active}`}
        aria-live="polite"
      >
        <button className="case-arrow case-arrow-left" type="button" onClick={() => select(active - 1)} aria-label="Предыдущий кейс">
          <ArrowLeft aria-hidden="true" />
        </button>

        <div className="case-stage">
          {previous !== null && renderSlide(previous, "previous")}
          {renderSlide(active, "current")}
        </div>

        <button className="case-arrow case-arrow-right" type="button" onClick={() => select(active + 1)} aria-label="Следующий кейс">
          <ArrowRight aria-hidden="true" />
        </button>
      </div>
      <p className="case-note">* Для проектов без доступа к аналитике показаны ориентировочные значения для прототипа.</p>
    </div>
  );
}
