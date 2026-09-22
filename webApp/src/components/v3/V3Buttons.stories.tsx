import type { Meta, StoryObj } from "@storybook/react-vite";
import { Headset, PaperPlaneTilt } from "@phosphor-icons/react";
import { useEffect } from "react";
import "@fontsource-variable/oswald";
import "../../styles/v3.css";
import "./v3-storybook.css";
import { MAX_HREF, TELEGRAM_HREF } from "./messengerLinks";

function CompactContacts() {
  return (
    <div className="v3-nav__contact" aria-label="Контакты">
      <div className="v3-nav__contact-copy">
        <strong><span>Напишите мне</span></strong>
        <span>Обсудим проект</span>
      </div>
      <div className="v3-nav__contact-links">
        <a className="v3-nav__contact-button v3-nav__contact-button--telegram" href={TELEGRAM_HREF} aria-label="Написать Сергею в Telegram" title="Telegram">
          <PaperPlaneTilt aria-hidden="true" weight="fill" />
        </a>
        <a className="v3-nav__contact-button v3-nav__contact-button--max" href={MAX_HREF} aria-label="Написать Сергею в MAX" title="MAX">
          <img src="/assets/max-logo-wikimedia.svg" alt="" width="1000" height="1000" />
        </a>
      </div>
    </div>
  );
}

function V3ButtonGallery() {
  useEffect(() => {
    document.documentElement.dataset.design = "cinematic";
    document.documentElement.dataset.motion = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "off" : "on";
  }, []);

  return (
    <main className="v3 v3-button-gallery">
      <div className="v3-shell">
        <header className="v3-button-gallery__header">
          <p className="v3-kicker">V3 / Компоненты</p>
          <h1>Кнопки и контакты</h1>
          <p>Плоские действия для тёмной кинематографичной канвы V3.</p>
        </header>

        <section className="v3-button-gallery__section" aria-labelledby="v3-button-icons-title">
          <h2 id="v3-button-icons-title">С иконками</h2>
          <div className="v3-button-gallery__row">
            <a className="v3-button v3-button--primary v3-button--icon" href="#telegram">
              <PaperPlaneTilt aria-hidden="true" weight="duotone" />
              Обсудить проект
            </a>
            <a className="v3-button v3-button--quiet v3-button--icon" href="#brief">
              <Headset aria-hidden="true" weight="duotone" />
              Отправить бриф
            </a>
            <a className="v3-button v3-button--quiet v3-button--icon" href={MAX_HREF} target="_blank" rel="noreferrer">
              <img src="/assets/max-logo-colored.svg" alt="" width="80" height="32" />
              Написать в MAX
            </a>
          </div>
        </section>

        <section className="v3-button-gallery__section" aria-labelledby="v3-button-contacts-title">
          <h2 id="v3-button-contacts-title">Компактные контакты в шапке</h2>
          <CompactContacts />
        </section>
      </div>
    </main>
  );
}

function MessengerLanding() {
  return (
    <main className="v3 v3-messengers">
      <div className="v3-messengers__inner">
        <p className="v3-kicker">Прямой контакт</p>
        <h1>Выберите мессенджер</h1>
        <p className="v3-messengers__description">Откройте удобный канал, чтобы сразу обсудить задачу.</p>
        <div className="v3-messengers__actions">
          <a className="v3-button v3-button--primary v3-button--icon" href={TELEGRAM_HREF} target="_blank" rel="noreferrer">
            <PaperPlaneTilt aria-hidden="true" weight="duotone" />
            Телеграм
          </a>
          <a className="v3-button v3-button--quiet v3-button--icon" href={MAX_HREF} target="_blank" rel="noreferrer">
            <img src="/assets/max-logo-colored.svg" alt="" width="80" height="32" />
            MAX
          </a>
        </div>
      </div>
    </main>
  );
}

const meta = {
  title: "V3 / Buttons",
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "canvas", values: [{ name: "canvas", value: "#0c0e0f" }] },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = { name: "All variants", render: () => <V3ButtonGallery /> };
export const MessengerLandingState: Story = { name: "Страница выбора мессенджера", render: () => <MessengerLanding /> };
