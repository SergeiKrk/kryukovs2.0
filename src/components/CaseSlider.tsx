import { useRef, useState } from "react";
import type { CSSProperties } from "react";
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
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const current = cases[active];

  const select = (next: number) => {
    const normalized = (next + cases.length) % cases.length;
    setActive(normalized);
    tabRefs.current[normalized]?.focus();
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
            onClick={() => setActive(index)}
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
        style={{ "--case-accent": current.accent, "--case-tint": current.tint } as CSSProperties}
      >
        <button className="case-arrow case-arrow-left" type="button" onClick={() => select(active - 1)} aria-label="Предыдущий кейс">
          <ArrowLeft aria-hidden="true" />
        </button>

        <div className="case-copy case-enter-copy" key={`copy-${current.name}`}>
          <p className="case-type">{current.type}</p>
          <h3>{current.name}</h3>
          <p className="case-title">{current.title}</p>
          <p className="case-description">{current.text}</p>
          <ul className="case-metrics" aria-label="Показатели проекта">
            {current.metrics.map((metric) => {
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

        <div className="case-media" key={`media-${current.name}`} aria-label={`Скриншоты проекта ${current.name}`}>
          <RocketLaunch className="case-rocket" aria-hidden="true" weight="duotone" />
          <figure className="desktop-shot case-enter-desktop">
            <div className="desktop-screen"><img src={current.desktop} alt={`${current.name}: версия для компьютера`} width="1440" height="900" /></div>
            <div className="laptop-base" aria-hidden="true" />
          </figure>
          <figure className="mobile-shot case-enter-mobile">
            <div className="phone-screen"><img src={current.mobile} alt={`${current.name}: мобильная версия`} width="390" height="844" /></div>
          </figure>
        </div>

        <button className="case-arrow case-arrow-right" type="button" onClick={() => select(active + 1)} aria-label="Следующий кейс">
          <ArrowRight aria-hidden="true" />
        </button>
      </div>
      <p className="case-note">* Для проектов без доступа к аналитике показаны ориентировочные значения для прототипа.</p>
    </div>
  );
}
