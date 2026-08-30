import { useEffect, useState } from "react";
import { List, PaperPlaneTilt, X } from "@phosphor-icons/react";

const maxHref = "https://max.ru/u/f9LHodD0cOJnvKBT3lzI_frHwvBIZXJVtfvP_VynzhsCBdFg_ZGlsLzi1Gw";

const links = [
  { href: "/services/", label: "Услуги" },
  { href: "/#cases", label: "Кейсы" },
  { href: "/#process", label: "Процесс" },
  { href: "/#reliable", label: "Обо мне" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <a className="brand" href="/" aria-label="Сергей Крюков — главная">
          <span>K</span><span>S</span>
        </a>
        <nav className="desktop-nav" aria-label="Основная навигация">
          {links.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
        </nav>
        <div className="header-actions">
          <div className="header-contact-copy">
            <strong className="header-contact-kicker"><span>Напишите мне</span></strong>
            <span>Обсудим проект</span>
          </div>
          <div className="header-contact-links">
            <a className="header-contact-button header-telegram" href="https://t.me/sergeikrk" target="_blank" rel="noreferrer" aria-label="Написать Сергею в Telegram" title="Telegram">
              <PaperPlaneTilt aria-hidden="true" weight="fill" />
            </a>
            <a className="header-contact-button header-max" href={maxHref} target="_blank" rel="noreferrer" aria-label="Написать Сергею в MAX" title="MAX">
              <img src="/assets/max-logo-wikimedia.svg" alt="" width="1000" height="1000" />
            </a>
          </div>
        </div>
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X aria-hidden="true" /> : <List aria-hidden="true" />}
        </button>
      </div>
      <div id="mobile-navigation" className={`mobile-nav ${open ? "is-open" : ""}`} hidden={!open}>
        <nav className="container" aria-label="Мобильная навигация">
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</a>
          ))}
          <a className="button button-primary" href="https://t.me/sergeikrk" target="_blank" rel="noreferrer">
            <PaperPlaneTilt aria-hidden="true" weight="duotone" />
            Обсудить проект
          </a>
          <a className="button button-secondary button-max" href={maxHref} target="_blank" rel="noreferrer">
            <img src="/assets/max-logo-wikimedia.svg" alt="" width="1000" height="1000" /> Написать в MAX
          </a>
        </nav>
      </div>
    </header>
  );
}
