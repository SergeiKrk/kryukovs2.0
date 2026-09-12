import { useEffect, useState } from "react";

export default function Navigation() {
  const [motion, setMotion] = useState(true);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      let saved: string | null = null;
      try { saved = sessionStorage.getItem("immersive-motion"); } catch { /* Storage may be unavailable. */ }
      setMotion(!media.matches && saved !== "off");
    };
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const toggle = () => {
    const next = !motion;
    setMotion(next);
    try { sessionStorage.setItem("immersive-motion", next ? "on" : "off"); } catch { /* The toggle still works without storage. */ }
    window.dispatchEvent(new CustomEvent("immersive:motion", { detail: next }));
  };
  return (
    <header className="iv-nav">
      <a className="iv-logo" href="/v2/" aria-label="Сергей Крюков — главная">К<span>↗</span></a>
      <nav aria-label="Навигация второй версии">
        <a href="/v2/#work">Проекты</a>
        <a href="/v2/#services">Услуги</a>
        <a href="/v2/#contact">Контакт</a>
      </nav>
      <button className="iv-motion" type="button" aria-pressed={motion} onClick={toggle} title="Включить или выключить анимации">
        <span aria-hidden="true">{motion ? "◉" : "○"}</span><span>Анимации {motion ? "вкл" : "выкл"}</span>
      </button>
      <a className="iv-nav-cta" href="https://t.me/sergeikrk" target="_blank" rel="noreferrer">Обсудить проект <span aria-hidden="true">↗</span></a>
    </header>
  );
}
