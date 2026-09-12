import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowRight, Headset, PaperPlaneTilt } from "@phosphor-icons/react";
import { useState } from "react";

function ButtonGallery() {
  const [statusLabel, setStatusLabel] = useState("Готово к действию");

  return (
    <main className="button-gallery">
      <header>
        <p className="eyebrow">Компоненты</p>
        <h1>Кнопки</h1>
        <p>Варианты действий, которые уже используются на сайте.</p>
      </header>

      <section aria-labelledby="button-hero">
        <h2 id="button-hero">Главное действие в Hero</h2>
        <div className="hero-actions">
          <a className="button button-primary" href="#hero-contact"><PaperPlaneTilt aria-hidden="true" weight="duotone" />Обсудить проект</a>
          <a className="button button-link" href="#hero-cases">Смотреть кейсы <ArrowRight aria-hidden="true" /></a>
        </div>
      </section>

      <section aria-labelledby="button-emphasis">
        <h2 id="button-emphasis">Основные варианты</h2>
        <div className="button-gallery-row">
          <a className="button button-primary" href="#primary">Основное действие</a>
          <a className="button button-secondary" href="#secondary">Второе действие</a>
          <a className="button button-link" href="#link">Текстовая ссылка <ArrowRight aria-hidden="true" /></a>
        </div>
      </section>

      <section aria-labelledby="button-icons">
        <h2 id="button-icons">С иконками</h2>
        <div className="button-gallery-row">
          <a className="button button-primary" href="#telegram"><PaperPlaneTilt aria-hidden="true" weight="duotone" />Обсудить проект</a>
          <a className="button button-secondary" href="#brief"><Headset aria-hidden="true" weight="duotone" />Отправить бриф</a>
          <a className="button button-secondary button-max" href="#max"><img src="/assets/max-logo-colored.svg" alt="" width="80" height="32" />Написать в MAX</a>
        </div>
      </section>

      <section aria-labelledby="button-statuses">
        <h2 id="button-statuses">Состояния</h2>
        <div className="button-gallery-row">
          <button className="button button-primary" type="button" onClick={() => setStatusLabel("Действие выполнено")}>{statusLabel}</button>
          <button className="button button-primary" type="button" disabled>Недоступно</button>
        </div>
      </section>

      <section aria-labelledby="button-messengers">
        <h2 id="button-messengers">Компактные контакты в шапке</h2>
        <div className="button-gallery-row button-gallery-social">
          <a className="header-contact-button header-telegram" href="#telegram" aria-label="Написать в Telegram" title="Telegram"><PaperPlaneTilt aria-hidden="true" weight="fill" /></a>
          <a className="header-contact-button header-max" href="#max" aria-label="Написать в MAX" title="MAX"><img src="/assets/max-logo-wikimedia.svg" alt="" width="1000" height="1000" /></a>
        </div>
      </section>
    </main>
  );
}

const meta = {
  title: "Компоненты/Кнопки",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = { render: () => <ButtonGallery /> };
