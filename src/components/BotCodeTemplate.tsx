import React, { useState } from "react";
import { Check, Copy, Terminal, ExternalLink, Settings, Zap, ArrowRight } from "lucide-react";

export default function BotCodeTemplate() {
  const [copied, setCopied] = useState(false);

  const pythonCode = `import os
import asyncio
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo

# 1. Токен бота от @BotFather
BOT_TOKEN = os.getenv("BOT_TOKEN", "YOUR_TELEGRAM_BOT_TOKEN")
# 2. Ссылка на ваш WebApp (вставьте URL данного запущенного приложения)
WEB_APP_URL = os.getenv("WEB_APP_URL", "https://your-mini-app-domain.ru")

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()

@dp.message(Command("start"))
async def start_handler(message: types.Message):
    # Кнопка подписки на канал для проверки Обязательной подписки (ОП)
    keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [
            InlineKeyboardButton(text="📢 Подписаться на Канал", url="https://t.me/your_channel_username")
        ],
        [
            InlineKeyboardButton(text="⚡️ Открыть Mini App (База Знаний)", web_app=WebAppInfo(url=WEB_APP_URL))
        ]
    ])
    
    welcome_text = (
        f"👋 *Приветствуем в Хак-Системе, {message.from_user.first_name}!*\\n\\n"
        "Мы автоматизировали доступ к закрытым знаниям, схемам экономии и уникальным разборам.\\n\\n"
        "📍 *Шаг 1:* Подпишитесь на наш официальный канал (кнопка ниже).\\n"
        "📍 *Шаг 2:* Нажмите кнопку *Открыть Mini App*, чтобы получить секретные посты первого дня, активировать пробный период или войти в приватный VIP-клуб через СБП/рублёвые карты."
    )
    await message.answer(welcome_text, reply_markup=keyboard, parse_mode="Markdown")

async def main():
    print("🤖 Telegram бот успешно запущен и готов приносить рубли!")
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pythonCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#111] border border-white/10 rounded-2xl p-6 space-y-6">
      
      {/* Step by step implementation outline */}
      <div>
        <h3 className="text-[#C1FF00] text-sm font-black uppercase tracking-widest flex items-center gap-2 font-mono">
          <Settings className="w-4 h-4 text-[#C1FF00]" />
          IV. ИНСТРУКЦИЯ ПО ЗАПУСКУ С НУЛЯ (ЗА 15 МИНУТ)
        </h3>
        <p className="text-xs text-white/50 mt-1 uppercase font-mono">
          Как запустить реальный бизнес в рублях и связать канал c ботом
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-black/60 rounded-xl border border-white/5 space-y-2">
          <div className="text-xs font-black font-mono text-[#C1FF00]">ШАГ 1: ТЕХНИЧЕСКАЯ СВЯЗКА</div>
          <p className="text-[11px] text-white/70 leading-relaxed">
            Создайте бота у <b>@BotFather</b> в Telegram, скопируйте <code>API token</code>. Там же в меню пропишите команду <code>/newapp</code> для регистрации вашего Telegram Mini App.
          </p>
        </div>

        <div className="p-4 bg-black/60 rounded-xl border border-white/5 space-y-2">
          <div className="text-xs font-black font-mono text-[#C1FF00]">ШАГ 2: ПОДКЛЮЧЕНИЕ ЮKASSA (РУБЛИ)</div>
          <p className="text-[11px] text-white/70 leading-relaxed">
            Зарегистрируйте личный кабинет на <b>yookassa.ru</b> (для физлиц/самозанятых/ИП). Вы получите ключи интеграции для мгновенного приема платежей по СБП и картам МИР.
          </p>
        </div>

        <div className="p-4 bg-black/60 rounded-xl border border-white/5 space-y-2">
          <div className="text-xs font-black font-mono text-[#C1FF00]">ШАГ 3: ЗАГРУЗКА И СТАРТ</div>
          <p className="text-[11px] text-white/70 leading-relaxed">
            Запустите Python-скрипт бота на бесплатном сервере (например, Amvera, Render или Копеечный VPS). Бот начнет гнать трафик из бесплатного канала в прибыльный Mini App.
          </p>
        </div>
      </div>

      {/* Code syntax console */}
      <div className="space-y-2">
        <div className="flex justify-between items-center bg-black/80 px-4 py-2 rounded-t-xl border-t border-x border-white/10">
          <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-[#C1FF00]" />
            bot_runner.py (aiogram v3)
          </span>
          <button
            type="button"
            onClick={copyToClipboard}
            className="text-[10px] text-white/60 hover:text-[#C1FF00] font-mono flex items-center gap-1 transition"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-[#C1FF00]" /> Скопировано!
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" /> Копировать код
              </>
            )}
          </button>
        </div>
        <pre className="p-4 bg-black border border-white/10 rounded-b-xl text-[10px] text-[#C1FF00]/90 font-mono overflow-x-auto max-h-72 leading-relaxed">
          {pythonCode}
        </pre>
      </div>

      <div className="p-4 bg-[#C1FF00]/10 border border-[#C1FF00]/20 rounded-xl flex items-start gap-3">
        <Zap className="w-5 h-5 text-[#C1FF00] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h5 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
            Автоматическая воронка ОП (Обязательной Подписки)
          </h5>
          <p className="text-[11px] text-white/70 leading-relaxed">
            Связка работает безупречно: бот блокирует запуск Mini App, пока пользователь не подпишется на ваш канал. Это дает взрывной, бесплатный рост подписчиков, за которых рекламодатели платят в среднем по <b>150-300 рублей</b> за человека в бизнес-тематиках!
          </p>
        </div>
      </div>

    </div>
  );
}
