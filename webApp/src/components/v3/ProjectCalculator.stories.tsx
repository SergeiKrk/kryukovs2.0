import type { Meta, StoryObj } from "@storybook/react-vite";
import "../../styles/v3.css";
import "./v3-storybook.css";
import { offerCatalog } from "../../data/v3";
import ProjectCalculator from "./ProjectCalculator";
import { buildCalculatorSummary, createInitialCalculatorAnswers, type CalculatorAnswers } from "./calculatorHelpers.mjs";

const meta = {
  title: "V3/ProjectCalculator",
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="v3 v3-storybook-static">
        <section className="v3-calculator-section v3-section" aria-label="Состояние калькулятора">
          <div className="v3-shell"><Story /></div>
        </section>
      </div>
    ),
  ],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const siteAnswers: CalculatorAnswers = {
  ...createInitialCalculatorAnswers(),
  taskType: "site",
  siteFormat: "corporate-site",
  sitePages: "multi",
  siteDesign: "individual",
  siteEditor: "need",
  siteIntegrations: "complex",
  siteMaterials: "partial",
};

const complexToolAnswers: CalculatorAnswers = {
  ...createInitialCalculatorAnswers(),
  taskType: "tool",
  toolGoal: "Подбор решения по нескольким условиям",
  toolInputs: "Профиль пользователя, ограничения и каталог",
  toolDataSource: "external",
  toolScenarios: "exceptions",
  toolComplexity: "complex",
};

const discoveryAnswers: CalculatorAnswers = {
  ...createInitialCalculatorAnswers(),
  taskType: "web-app",
  webUsers: "Команда и клиенты",
  webRoles: "roles",
  webData: "Заказы, статусы и документы",
  webApi: "plannedApi",
};

export const FirstScreen: Story = {
  name: "Первый экран",
  render: () => <ProjectCalculator />,
};

export const SiteBranch: Story = {
  name: "Ветка сайта",
  render: () => <ProjectCalculator initialAnswers={{ taskType: "site" }} initialStep={1} />,
};

export const ComplexProject: Story = {
  name: "Сложный проект",
  render: () => <ProjectCalculator initialAnswers={complexToolAnswers} initialStep={1} />,
};

export const ResultWithPrice: Story = {
  name: "Результат с ценой",
  render: () => <ProjectCalculator initialAnswers={siteAnswers} initialSummary={buildCalculatorSummary(siteAnswers, offerCatalog)} />,
};

export const ResultDiscovery: Story = {
  name: "Результат discovery",
  render: () => <ProjectCalculator initialAnswers={discoveryAnswers} initialSummary={buildCalculatorSummary(discoveryAnswers, offerCatalog)} />,
};

export const ValidationError: Story = {
  name: "Ошибка обязательного поля",
  render: () => <ProjectCalculator initialAnswers={{ taskType: "site" }} initialStep={1} initialInvalidField="siteFormat" />,
};

export const SessionStorageUnavailable: Story = {
  name: "Недоступный sessionStorage",
  render: () => <ProjectCalculator initialAnswers={siteAnswers} initialSummary={buildCalculatorSummary(siteAnswers, offerCatalog)} />,
  parameters: {
    docs: { description: { story: "Bridge сохраняет summary best-effort: при запрете или переполнении sessionStorage событие и контактный переход продолжают работать." } },
  },
};

export const MobileLayout: Story = {
  name: "Мобильная раскладка",
  render: () => <ProjectCalculator initialAnswers={{ taskType: "site" }} initialStep={1} />,
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};

export const ContactPopupMobile: Story = {
  name: "Попап контакта на мобильном",
  render: () => <ProjectCalculator initialAnswers={siteAnswers} initialSummary={buildCalculatorSummary(siteAnswers, offerCatalog)} initialContactOpen />,
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};

export const ContactPopupDesktop: Story = {
  name: "Попап контакта с QR на десктопе",
  render: () => <ProjectCalculator initialAnswers={siteAnswers} initialSummary={buildCalculatorSummary(siteAnswers, offerCatalog)} initialContactOpen />,
};
