import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { PaperPlaneTilt } from "@phosphor-icons/react";
import { gsap } from "gsap";

const maxHref = "https://max.ru/u/f9LHodD0cOJnvKBT3lzI_frHwvBIZXJVtfvP_VynzhsCBdFg_ZGlsLzi1Gw";

const links = [
  ["Работы", "#work"],
  ["Подход", "#process"],
  ["Услуги", "#services"],
  ["Стоимость", "#pricing"],
  ["Ответы", "#faq"],
] as const;

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

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

  useIsomorphicLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel || !open) return;

    const menuLinks = Array.from(panel.querySelectorAll<HTMLElement>(".v3-nav__links a"));
    const panelBottom = panel.querySelector<HTMLElement>(".v3-nav__panel-bottom");
    let removeHoverListeners = () => {};
    const context = gsap.context(() => {
      if (reducedMotion || !motionEnabled) {
        const animatedTargets = [panel, ...menuLinks, panelBottom].filter(
          (target): target is HTMLElement => Boolean(target),
        );
        gsap.set(animatedTargets, {
          autoAlpha: 1,
          clearProps: "transform,clipPath,opacity,visibility",
        });
        return;
      }

      const entrance = gsap.timeline({ defaults: { ease: "power3.out" } });
      entrance.fromTo(
        panel,
        { autoAlpha: 0, yPercent: -3, clipPath: "inset(0 0 100% 0)" },
        { autoAlpha: 1, yPercent: 0, clipPath: "inset(0 0 0% 0)", duration: 0.68 },
      );
      entrance.fromTo(
        menuLinks,
        { autoAlpha: 0, y: 28 },
        { autoAlpha: 1, y: 0, duration: 0.52, stagger: 0.065 },
        "-=0.38",
      );
      if (panelBottom) {
        entrance.fromTo(panelBottom, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.42 }, "-=0.28");
      }

      const animateLink = (target: EventTarget | null, y: number, duration: number) => {
        if (target instanceof HTMLElement) {
          gsap.to(target, { y, duration, ease: "power2.out", overwrite: "auto" });
        }
      };
      const enter = (event: Event) => animateLink(event.currentTarget, -5, 0.24);
      const leave = (event: Event) => animateLink(event.currentTarget, 0, 0.32);

      menuLinks.forEach((link) => {
        link.addEventListener("mouseenter", enter);
        link.addEventListener("mouseleave", leave);
        link.addEventListener("focus", enter);
        link.addEventListener("blur", leave);
      });

      removeHoverListeners = () => {
        menuLinks.forEach((link) => {
          link.removeEventListener("mouseenter", enter);
          link.removeEventListener("mouseleave", leave);
          link.removeEventListener("focus", enter);
          link.removeEventListener("blur", leave);
        });
      };
    }, panel);

    return () => {
      removeHoverListeners();
      context.revert();
    };
  }, [open, reducedMotion, motionEnabled]);

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
        <div className="v3-nav__contact" aria-label="Контакты">
          <div className="v3-nav__contact-copy">
            <strong><span>Напишите мне</span></strong>
            <span>Обсудим проект</span>
          </div>
          <div className="v3-nav__contact-links">
            <a
              className="v3-nav__contact-button v3-nav__contact-button--telegram"
              href="https://t.me/sergeikrk"
              target="_blank"
              rel="noreferrer"
              aria-label="Написать Сергею в Telegram"
              title="Telegram"
            >
              <PaperPlaneTilt aria-hidden="true" weight="fill" />
            </a>
            <a
              className="v3-nav__contact-button v3-nav__contact-button--max"
              href={maxHref}
              target="_blank"
              rel="noreferrer"
              aria-label="Написать Сергею в MAX"
              title="MAX"
            >
              <img src="/assets/max-logo-wikimedia.svg" alt="" width="1000" height="1000" />
            </a>
          </div>
        </div>
        <a className="v3-nav__cta" href="#calculator" onClick={closeMenu}>Рассчитать проект</a>
        <button
          ref={menuButtonRef}
          className="v3-nav__menu-button"
          type="button"
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={open}
          aria-controls="v3-menu"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="v3-nav__menu-mark" aria-hidden="true">
            <svg className="v3-nav__menu-ring" viewBox="0 0 68 68" focusable="false">
              <circle className="v3-nav__menu-ring-base" cx="34" cy="34" r="31" />
              <path className="v3-nav__menu-ring-path" d="M34 3C16.88 3 3 16.88 3 34s13.88 31 31 31 31-13.88 31-31S51.12 3 34 3Z" />
            </svg>
            <span className="v3-nav__menu-line v3-nav__menu-line--top" />
            <span className="v3-nav__menu-line v3-nav__menu-line--middle" />
            <span className="v3-nav__menu-line v3-nav__menu-line--bottom" />
          </span>
        </button>
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
