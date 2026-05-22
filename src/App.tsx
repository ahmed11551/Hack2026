import React, { useState, useEffect } from "react";
import { PresetNiche, NicheAnalysis, PostDetail } from "./types";
import NicheSelector from "./components/NicheSelector";
import Calculators from "./components/Calculators";
import BotCodeTemplate from "./components/BotCodeTemplate";
import { 
  Sparkles, 
  Send, 
  Eye, 
  Share2, 
  MessageCircle, 
  ThumbsUp, 
  AlertCircle,
  TrendingUp, 
  HelpCircle,
  FileText,
  Bookmark,
  Zap,
  CheckCircle,
  Image as ImageIcon,
  RefreshCw,
  Coins,
  Smartphone,
  CreditCard,
  Lock,
  Unlock,
  Check,
  Bot as BotIcon,
  Layers,
  Info,
  DollarSign
} from "lucide-react";

export default function App() {
  const [presets, setPresets] = useState<PresetNiche[]>([]);
  const [geminiConfigured, setGeminiConfigured] = useState<boolean>(false);
  const [selectedPresetId, setSelectedPresetId] = useState<string>("");
  const [selectedNiche, setSelectedNiche] = useState<NicheAnalysis | null>(null);
  
  // App Navigation Tabs
  const [activeTab, setActiveTab] = useState<"ideation" | "simulator" | "competitors" | "code">("ideation");

  // Loading flags
  const [loadingNiche, setLoadingNiche] = useState<boolean>(false);
  const [loadingPost, setLoadingPost] = useState<boolean>(false);
  const [imageGenerating, setImageGenerating] = useState<boolean>(false);

  // Growth Planner states
  const [selectedDayNum, setSelectedDayNum] = useState<number>(1);
  const [currentPost, setCurrentPost] = useState<PostDetail | null>(null);
  const [postImageUrl, setPostImageUrl] = useState<string>("");
  const [isFallbackImage, setIsFallbackImage] = useState<boolean>(true);

  // Status Alerts
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Simulated Telegram Ecosystem State Flow
  const [simStep, setSimStep] = useState<number>(1); // 1: Channel, 2: Bot Start, 3: Mini App Catalog, 4: YooKassa Checkout, 5: Unlocked VIP Access
  const [paymentMethod, setPaymentMethod] = useState<"card" | "sbp">("sbp");
  const [simulationPaid, setSimulationPaid] = useState<boolean>(false);
  const [simPhoneMock, setSimPhoneMock] = useState<string>("+7 (999) 123-45-67");
  const [checkoutPrice, setCheckoutPrice] = useState<number>(490);
  const [showTransactionAlert, setShowTransactionAlert] = useState<boolean>(false);
  const [showYooKassaReceipt, setShowYooKassaReceipt] = useState<boolean>(false);

  // Simulated Chat Bot Integration States & Logic
  const [chatMessages, setChatMessages] = useState<Array<{
    sender: "bot" | "user";
    text: string;
    time: string;
    buttons?: Array<{ text: string; action: string }>;
  }>>([]);
  const [userInputText, setUserInputText] = useState<string>("");
  const [typingBot, setTypingBot] = useState<boolean>(false);

  // Auto initialize chat when selected niche changes
  useEffect(() => {
    if (selectedNiche) {
      setChatMessages([
        {
          sender: "bot",
          text: `👋 **Приветствуем в официальной Хак-Системе!**\n\nЯ — интеллектуальный бот-помощник канала **«${selectedNiche.title || "Хак-Заработок"}»**.\n\nМы автоматизировали доступ к закрытой базе практических инструкций, схем экономии и заработку с выводом прямо на карты банков РФ в рублях.\n\n🤖 **Главные команды бота:**\n🔹 /buy — Быстрая покупка подписки прямо в чате\n🔹 /info — Подробная информация о проекте и заработке\n🔹 /legal — Юридическая поддержка, публичная оферта и правила возврата средств\n🔹 /support — Написать в техподдержку / Наш ИИ-юрист`,
          time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
          buttons: [
            { text: "⚡ Открыть Mini App", action: "miniapp" },
            { text: "💳 Прямая оплата подписки", action: "buy" },
            { text: "📜 Юридические документы", action: "legal" }
          ]
        }
      ]);
    }
  }, [selectedNiche]);

  const handleSendChatMessage = async (customText?: string) => {
    const textToSend = customText || userInputText.trim();
    if (!textToSend || !selectedNiche) return;

    if (!customText) {
      setUserInputText("");
    }

    // Add user message to log
    const userMsg = {
      sender: "user" as const,
      text: textToSend,
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatMessages(prev => [...prev, userMsg]);
    setTypingBot(true);

    try {
      const res = await fetch("/api/bot-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          channelTitle: selectedNiche.title,
          channelTagline: selectedNiche.tagline
        })
      });
      const data = await res.json();
      if (res.ok) {
        setChatMessages(prev => [...prev, {
          sender: "bot",
          text: data.reply,
          time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
          buttons: data.suggestedButtons
        }]);
      } else {
        setChatMessages(prev => [...prev, {
          sender: "bot",
          text: `❌ Ошибка чат-бота: ${data.error || "Неизвестная ошибка"}`,
          time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
        }]);
      }
    } catch (err) {
      console.error(err);
      setChatMessages(prev => [...prev, {
        sender: "bot",
        text: "❌ Сетевая ошибка при подключении к ИИ-боту.",
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setTypingBot(false);
    }
  };

  const handleBotButtonAction = (action: string) => {
    if (action === "miniapp") {
      setSimStep(3); // Go to Mini App Catalogue
    } else if (action === "buy") {
      handleSendChatMessage("/buy");
    } else if (action === "legal") {
      handleSendChatMessage("/legal");
    } else if (action === "support") {
      handleSendChatMessage("/support");
    } else if (action === "info_calc") {
      handleSendChatMessage("/info");
    } else if (action === "checkout_490") {
      setCheckoutPrice(490);
      setSimStep(4); // Direct checkout
    } else if (action === "checkout_149") {
      setCheckoutPrice(149);
      setSimStep(4); // Direct checkout
    } else if (action === "checkout_1490") {
      setCheckoutPrice(1490);
      setSimStep(4); // Direct checkout
    } else if (action === "legal_offer") {
      setChatMessages(prev => [...prev, {
        sender: "bot",
        text: `📜 **ВЫДЕРЖКА ИЗ ПУБЛИЧНОЙ ОФЕРТЫ (ст. 437 ГК РФ):**\n\n1. **Предмет договора:** Оператор (Самозанятая Себиева Рояна, ИНН 770980461804) предоставляет доступ к закрытым информационным материалам в Telegram в виде подписки.\n2. **Порядок акцепта:** Оплата тарифа является полным и безоговорочным акцептом условий настоящей Оферты.\n3. **Условия предоставления:** Доступ открывается автоматически в течение 5 секунд после фискализации платежа в системе ЮKassa.\n4. **Ограничение ответственности:** Все материалы носят экспертно-информационный характер. Доход зависит от усердия пользователя и правильности воспроизведения настроек.`,
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        buttons: [{ text: "💸 Условия возврата", action: "legal_refund" }, { text: "💬 Назад в меню", action: "start" }]
      }]);
    } else if (action === "legal_refund") {
      setChatMessages(prev => [...prev, {
        sender: "bot",
        text: `💸 **УСЛОВИЯ ВОЗВРАТА СРЕДСТВ (ст. 26.1 ЗоЗПП РФ):**\n\n1. Потребитель вправе отказаться от товара/услуги в любое время до его передачи.\n2. В силу специфики электронного цифрового контента, возврат за уже открытый доступ к базе знаний не производится, поскольку услуга считается оказанной в момент предоставления доступа.\n3. В случае задержки активации или технических проблем с ботом, уплаченные средства возвращаются оператору в полном объеме по реквизитам плательщика в течение 1-3 рабочих дней.\n\nЗапросы направляются на **help@startappai.ru**.\n\nМы платим налоги (НПД для самозанятых) и предоставляем электронный чек при совершении каждой транзакции!`,
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        buttons: [{ text: "💳 Выбрать Тариф", action: "buy" }, { text: "💬 Назад в меню", action: "start" }]
      }]);
    } else if (action === "support_taxes") {
      handleSendChatMessage("Как легально платить налоги в РФ?");
    } else if (action === "support_refunds") {
      handleSendChatMessage("Какая политика возврата средств?");
    } else if (action === "support_kassa") {
      setChatMessages(prev => [...prev, {
        sender: "bot",
        text: `⚙️ **Как настроить ЮKassa самостоятельно:**\n\n1. Зайдите на **yookassa.ru** и отправьте заявку в качестве Самозанятого или ИП.\n2. Из настроек заберите \`shopId\` и \`SecretKey\`.\n3. Пропишите их в конфигурацию вашего ИИ бот-контейнера (инструкции в шаге 4).\n4. Касса будет фискализировать ваши платежи и слать онлайн-чеки клиентам в соответствии с ФЗ-54. Поздравляем, вы работаете полностью по закону!`,
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        buttons: [{ text: "⚙️ Посмотреть код бота", action: "gocode" }]
      }]);
    } else if (action === "gocode") {
      setActiveTab("code");
    } else if (action === "start") {
      handleSendChatMessage("/start");
    }
  };

  // Load Presets on Init
  useEffect(() => {
    async function loadInitialData() {
      try {
        const res = await fetch("/api/presets");
        const data = await res.json();
        setPresets(data.presets || []);
        setGeminiConfigured(data.geminiConfigured ?? false);
        
        // Auto select first preset to populate the UI initially
        if (data.presets && data.presets.length > 0) {
          handleSelectPreset(data.presets[0]);
        }
      } catch (err) {
        console.error("Error loading presets:", err);
        setErrorMessage("Не удалось загрузить стартовые пресеты с сервера.");
      }
    }
    loadInitialData();
  }, []);

  // Handle Preset Click
  const handleSelectPreset = async (preset: PresetNiche) => {
    setSelectedPresetId(preset.id);
    setLoadingNiche(true);
    setErrorMessage("");
    setSelectedDayNum(1);
    setCurrentPost(null);
    setPostImageUrl("");

    try {
      const res = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: preset.title, targetEarning: preset.targetEarning })
      });
      const data = await res.json();
      if (res.ok) {
        setSelectedNiche(data);
        if (data.sevenDayPlanOutline && data.sevenDayPlanOutline.length > 0) {
          generatePostForDay(data, 1, data.sevenDayPlanOutline[0].topic);
        }
      } else {
        setErrorMessage(data.error || "Произошла ошибка при составлении плана.");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Сетевая ошибка при получении бизнес-модели.");
    } finally {
      setLoadingNiche(false);
    }
  };

  // Handle Custom AI Analysis
  const handleAnalyzeCustom = async (customIdea: string, targetEarning: string) => {
    setSelectedPresetId("custom");
    setLoadingNiche(true);
    setErrorMessage("");
    setSelectedDayNum(1);
    setCurrentPost(null);
    setPostImageUrl("");

    try {
      const res = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: customIdea, targetEarning: targetEarning })
      });
      const data = await res.json();
      if (res.ok) {
        setSelectedNiche(data);
        if (data.sevenDayPlanOutline && data.sevenDayPlanOutline.length > 0) {
          generatePostForDay(data, 1, data.sevenDayPlanOutline[0].topic);
        }
      } else {
        setErrorMessage(data.error || "Ошибка генерации пользовательского концепта.");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Не удалось установить соединение с сервером ИИ.");
    } finally {
      setLoadingNiche(false);
    }
  };

  // Generate Daily Post preview content
  const generatePostForDay = async (niche: NicheAnalysis, day: number, topic: string) => {
    setLoadingPost(true);
    setCurrentPost(null);
    setPostImageUrl("");
    setErrorMessage("");

    try {
      const res = await fetch("/api/generate-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channelTitle: niche.title,
          channelTagline: niche.tagline,
          day,
          topic
        })
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentPost(data);
        triggerImageGeneration(data.imagePrompt);
      } else {
        setErrorMessage(data.error || "Ошибка при генерации поста.");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Ошибка сети при генерации поста.");
    } finally {
      setLoadingPost(false);
    }
  };

  // Trigger Gemini/Mock Visual rendering
  const triggerImageGeneration = async (prompt: string) => {
    setImageGenerating(true);
    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      if (res.ok && data.imageUrl) {
        setPostImageUrl(data.imageUrl);
        setIsFallbackImage(data.isFallback ?? false);
      } else {
        const randomId = Math.floor(Math.random() * 500);
        setPostImageUrl(`https://picsum.photos/id/${randomId}/800/450`);
        setIsFallbackImage(true);
      }
    } catch (err) {
      console.error("Error generating image:", err);
      setPostImageUrl("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80");
      setIsFallbackImage(true);
    } finally {
      setImageGenerating(false);
    }
  };

  // Active day selection changed by user
  const handleDaySelect = (dayNum: number, topic: string) => {
    if (!selectedNiche) return;
    setSelectedDayNum(dayNum);
    generatePostForDay(selectedNiche, dayNum, topic);
  };

  // Regenerate visual with customized prompt
  const [customPrompt, setCustomPrompt] = useState<string>("");
  const handleRegenImageWithPrompt = () => {
    const promptToUse = customPrompt.trim() !== "" ? customPrompt : (currentPost?.imagePrompt || "cyberpunk telegram aesthetic");
    triggerImageGeneration(promptToUse);
  };

  // Simulate complete transaction (Russian rubles YooKassa simulation)
  const handleExecutePayment = () => {
    setSimulationPaid(true);
    setShowTransactionAlert(true);
    setSimStep(5); // Go directly to Unlocked Secrets Step
    setTimeout(() => {
      setShowTransactionAlert(false);
    }, 4500);
  };

  const [postLikes, setPostLikes] = useState<number>(42);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const toggleLike = () => {
    if (hasLiked) {
      setPostLikes(prev => prev - 1);
    } else {
      setPostLikes(prev => prev + 1);
    }
    setHasLiked(!hasLiked);
  };

  return (
    <div className="min-h-screen bg-[#070707] text-white flex flex-col font-sans overflow-x-hidden relative">
      
      {/* Visual Ambient Light glow behind header */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-[#C1FF00]/5 to-transparent pointer-events-none" />

      {/* Main Container styled beautifully with high negative space & sharp aesthetics */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 md:py-12 flex-1 flex flex-col justify-between">
        
        {/* TOP LINE: Bold brand title inspired by Swiss brutality & high contrast */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8 border-b border-white/10 pb-8 relative z-10">
          <div className="space-y-2">
            <p className="text-[#C1FF00] font-mono text-xs tracking-widest uppercase flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#C1FF00] animate-pulse" />
              TELEGRAM СВЯЗКА: КАНАЛ + БОТ + MINI APP v4.0
            </p>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black leading-[0.85] tracking-tighter uppercase font-sans">
              ХАК-ЗАРАБОТОК <span className="text-[#C1FF00]">2026</span>
            </h1>
            <p className="text-white/50 text-xs sm:text-sm font-sans tracking-tight max-w-xl">
              Запуск полностью автоматизированного бизнеса в Телеграм с выводом прямо на российские карты в рублях.
            </p>
          </div>

          <div className="text-left md:text-right bg-white/5 border border-white/10 p-4 rounded-xl shrink-0">
            <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-[#C1FF00]">
              490 ₽ – 2 990 ₽
            </div>
            <p className="text-white/40 text-[10px] uppercase font-mono tracking-widest mt-1">
              Комфортный чек подписки в рублях
            </p>
            {geminiConfigured ? (
              <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold bg-[#C1FF00]/20 text-[#C1FF00] px-2 py-0.5 rounded mt-2">
                🟢 ИИ-ДВИЖОК GEMINI АКТИВЕН
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded mt-2">
                🟡 РЕЖИМ СВЕРХБЫСТРЫХ ПРЕСЕТОВ
              </span>
            )}
          </div>
        </div>

        {/* PROMINENT ECOSYSTEM WORKSPACE TABS */}
        <div className="flex flex-wrap gap-2 mb-8 bg-zinc-900/60 p-1 rounded-xl border border-white/10 self-start z-10 relative">
          <button
            type="button"
            onClick={() => setActiveTab("ideation")}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase transition-all duration-200 ${
              activeTab === "ideation" 
                ? "bg-[#C1FF00] text-black shadow-lg" 
                : "text-white/70 hover:text-white hover:bg-white/5"
            }`}
          >
            🎯 I. Проектирование Ниши & Расчёты
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab("simulator")}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase transition-all duration-200 flex items-center gap-1.5 ${
              activeTab === "simulator" 
                ? "bg-[#C1FF00] text-black shadow-lg" 
                : "text-white/70 hover:text-white hover:bg-white/5"
            }`}
          >
            📱 II. Интерактивный Симулятор Воронки
            <span className="bg-red-500 text-white text-[8px] px-1 rounded animate-pulse">LIVE</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("competitors")}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase transition-all duration-200 ${
              activeTab === "competitors" 
                ? "bg-[#C1FF00] text-black shadow-lg" 
                : "text-white/70 hover:text-white hover:bg-white/5"
            }`}
          >
            🕵️ III. Баттл с Конкурентами (Анализ)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("code")}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase transition-all duration-200 ${
              activeTab === "code" 
                ? "bg-[#C1FF00] text-black shadow-lg" 
                : "text-white/70 hover:text-white hover:bg-white/5"
            }`}
          >
            ⚙️ IV. Код Бот-Контейнера & Старт
          </button>
        </div>

        {/* ERROR ALERTS */}
        {errorMessage && (
          <div className="bg-red-950/40 border border-red-500/40 rounded-xl p-4 mb-6 flex items-start gap-3 relative z-10">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h5 className="font-bold text-red-400 text-sm uppercase font-mono">Системная помеха</h5>
              <p className="text-xs text-white/70">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* DETAILED EDUCATIONAL SYNOPSIS EXPLAINING THE WHOLE ESSENCE */}
        <div className="mb-8 p-5 bg-gradient-to-r from-sky-950/20 to-black rounded-xl border border-sky-500/20 flex flex-col sm:flex-row items-start gap-4">
          <div className="bg-sky-500/10 p-2.5 rounded-lg shrink-0">
            <Info className="w-6 h-6 text-sky-400" />
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
              В чём фундаментальная суть проекта? Простыми словами:
            </h4>
            <p className="text-xs text-white/80 leading-relaxed font-sans">
              Обычные Telegram-каналы (просто с картинками или новостями) зарабатывают копейки на редкой и дешевой рекламе. 
              <b> Мы строим инновационную трёхфазную экосистему</b>: пользователь читает прогревающий вирусный пост в <b>Канале</b> &rarr; 
              кликает на кнопку &rarr; попадает в <b>Чат-бот</b>, который требует обязательную подписку &rarr; внутри бота запускается 
              современное <b>Mini App (встроенный сайт прямо в Telegram)</b>, где пользователь оплачивает премиум-доступ через русские платежные системы (<b>СБП, Т-Банк, СберПэй, ЮKassa в рублях</b>) за закрытые схемы экономии и лайфхаки. 
              Все автоматизировано на 100%, доход капает на русскую карту!
            </p>
          </div>
        </div>

        {/* ACTIVE TAB CONTENT DISPLAY AREA */}
        <div className="relative z-10">

          {/* TAB 1: IDEATION (Niches, calculators, day outline) */}
          {activeTab === "ideation" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Sidebar (Presets & Custom Prompt) */}
              <div className="lg:col-span-4 space-y-6">
                <NicheSelector 
                  presets={presets}
                  onSelectPreset={handleSelectPreset}
                  onAnalyzeCustom={handleAnalyzeCustom}
                  loading={loadingNiche}
                  selectedId={selectedPresetId}
                />

                <div className="p-6 bg-[#111] border border-white/5 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#C1FF00]/5 blur-3xl pointer-events-none" />
                  <div className="text-4xl font-black text-[#C1FF00] font-mono">100%</div>
                  <p className="text-xs uppercase tracking-widest font-bold mt-1 text-white/90">ЭНДОРФИНОВАЯ ВОРОНКА</p>
                  <p className="text-[10px] text-white/45 mt-2 leading-relaxed">
                    Каждый сгенерированный концепт завязан на дофаминовых качелях: раскрытие закрытых баз данных, схемы экономии, эксклюзивные инструкции или шок-расследования.
                  </p>
                </div>
              </div>

              {/* Right Column: Roadmap, calculator & content plan */}
              <div className="lg:col-span-8 space-y-8">
                {loadingNiche ? (
                  <div className="bg-[#111] border border-white/10 rounded-2xl p-16 text-center space-y-4 flex flex-col items-center justify-center">
                    <RefreshCw className="w-10 h-10 text-[#C1FF00] animate-spin" />
                    <h3 className="text-lg font-black uppercase text-white tracking-widest font-mono">
                      ИИ рассчитывает вектор взрывного роста...
                    </h3>
                    <p className="text-xs text-white/50 max-w-sm">
                      Мы анализируем ключевые запросы пользователей, просчитываем финансовую воронку и пишем план контента на 7 дней.
                    </p>
                  </div>
                ) : selectedNiche ? (
                  <div className="space-y-8">
                    
                    {/* Primary Strategy Banner */}
                    <div className="border border-white/10 bg-black rounded-2xl p-6 relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-[#C1FF00] text-black text-[10px] font-black px-3 py-1 uppercase tracking-widest leading-none">
                        СТРАТЕГИЯ
                      </div>

                      <div className="space-y-3">
                        <span className="text-[#C1FF00] font-mono text-xs uppercase tracking-wider font-bold block">
                          Концепция закрытого клуба
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
                          «{selectedNiche.title}»
                        </h2>
                        <blockquote className="border-l-2 border-[#C1FF00] pl-3 italic text-xs text-white/70">
                          "{selectedNiche.tagline}"
                        </blockquote>
                      </div>

                      <div className="mt-6 pt-5 border-t border-white/10">
                        <h4 className="text-[#C1FF00] text-xs font-bold uppercase mb-2 tracking-widest italic font-mono">
                          🔥 НЕРЕАЛЬНЫЙ ФАКТОР (СЕКРЕТНЫЙ КРЮЧОК ДЛЯ ТРАФИКА):
                        </h4>
                        <p className="text-xs text-white/80 leading-relaxed">
                          {selectedNiche.unrealFactor}
                        </p>
                      </div>

                      <div className="mt-4 text-xs text-white/50 font-mono">
                        <span className="text-white/80 font-bold uppercase">ЦЕЛЕВАЯ АУДИТОРИЯ:</span> {selectedNiche.targetAudience}
                      </div>
                    </div>

                    {/* Stage Blueprint */}
                    <div className="space-y-3">
                      <h3 className="text-[#C1FF00] text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 font-mono">
                        <Layers className="w-4 h-4 text-[#C1FF00]" />
                        ТРЁХФАЗНЫЙ ПЛАН МОНЕТИЗАЦИИ С НУЛЯ ДО 1 МЛН
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        
                        <div className="bg-white text-black p-5 rounded-xl flex flex-col justify-between space-y-4">
                          <div>
                            <span className="font-mono text-[10px] font-bold uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded">
                              СТАДИЯ I
                            </span>
                            <h4 className="text-lg font-black leading-tight uppercase mt-2">
                              ТЕСТ ВОРОНКИ
                            </h4>
                            <p className="text-[11px] mt-2 font-medium leading-snug text-black/80 font-sans">
                              {selectedNiche.monetizationBlueprint?.[0] || "Ориентация на партнерский трафик и первичную рекламу смежных каналов."}
                            </p>
                          </div>
                          <div className="text-[10px] font-mono font-bold tracking-tight text-black/50 border-t border-black/10 pt-2 flex justify-between">
                            <span>СЛОЖНОСТЬ</span>
                            <span>НИЗКАЯ / 10%</span>
                          </div>
                        </div>

                        <div className="bg-[#C1FF00] text-black p-5 rounded-xl flex flex-col justify-between space-y-4">
                          <div>
                            <span className="font-mono text-[10px] font-bold uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded">
                              СТАДИЯ II
                            </span>
                            <h4 className="text-lg font-black leading-tight uppercase mt-2">
                              РУБЛЕВЫЙ ТАРИФ
                            </h4>
                            <p className="text-[11px] mt-2 font-black leading-snug text-black font-sans">
                              {selectedNiche.monetizationBlueprint?.[1] || "Запуск платных эксклюзивных гайдов, скриптов, утилит или закрытого VIP чата."}
                            </p>
                          </div>
                          <div className="text-[10px] font-mono font-bold tracking-tight text-black/60 border-t border-black/10 pt-2 flex justify-between">
                            <span>ДОХОДНОСТЬ</span>
                            <span>СВЕРХ-ВЫСОКАЯ</span>
                          </div>
                        </div>

                        <div className="bg-[#151515] text-white p-5 rounded-xl border border-white/10 flex flex-col justify-between space-y-4">
                          <div>
                            <span className="font-mono text-[10px] font-bold uppercase tracking-wider bg-white/10 text-[#C1FF00] px-2 py-0.5 rounded">
                              СТАДИЯ III
                            </span>
                            <h4 className="text-lg font-black leading-tight uppercase mt-2 text-[#C1FF00]">
                              АВТОПИЛОТ
                            </h4>
                            <p className="text-[11px] mt-2 leading-snug text-white/70 font-sans">
                              {selectedNiche.monetizationBlueprint?.[2] || "Реклама брендов, автоматический автовебинарный воронки, продажа премиум-услуг."}
                            </p>
                          </div>
                          <div className="text-[10px] font-mono font-bold tracking-tight text-white/40 border-t border-white/5 pt-2 flex justify-between">
                            <span>ПРИБЫЛЬ</span>
                            <span>ПА СИВ ФЛОУ</span>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Calculator Integration */}
                    <Calculators channelTitle={selectedNiche.title} />

                    {/* Post previews widget */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4 border-t border-white/10">
                      
                      <div className="md:col-span-12">
                        <div className="bg-[#C1FF00]/10 border border-[#C1FF00]/30 rounded-xl p-4 mb-4 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
                            <p className="text-xs font-bold font-mono uppercase text-white">
                              Рекомендуем оценить симулятор воронки:
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setActiveTab("simulator")}
                            className="bg-[#C1FF00] hover:bg-white text-black text-[10px] font-black uppercase px-3 py-1.5 rounded transition"
                          >
                            Запустить Симулятор &rarr;
                          </button>
                        </div>
                      </div>

                      {/* Day selector */}
                      <div className="md:col-span-5 space-y-4">
                        <h3 className="text-[#C1FF00] text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 font-mono">
                          <Bookmark className="w-3.5 h-3.5" />
                          КОНТЕНТ-ПЛАН ДЛЯ КАНАЛА
                        </h3>
                        <p className="text-[11px] text-white/60 mb-2 leading-relaxed">
                          ИИ автоматически продумал сценарий удержания внимания на неделю:
                        </p>

                        <div className="space-y-2">
                          {selectedNiche.sevenDayPlanOutline?.map((dayPlan) => {
                            const isDaySelected = selectedDayNum === dayPlan.day;
                            return (
                              <button
                                key={dayPlan.day}
                                type="button"
                                onClick={() => handleDaySelect(dayPlan.day, dayPlan.topic)}
                                className={`w-full text-left p-3 rounded-xl border transition-all text-xs flex items-center gap-2.5 ${
                                  isDaySelected 
                                    ? "bg-white text-black border-white" 
                                    : "bg-[#111] text-white/80 border-white/10 hover:border-white/20 hover:bg-[#151515]"
                                }`}
                              >
                                <span className={`w-6 h-6 rounded-md font-mono font-bold text-[11px] flex items-center justify-center shrink-0 uppercase tracking-tight ${
                                  isDaySelected ? "bg-black text-[#C1FF00]" : "bg-[#1d1d1d] text-white"
                                }`}>
                                  Д{dayPlan.day}
                                </span>
                                <span className="font-medium line-clamp-1 flex-1 font-sans">{dayPlan.topic}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Phone preview of mock TG */}
                      <div className="md:col-span-7 space-y-4">
                        <h3 className="text-white/40 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 font-mono">
                          <Send className="w-3.5 h-3.5 text-sky-400" />
                          КАНАЛ В ДЕЙСТВИИ
                        </h3>

                        {loadingPost ? (
                          <div className="bg-[#161616] p-12 text-center rounded-2xl border border-white/10 flex flex-col items-center justify-center space-y-3 min-h-[350px]">
                            <RefreshCw className="w-8 h-8 text-sky-400 animate-spin" />
                            <p className="text-xs font-mono uppercase text-white tracking-widest">
                              ИИ ГЕНЕРИРУЕТ СТАТЬЮ...
                            </p>
                          </div>
                        ) : currentPost ? (
                          <div className="space-y-3">
                            <div className="bg-[#182533] rounded-2xl border border-sky-900/30 overflow-hidden shadow-2xl p-4 text-xs space-y-3">
                              
                              <div className="flex items-center gap-2.5 pb-2.5 border-b border-white/5">
                                <div className="w-8 h-8 rounded-full bg-[#C1FF00] text-black font-extrabold flex items-center justify-center font-mono text-xs">
                                  {selectedNiche.title.substring(0, 2).toUpperCase()}
                                </div>
                                <div className="leading-tight">
                                  <div className="font-bold text-white text-sm tracking-tight flex items-center gap-1">
                                    {selectedNiche.title}
                                    <span className="inline-block w-3 h-3 text-xs text-sky-400 bg-sky-900/10 rounded-full select-none text-center">✓</span>
                                  </div>
                                  <div className="text-[10px] text-sky-300 font-mono">
                                    48 912 подписчиков
                                  </div>
                                </div>
                              </div>

                              <div className="relative aspect-video rounded-lg overflow-hidden bg-black/40 border border-white/10">
                                {postImageUrl ? (
                                  <img 
                                    src={postImageUrl} 
                                    alt="Post illustration" 
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex flex-col items-center justify-center text-white/20">
                                    <ImageIcon className="w-8 h-8 stroke-1" />
                                    <span className="text-[9px] uppercase font-mono mt-1">Ожидание картинки</span>
                                  </div>
                                )}

                                {imageGenerating && (
                                  <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center space-y-2">
                                    <RefreshCw className="w-6 h-6 text-[#C1FF00] animate-spin" />
                                    <span className="text-[9px] font-mono uppercase tracking-widest text-[#C1FF00]">
                                      ИИ подбирает премиум-дизайн...
                                    </span>
                                  </div>
                                )}
                              </div>

                              <h4 className="text-sm font-extrabold text-[#C1FF00] uppercase tracking-tight">
                                {currentPost.postTitle}
                              </h4>

                              <div className="text-white/95 leading-relaxed space-y-2 whitespace-pre-wrap text-[11px] font-normal font-sans">
                                {currentPost.postText}
                              </div>

                              <div className="pt-2">
                                <button 
                                  type="button"
                                  onClick={() => setActiveTab("simulator")}
                                  className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-1.5 transition duration-200 uppercase tracking-wide text-[10px]"
                                >
                                  <span>{currentPost.ctaText || "⚡ КЛИК ДЛЯ ЧАТ-БОТА"}</span>
                                </button>
                              </div>

                              <div className="flex justify-between items-center text-[10px] text-white/40 pt-2 border-t border-white/5 font-mono">
                                <div className="flex items-center gap-3">
                                  <span><Eye className="w-3.5 h-3.5 inline mr-1" /> 8.7K</span>
                                  <span><Share2 className="w-3.5 h-3.5 inline mr-1" /> 164</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={toggleLike}
                                  className={`flex items-center gap-1 p-1 px-2 rounded-md transition ${hasLiked ? 'text-[#C1FF00]' : 'text-white/40'}`}
                                >
                                  <ThumbsUp className="w-3 h-3" /> {postLikes}
                                </button>
                              </div>

                            </div>
                          </div>
                        ) : null}
                      </div>

                    </div>

                  </div>
                ) : (
                  <div className="bg-[#111] border border-white/10 rounded-2xl p-16 text-center space-y-3 flex flex-col items-center justify-center h-[350px]">
                    <Sparkles className="w-12 h-12 text-[#C1FF00] animate-pulse" />
                    <h3 className="text-lg font-black uppercase text-white tracking-widest font-mono font-sans">
                      Загрузка стратегии ураганного роста...
                    </h3>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: INTERACTIVE ECOSYSTEM SIMULATOR (BOT & MINI APP WITH YOOKASSA RUB PAYMENT) */}
          {activeTab === "simulator" && (
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6 lg:p-8 space-y-8">
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-5">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight flex items-center gap-2">
                    <Smartphone className="w-6 h-6 text-[#C1FF00]" />
                    ПОШАГОВЫЙ СИМУЛЯТОР TELEGRAM ВОРОНКИ
                  </h2>
                  <p className="text-xs text-white/50 mt-1 uppercase font-mono">
                    Посмотрите, как работает путь клиента от рекламного поста до оплаты в рублях
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-black/60 p-2 rounded-lg border border-white/5">
                  <span className="text-[10px] font-mono text-white/50 uppercase">СТАТУС КЛУБА:</span>
                  {simulationPaid ? (
                    <span className="text-xs font-black font-mono text-[#C1FF00] bg-[#C1FF00]/10 px-2.5 py-1 rounded border border-[#C1FF00]/30 flex items-center gap-1">
                      <Unlock className="w-3 h-3" /> ОПЛАЧЕН (VIP)
                    </span>
                  ) : (
                    <span className="text-xs font-black font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> РЕЖИМ ГОСТЯ
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Steps Navigator Pane - taking 5 cols */}
                <div className="lg:col-span-5 space-y-4">
                  <h4 className="text-xs font-bold text-[#C1FF00] uppercase tracking-wider font-mono">
                    Кликните шаг для управления поведением пользователя:
                  </h4>

                  <div className="space-y-3">
                    
                    {/* step 1 */}
                    <button
                      type="button"
                      onClick={() => setSimStep(1)}
                      className={`w-full text-left p-4 rounded-xl border transition duration-150 flex items-start gap-3.5 ${
                        simStep === 1 
                          ? "bg-white text-black border-white" 
                          : "bg-black/40 text-white/70 border-white/5 hover:border-white/20"
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${
                        simStep === 1 ? "bg-black text-[#C1FF00]" : "bg-white/10 text-white/80"
                      }`}>1</span>
                      <div className="space-y-1">
                        <div className="text-xs font-extrabold uppercase tracking-tight">Рекламный пост в Канале</div>
                        <p className={`text-[11px] ${simStep === 1 ? "text-black/80" : "text-white/40"}`}>
                          Читатель видит интригующую схему в {selectedNiche?.title || "канале"} и кликает на Секретную ссылку.
                        </p>
                      </div>
                    </button>

                    {/* step 2 */}
                    <button
                      type="button"
                      onClick={() => setSimStep(2)}
                      className={`w-full text-left p-4 rounded-xl border transition duration-150 flex items-start gap-3.5 ${
                        simStep === 2 
                          ? "bg-white text-black border-white" 
                          : "bg-black/40 text-white/70 border-white/5 hover:border-white/20"
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${
                        simStep === 2 ? "bg-black text-[#C1FF00]" : "bg-white/10 text-white/80"
                      }`}>2</span>
                      <div className="space-y-1">
                        <div className="text-xs font-extrabold uppercase tracking-tight">Подписка в Чат-боте</div>
                        <p className={`text-[11px] ${simStep === 2 ? "text-black/80" : "text-white/40"}`}>
                          Бот проверяет подписку на канал и открывает встроенный Telegram Mini App.
                        </p>
                      </div>
                    </button>

                    {/* step 3 */}
                    <button
                      type="button"
                      onClick={() => setSimStep(3)}
                      className={`w-full text-left p-4 rounded-xl border transition duration-150 flex items-start gap-3.5 ${
                        simStep === 3 
                          ? "bg-white text-black border-white" 
                          : "bg-black/40 text-white/70 border-white/5 hover:border-white/20"
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${
                        simStep === 3 ? "bg-black text-[#C1FF00]" : "bg-white/10 text-white/80"
                      }`}>3</span>
                      <div className="space-y-1">
                        <div className="text-xs font-extrabold uppercase tracking-tight">Mini App: Выбор тарифа</div>
                        <p className={`text-[11px] ${simStep === 3 ? "text-black/80" : "text-white/40"}`}>
                          Внутри TG открывается витрина. Контент заблокирован красивым оверлеем с тарифами в рублях.
                        </p>
                      </div>
                    </button>

                    {/* step 4 */}
                    <button
                      type="button"
                      onClick={() => setSimStep(4)}
                      className={`w-full text-left p-4 rounded-xl border transition duration-150 flex items-start gap-3.5 ${
                        simStep === 4 
                          ? "bg-white text-black border-white" 
                          : "bg-black/40 text-white/70 border-white/5 hover:border-white/20"
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${
                        simStep === 4 ? "bg-black text-[#C1FF00]" : "bg-white/10 text-white/80"
                      }`}>4</span>
                      <div className="space-y-1">
                        <div className="text-xs font-extrabold uppercase tracking-tight">Оплата в Рублях (ЮKassa / СБП)</div>
                        <p className={`text-[11px] ${simStep === 4 ? "text-black/80" : "text-white/40"}`}>
                          Клиент видит стандартную русскую платежку. Оплачивает картой МИР, СберПэй или через СБП.
                        </p>
                      </div>
                    </button>

                    {/* step 5 */}
                    <button
                      type="button"
                      onClick={() => setSimStep(5)}
                      className={`w-full text-left p-4 rounded-xl border transition duration-155 flex items-start gap-3.5 ${
                        simStep === 5 
                          ? "bg-white text-black border-white" 
                          : "bg-black/40 text-white/70 border-white/5 hover:border-white/20"
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${
                        simStep === 5 ? "bg-black text-[#C1FF00]" : "bg-white/10 text-white/80"
                      }`}>5</span>
                      <div className="space-y-1">
                        <div className="text-xs font-extrabold uppercase tracking-tight">Мгновенный авто-доступ</div>
                        <p className={`text-[11px] ${simStep === 5 ? "text-black/80" : "text-white/40"}`}>
                          Доступ автоматически выдается! Секреты разблокированы, деньги у вас на счету.
                        </p>
                      </div>
                    </button>

                  </div>

                  <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-1.5 text-[11px] text-white/70 leading-relaxed font-mono">
                    <span className="text-[#C1FF00] font-black uppercase">💡 Важное преимущество:</span><br />
                    В отличие от сайтов, требующих заходить в браузер и вводить пароли, <b>Mini App запускается за 0.5 секунд</b> без авторизации! Данные юзера получаются автоматически из Telegram API. Конверсия в оплату выше в 3.5 раза!
                  </div>
                </div>

                {/* Simulated Screen (Mobile Frame Mockup) - taking 7 cols */}
                <div className="lg:col-span-7 flex flex-col items-center">
                  
                  {/* Smartphone Body Mockup */}
                  <div className="w-full max-w-[340px] bg-neutral-900 rounded-[44px] p-3.5 border-[6px] border-zinc-700/80 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden min-h-[580px] flex flex-col justify-between">
                    
                    {/* Phone speaker gap element */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-b-2xl z-40 flex items-center justify-center">
                      <div className="w-10 h-1 bg-zinc-800 rounded-full mb-1" />
                    </div>

                    {/* Actual screen area */}
                    <div className="bg-[#17212b] rounded-[34px] flex-1 overflow-hidden p-3 pt-8 flex flex-col text-white text-[11px] font-sans relative">
                      
                      {/* SCREEN STEP 1: CHANNEL VIEW */}
                      {simStep === 1 && (
                        <div className="flex-1 flex flex-col justify-between">
                          <div className="space-y-2">
                            {/* Fake TG header */}
                            <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 font-mono text-[9px] text-white/40 uppercase">
                              <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-pulse" />
                              Канал: {selectedNiche?.title || "Главные секреты"}
                            </div>

                            {/* Post */}
                            <div className="bg-[#182533] p-2.5 rounded-xl space-y-2">
                              <div className="w-full h-24 bg-zinc-800 rounded-lg overflow-hidden relative">
                                {postImageUrl ? (
                                  <img src={postImageUrl} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-white/20">Премиум графика</div>
                                )}
                              </div>
                              <span className="font-bold text-[#C1FF00] uppercase block text-[10px]">
                                🕵️ ЗАГОЛОВОК СВЕРХПОЛЬЗЫ
                              </span>
                              <p className="text-[10px] text-white/80 line-clamp-3 leading-snug font-sans">
                                {currentPost?.postText || "Мы взломали базу скидок и делимся бесплатным проходом. Читай схему ниже по кнопке бота..."}
                              </p>

                              <button
                                type="button"
                                onClick={() => setSimStep(2)}
                                className="w-full bg-sky-500 hover:bg-sky-400 text-white font-extrabold py-2 px-3 rounded text-[9px] uppercase tracking-wider text-center block transition-all"
                              >
                                🔗 Забрать схему в Чат-боте &rarr;
                              </button>
                            </div>
                          </div>

                          <div className="text-center p-2 text-white/30 text-[9px] font-mono">
                            Пользователь кликает на ссылку и перелетает в бот.
                          </div>
                        </div>
                      )}

                      {/* SCREEN STEP 2: BOT WELCOME SCREEN & ACTIVE CHAT */}
                      {simStep === 2 && (
                        <div className="flex-1 flex flex-col justify-between -m-3 bg-[#131d27] p-3 rounded-[34px] overflow-hidden text-white relative">
                          
                          {/* Chat header */}
                          <div className="flex items-center gap-2 pb-2.5 border-b border-white/5 shrink-0 select-none">
                            <div className="w-6 h-6 rounded-full bg-[#C1FF00] text-black font-extrabold text-[10px] flex items-center justify-center font-mono">
                              🤖
                            </div>
                            <div className="leading-tight flex-1">
                              <div className="font-bold text-[10px] text-white truncate">
                                {selectedNiche?.title || "Хак-Бот"}
                              </div>
                              <div className="text-[8px] text-[#C1FF00] font-semibold tracking-tight">
                                бот-юрист • в сети
                              </div>
                            </div>
                            <button 
                              type="button"
                              onClick={() => setSimStep(3)}
                              className="text-[9px] font-bold text-[#C1FF00] bg-[#C1FF00]/10 border border-[#C1FF00]/25 px-2 py-0.5 rounded uppercase font-mono tracking-tight"
                            >
                              Mini App &rarr;
                            </button>
                          </div>

                          {/* Scrollable Messages viewport */}
                          <div className="flex-1 overflow-y-auto py-2.5 space-y-3 pr-0.5 max-h-[290px] flex flex-col">
                            {chatMessages.map((msg, idx) => (
                              <div 
                                key={idx} 
                                className={`flex flex-col max-w-[85%] ${msg.sender === "user" ? "self-end items-end" : "self-start items-start"}`}
                              >
                                {/* Message Bubble */}
                                <div className={`p-2 rounded-2xl text-[10px] leading-relaxed shadow-md ${
                                  msg.sender === "user" 
                                    ? "bg-[#2b5278] text-white rounded-tr-none font-sans" 
                                    : "bg-[#182533] text-white/95 rounded-tl-none font-sans border border-sky-950/20"
                                }`}>
                                  {/* Formatted Text rendering */}
                                  <div className="whitespace-pre-wrap">
                                    {msg.text.split("\n").map((line, lIdx) => {
                                      const parts = line.split("**");
                                      const renderedLine = parts.map((part, pIdx) => {
                                        if (pIdx % 2 === 1) {
                                          return <strong key={pIdx} className="text-[#C1FF00] font-extrabold">{part}</strong>;
                                        }
                                        return part;
                                      });
                                      return (
                                        <div key={lIdx}>
                                          {renderedLine}
                                        </div>
                                      );
                                    })}
                                  </div>
                                  
                                  <span className="block text-[7px] text-white/30 text-right mt-1 font-mono">
                                    {msg.time}
                                  </span>
                                </div>

                                {/* Inline Keyboard Buttons inside chat bubble */}
                                {msg.buttons && msg.buttons.length > 0 && (
                                  <div className="grid grid-cols-1 gap-1.5 mt-2 w-full">
                                    {msg.buttons.map((btn, bIdx) => (
                                      <button
                                        key={bIdx}
                                        type="button"
                                        onClick={() => handleBotButtonAction(btn.action)}
                                        className="w-full bg-[#1c2e40] hover:bg-[#253c54] border border-[#2b4c6e] text-white text-[9px] font-bold py-1.5 px-3 rounded-lg text-center transition tracking-wide uppercase shadow"
                                      >
                                        {btn.text}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}

                            {typingBot && (
                              <div className="bg-[#182533] p-2.5 rounded-2xl rounded-tl-none text-[9px] text-[#C1FF00] font-mono self-start flex items-center gap-1 shrink-0">
                                <span className="w-1 h-1 bg-[#C1FF00] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-1 h-1 bg-[#C1FF00] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-1 h-1 bg-[#C1FF00] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                <span className="text-[8px] text-white/40">печатает ответ...</span>
                              </div>
                            )}
                          </div>

                          {/* Quick Suggestion Pills */}
                          <div className="flex gap-1.5 overflow-x-auto py-1.5 shrink-0 border-t border-white/5 select-none font-sans scrollbar-none">
                            <button
                              type="button"
                              onClick={() => handleSendChatMessage("/start")}
                              className="bg-black/40 hover:bg-black/70 text-white/60 hover:text-white px-2 py-1 rounded text-[8px] font-mono border border-white/5 text-center whitespace-nowrap shrink-0"
                            >
                              🏁 /start
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSendChatMessage("/buy")}
                              className="bg-black/40 hover:bg-[#C1FF00]/10 text-white/60 hover:text-[#C1FF00] px-2 py-1 rounded text-[8px] font-mono border border-white/5 text-center whitespace-nowrap shrink-0"
                            >
                              💳 /buy
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSendChatMessage("/info")}
                              className="bg-black/40 hover:bg-black/70 text-white/60 hover:text-white px-2 py-1 rounded text-[8px] font-mono border border-white/5 text-center whitespace-nowrap shrink-0"
                            >
                              ℹ️ /info
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSendChatMessage("/legal")}
                              className="bg-black/40 hover:bg-[#C1FF00]/10 text-white/60 hover:text-[#C1FF00] px-2 py-1 rounded text-[8px] font-mono border border-white/5 text-center whitespace-nowrap shrink-0"
                            >
                              📜 /legal
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSendChatMessage("/support")}
                              className="bg-black/40 hover:bg-black/70 text-white/60 hover:text-white px-2 py-1 rounded text-[8px] font-mono border border-white/5 text-center whitespace-nowrap shrink-0"
                            >
                              💬 /support
                            </button>
                          </div>

                          {/* Chat footer input bar */}
                          <form 
                            onSubmit={(e) => { e.preventDefault(); handleSendChatMessage(); }} 
                            className="flex items-center gap-1.5 mt-1 pt-1.5 border-t border-white/5 shrink-0"
                          >
                            <input
                              type="text"
                              value={userInputText}
                              onChange={(e) => setUserInputText(e.target.value)}
                              placeholder="Спросить про законы, налоги, оферту..."
                              className="flex-1 bg-black/40 border border-white/5 rounded-full px-3 py-1 text-[9px] focus:outline-none focus:border-[#C1FF00]/40 text-white placeholder-white/35 font-sans"
                            />
                            <button
                              type="submit"
                              disabled={typingBot}
                              className="w-7 h-7 bg-[#C1FF00] text-black rounded-full flex items-center justify-center transition hover:scale-105 shrink-0 disabled:opacity-50"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>
                          </form>
                          
                        </div>
                      )}

                      {/* SCREEN STEP 3: MINI APP LOCKED TARIFFS */}
                      {simStep === 3 && (
                        <div className="flex-1 flex flex-col justify-between bg-[#111] -m-3 p-3 rounded-[34px] border border-white/10">
                          
                          {/* Mini App Header inside Telegram */}
                          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
                            <div className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 bg-[#C1FF00] rounded-full" />
                              <span className="font-bold text-[10px] uppercase tracking-tight text-white/80">
                                {selectedNiche?.title || "Private VIP Club"}
                              </span>
                            </div>
                            <span className="text-[10px] text-white/40 font-mono">••• ✕</span>
                          </div>

                          <div className="space-y-3 flex-1 overflow-y-auto pr-0.5">
                            
                            {/* Blocked info message */}
                            <div className="text-center py-2 space-y-1">
                              <span className="inline-block bg-[#C1FF00]/10 text-[#C1FF00] font-mono text-[8px] px-2 py-0.5 rounded-full uppercase font-bold tracking-widest">
                                VIP МАТЕРИАЛЫ
                              </span>
                              <h5 className="text-xs font-black uppercase text-white tracking-wide">
                                ДОСТУП ОГРАНИЧЕН 🔒
                              </h5>
                              <p className="text-[9px] text-white/50 max-w-[200px] mx-auto leading-relaxed">
                                Для бесконечного просмотра схем выберите любой комфортный тариф в рублях:
                              </p>
                            </div>

                            {/* Tariffs List */}
                            <div className="space-y-2">
                              {/* Option 1 */}
                              <div className="bg-black/80 p-2.5 rounded-xl border border-white/5 flex items-center justify-between hover:border-[#C1FF00]/30 transition group select-none">
                                <div className="space-y-0.5">
                                  <span className="text-[9px] font-bold text-white uppercase block">Пробный период (7 дней)</span>
                                  <span className="text-[8px] text-white/50">Доступ ко всем схемам</span>
                                </div>
                                <div className="text-right">
                                  <span className="font-mono text-xs font-black text-[#C1FF00]">149 ₽</span>
                                  <button
                                    type="button"
                                    onClick={() => { setCheckoutPrice(149); setSimStep(4); }}
                                    className="block text-[8px] bg-[#C1FF00] text-black px-2 py-0.5 rounded font-bold uppercase tracking-tight mt-1"
                                  >
                                    Выбрать
                                  </button>
                                </div>
                              </div>

                              {/* Option 2 (Most Popular) */}
                              <div className="bg-gradient-to-r from-zinc-900 to-black p-2.5 rounded-xl border-2 border-[#C1FF00] flex items-center justify-between select-none">
                                <div className="space-y-0.5">
                                  <span className="text-[9px] font-black text-[#C1FF00] uppercase block">VIP Безлимит (Месяц)</span>
                                  <span className="text-[8px] text-[#C1FF00]/70">🔥 Топ выбор владельцев</span>
                                </div>
                                <div className="text-right">
                                  <span className="font-mono text-xs font-black text-[#C1FF00]">490 ₽</span>
                                  <button
                                    type="button"
                                    onClick={() => { setCheckoutPrice(490); setSimStep(4); }}
                                    className="block text-[8px] bg-white text-black px-2 py-0.5 rounded font-bold uppercase tracking-tight mt-1"
                                  >
                                    Выбрать
                                  </button>
                                </div>
                              </div>

                              {/* Option 3 */}
                              <div className="bg-black/80 p-2.5 rounded-xl border border-white/5 flex items-center justify-between select-none">
                                <div className="space-y-0.5">
                                  <span className="text-[9px] font-bold text-white uppercase block">VIP НАВСЕГДА</span>
                                  <span className="text-[8px] text-white/50">Все будущие обновления</span>
                                </div>
                                <div className="text-right">
                                  <span className="font-mono text-xs font-black text-white">1 490 ₽</span>
                                  <button
                                    type="button"
                                    onClick={() => { setCheckoutPrice(1490); setSimStep(4); }}
                                    className="block text-[8px] bg-[#C1FF00] text-black px-2 py-0.5 rounded font-bold uppercase tracking-tight mt-1"
                                  >
                                    Выбрать
                                  </button>
                                </div>
                              </div>

                            </div>

                          </div>

                          <div className="text-center text-white/40 text-[8px] uppercase tracking-widest font-mono">
                            безопасная оплата • картой рф
                          </div>
                        </div>
                      )}

                      {/* SCREEN STEP 4: YOOKASSA / SBP PAYMENT PAGE */}
                      {simStep === 4 && (
                        <div className="flex-1 flex flex-col justify-between bg-white text-black -m-3 p-3.5 rounded-[34px] shadow-inner font-sans">
                          
                          {/* Payment Header */}
                          <div className="space-y-1 pb-2 border-b border-black/10">
                            <div className="flex justify-between items-center text-[10px] text-black/50 font-mono uppercase">
                              <span>Себиева Рояна / startappai.ru</span>
                              <span className="font-bold text-sky-600">ЮKassa</span>
                            </div>
                            <h5 className="text-xs font-black uppercase text-black tracking-tight flex items-center justify-between">
                              <span>Оплата подписки VIP</span>
                              <span className="text-sm font-black font-mono text-sky-600">{checkoutPrice} ₽</span>
                            </h5>
                          </div>

                          {/* Payment Options Selection */}
                          <div className="space-y-3 my-auto">
                            
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() => setPaymentMethod("sbp")}
                                className={`p-2 rounded-xl text-center border text-[9px] font-bold uppercase flex flex-col items-center gap-1 transition ${
                                  paymentMethod === "sbp" 
                                    ? "bg-sky-50 border-sky-500 text-sky-700" 
                                    : "bg-neutral-50 border-neutral-200 text-black/60"
                                }`}
                              >
                                ⚡ Система СБП
                                <span className="text-[7px] text-neutral-450">Мгновенно</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setPaymentMethod("card")}
                                className={`p-2 rounded-xl text-center border text-[9px] font-bold uppercase flex flex-col items-center gap-1 transition ${
                                  paymentMethod === "card" 
                                    ? "bg-sky-50 border-sky-500 text-sky-700" 
                                    : "bg-neutral-50 border-neutral-200 text-black/60"
                                }`}
                              >
                                <CreditCard className="w-3.5 h-3.5" /> Карты РФ
                                <span className="text-[7px] text-neutral-450">МИР / Visa / СБЕР</span>
                              </button>
                            </div>

                            {paymentMethod === "sbp" ? (
                              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 text-center space-y-2">
                                <div className="w-16 h-16 bg-neutral-900 mx-auto rounded-lg flex items-center justify-center p-1">
                                  {/* Minimalist simulated QR matrix */}
                                  <div className="grid grid-cols-3 gap-1 bg-white p-1 rounded">
                                    <span className="w-3 h-3 bg-black" />
                                    <span className="w-3 h-3 bg-black" />
                                    <span className="w-3 h-3 bg-black" />
                                    <span className="w-3 h-3 bg-black" />
                                    <span className="w-3 h-3 bg-neutral-200" />
                                    <span className="w-3 h-3 bg-black" />
                                    <span className="w-3 h-3 bg-black" />
                                    <span className="w-3 h-3 bg-black" />
                                    <span className="w-3 h-3 bg-black" />
                                  </div>
                                </div>
                                <p className="text-[8px] text-neutral-500 max-w-[200px] mx-auto leading-normal">
                                  Отсканируйте код или нажмите кнопку ниже для мгновенной оплаты в приложении вашего банка.
                                </p>
                              </div>
                            ) : (
                              <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 space-y-2">
                                <div className="space-y-1">
                                  <span className="text-[8px] font-mono text-neutral-500 uppercase block">Номер карты</span>
                                  <input 
                                    type="text" 
                                    placeholder="2200 4500 1234 5678" 
                                    readOnly 
                                    className="w-full bg-white border border-neutral-200 p-1.2 rounded text-[10px] focus:outline-none" 
                                    value="2200 4500 1234 5678"
                                  />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <span className="text-[8px] font-mono text-neutral-500 uppercase block">Срок</span>
                                    <input type="text" placeholder="12/28" readOnly className="w-full bg-white border border-neutral-200 p-1 rounded text-[10px]" value="12/28" />
                                  </div>
                                  <div>
                                    <span className="text-[8px] font-mono text-neutral-500 uppercase block">CVC</span>
                                    <input type="password" placeholder="***" readOnly className="w-full bg-white border border-neutral-200 p-1 rounded text-[10px]" value="999" />
                                  </div>
                                </div>
                              </div>
                            )}

                          </div>

                          <div className="space-y-2">
                            <button
                              type="button"
                              onClick={handleExecutePayment}
                              className="w-full bg-sky-600 hover:bg-sky-500 text-white font-black py-2.5 rounded-xl text-[10px] uppercase tracking-wide text-center"
                            >
                              ✓ Подтвердить плату {checkoutPrice} ₽
                            </button>

                            <button
                              type="button"
                              onClick={() => setSimStep(3)}
                              className="w-full text-center text-[9px] text-neutral-400 hover:text-black uppercase font-mono tracking-tight"
                            >
                              &larr; Назад к тарифам
                            </button>
                          </div>
                        </div>
                      )}

                      {/* SCREEN STEP 5: VIP ACCESS GRANTED */}
                      {simStep === 5 && (
                        <div className="flex-1 flex flex-col justify-between bg-zinc-950 -m-3 p-3.5 rounded-[34px] border-2 border-[#C1FF00]">
                          
                          {/* Checked header */}
                          <div className="text-center py-2 space-y-1 border-b border-[#C1FF00]/20">
                            <h5 className="text-[11px] font-black uppercase text-white tracking-wide">
                              ДОСТУП ОТКРЫТ! 🎉
                            </h5>
                            <p className="text-[8px] text-[#C1FF00] uppercase font-mono font-bold tracking-widest">
                              СТАТУС: {showYooKassaReceipt ? "ФИСКАЛИЗИРОВАН (ФЗ-54)" : "VIP-КЛИЕНТ (АКТИВНО)"}
                            </p>
                          </div>

                          {/* Toggle between Content and Electronic Receipt */}
                          <div className="grid grid-cols-2 gap-1.5 p-1 bg-white/5 rounded-lg border border-white/10 my-1">
                            <button
                              type="button"
                              onClick={() => setShowYooKassaReceipt(false)}
                              className={`py-1 rounded text-[8px] uppercase font-extrabold tracking-tight transition ${
                                !showYooKassaReceipt 
                                  ? "bg-[#C1FF00] text-black" 
                                  : "text-white/70 hover:text-white"
                              }`}
                            >
                              🔑 Секреты клуба
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowYooKassaReceipt(true)}
                              className={`py-1 rounded text-[8px] uppercase font-extrabold tracking-tight transition ${
                                showYooKassaReceipt 
                                  ? "bg-[#C1FF00] text-black" 
                                  : "text-white/70 hover:text-white"
                              }`}
                            >
                              📄 Чек ФЗ-54 (ЮKassa)
                            </button>
                          </div>

                          {/* Secret Locked content unlocked */}
                          {!showYooKassaReceipt ? (
                            <div className="space-y-2.5 flex-grow my-auto overflow-y-auto max-h-[220px] pr-1">
                              <div className="p-2.5 bg-neutral-900 rounded-xl border border-white/5 space-y-1">
                                <span className="text-[8px] font-mono text-[#C1FF00] uppercase font-black block">🔑 СУПЕР-СХЕМА №1:</span>
                                <p className="text-[9px] text-white/95 leading-relaxed">
                                  Как бесплатно питаться в ресторанах РФ за счет багов партнерских акций агрегаторов доставки.
                                </p>
                              </div>

                              <div className="p-2.5 bg-neutral-900 rounded-xl border border-white/5 space-y-1">
                                <span className="text-[8px] font-mono text-[#C1FF00] uppercase font-black block">💰 ЛАЙФХАК №2:</span>
                                <p className="text-[9px] text-white/95 leading-relaxed">
                                  Экономия до 65% на покупке дорогой техники (Apple, Dyson) через СберМегаМаркет + кэшбэк.
                                </p>
                              </div>

                              <div className="p-2.5 bg-neutral-900 rounded-xl border border-white/5 space-y-1">
                                <span className="text-[8px] font-mono text-[#C1FF00] uppercase font-black block">🔐 БОНУС МЕСЯЦА:</span>
                                <p className="text-[9px] text-white/95 leading-relaxed">
                                  Секретная база закрытых промокодов Сбермаркет со скидкой 1000 ₽ на любую корзину.
                                </p>
                              </div>
                            </div>
                          ) : (
                            /* OFFICIAL COMPLIANCE RECEIPT (ЧЕК ФЗ-54) DESIGNED PERFECTLY FOR YOOMONEY MODERATION SCREENSHOTS */
                            <div className="bg-[#fcfbf7] text-black p-3 rounded-lg border border-neutral-300 font-mono text-[8px] flex-grow my-auto shadow-md leading-tight overflow-y-auto max-h-[220px] pr-1 select-text">
                              <div className="text-center font-bold pb-1 text-[9px] border-b border-dashed border-black/30">
                                КАССОВЫЙ ЧЕК / ПРИХОД
                              </div>
                              
                              <div className="space-y-0.5 pt-1.5 pb-1.5 border-b border-dashed border-black/30">
                                <div className="flex justify-between">
                                  <span>ПРОДАВЕЦ:</span>
                                  <span className="font-bold">Самозанятая Себиева Рояна</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>ИНН:</span>
                                  <span className="font-bold">770980461804</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>РЕЖИМ НАЛОГА:</span>
                                  <span>НПД (Самозанятый)</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>БАНК СМЗ:</span>
                                  <span>ООО "ОЗОН БАНК"</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>АДРЕС ККТ:</span>
                                  <span>startappai.ru</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>ОПЕРАТОР:</span>
                                  <span>ООО НКО "ЮМани"</span>
                                </div>
                              </div>

                              <div className="py-1.5 border-b border-dashed border-black/30 text-[8px] leading-snug">
                                <span className="font-bold block uppercase">НАИМЕНОВАНИЕ УСЛУГИ:</span>
                                <div className="pl-1">
                                  Предоставление платного VIP-доступа на 30 дней («{selectedNiche?.title || "Хак-Заработок"}»)
                                </div>
                                <div className="flex justify-between font-bold pt-1">
                                  <span>ИТОГО К ОПЛАТЕ:</span>
                                  <span>{checkoutPrice}.00 ₽</span>
                                </div>
                                <div className="flex justify-between text-[7px] text-black/60">
                                  <span>В т.ч. НДС:</span>
                                  <span>Без НДС (УСН)</span>
                                </div>
                              </div>

                              <div className="py-1 border-b border-dashed border-black/30 text-[7px] space-y-0.5">
                                <div className="flex justify-between">
                                  <span>ОПЛАЧЕНО СБП:</span>
                                  <span>{checkoutPrice}.00 ₽</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>ДАТА ЧЕКА:</span>
                                  <span>{new Date().toLocaleDateString('ru-RU')} {new Date().toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'})}</span>
                                </div>
                                <div className="flex justify-between font-bold text-sky-700">
                                  <span>ТРАНЗАКЦИЯ:</span>
                                  <span>УСПЕШНО OPL_89321</span>
                                </div>
                              </div>

                              <div className="pt-1.5 flex items-start gap-1.5">
                                {/* Digital Simulated QR Code */}
                                <div className="w-9 h-9 bg-black shrink-0 p-0.5 rounded flex flex-wrap justify-between">
                                  <div className="w-1.5 h-1.5 bg-white" />
                                  <div className="w-1.5 h-1.5 bg-white" />
                                  <div className="w-1.5 h-1.5 bg-white" />
                                  <div className="w-full h-0.5" />
                                  <div className="w-1 h-1.5 bg-white" />
                                  <div className="w-1.5 h-1 bg-white" />
                                  <div className="w-1.5 h-1.5 bg-white" />
                                </div>
                                <div className="text-[6px] text-black/70 space-y-0.5 self-center">
                                  <div>РН ККТ: 000459321104889</div>
                                  <div>ФН №: 9945440302928131</div>
                                  <div>ФД: 00388912 • ФП: 382902911</div>
                                  <span className="font-bold text-emerald-700">ФЗ-54 ФИСКАЛИЗИРОВАНО</span>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="space-y-2 mt-1">
                            {showYooKassaReceipt && (
                              <div className="text-[7.5px] bg-sky-950/40 border border-sky-500/20 text-sky-450 p-1 rounded text-center leading-normal">
                                📸 <b>Сделайте скриншот этого экрана с чеком</b> и пошлите модератору ЮКассы. Это идеальное подтверждение соответствия ФЗ-54!
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={() => { setSimulationPaid(false); setSimStep(1); setShowYooKassaReceipt(false); }}
                              className="w-full bg-neutral-800 hover:bg-neutral-700 text-white font-extrabold py-2 rounded text-[9px] uppercase tracking-wide"
                            >
                              🔄 СБРОСИТЬ ТЕСТ (СИМУЛИРОВАТЬ СНОВА)
                            </button>
                          </div>
                        </div>
                      )}

                    </div>

                    {/* Home Indicator Button on fake iPhone */}
                    <div className="w-28 h-1 bg-zinc-650 rounded-full mx-auto mt-2" />
                  </div>

                </div>

              </div>

              {/* Status Indicator popup when SBP Paid */}
              {showTransactionAlert && (
                <div className="fixed bottom-6 right-6 bg-[#C1FF00] text-black p-4 rounded-xl border border-black/25 shadow-2xl z-50 flex items-center gap-3 animate-fade-in font-mono max-w-sm">
                  <span className="w-3 h-3 bg-red-500 rounded-full animate-ping" />
                  <div className="text-[11px] leading-tight select-none">
                    <span className="font-bold uppercase tracking-wider block">УВЕДОМЛЕНИЕ ПЛАТЕЖКИ (MOCK):</span>
                    ЮKassa зачислила <b>{checkoutPrice} руб.</b> по СБП! Оплата подтверждена. VIP-доступ открыт.
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 3: COMPETITORS MATRIX COOLDOWN */}
          {activeTab === "competitors" && (
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6 lg:p-8 space-y-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-[#C1FF00]" />
                  АНАЛИЗ КОНКУРЕНТОВ: ПОЧЕМУ МЫ ДОЛЖНЫ БЫТЬ САМЫМИ КРУТЫМИ?
                </h2>
                <p className="text-xs text-white/50 mt-1 uppercase font-mono">
                  Сравнительный анализ и наше убийственное преимущество, гарантирующее прибыль
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Traditional old boring channels */}
                <div className="p-5 bg-black/60 rounded-xl border border-red-500/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase bg-red-950/40 text-red-400 px-2 py-0.5 rounded">
                      ⚠️ КАК ДЕЛАЮТ ВСЕ (КУСТАРНО)
                    </span>
                    <span className="text-xs font-bold text-red-500 font-mono">Шумы / Убыток</span>
                  </div>

                  <h3 className="text-lg font-black text-white uppercase tracking-tight">
                    Обычные "Паблики со схемами"
                  </h3>

                  <p className="text-xs text-white/70 leading-relaxed font-sans">
                    Большинство создателей просто копируют старые заезженные тексты дебетовых карт из интернета. 
                    У них нет автоматизации. Люди заходят, читают 1-2 поста, не получают осязаемого результата 
                    и отписываются. Монетизация идет только за счет редкой продажи дешевой скам-рекламы ставок.
                  </p>

                  <div className="p-3.5 bg-red-950/20 rounded-lg text-xs space-y-1.5 border border-red-500/10 font-mono">
                    <div className="text-[11px] font-black uppercase text-red-400">Критический минус:</div>
                    <ul className="list-disc pl-4 space-y-1 text-white/60 text-[10px]">
                      <li>Огромная отписка (выгорание трафика за 2 недели)</li>
                      <li>Нет собственного продукта или закрытого портала</li>
                      <li>Сложный вход новичков</li>
                    </ul>
                  </div>
                </div>

                {/* Our Automated system secrets model & VIP sub-club */}
                <div className="p-5 bg-[#C1FF00]/5 rounded-xl border border-[#C1FF00]/20 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase bg-[#C1FF00]/10 text-[#C1FF00] px-2 py-0.5 rounded font-bold">
                      🔥 НАШЕ ИННОВАЦИОННОЕ РЕШЕНИЕ (BLUE OCEAN)
                    </span>
                    <span className="text-xs font-black text-[#C1FF00] font-mono">ЛИДЕР РЫНКА</span>
                  </div>

                  <h3 className="text-lg font-black text-white uppercase tracking-tight">
                    Связка Бот-Фильтр + Mini App Клуб
                  </h3>

                  <p className="text-xs text-white/80 leading-relaxed">
                    Мы даем человеку <b>интерактивный инструмент</b> прямо внутри мессенджера. Пользователь 
                    чувствует себя исследователем. Наличие залоченного контента создает мощный дефицит информации. 
                    А легкая встроенная оплата через СБП прямо в Mini App без ввода карт обеспечивает космическую 
                    конверсию!
                  </p>

                  <div className="p-3.5 bg-[#C1FF00]/10 rounded-lg text-xs space-y-1.5 border border-[#C1FF00]/20 font-mono">
                    <div className="text-[11px] font-black uppercase text-[#C1FF00]">Наши козыри:</div>
                    <ul className="list-disc pl-4 space-y-1 text-white/80 text-[10px]">
                      <li>100% рублевая локализация под СНГ аудиторию</li>
                      <li>Обязательная автоматическая подписка перед заходом</li>
                      <li>Материалы ИИ генерируются регулярно, защищая от выгорания</li>
                    </ul>
                  </div>
                </div>

              </div>

              {/* Profit Table matrix */}
              <div className="p-6 bg-black/40 rounded-xl border border-white/5 space-y-3 font-mono">
                <h4 className="text-xs font-black uppercase text-white tracking-widest text-[#C1FF00] flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-[#C1FF00]" />
                  ЭКОНОМИКА / ПРОГНОЗ ОКУПАЕМОСТИ НАША КОРЗИНА (В РУБЛЯХ)
                </h4>
                <div className="overflow-x-auto text-[11px]">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-white/50">
                        <th className="py-2">Метрика</th>
                        <th className="py-2">Обычный паблик</th>
                        <th className="py-2 text-[#C1FF00]">Наша авто-воронка</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-white/80">
                      <tr>
                        <td className="py-2 font-bold">Подписчики с рекламы</td>
                        <td className="py-2">1,000 человек</td>
                        <td className="py-3 text-[#C1FF00] font-bold">1,800 человек (за счет Bot-фильтра)</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-bold">Конверсия в VIP статус</td>
                        <td className="py-2">0.5% (через чаты вручную)</td>
                        <td className="py-3 text-[#C1FF00] font-bold">4.8% (через СБП в Mini App)</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-bold">Средний чек</td>
                        <td className="py-2">0 руб</td>
                        <td className="py-3 text-[#C1FF00] font-bold">490 рублей</td>
                      </tr>
                      <tr className="text-white">
                        <td className="py-2 font-black">Чистая прибыль в мес</td>
                        <td className="py-2 text-red-400">~ 5 000 руб</td>
                        <td className="py-3 text-[#C1FF00] font-black bg-[#C1FF00]/5 px-1 rounded">~ 42 330 руб</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: CODE SETUP CODE AND STEP BY STEP BLUEPRINT */}
          {activeTab === "code" && (
            <BotCodeTemplate />
          )}

        </div>

        {/* BOTTOM SECTION: Social proof metrics footer styled with bold aesthetic */}
        <div className="mt-12 flex flex-col md:flex-row items-center gap-6 border-t border-white/10 pt-8 pb-4 relative z-10 text-center md:text-left">
          <div className="flex -space-x-3 select-none">
            <span className="w-8 h-8 rounded-full bg-slate-800 border-2 border-black flex items-center justify-center text-[10px] font-bold">🔥</span>
            <span className="w-8 h-8 rounded-full bg-[#111] border-2 border-black flex items-center justify-center text-[10px] font-bold">🤖</span>
            <span className="w-8 h-8 rounded-full bg-slate-700 border-2 border-black flex items-center justify-center text-[10px] font-bold">₽</span>
          </div>
          <div className="text-[11px] uppercase tracking-[0.1em] font-mono text-white/60">
            Этот планер использует передовые модели <span className="text-[#C1FF00] italic font-bold">Gemini 3.5 Flash</span> для расчета схем удержания. 
            Все готово к продвижению.
          </div>
          <div className="md:ml-auto text-[10px] font-mono text-[#C1FF00] border border-[#C1FF00] p-1.5 px-3 uppercase tracking-widest rounded-md bg-[#C1FF00]/5 hover:bg-[#C1FF00]/20 transition duration-200">
            Платформа монетизации готова 🚀
          </div>
        </div>

      </div>

    </div>
  );
}
