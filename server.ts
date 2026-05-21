import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize the Google Gen AI client with appropriate headers for AI Studio telemetry
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Helper: Check if Gemini Key is available
const isGeminiAvailable = () => {
  return typeof process.env.GEMINI_API_KEY === "string" && process.env.GEMINI_API_KEY.trim().length > 0;
};

// Circuit Breaker State for API Quotas to prevent flooding with 429 warnings
let isImageQuotaExhausted = false;
let imageQuotaExhaustedUntil = 0;

let isTextQuotaExhausted = false;
let textQuotaExhaustedUntil = 0;

const isImageQuotaExpired = () => {
  if (isImageQuotaExhausted && Date.now() < imageQuotaExhaustedUntil) {
    return true;
  }
  if (isImageQuotaExhausted && Date.now() >= imageQuotaExhaustedUntil) {
    isImageQuotaExhausted = false;
  }
  return false;
};

const isTextQuotaExpired = () => {
  if (isTextQuotaExhausted && Date.now() < textQuotaExhaustedUntil) {
    return true;
  }
  if (isTextQuotaExhausted && Date.now() >= textQuotaExhaustedUntil) {
    isTextQuotaExhausted = false;
  }
  return false;
};

// Default high-value niches if the user wants quick ideas without generating everything from scratch,
// or if the Gemini API key is missing.
const DEFAULT_PRESETS = [
  {
    id: "arbitrage-lifehacks",
    title: "Финансовый Арбитраж Лайфхаков",
    emoji: "⚡",
    tagline: "Как экономить и зарабатывать на дырах в программах лояльности крупных брендов",
    unrealFactor: "Люди буквально ежедневно получают посты с готовыми инструкциями, как получить товары от Яндекс, Озон, Самокат или ВКонтакте за 1 рубль либо вернуть полную стоимость законно. Это вызывает вирусную подписку и ежедневную проверку обновлений.",
    monetization: "Приватный VIP-канал с 'жирными' схемами (1500 руб/мес), реферальные ссылки, продажа рекламы банков и ритейлеров.",
    targetEarning: "150,000 - 500,000 руб/мес за счет быстрого набора 50к+ голодной до выгоды аудитории."
  },
  {
    id: "historical-mysteries",
    title: "Хроники Забытой Земли",
    emoji: "🏺",
    tagline: "Альтернативные архивные факты, скрытые технологии и загадки древних цивилизаций",
    unrealFactor: "Каждый пост содержит архивную карту, сенсационное старое фото либо чертеж с подробным интерактивным расследованием. Создаем ощущение раскрытия всемирного заговора. Читатели спорят в комментариях часами.",
    monetization: "Продажа уникального мерча, реклама книг и образовательных курсов, закрытые вебинары по скрытой истории.",
    targetEarning: "200,000 - 800,000 руб/мес за счет высочайшей вовлеченности (ERR > 60%)."
  },
  {
    id: "dark-psychology",
    title: "Шепот Влияния (Темная Психология)",
    emoji: "👁️",
    tagline: "Разбор скрытых манипуляций политиков, боссов, маркетологов и разбор приемов защиты",
    unrealFactor: "Читатели получают разборы реальных видеороликов, диалогов или рекламы по косточкам. Они видят, как ими манипулируют прямо сейчас в супермаркете или на работе. Каждое утро они заходят проверить новые психологические защиты.",
    monetization: "Платные консультации, гайды по защите от манипуляций (990 руб), дорогая реклама премиум-брендов.",
    targetEarning: "300,000 - 1,200,000 руб/мес."
  },
  {
    id: "ai-prompt-broker",
    title: "Фабрика Промптов (Сверхпроизводительность)",
    emoji: "🤖",
    tagline: "Нейросети, которые заменяют 10 сотрудников: как зарабатывать на генерации контента для бизнеса",
    unrealFactor: "Конкретные пошаговые промпты, которые генерируют код, макеты, 3D-модели или видео. Пользователь копирует один промпт и мгновенно получает готовый коммерческий результат, который может продать.",
    monetization: "Индивидуальное составление промптов для компаний, продажа закрытых баз знаний, партнерские витрины AI-сервисов.",
    targetEarning: "500,000 - 2,000,000 руб/мес."
  }
];

// 1. API Endpoint: Get presets
app.get("/api/presets", (req, res) => {
  res.json({
    presets: DEFAULT_PRESETS,
    geminiConfigured: isGeminiAvailable()
  });
});

// 2. API Endpoint: Generate Custom Niche / Idea Analysis
app.post("/api/generate-plan", async (req, res) => {
  const { idea, targetEarning } = req.body;

  if (!idea) {
    return res.status(400).json({ error: "Необходимо указать идею или тематику канала" });
  }

  const prompt = `Ты — ведущий Telegram-маркетолог, эксперт по вирусному контенту и монетизации с опытом вывода каналов на доход более 1 000 000 руб/месяц.
Проанализируй следующую идею Telegram-канала: "${idea}".
Учти желаемый доход: "${targetEarning || "500,000 рублей в месяц"}".

Сделай глубокий анализ и разработай концепцию канала, которая будет вызывать ДИКИЙ, нереальный интерес у людей, заставляя их возвращаться каждый день. Напиши ответ СТРОГО на русском языке в формате JSON. JSON должен точно соответствовать следующей схеме:

{
  "title": "Интригующее и запоминающееся название канала на русском",
  "tagline": "Яркое описание (био) канала — цепляющее, заставляющее подписаться за 3 секунды",
  "unrealFactor": "Подробный разбор того самого 'нереального фактора' (секретного крючка), который заставит людей заходить каждый день, делиться постами с друзьями и держать уведомления включенными",
  "targetAudience": "Кто эти люди, почему они готовы вовлекаться и тратить деньги",
  "monetizationBlueprint": [
    "Шаг 1 монетизации: быстрый старт на рекламе и партнерках с описанием ценников",
    "Шаг 2 монетизации: запуск собственного инфопродукта, закрытого клуба, платного бота или платных эксклюзивных услуг",
    "Шаг 3 монетизации: масштабирование, продажа премиум-услуг, реклама крупных корпораций, мерч"
  ],
  "financialModel": {
    "requiredSubscribers": "Сколько нужно живых подписчиков для выхода на желаемый доход",
    "earningBreakdown": "Расчет: за счет чего конкретно сформируется сумма желаемого дохода (например, 20 рекламных постов по Х руб + 50 продаж гайда по Y руб)",
    "timeToLaunch": "Реалистичный срок выхода на первые деньги при правильном подходе"
  },
  "contentStrategy": "Генеральная стратегия ведения: какой тон, стиль постов, какие медиа форматы задействовать",
  "sevenDayPlanOutline": [
    { "day": 1, "topic": "Тема или интригующий заголовок поста 1-го дня" },
    { "day": 2, "topic": "Тема или интригующий заголовок поста 2-го дня" },
    { "day": 3, "topic": "Тема или интригующий заголовок поста 3-го дня" },
    { "day": 4, "topic": "Тема или интригующий заголовок поста 4-го дня" },
    { "day": 5, "topic": "Тема или интригующий заголовок поста 5-го дня" },
    { "day": 6, "topic": "Тема или интригующий заголовок поста 6-го дня" },
    { "day": 7, "topic": "Тема или интригующий заголовок поста 7-го дня" }
  ]
}

Убедись, что концепция звучит дерзко, реалистично с точки зрения рынка Telegram, но невероятно привлекательно для пользователя. Отдавай только чистый JSON без разметки markdown \`\`\`json или постороннего текста.`;

  try {
    if (!isGeminiAvailable() || isTextQuotaExpired()) {
      // Return a generated simulation if Gemini is not set up or quota expired
      console.log("Gemini API key is missing or quota expired. Simulating analysis response.");
      // Just simulate with high-quality customized mock based on their input
      const normalizedInput = idea.toLowerCase();
      let matchedPreset = DEFAULT_PRESETS.find(p => normalizedInput.includes(p.title.toLowerCase()) || normalizedInput.includes(p.id));
      
      const simulatedResponse = {
        title: matchedPreset ? matchedPreset.title : `Секретный Код: ${idea}`,
        tagline: matchedPreset ? matchedPreset.tagline : `Уникальная изнанка сферы "${idea}", о которой молчат 99% экспертов. Жми подписку!`,
        unrealFactor: matchedPreset ? matchedPreset.unrealFactor : `Каждый пост раскрывает инсайдерскую информацию, упущенные выгоды или скрытые приемы из тематики "${idea}". Мы даем инструменты, которые экономят пользователю кучу времени и приносят прямую финансовую выгоду. Человек боится пропустить очередной выпуск, ведь каждый совет может принести прибыль в этот же день.`,
        targetAudience: "Предприниматели, фрилансеры, искатели легкого дохода и люди в возрасте 18-35 лет, стремящиеся к финансовой свободе.",
        monetizationBlueprint: [
          "Продажа VIP-доступа в закрытый чат с детальными гайдами и прямыми консультациями (от 2000 руб/мес)",
          "Рекламная интеграция тематических Telegram-каналов, сервисов и криптопроектов (от 3000 до 15000 руб за размещение)",
          "Продажа комплексного руководства или обучающего курса по быстрому заработку на " + idea
        ],
        financialModel: {
          requiredSubscribers: "12,000 - 15,000 вовлеченных подписчиков",
          earningBreakdown: `Для заработка ${targetEarning || "500,000 рублей в месяц"}: продажа 150 доступов в приватный чат по 2,000 руб/мес (300,000 руб) + 12 рекламных размещений за месяц по 17,000 руб (204,000 руб).`,
          timeToLaunch: "4-6 недель при агрессивной закупке рекламы и регулярном постинге."
        },
        contentStrategy: "Яркий, напористый, слегка провокационный стиль. Использование качественных обложек, скриншотов-доказательств и пошаговых скриптов, которые можно внедрить за 5 минут.",
        sevenDayPlanOutline: [
          { day: 1, topic: "Разоблачение главной мистификации или главной ошибки в этой нише" },
          { day: 2, topic: "Секретный лайфхак/метод: как сэкономить 50% ресурсов или получить результат за 10 минут" },
          { day: 3, topic: "Пошаговая инструкция быстрого заработка или автоматизации процессов" },
          { day: 4, topic: "Шокирующая статистика или малоизвестный факт, который переворачивает представление о нише" },
          { day: 5, topic: "Разбор реального кейса подписчика: как обычный человек сделал результат благодаря вашему совету" },
          { day: 6, topic: "Интерактив/Опрос: выбор лучшего инструмента или темы для следующего закрытого разбора" },
          { day: 7, topic: "Эксклюзивный анонс: доступ к закрытому материалу и призыв вступить в приватное сообщество" }
        ],
        isFallback: true,
        errorInfo: isTextQuotaExpired() ? "Превышена квота бесплатных запросов текстового ИИ (429/Limit). Применена высокоточная готовая симуляция." : undefined
      };
      return res.json(simulatedResponse);
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text || "{}";
    const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const result = JSON.parse(cleanedText);
    res.json(result);

  } catch (err: any) {
    const isQuotaError = err.message && (err.message.includes("quota") || err.message.includes("429") || err.message.includes("limit") || err.message.includes("RESOURCE_EXHAUSTED"));
    
    if (isQuotaError) {
      isTextQuotaExhausted = true;
      textQuotaExhaustedUntil = Date.now() + 10 * 60 * 1000; // 10 minutes circuit break
      console.warn(
        `[Fallback Triggered & Circuit Breaker Activated] Text generation failed due to quota limit (429). Entering Simulation mode for 10 minutes.`
      );
      
      const normalizedInput = idea.toLowerCase();
      let matchedPreset = DEFAULT_PRESETS.find(p => normalizedInput.includes(p.title.toLowerCase()) || normalizedInput.includes(p.id));
      
      const simulatedResponse = {
        title: matchedPreset ? matchedPreset.title : `Секретный Код: ${idea}`,
        tagline: matchedPreset ? matchedPreset.tagline : `Уникальная изнанка сферы "${idea}", о которой молчат 99% экспертов. Жми подписку!`,
        unrealFactor: matchedPreset ? matchedPreset.unrealFactor : `Каждый пост раскрывает инсайдерскую информацию, упущенные выгоды или скрытые приемы из тематики "${idea}". Мы даем инструменты, которые экономят пользователю кучу времени и приносят прямую финансовую выгоду. Человек боится пропустить очередной выпуск, ведь каждый совет может принести прибыль в этот же день.`,
        targetAudience: "Предприниматели, фрилансеры, искатели легкого дохода и люди в возрасте 18-35 лет, стремящиеся к финансовой свободе.",
        monetizationBlueprint: [
          "Продажа VIP-доступа в закрытый чат с детальными гайдами и прямыми консультациями (от 2000 руб/мес)",
          "Рекламная интеграция тематических Telegram-каналов, сервисов и криптопроектов (от 3000 до 15000 руб за размещение)",
          "Продажа комплексного руководства или обучающего курса по быстрому заработку на " + idea
        ],
        financialModel: {
          requiredSubscribers: "12,000 - 15,000 вовлеченных подписчиков",
          earningBreakdown: `Для заработка ${targetEarning || "500,000 рублей в месяц"}: продажа 150 доступов в приватный чат по 2,000 руб/мес (300,000 руб) + 12 рекламных размещений за месяц по 17,000 руб (204,000 руб).`,
          timeToLaunch: "4-6 недель при агрессивной закупке рекламы и регулярном постинге."
        },
        contentStrategy: "Яркий, напористый, слегка провокационный стиль. Использование качественных обложек, скриншотов-доказательств и пошаговых скриптов, которые можно внедрить за 5 минут.",
        sevenDayPlanOutline: [
          { day: 1, topic: "Разоблачение главной мистификации или главной ошибки в этой нише" },
          { day: 2, topic: "Секретный лайфхак/метод: как сэкономить 50% ресурсов или получить результат за 10 минут" },
          { day: 3, topic: "Пошаговая инструкция быстрого заработка или автоматизации процессов" },
          { day: 4, topic: "Шокирующая статистика или малоизвестный факт, который переворачивает представление о нише" },
          { day: 5, topic: "Разбор реального кейса подписчика: как обычный человек сделал результат благодаря вашему совету" },
          { day: 6, topic: "Интерактив/Опрос: выбор лучшего инструмента или темы для следующего закрытого разбора" },
          { day: 7, topic: "Эксклюзивный анонс: доступ к закрытому материалу и призыв вступить в приватное сообщество" }
        ],
        isFallback: true,
        errorInfo: "Превышена квота бесплатных запросов текстового ИИ (429/Limit). Применена высокоточная готовая симуляция."
      };
      return res.json(simulatedResponse);
    }

    console.error("Error calling Gemini API:", err);
    res.status(500).json({ error: "Ошибка при анализе идеи с помощью AI: " + err.message });
  }
});

// 3. API Endpoint: Generate detailed Post contents (Text + Visual prompt) for a specific day/topic
app.post("/api/generate-post", async (req, res) => {
  const { channelTitle, channelTagline, day, topic, targetEarning } = req.body;

  if (!channelTitle || !topic) {
    return res.status(400).json({ error: "Недостаточно данных для генерации поста" });
  }

  const prompt = `Ты — топовый копирайтер для Telegram-каналов-миллионников. Напиши взрывной, увлекательный, готовый к публикации пост для Telegram-канала на русском языке.
  
Канал называется: "${channelTitle}"
Его концепция: "${channelTagline}"
День контент-плана: День ${day}
Тема поста: "${topic}"

Создай потрясающий пост, который задержит внимание читателя и заставит его переслать этот пост другу. Пост должен содержать:
1. Креативные эмодзи, форматирование (жирные заголовки, списки, выделения кода для лучшей читаемости).
2. Интригующее начало, раскрытие сути, практическую пользу (лайфхак/совет/факт) и мощный призыв к действию (CTA): поделиться постом, оставить комментарий или подписаться.
3. Хештеги.
4. Дополнительно составь ОЧЕНЬ ПОДРОБНЫЙ, КАРТИННЫЙ англоязычный промпт для генерации идеальной иллюстрации к этому посту в нейросети (Midjourney / Imagen / DALL-E) с указанием стиля, освещения и пропорций.

Верни ответ СТРОГО в формате JSON без markdown \`\`\`json. Структура:
{
  "postTitle": "Заголовок поста с подходящими эмодзи",
  "postText": "Здесь весь текст поста. Используй \\n для переносов строк. Используй маркеры списка, жирный шрифт (будет выведен с помощью markdown-подобных тегов в интерфейсе) и вовлекающие фишки.",
  "imagePrompt": "Detailed English image generation prompt for Midjourney/Imagen based on the post theme. e.g., 'A vintage photorealistic laboratory with glowing potions, micro-contrast, cinematic lighting, 4k resolution'",
  "ctaText": "Текст вовлекающей кнопки под постом (например: 🗳️ Пройти тест, ⚡ Забрать шаблон, 🔔 Включить уведомления)"
}

Пиши текст поста на русском языке. Сделай его максимально приближенным к стилю модных образовательных или крипто/бизнес авторских каналов. Без воды, только польза и огонь.`;

  try {
    if (!isGeminiAvailable() || isTextQuotaExpired()) {
      console.log("Simulating post text generation due to key missing or quota expired.");
      const simulatedPost = {
        postTitle: `🔥 День ${day}: Секретный метод раскрыт: ${topic}`,
        postText: `⚡️ Сегодня мы разберем то, о чем молчат 95% участников рынка. Вы когда-нибудь задумывались, почему одни получают все сливки, а другие довольствуются крошками?\n\nВот пошаговый алгоритм, который вы можете внедрить прямо СЕГОДНЯ:\n\n1️⃣ **Шаг первый:** Перестаньте действовать по шаблону. Все паблики пишут о банальных вещах. Наш подход — искать аномалии.\n2️⃣ **Шаг второй:** Используйте автоматизацию. Пока другие делают руками, мы запускаем скрипты.\n3️⃣ **Шаг третий:** Фиксируйте прибыль сразу.\n\nЗапомните: в наше время выигрывает не самый умный, а самый шустрый. У вас на это уйдет ровно 5 минут, а профит может превысить ожидания в разы.\n\n👇 **Давайте честно: пробовали такое раньше? Пишите в комменты.**`,
        imagePrompt: `A vibrant visual metaphor for fast execution and high profit, showing a sleek retrofuturistic workspace, neon holograms of growth charts floating above, deep charcoal and electric gold colors, high-end 3D render style, cinematic lighting, dramatic depth of field, minimalist aesthetic, 16:9 aspect ratio`,
        ctaText: "🚀 Забрать Инструкцию",
        isFallback: true,
        errorInfo: isTextQuotaExpired() ? "Превышена квота бесплатных запросов текстового ИИ (429/Limit). Применена высокоточная готовая симуляция." : undefined
      };
      return res.json(simulatedPost);
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text || "{}";
    const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const result = JSON.parse(cleanedText);
    res.json(result);

  } catch (err: any) {
    const isQuotaError = err.message && (err.message.includes("quota") || err.message.includes("429") || err.message.includes("limit") || err.message.includes("RESOURCE_EXHAUSTED"));
    
    if (isQuotaError) {
      isTextQuotaExhausted = true;
      textQuotaExhaustedUntil = Date.now() + 10 * 60 * 1000; // 10 minutes circuit break
      console.warn(
        `[Fallback Triggered & Circuit Breaker Activated] Text generation failed due to quota limit (429). Entering Simulation mode for 10 minutes.`
      );
      
      const simulatedPost = {
        postTitle: `🔥 День ${day}: Секретный метод раскрыт: ${topic}`,
        postText: `⚡️ Сегодня мы разберем то, о чем молчат 95% участников рынка. Вы когда-нибудь задумывались, почему одни получают все сливки, а другие довольствуются крошками?\n\nВот пошаговый алгоритм, который вы можете внедрить прямо СЕГОДНЯ:\n\n1️⃣ **Шаг первый:** Перестаньте действовать по шаблону. Все паблики пишут о банальных вещах. Наш подход — искать аномалии.\n2️⃣ **Шаг второй:** Используйте автоматизацию. Пока другие делают руками, мы запускаем скрипты.\n3️⃣ **Шаг третий:** Фиксируйте прибыль сразу.\n\nЗапомните: в наше время выигрывает не самый умный, а самый шустрый. У вас на это уйдет ровно 5 минут, а профит может превысить ожидания в разы.\n\n👇 **Давайте честно: пробовали такое раньше? Пишите в комменты.**`,
        imagePrompt: `A vibrant visual metaphor for fast execution and high profit, showing a sleek retrofuturistic workspace, neon holograms of growth charts floating above, deep charcoal and electric gold colors, high-end 3D render style, cinematic lighting, dramatic depth of field, minimalist aesthetic, 16:9 aspect ratio`,
        ctaText: "🚀 Забрать Инструкцию",
        isFallback: true,
        errorInfo: "Превышена квота бесплатных запросов текстового ИИ (429/Limit). Применена высокоточная готовая симуляция."
      };
      return res.json(simulatedPost);
    }

    console.error("Error generating post text:", err);
    res.status(500).json({ error: "Ошибка генерации поста с помощью AI: " + err.message });
  }
});

// 4. API Endpoint: Generate actual visual based on the imagePrompt or fallback
app.post("/api/generate-image", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Необходим промпт для иллюстрации" });
  }

  // Pre-selected high-resolution premium Unsplash assets matched to our Telegram niches
  const curatedFallbackImages = [
    {
      keywords: ["arbitrage", "hack", "money", "loyalty", "profit", "earn", "схема", "выгода"],
      url: "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?auto=format&fit=crop&w=800&h=450&q=80"
    },
    {
      keywords: ["history", "ancient", "mystery", "archive", "ruins", "загадка", "архив"],
      url: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=800&h=450&q=80"
    },
    {
      keywords: ["psychology", "manipulation", "influence", "mind", "темная", "психология"],
      url: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&w=800&h=450&q=80"
    },
    {
      keywords: ["ai", "prompt", "neural", "tech", "robot", "нейросеть", "промпт"],
      url: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&h=450&q=80"
    }
  ];

  // Pick suitable curated image or random abstract fallback
  const getFailsafeImageUrl = (promptText: string) => {
    const textToMatch = promptText.toLowerCase();
    const matched = curatedFallbackImages.find(item => 
      item.keywords.some(kw => textToMatch.includes(kw))
    );
    if (matched) return matched.url;
    // Fallback default (clean high-end tech workspace)
    return "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&h=450&q=80";
  };

  try {
    if (isImageQuotaExpired()) {
      console.log("Image generation API is temporarily rate-limited. Serving premium curated fallback instantly.");
      return res.json({
        imageUrl: getFailsafeImageUrl(prompt),
        isFallback: true,
        errorInfo: "Превышена квота бесплатных запросов ИИ (429). Применен готовый премиум-дизайн."
      });
    }

    if (!isGeminiAvailable()) {
      console.log("Gemini API key is missing. Using premium curated fallback image.");
      return res.json({ imageUrl: getFailsafeImageUrl(prompt), isFallback: true });
    }

    console.log("Invoking Gemini Image Generation using gemini-2.5-flash-image:", prompt);
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: prompt + ", premium digital illustration, highly stylized, vibrant colors, clean vector or fine digital art style, 4k",
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      }
    });

    let base64Image = "";
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          base64Image = part.inlineData.data;
          break;
        }
      }
    }

    if (base64Image) {
      const imageUrl = `data:image/png;base64,${base64Image}`;
      return res.json({ imageUrl, isFallback: false });
    } else {
      console.warn("Gemini did not return inlineData for image. Using upscale fallback.");
      return res.json({ imageUrl: getFailsafeImageUrl(prompt), isFallback: true });
    }

  } catch (err: any) {
    // Graceful recovery for all errors ( quota limits 429, timeout, network issues, etc. )
    const isQuotaError = err.message && (err.message.includes("quota") || err.message.includes("429") || err.message.includes("limit"));
    
    if (isQuotaError) {
      isImageQuotaExhausted = true;
      imageQuotaExhaustedUntil = Date.now() + 10 * 60 * 1000; // 10 minutes circuit break
      console.warn(
        `[Fallback Triggered & Circuit Breaker Activated] Image generation failed due to quota limit (429). Bypassing Gemini image calls for 10 minutes.`
      );
    } else {
      console.error("Image generation failed:", err.message || err);
    }
    
    // Send a beautiful premium curated fallback image immediately so UI stays gorgeous under all conditions
    res.json({
      imageUrl: getFailsafeImageUrl(prompt),
      isFallback: true,
      errorInfo: isQuotaError ? "Превышена квота бесплатных запросов ИИ (429). Применен готовый премиум-дизайн." : err.message
    });
  }
});

// Setup Vite Dev server or Serve compiled build
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
