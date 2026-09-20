import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, type ReactNode } from "react";
import "@fontsource-variable/oswald";
import "../../styles/v3.css";
import "./v3-storybook.css";
import ProjectQuiz from "./ProjectQuiz";
import Navigation from "./Navigation";
import { capabilities, faq, pricing, processSteps, projects, proofs, services } from "../../data/v3";

const rockFiles = ["rock-1.png", "rock-2.png", "rock-3.png", "rock-4.png", "rock-2.png", "rock-4.png"];

function V3Frame({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.documentElement.dataset.design = "cinematic";
    document.documentElement.dataset.motion = "off";
  }, []);

  return <div className="v3 v3-storybook-static">{children}</div>;
}

function StorybookPage({ children, withNavigation = false }: { children: ReactNode; withNavigation?: boolean }) {
  return <V3Frame>{withNavigation && <Navigation />}{children}</V3Frame>;
}

function HeroSection() {
  return (
    <section className="v3-hero" aria-labelledby="storybook-v3-hero-title">
      <div className="v3-shell v3-hero__grid">
        <div className="v3-hero__copy">
          <p className="v3-kicker">Проекты от 45 000 ₽</p>
          <h1 id="storybook-v3-hero-title">
            <span className="v3-hero__title-outline"><span>Создание сайтов</span><span>под ключ</span></span>
          </h1>
          <p className="v3-hero__support">Для бизнеса и брендов: сильный дизайн, разработка и SEO у одного специалиста.</p>
          <div className="v3-actions">
            <a className="v3-button v3-button--primary v3-button--hero" href="#storybook-calculator">Рассчитать проект</a>
            <a className="v3-button v3-button--quiet" href="#storybook-work">Смотреть работы <span aria-hidden="true">↘</span></a>
          </div>
        </div>

        <figure className="v3-hero__visual">
          <div className="v3-hero__rocks" aria-hidden="true">
            {rockFiles.map((file, index) => (
              <span className={`v3-hero__rock v3-hero__rock--${index + 1}`} key={file + index}>
                <img src={`/assets/v3/${file}`} alt="" width="280" height="280" />
              </span>
            ))}
          </div>
          <img className="v3-hero__laptop" src="/assets/v3/development-laptop.png" alt="" width="1024" height="1024" />
          <img className="v3-hero__head" src="/assets/v3/hero-stone-head-left.png" alt="Каменная голова как образ цельного цифрового продукта" width="1024" height="1024" />
        </figure>
      </div>

      <ProofStrip />
    </section>
  );
}

function ProofStrip() {
  return (
    <div className="v3-shell v3-proof-strip" aria-label="Проверенные факты">
      <div className="v3-proof-strip__grid">
        {proofs.map(([value, label], index) => index === 2 ? (
          <a className="v3-proof-strip__item v3-proof-strip__item--featured" href="#storybook-calculator" aria-label={`${value}, ${label}`} key={value}>
            <strong>{value}</strong>
            <span>{label}</span>
          </a>
        ) : (
          <p className="v3-proof-strip__item" key={value}>
            <strong>{value}</strong>
            <span>{label}</span>
          </p>
        ))}
      </div>
    </div>
  );
}

function CapabilitiesSection() {
  return (
    <section className="v3-capabilities" aria-labelledby="storybook-v3-capabilities-title">
      <div className="v3-capabilities__pin">
        <div className="v3-shell">
          <div className="v3-capabilities__grid">
            <div className="v3-capabilities__intro">
              <p className="v3-kicker">Три направления, единый результат</p>
              <h2 id="storybook-v3-capabilities-title">Сайт работает как единое целое</h2>
              <p>Не нужно координировать отдельных дизайнеров, разработчиков и SEO-специалистов.</p>
            </div>
            <div className="v3-capabilities__stage">
              <div className="v3-capabilities__rocks" aria-hidden="true">
                {rockFiles.concat(rockFiles, rockFiles).map((file, index) => (
                  <picture key={file + index}>
                    <img className={`v3-capabilities__rock v3-capabilities__rock--${(index % 3) + 1}`} src={`/assets/v3/${file}`} alt="" width="512" height="512" />
                  </picture>
                ))}
              </div>
              <img className="v3-capabilities__head" src="/assets/v3/hero-stone-head.png" alt="Каменная голова в центре композиции" width="512" height="512" />
              <div className="v3-capabilities__list">
                {capabilities.map((capability) => (
                  <article className="v3-capability" key={capability.word}>
                    <h3 className="v3-capability__word" aria-label={capability.word}>
                      {Array.from(capability.word).map((character, index) => {
                        const glyph = capability.glyphs[index];
                        return glyph ? (
                          <span className="v3-capability__glyph" aria-hidden="true" key={`${character}-${index}`}>
                            <img src={glyph.src} alt="" width="512" height="512" />
                          </span>
                        ) : <span aria-hidden="true" key={`${character}-${index}`}>{character}</span>;
                      })}
                    </h3>
                    <p>{capability.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProcessSection() {
  return (
    <section className="v3-process v3-section" aria-labelledby="storybook-v3-process-title">
      <div className="v3-shell">
        <div className="v3-personal">
          <figure className="v3-identity__transform v3-personal__portrait">
            <img className="v3-identity__final" src="/assets/v3/sergey-kryukov.png" alt="Сергей Крюков после перехода от образа к личному авторству" width="1600" height="900" />
            <div className="v3-personal__copy">
              <p className="v3-kicker">Личная ответственность</p>
              <h2 id="storybook-v3-process-title">От обсуждения до запуска - работаю с проектом сам</h2>
              <p className="v3-personal__description">Соединяю продуктовый взгляд, визуальный дизайн и разработку. Вы всегда понимаете, с кем обсуждать решение и кто отвечает за его качество.</p>
            </div>
          </figure>
          <p className="v3-personal__signature">
            <span className="v3-personal__signature-name">Крюков Сергей</span>
            <span className="v3-personal__signature-roles"><strong>Fullstack-разработка</strong> <span aria-hidden="true">·</span> Маркетинг <span aria-hidden="true">·</span> SEO</span>
          </p>
        </div>

        <ol className="v3-process__steps">
          {processSteps.map((step) => (
            <li className="v3-process__step" key={step.title}>
              <figure><img src={step.image} alt="" width="512" height="512" /></figure>
              <div><h3>{step.title}</h3><p>{step.text}</p></div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function IdentitySection() {
  return (
    <section className="v3-identity v3-section" aria-labelledby="storybook-v3-identity-title">
      <div className="v3-shell">
        <div className="v3-section-heading v3-section-heading--split">
          <div><p className="v3-kicker">От образа к реализации</p><h2 id="storybook-v3-identity-title">Характер бренда становится работающим кодом</h2></div>
          <p>Кинематографичная подача остаётся частью понятного коммерческого сайта, а не заменяет его содержание.</p>
        </div>
        <div className="v3-identity__media v3-identity__media--single">
          <figure className="v3-identity__laptop">
            <img src="/assets/v3/development-laptop.png" alt="Ноутбук с редактором кода проекта" width="1024" height="1024" />
            <figcaption>React, TypeScript и Astro для производственной разработки</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

function WorkSection() {
  return (
    <section id="storybook-work" className="v3-work v3-section" aria-labelledby="storybook-v3-work-title">
      <div className="v3-shell">
        <div className="v3-work__pin">
          <div className="v3-section-heading v3-section-heading--split">
            <div><p className="v3-kicker">Избранные проекты</p><h2 id="storybook-v3-work-title">Пять задач, пять работающих интерфейсов</h2></div>
            <p>Только реальные локальные скриншоты. Без оценок трафика и цифр, которые нельзя подтвердить.</p>
          </div>
          <div className="v3-work__viewport">
            <div className="v3-work__track">
              {projects.map((project, index) => (
                <article className={`v3-project${index === 0 ? " v3-project--lead" : ""}`} key={project.name}>
                  <a href={project.href} target="_blank" rel="noreferrer" aria-label={`Открыть проект ${project.name}`}>
                    <figure><img src={project.image} alt={`Скриншот десктопной версии сайта ${project.name}`} width="1440" height="900" loading="lazy" /></figure>
                    <div className="v3-project__content">
                      <div><span>{String(index + 1).padStart(2, "0")}</span><p>{project.category}</p></div>
                      <h3>{project.name}</h3>
                      <p>{project.description}</p>
                      <strong>Открыть сайт <span aria-hidden="true">↗</span></strong>
                    </div>
                  </a>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  return (
    <section className="v3-services v3-section" aria-labelledby="storybook-v3-services-title">
      <div className="v3-shell">
        <div className="v3-section-heading v3-section-heading--split">
          <div><p className="v3-kicker">Форматы работы</p><h2 id="storybook-v3-services-title">Под задачу, а не под готовый пакет</h2></div>
          <p>Состав работ фиксируем после короткого знакомства с продуктом и исходными материалами.</p>
        </div>
        <div className="v3-services__list">
          {services.map((service, index) => (
            <article key={service.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section className="v3-pricing v3-section" aria-labelledby="storybook-v3-pricing-title">
      <div className="v3-shell">
        <div className="v3-section-heading v3-section-heading--split">
          <div><p className="v3-kicker">Рабочие ориентиры</p><h2 id="storybook-v3-pricing-title">Стоимость зависит от масштаба</h2></div>
          <p>Это стартовые ориентиры, а не публичная оферта. Финальная оценка появляется после уточнения состава и сроков.</p>
        </div>
        <div className="v3-pricing__grid">
          {pricing.map((tier) => (
            <article className={`v3-price${tier.featured ? " v3-price--featured" : ""}`} key={tier.name}>
              <div><p>{tier.name}</p>{tier.featured && <span>Частый выбор</span>}</div>
              <strong>{tier.price}</strong>
              <p>{tier.text}</p>
              <ul>{tier.includes.map((item) => <li key={item}>{item}</li>)}</ul>
              <a className="v3-button v3-button--quiet" href="#storybook-calculator">Обсудить состав</a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section className="v3-faq v3-section" aria-labelledby="storybook-v3-faq-title">
      <div className="v3-shell v3-faq__grid">
        <div><p className="v3-kicker">До первого сообщения</p><h2 id="storybook-v3-faq-title">Ответы на частые вопросы</h2></div>
        <div className="v3-faq__list">
          {faq.map(([question, answer], index) => (
            <details key={question} open={index === 0}>
              <summary><span>{String(index + 1).padStart(2, "0")}</span>{question}<strong aria-hidden="true">+</strong></summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function CalculatorSection() {
  return (
    <section id="storybook-calculator" className="v3-quiz v3-section" aria-labelledby="storybook-v3-quiz-title">
      <div className="v3-shell">
        <div className="v3-section-heading v3-section-heading--split">
          <div><p className="v3-kicker">Калькулятор проекта</p><h2 id="storybook-v3-quiz-title">Соберём контекст за пять шагов</h2></div>
          <p>Ответы помогут подготовить первый ориентир по формату, составу работ и следующему шагу.</p>
        </div>
        <ProjectQuiz />
      </div>
    </section>
  );
}

function FooterSection() {
  return (
    <footer className="v3-footer" aria-labelledby="storybook-v3-footer-title">
      <div className="v3-shell">
        <p className="v3-kicker">Следующий проект</p>
        <h2 id="storybook-v3-footer-title">Есть задача.<br /><a href="https://t.me/sergeikrk" target="_blank" rel="noreferrer">Давайте обсудим <span aria-hidden="true">↗</span></a></h2>
        <div className="v3-footer__grid">
          <p>Расскажите о продукте, бренде или сайте, который пора обновить. Отвечу на вопросы и предложу первый шаг.</p>
          <nav aria-label="Контакты">
            <a href="https://t.me/sergeikrk" target="_blank" rel="noreferrer">Telegram ↗</a>
            <a href="mailto:ksv.progect@gmail.com">ksv.progect@gmail.com ↗</a>
            <a href="tel:+79176103476">+7 917 610-34-76</a>
          </nav>
        </div>
        <div className="v3-footer__line"><span>© 2026 Сергей Крюков</span><a href="#storybook-v3-hero-title">Наверх ↑</a></div>
      </div>
    </footer>
  );
}

function FullPage() {
  return (
    <StorybookPage withNavigation>
      <HeroSection />
      <CapabilitiesSection />
      <ProcessSection />
      <IdentitySection />
      <WorkSection />
      <ServicesSection />
      <PricingSection />
      <FaqSection />
      <CalculatorSection />
      <FooterSection />
    </StorybookPage>
  );
}

const meta = {
  title: "V3 / Sections",
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "canvas", values: [{ name: "canvas", value: "#0c0e0f" }] },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const FullPageV3: Story = { name: "Full page", render: () => <FullPage /> };
export const Hero: Story = { render: () => <StorybookPage withNavigation><HeroSection /></StorybookPage> };
export const Capabilities: Story = { render: () => <StorybookPage><CapabilitiesSection /></StorybookPage> };
export const Process: Story = { render: () => <StorybookPage><ProcessSection /></StorybookPage> };
export const Identity: Story = { render: () => <StorybookPage><IdentitySection /></StorybookPage> };
export const Work: Story = { render: () => <StorybookPage><WorkSection /></StorybookPage> };
export const Services: Story = { render: () => <StorybookPage><ServicesSection /></StorybookPage> };
export const Pricing: Story = { render: () => <StorybookPage><PricingSection /></StorybookPage> };
export const FAQ: Story = { render: () => <StorybookPage><FaqSection /></StorybookPage> };
export const Calculator: Story = { render: () => <StorybookPage><CalculatorSection /></StorybookPage> };
export const Footer: Story = { render: () => <StorybookPage><FooterSection /></StorybookPage> };
