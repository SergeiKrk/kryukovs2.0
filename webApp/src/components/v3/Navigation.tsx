import { useEffect, useRef, useState } from "react";

const links = [
  ["Работы", "#work"],
  ["Подход", "#process"],
  ["Услуги", "#services"],
  ["Стоимость", "#pricing"],
  ["Ответы", "#faq"],
] as const;

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [motionEnabled, setMotionEnabled] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = (notifyMotion = true) => {
      let saved: string | null = null;
      try {
        saved = sessionStorage.getItem("v3-motion");
      } catch {
        // The page remains usable when storage is unavailable.
      }
      const reduced = preference.matches;
      const next = reduced ? false : saved ? saved === "on" : true;
      setReducedMotion(reduced);
      setMotionEnabled(next);
      document.documentElement.dataset.motion = next ? "on" : "off";
      if (notifyMotion) {
        window.dispatchEvent(new CustomEvent("v3:motion", { detail: { enabled: next } }));
      }
    };
    const handlePreferenceChange = () => syncPreference(true);
    syncPreference(false);
    preference.addEventListener("change", handlePreferenceChange);
    return () => preference.removeEventListener("change", handlePreferenceChange);
  }, []);

  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    const previousOverflow = document.body.style.overflow;
    const focusable = panel?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    const items = focusable ? Array.from(focusable) : [];
    document.body.style.overflow = "hidden";
    items[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        window.requestAnimationFrame(() => menuButtonRef.current?.focus());
        return;
      }
      if (event.key !== "Tab" || items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const closeMenu = () => setOpen(false);
  const toggleMotion = () => {
    const next = !motionEnabled;
    setMotionEnabled(next);
    document.documentElement.dataset.motion = next ? "on" : "off";
    try {
      sessionStorage.setItem("v3-motion", next ? "on" : "off");
    } catch {
      // The hook still updates the current document without storage.
    }
    window.dispatchEvent(new CustomEvent("v3:motion", { detail: { enabled: next } }));
  };

  return (
    <header className={`v3-nav${open ? " is-open" : ""}`}>
      <div className="v3-nav__bar">
        <a className="v3-nav__brand" href="/v3/" aria-label="Сергей Крюков, главная третьей версии">
          KSV<span>•</span>
        </a>
        <button
          ref={menuButtonRef}
          className="v3-nav__menu-button"
          type="button"
          aria-expanded={open}
          aria-controls="v3-menu"
          onClick={() => setOpen((value) => !value)}
        >
          <span>{open ? "Закрыть" : "Меню"}</span>
          <span className="v3-nav__menu-mark" aria-hidden="true">{open ? "×" : "+"}</span>
        </button>
        <a className="v3-nav__cta" href="#calculator" onClick={closeMenu}>Рассчитать проект</a>
      </div>

      <div ref={panelRef} className="v3-nav__panel" id="v3-menu" hidden={!open}>
        <nav className="v3-nav__links" aria-label="Навигация третьей версии">
          {links.map(([label, href], index) => (
            <a href={href} onClick={closeMenu} key={href}>
              <span>{String(index + 1).padStart(2, "0")}</span>{label}
            </a>
          ))}
        </nav>
        <div className="v3-nav__panel-bottom">
          <button
            className="v3-nav__motion"
            type="button"
            aria-pressed={motionEnabled}
            onClick={toggleMotion}
            disabled={reducedMotion}
            data-v3-motion-toggle
          >
            {reducedMotion ? "Анимация: ограничена системой" : `Анимация: ${motionEnabled ? "включена" : "выключена"}`}
          </button>
          <a className="v3-nav__panel-cta" href="#calculator" onClick={closeMenu}>
            Рассчитать проект <span aria-hidden="true">↗</span>
          </a>
          <p>Сергей Крюков<br />Независимый дизайнер и разработчик</p>
        </div>
      </div>
      <noscript>
        <nav className="v3-nav__nojs" aria-label="Навигация без JavaScript">
          {links.map(([label, href]) => <a href={href} key={href}>{label}</a>)}
          <a href="#calculator">Рассчитать проект</a>
        </nav>
      </noscript>
    </header>
  );
}
