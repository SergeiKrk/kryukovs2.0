export type Capability = {
  word: string;
  description: string;
  glyphs: Record<number, { src: string; alt: string }>;
};

export const capabilities: Capability[] = [
  {
    word: "ДИЗАЙН",
    description: "Визуальная система под характер бренда, а не сборка из готовых шаблонов.",
    glyphs: {
      0: { src: "/assets/v3/glyph-de.png", alt: "Каменная буква Д" },
      1: { src: "/assets/v3/glyph-i.png", alt: "Каменная буква И" },
      2: { src: "/assets/v3/glyph-ze.png", alt: "Каменная буква З" },
      3: { src: "/assets/v3/glyph-a.png", alt: "Каменная буква А" },
      4: { src: "/assets/v3/glyph-short-i.png", alt: "Каменная буква Й" },
      5: { src: "/assets/v3/glyph-en.png", alt: "Каменная буква Н" },
    },
  },
  {
    word: "РАЗРАБОТКА",
    description: "Адаптивный интерфейс, понятная структура кода и основа для дальнейшего развития.",
    glyphs: {
      0: { src: "/assets/v3/glyph-er.png", alt: "Каменная буква Р" },
      1: { src: "/assets/v3/glyph-a.png", alt: "Каменная буква А" },
      2: { src: "/assets/v3/glyph-ze.png", alt: "Каменная буква З" },
      3: { src: "/assets/v3/glyph-er.png", alt: "Каменная буква Р" },
      4: { src: "/assets/v3/glyph-a.png", alt: "Каменная буква А" },
      5: { src: "/assets/v3/glyph-be.png", alt: "Каменная буква Б" },
      6: { src: "/assets/v3/glyph-o.png", alt: "Каменная буква О" },
      7: { src: "/assets/v3/glyph-te.png", alt: "Каменная буква Т" },
      8: { src: "/assets/v3/glyph-ka.png", alt: "Каменная буква К" },
      9: { src: "/assets/v3/glyph-a.png", alt: "Каменная буква А" },
    },
  },
  {
    word: "SEO",
    description: "Техническая база, контентная архитектура и аналитика с первого релиза.",
    glyphs: {
      0: { src: "/assets/v3/glyph-s.png", alt: "Каменная буква S" },
      1: { src: "/assets/v3/glyph-e-lat.png", alt: "Каменная буква E" },
      2: { src: "/assets/v3/glyph-o.png", alt: "Каменная буква O" },
    },
  },
];

export const processSteps = [
  {
    title: "Бриф",
    text: "Фиксируем бизнес-задачу, аудиторию, ограничения и критерии готовности проекта.",
    image: "/assets/v3/process-brief.png",
  },
  {
    title: "Структура и прототип",
    text: "Собираю логику страниц и ключевые сценарии, чтобы согласовать решение до дизайна.",
    image: "/assets/v3/process-prototype.png",
  },
  {
    title: "Дизайн",
    text: "Создаю визуальную систему, состояния интерфейса и адаптивную композицию.",
    image: "/assets/v3/process-design.png",
  },
  {
    title: "Разработка",
    text: "Переношу согласованный дизайн в быстрый интерфейс на современном стеке.",
    image: "/assets/v3/process-development.png",
  },
  {
    title: "Запуск и поддержка",
    text: "Проверяю ключевые сценарии, подключаю аналитику и остаюсь на связи 14 дней.",
    image: "/assets/v3/process-launch.png",
  },
];

export const projects = [
  {
    name: "SamogonCalc",
    category: "Продуктовый сервис, разработка и SEO",
    description: "Сервис для винокуров с 12 калькуляторами и 86 контентными страницами.",
    image: "/assets/samogoncalc-desktop.png",
    href: "https://samogoncalc.ru/",
  },
  {
    name: "Green Crown",
    category: "Сайт услуг, структура и SEO",
    description: "Коммерческий сайт службы ухода за зелёными насаждениями с каталогом направлений.",
    image: "/assets/green-crown-desktop.png",
    href: "https://green-crown.ru/",
  },
  {
    name: "СЭС Москва",
    category: "Коммерческий сайт, адаптив",
    description: "Сайт городской службы дезинфекции с понятным маршрутом от услуги к заявке.",
    image: "/assets/sesmsk-desktop.png",
    href: "https://sesmsk.su/",
  },
  {
    name: "Росснаб73",
    category: "Каталог медицинского оборудования",
    description: "Презентация продуктовой линейки для медицинского бизнеса на десктопе и мобильных устройствах.",
    image: "/assets/medicaequip-desktop.png",
    href: "https://medicaequip.netlify.app/",
  },
  {
    name: "Услуги альпиниста",
    category: "Сайт услуг, Ульяновск",
    description: "Локальный сайт высотных работ с быстрым сценарием обращения к специалисту.",
    image: "/assets/uslugialpinista-desktop.png",
    href: "https://uslugialpinista.ru/",
  },
];

export type OfferGroup = "sites" | "tools" | "acquisition" | "growth";
export type OfferUnit = "project" | "month";

export type Offer = {
  id: string;
  group: OfferGroup;
  title: string;
  priceFrom: number;
  unit: OfferUnit;
  priceLabel: string;
  summary: string;
  includes: string[];
  boundary: string;
  featured?: boolean;
};

export const offerCatalog: Offer[] = [
  {
    id: "landing-ad",
    group: "sites",
    title: "Лендинг, рекламная посадочная",
    priceFrom: 25000,
    unit: "project",
    priceLabel: "от 25 000 ₽",
    summary: "Посадочная страница под один оффер, кампанию или целевое действие.",
    includes: ["Посадочная страница", "Внутренняя SEO-оптимизация"],
    boundary: "Рекламный бюджет и дальнейшее ведение кампании оплачиваются отдельно.",
  },
  {
    id: "landing-direct",
    group: "sites",
    title: "Лендинг + настройка Яндекс.Директа",
    priceFrom: 35000,
    unit: "project",
    priceLabel: "от 35 000 ₽",
    summary: "Посадочная страница и связка с рекламным сценарием для измерения первого действия.",
    includes: ["Посадочная страница", "Внутренняя SEO-оптимизация", "Настройка Поиска и РСЯ"],
    boundary: "Кабинет и рекламный бюджет остаются у клиента и оплачиваются отдельно.",
    featured: true,
  },
  {
    id: "direct-setup",
    group: "acquisition",
    title: "Настройка Яндекс.Директа",
    priceFrom: 15000,
    unit: "project",
    priceLabel: "от 15 000 ₽",
    summary: "Настройка рекламной кампании для готовой посадочной страницы или сайта.",
    includes: ["Настройка Поиска и РСЯ"],
    boundary: "Кабинет и рекламный бюджет остаются у клиента. Результат кампании заранее не гарантируется.",
  },
  {
    id: "custom-landing",
    group: "sites",
    title: "Индивидуальный лендинг",
    priceFrom: 45000,
    unit: "project",
    priceLabel: "от 45 000 ₽",
    summary: "Одностраничный продукт с индивидуальной структурой и визуальной системой.",
    includes: ["Прототип", "Дизайн", "Текст", "Адаптив", "Аналитика"],
    boundary: "Состав и сроки зависят от материалов, интеграций и согласованного объёма.",
  },
  {
    id: "animated-landing-direct",
    group: "sites",
    title: "Индивидуальный лендинг с анимацией + Директ",
    priceFrom: 55000,
    unit: "project",
    priceLabel: "от 55 000 ₽",
    summary: "Индивидуальная посадочная страница с motion-сценарием и настройкой рекламы.",
    includes: ["Более глубокая структура", "Контент", "Аналитика", "Настройка Яндекс.Директа"],
    boundary: "Рекламный бюджет оплачивается клиентом напрямую. Бонус Яндекса возможен только после проверки условий конкретного аккаунта.",
  },
  {
    id: "corporate-site",
    group: "sites",
    title: "Корпоративный сайт",
    priceFrom: 75000,
    unit: "project",
    priceLabel: "от 75 000 ₽",
    summary: "Многостраничный сайт для компании, услуг, аудиторий и доказательств.",
    includes: ["Несколько шаблонов", "Внутренняя SEO-оптимизация"],
    boundary: "Финальный состав страниц, материалов и интеграций фиксируется после уточнения задачи.",
  },
  {
    id: "calculator",
    group: "tools",
    title: "Сайт-калькулятор / интерактивный инструмент",
    priceFrom: 50000,
    unit: "project",
    priceLabel: "от 50 000 ₽",
    summary: "Инструмент для расчёта, подбора, сравнения или конфигурации результата.",
    includes: ["Состав расчёта", "Состояния интерфейса", "Формулы и интеграции по согласованному объёму"],
    boundary: "Формула, источники данных и интеграции уточняются отдельно.",
  },
  {
    id: "complex-calculator",
    group: "tools",
    title: "Сложный калькулятор / web-интерфейс",
    priceFrom: 80000,
    unit: "project",
    priceLabel: "от 80 000 ₽",
    summary: "Многошаговый интерактивный продукт со сложной логикой и состояниями.",
    includes: ["Многошаговая логика", "Состояния", "Роли или интеграции по согласованному объёму"],
    boundary: "Точный scope frontend/backend и интеграций определяется после discovery.",
  },
  {
    id: "complex-product",
    group: "tools",
    title: "Магазин, личный кабинет, CRM, сложный интерактивный продукт",
    priceFrom: 100000,
    unit: "project",
    priceLabel: "от 100 000 ₽",
    summary: "Разработка сложного цифрового продукта с отдельным определением границ ответственности.",
    includes: ["Frontend/backend scope", "Интеграции по согласованному объёму"],
    boundary: "Оценка возможна после определения frontend/backend границ и интеграций.",
  },
  {
    id: "saas-crm-automation",
    group: "tools",
    title: "SaaS, полноценная CRM, нестандартная автоматизация",
    priceFrom: 150000,
    unit: "project",
    priceLabel: "от 150 000 ₽",
    summary: "Проектная оценка сложного сервиса или автоматизации.",
    includes: ["Проектная оценка"],
    boundary: "Цена не означает полный backend-контур без отдельного scope.",
  },
  {
    id: "seo-audit",
    group: "growth",
    title: "Технический / SEO-аудит",
    priceFrom: 12000,
    unit: "project",
    priceLabel: "от 12 000 ₽",
    summary: "Проверка технических барьеров и план приоритетных исправлений.",
    includes: ["Отчёт с проверяемыми находками", "Приоритетный план"],
    boundary: "Аудит не гарантирует позиции, индексацию каждой страницы, трафик или лиды.",
  },
  {
    id: "site-improvement",
    group: "growth",
    title: "Отдельная доработка, ускорение, миграция",
    priceFrom: 5000,
    unit: "project",
    priceLabel: "от 5 000 ₽",
    summary: "Изменение существующего сайта или продукта по конкретной задаче.",
    includes: ["Разбор текущего состояния", "Согласованный объём изменений"],
    boundary: "Цена зависит от доступа, риска и объёма; крупная миграция оценивается отдельно.",
  },
  {
    id: "support",
    group: "growth",
    title: "Регулярная поддержка и развитие",
    priceFrom: 35000,
    unit: "month",
    priceLabel: "от 35 000 ₽/мес.",
    summary: "Плановые изменения и контроль существующего проекта по согласованному объёму.",
    includes: ["Плановые правки", "Развитие", "Аналитика", "Контроль проекта"],
    boundary: "Состав работ и условия поддержки фиксируются отдельно.",
  },
];

export const services = [
  {
    id: "corporate-site",
    title: "Корпоративный сайт",
    text: "Несколько страниц и шаблонов для компании, услуг, аудиторий, доказательств и контактов.",
  },
  {
    id: "landing-pages",
    title: "Лендинг или рекламная посадочная",
    text: "Одна сфокусированная страница под оффер, кампанию, событие или целевое действие.",
  },
  {
    id: "interactive-tools",
    title: "Калькулятор или интерактивный инструмент",
    text: "Формула, подбор, сравнение или конфигурация в понятном интерфейсе с согласованными состояниями.",
  },
  {
    id: "web-apps",
    title: "Веб-сервис или клиентский кабинет",
    text: "Интерфейс для регулярной работы с данными, ролями, действиями и статусами в согласованном scope.",
  },
  {
    id: "rsya",
    title: "Запуск РСЯ / Яндекс.Директа",
    text: "Связка оффера, посадочной, рекламной кампании и проверяемого события обращения.",
  },
  {
    id: "site-support",
    title: "Поддержка и улучшение",
    text: "Разбор и изменение уже работающего сайта или сервиса: исправления, ускорение, развитие и миграция.",
  },
];

export type PricingCard = {
  id: string;
  name: string;
  price: string;
  text: string;
  includes: string[];
  featured?: boolean;
};

export const pricingGroups: Array<{ id: OfferGroup; title: string; offers: Offer[] }> = [
  { id: "sites", title: "Сайты", offers: offerCatalog.filter((offer) => offer.group === "sites") },
  { id: "tools", title: "Инструменты и продукты", offers: offerCatalog.filter((offer) => offer.group === "tools") },
  { id: "acquisition", title: "Продвижение", offers: offerCatalog.filter((offer) => offer.group === "acquisition") },
  { id: "growth", title: "Развитие", offers: offerCatalog.filter((offer) => offer.group === "growth") },
];

// Compatibility projection for consumers that need the compact card shape.
export const pricing: PricingCard[] = offerCatalog.map((offer) => ({
  id: offer.id,
  name: offer.title,
  price: offer.priceLabel,
  text: offer.summary,
  includes: offer.includes,
  featured: offer.featured,
}));

export const proofs = [
  ["5+ лет", "production React и TypeScript"],
  ["с 2015", "веб, SEO и маркетинг"],
  ["Лендинг + Я.Директ", "от 35 тыс. ₽"],
  ["14 дней", "поддержки после запуска"],
];

export const faq = [
  ["Сколько времени занимает проект?", "Срок зависит от количества страниц, готовности материалов и интеграций. После брифа я фиксирую этапы и календарный план. Компактный лендинг обычно требует меньше времени, чем многостраничный брендовый сайт."],
  ["Какие исходные материалы нужны?", "Для старта достаточно рассказать о бизнесе, аудитории и задаче. Тексты, фото, фирменный стиль и примеры полезны, но их отсутствие не блокирует первый разговор."],
  ["Как проходит оплата?", "Оплату делим по этапам и закрепляем условия до начала работ. Точный график зависит от объёма проекта и состава результатов на каждом этапе."],
  ["Сколько правок входит в работу?", "Количество циклов обратной связи фиксируем в предложении. Обычно каждый ключевой этап включает согласование и понятный список корректировок."],
  ["Что будет после запуска?", "В течение 14 дней помогаю с вопросами по выпущенному проекту. Дальнейшую поддержку и развитие можно оформить отдельно."],
  ["Будет ли сайт быстрым и готовым к SEO?", "Закладываю адаптивность, семантическую разметку, техническую базу SEO и контроль производительности. Конкретные показатели зависят от контента, хостинга и подключённых сервисов, поэтому заранее их не гарантирую."],
  ["Можно обновить существующий сайт?", "Да. Сначала разбираю текущую структуру, контент и ограничения, затем предлагаю полный редизайн или поэтапное улучшение."],
];

export const quizSteps = [
  ["Тип проекта", "Новый сайт, промо, редизайн или развитие существующего проекта"],
  ["Задача", "Что должен понять или сделать посетитель"],
  ["Состав", "Нужные страницы, функции и интеграции"],
  ["Материалы", "Что уже готово со стороны бренда и контента"],
  ["Контакт", "Куда отправить ориентир по формату и следующему шагу"],
];
