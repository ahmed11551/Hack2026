import React, { useState, useEffect } from "react";
import { Coins, Users, Percent, Flame, Sparkles } from "lucide-react";

interface CalculatorsProps {
  channelTitle: string;
}

export default function Calculators({ channelTitle }: CalculatorsProps) {
  // Preset defaults
  const [subsCount, setSubsCount] = useState(15000);
  const [adPrice, setAdPrice] = useState(3500);
  const [adsCount, setAdsCount] = useState(12);
  const [vipPrice, setVipPrice] = useState(1490);
  const [vipConversion, setVipConversion] = useState(1.5); // 1.5%

  // Calculated variables
  const [adRevenue, setAdRevenue] = useState(0);
  const [vipRevenue, setVipRevenue] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const adsTotal = adPrice * adsCount;
    const vipBuyersCount = Math.round(subsCount * (vipConversion / 100));
    const vipTotal = vipBuyersCount * vipPrice;
    
    setAdRevenue(adsTotal);
    setVipRevenue(vipTotal);
    setTotalRevenue(adsTotal + vipTotal);
  }, [subsCount, adPrice, adsCount, vipPrice, vipConversion]);

  const handleScalePreset = (size: "small" | "medium" | "large") => {
    if (size === "small") {
      setSubsCount(5000);
      setAdPrice(1500);
      setAdsCount(8);
      setVipPrice(990);
      setVipConversion(2.0);
    } else if (size === "medium") {
      setSubsCount(20000);
      setAdPrice(4500);
      setAdsCount(12);
      setVipPrice(1490);
      setVipConversion(1.5);
    } else {
      setSubsCount(60000);
      setAdPrice(12000);
      setAdsCount(16);
      setVipPrice(2490);
      setVipConversion(1.2);
    }
  };

  const getEarningStatusMessage = () => {
    if (totalRevenue < 100000) {
      return { text: "⚡ Хорош для старта. Прекрасный пассивный доход, требующий 1-2 часа в день.", color: "text-white/80" };
    }
    if (totalRevenue < 500000) {
      return { text: "🔥 Продвинутый уровень! Полная замена работы и формирование личного бренда.", color: "text-[#C1FF00]" };
    }
    return { text: "👑 МЕДИА-МАГНАТ! Вы входите в элиту Telegram в СНГ с доходом уровня ТОП-компаний.", color: "text-[#C1FF00] font-black tracking-wide" };
  };

  const status = getEarningStatusMessage();

  return (
    <div className="bg-[#111] border border-white/10 rounded-2xl p-6 space-y-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#C1FF00]/5 blur-[80px] rounded-full pointer-events-none" />
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <h3 className="text-[#C1FF00] text-sm font-black uppercase tracking-widest flex items-center gap-2 font-mono">
            <Coins className="text-[#C1FF00] w-4 h-4" />
            III. КАЛЬКУЛЯТОР МОНЕТИЗАЦИИ
          </h3>
          <p className="text-[11px] text-white/40 mt-1 uppercase font-mono">
            Бизнес-модель канала «{channelTitle || "БЕЗ НАЗВАНИЯ"}»
          </p>
        </div>
        <div className="flex gap-1 bg-black p-1 rounded border border-white/10 self-start sm:self-auto">
          <button 
            type="button"
            onClick={() => handleScalePreset("small")} 
            className="text-[9px] px-2 py-1 text-white/50 hover:text-white rounded hover:bg-white/5 font-mono uppercase tracking-tight"
          >
            5k суб
          </button>
          <button 
            type="button"
            onClick={() => handleScalePreset("medium")} 
            className="text-[9px] px-2 py-1 text-white/50 hover:text-white rounded hover:bg-white/5 font-mono uppercase tracking-tight"
          >
            20k суб
          </button>
          <button 
            type="button"
            onClick={() => handleScalePreset("large")} 
            className="text-[9px] px-2 py-1 text-white/50 hover:text-white rounded hover:bg-white/5 font-mono uppercase tracking-tight"
          >
            60k суб
          </button>
        </div>
      </div>

      {/* Main calculation preview grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-black/60 p-4 rounded-xl border border-white/10">
          <span className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest block">
            ПРЯМАЯ РЕКЛАМА
          </span>
          <div className="text-xl font-black font-mono text-white mt-1">
            {adRevenue.toLocaleString()} ₽
          </div>
          <span className="text-[10px] font-mono text-white/40 block mt-1">
            {adsCount} разм. × {adPrice.toLocaleString()} ₽
          </span>
        </div>

        <div className="bg-black/60 p-4 rounded-xl border border-white/10">
          <span className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest block">
            ПРИВАТНЫЙ ЧАТ / VIP
          </span>
          <div className="text-xl font-black font-mono text-white mt-1">
            {vipRevenue.toLocaleString()} ₽
          </div>
          <span className="text-[10px] font-mono text-white/40 block mt-1">
            {Math.round(subsCount * (vipConversion / 100))} чел ({vipConversion}%) × {vipPrice.toLocaleString()} ₽
          </span>
        </div>

        <div className="bg-[#C1FF00]/10 p-4 rounded-xl border border-[#C1FF00]/40 relative overflow-hidden">
          <div className="absolute top-2 right-2 opacity-10">
            <Sparkles className="w-8 h-8 text-[#C1FF00]" />
          </div>
          <span className="text-[10px] font-mono font-black text-[#C1FF00] uppercase tracking-widest flex items-center gap-1">
            <Flame className="w-3.5 h-3.5" />
            ИТОГ В МЕСЯЦ
          </span>
          <div className="text-2xl font-black font-mono text-[#C1FF00] mt-1">
            {totalRevenue.toLocaleString()} ₽
          </div>
          <span className="text-[10px] text-white/60 block mt-1 font-mono uppercase">
            РЕАЛЬНЫЙ ПОТЕНЦИАЛ
          </span>
        </div>
      </div>

      {/* Interactive sliders container styled to look clean and techy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-black p-5 rounded-xl border border-white/5">
        
        {/* Left column */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest font-mono flex items-center gap-1.5 border-b border-white/10 pb-1.5">
            <Users className="w-3.5 h-3.5 text-[#C1FF00]" />
            Рекламный поток
          </h4>

          <div>
            <div className="flex justify-between text-xs mb-1 font-mono">
              <span className="text-white/50">Подписчики (Трафик):</span>
              <span className="font-bold text-white">{subsCount.toLocaleString()} чел.</span>
            </div>
            <input 
              type="range" 
              min="1000" 
              max="150000" 
              step="1000"
              value={subsCount} 
              onChange={(e) => setSubsCount(Number(e.target.value))}
              className="w-full accent-[#C1FF00] bg-neutral-900 rounded-lg cursor-pointer h-1.5"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1 font-mono">
              <span className="text-white/50">Цена 1 рекламы (CPM):</span>
              <span className="font-bold text-[#C1FF00]">{adPrice.toLocaleString()} ₽</span>
            </div>
            <input 
              type="range" 
              min="500" 
              max="35000" 
              step="100"
              value={adPrice} 
              onChange={(e) => setAdPrice(Number(e.target.value))}
              className="w-full accent-[#C1FF00] bg-neutral-900 rounded-lg cursor-pointer h-1.5"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1 font-mono">
              <span className="text-white/50 font-sans">Количество рекламных постов:</span>
              <span className="font-bold text-white">{adsCount} в месяц</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="30" 
              step="1"
              value={adsCount} 
              onChange={(e) => setAdsCount(Number(e.target.value))}
              className="w-full accent-[#C1FF00] bg-neutral-900 rounded-lg cursor-pointer h-1.5"
            />
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest font-mono flex items-center gap-1.5 border-b border-white/10 pb-1.5">
            <Percent className="w-3.5 h-3.5 text-[#C1FF00]" />
            Приватные сервисы & Услуги
          </h4>

          <div>
            <div className="flex justify-between text-xs mb-1 font-mono">
              <span className="text-white/50">Цена VIP / Подписки на услуги:</span>
              <span className="font-bold text-[#C1FF00]">{vipPrice.toLocaleString()} ₽</span>
            </div>
            <input 
              type="range" 
              min="290" 
              max="10000" 
              step="100"
              value={vipPrice} 
              onChange={(e) => setVipPrice(Number(e.target.value))}
              className="w-full accent-[#C1FF00] bg-neutral-900 rounded-lg cursor-pointer h-1.5"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1 font-mono">
              <span className="text-white/50">Конверсия аудитории:</span>
              <span className="font-bold text-white">{vipConversion}%</span>
            </div>
            <input 
              type="range" 
              min="0.1" 
              max="10" 
              step="0.1"
              value={vipConversion} 
              onChange={(e) => setVipConversion(Number(e.target.value))}
              className="w-full accent-[#C1FF00] bg-neutral-900 rounded-lg cursor-pointer h-1.5"
            />
          </div>

          <div className="p-3 bg-neutral-950 rounded-lg border border-white/10 text-[10px] text-white/60 leading-relaxed font-sans">
            🔥 <b>Совет эксперта:</b> Чем более уникальный контент вы даете (тот самый <b>«нереальный фактор»</b>), тем выше готовность людей покупать эксклюзив. Наша цель — поднять её выше 2%!
          </div>
        </div>
      </div>

      <div className="p-3 bg-neutral-900 border border-white/10 rounded-xl text-center">
        <span className={`text-xs uppercase font-mono tracking-wider ${status.color}`}>
          {status.text}
        </span>
      </div>
    </div>
  );
}
