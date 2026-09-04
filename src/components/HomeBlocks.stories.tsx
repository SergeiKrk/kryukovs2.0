import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ArrowRight,
  Article,
  Browser,
  Browsers,
  CalendarBlank,
  ChartLineUp,
  Code,
  Eye,
  Headset,
  MagnifyingGlass,
  PaperPlaneTilt,
  PencilSimple,
  RocketLaunch,
  ShieldCheck,
  SquaresFour,
  User,
} from "@phosphor-icons/react";

function Journey() {
  const steps = [
    [Article, "Задача", "Упорядочиваю цель, рисую карту решения и расставляю приоритеты."],
    [Browsers, "Прототип", "Показываю структуру и сценарии, согласуем интерфейс и логику."],
    [Code, "Разработка", "Пишу чистый код, тестирую и подключаю необходимые сервисы."],
    [ChartLineUp, "Трафик", "Подключаю аналитику, запускаю SEO и улучшаю метрики."],
  ] as const;
  return (
    <section className="journey">
      <div className="container container-narrow">
        <div className="journey-board is-visible">
          <div className="journey-heading">
            <div>
              <p className="eyebrow">Один специалист — весь путь</p>
              <h2>Как задача превращается в работающий продукт</h2>
            </div>
            <div className="availability">
              <span className="availability-indicator" aria-hidden="true">
                <span className="availability-ping-wave animate-ping" />
                <span className="availability-ping-core" />
              </span>
              Свободен для проекта в сентябре 2026
            </div>
          </div>
          <div className="journey-steps">
            {steps.map(([Icon, title, text], index) => (
              <div key={title} style={{ display: "contents" }}>
                <article className={`journey-step ${index === 1 || index === 2 ? "journey-step-violet" : ""}`}>
                  <div className="journey-icon"><Icon aria-hidden="true" weight="duotone" /></div>
                  <div><h3>{title}</h3><p>{text}</p></div>
                </article>
                {index < steps.length - 1 && (
                  <span className={`journey-curve ${index === 1 ? "journey-curve-violet" : "journey-curve-green"}`} aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function WorkProcess() {
  const steps = [[MagnifyingGlass, "Разбираюсь в задаче", "Задаю вопросы, изучаю нишу и предлагаю лучшее решение."], [PencilSimple, "Проектирую", "Согласовываем прототип, структуру и UI/UX-подход."], [Eye, "Показываю результат", "Делаю итерации, учитываю обратную связь и фиксирую договорённости."], [RocketLaunch, "Запускаю и поддерживаю", "Публикую, настраиваю аналитику и поддерживаю 14 дней."]] as const;
  return <section className="section section-tight"><div className="container container-narrow"><div className="section-heading"><div><p className="eyebrow">Как я работаю</p><h2>Короткими понятными циклами</h2></div><p>Вы видите промежуточный результат и понимаете, что происходит с задачей.</p></div><div className="work-grid">{steps.map(([Icon, title, text], index) => <article className="work-item" data-step={index + 1} key={title}><Icon aria-hidden="true" weight="duotone" /><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>;
}

function StartCards() {
  const cards = [[Browser, "Новый сайт", "Маркетинговый сайт, лендинг или корпоративный проект.", "/services/web-development"], [SquaresFour, "Веб-приложение", "Сервис, личный кабинет, калькулятор или сложный инструмент.", "/services/react-apps"], [ChartLineUp, "Доработка и SEO", "Улучшение существующего сайта, скорость, трафик и конверсия.", "/services/seo-audit"]] as const;
  return <section className="section section-soft"><div className="container"><div className="start-panel"><p className="eyebrow">С чего начнём</p><h2>Выберите ближайшую задачу</h2><div className="start-grid">{cards.map(([Icon, title, text, href]) => <a className="start-card" href={href} key={title}><Icon className="start-icon" aria-hidden="true" weight="duotone" /><strong>{title}</strong><span>{text}</span><ArrowRight className="start-arrow" aria-hidden="true" /></a>)}</div></div></div></section>;
}

function Reliability() {
  const items = [[User, "10+ лет production-разработки", "React, TypeScript, Astro, продуктовый подход и современные практики."], [CalendarBlank, "1,5 года в финтехе", "Командная разработка, Contract First, код-ревью и дизайн-система."], [ShieldCheck, "14 дней поддержки", "Помогаю после запуска и не оставляю вас один на один с результатом."]] as const;
  return <section className="section section-tight"><div className="container container-narrow"><div className="reliability"><p className="eyebrow">Доказательства</p><h2>Почему со мной надёжно</h2><div className="reliable-grid">{items.map(([Icon, title, text]) => <article className="reliable-item" key={title}><Icon aria-hidden="true" weight="duotone" /><div><h3>{title}</h3><p>{text}</p></div></article>)}</div></div></div></section>;
}

function CtaPanel() {
  return <section className="section"><div className="container cta-panel"><div><h2>Покажите задачу — предложу вариант решения</h2><p>Обсудим цели, сроки и подход. Отвечаю в течение дня.</p></div><div className="cta-actions"><a className="button button-primary" href="https://t.me/sergeikrk"><PaperPlaneTilt aria-hidden="true" weight="duotone" />Написать в Telegram</a><a className="button button-secondary" href="/contacts"><Headset aria-hidden="true" weight="duotone" />Отправить бриф</a></div><img className="cta-photo" src="/assets/sergey-look.webp" alt="Сергей Крюков" width="832" height="900" /></div></section>;
}

const meta = { title: "Секции главной", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const JourneySection: Story = { render: () => <Journey /> };
export const WorkProcessSection: Story = { render: () => <WorkProcess /> };
export const StartCardsSection: Story = { render: () => <StartCards /> };
export const ReliabilitySection: Story = { render: () => <Reliability /> };
export const CallToAction: Story = { render: () => <CtaPanel /> };
