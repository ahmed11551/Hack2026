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
    # Главное интерактивное меню робота
    keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [
            InlineKeyboardButton(text="⚡️ Открыть Mini App (Каталог)", web_app=WebAppInfo(url=WEB_APP_URL))
        ],
        [
            InlineKeyboardButton(text="💳 Прямая покупка подписки", callback_data="buy_tariff"),
            InlineKeyboardButton(text="ℹ️ О проекте", callback_data="info_project")
        ],
        [
            InlineKeyboardButton(text="📜 Юр. Информация и Оферта", callback_data="legal_info"),
            InlineKeyboardButton(text="💬 Написать Юристу", callback_data="support_contact")
        ]
    ])
    
    welcome_text = (
        f"👋 *Приветствуем в Хак-Системе, {message.from_user.first_name}!*\\n\\n"
        "Я — ваш интеллектуальный бот-юрист и ассистент закрытого канала.\\n\\n"
        "Мы автоматизировали оплату и мгновенное открытие экспертных баз знаний в соответствии с законами РФ.\\n\\n"
        "🤖 *Выберите необходимое действие в кнопках ниже:*\\n"
        "🔹 Открыть Mini App — запуск веб-ориентированного каталога\\n"
        "🔹 /buy — быстрая покупка подписки прямо в текущем чате\\n"
        "🔹 /info — подробности функционирования и статистика окупаемости\\n"
        "🔹 /legal — публичная оферта, реквизиты ИП и правила возврата\\n"
        "🔹 /support — задать юридический/технический вопрос нашему ИИ"
    )
    await message.answer(welcome_text, reply_markup=keyboard, parse_mode="Markdown")

@dp.message(Command("buy"))
async def buy_handler(message: types.Message):
    keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [
            InlineKeyboardButton(text="🌟 Оплатить VIP Месяц — 490 ₽", url="https://yookassa.ru/fast-pay-link-490"),
        ],
        [
            InlineKeyboardButton(text="🎁 Пробный (7 дней) — 149 ₽", url="https://yookassa.ru/fast-pay-link-149"),
            InlineKeyboardButton(text="💎 Навсегда — 1 490 ₽", url="https://yookassa.ru/fast-pay-link-1490")
        ]
    ])
    await message.answer(
        "💳 *Быстрая покупка подписки в рублях прямо в чате!*\\n\\n"
        "Выберите желаемый VIP-тариф. Оплата мгновенно проходит через ЮKassa защищенным протоколом (СБП, МИР, СберПэй).\\n\\n"
        "После фискализации и чека система сразу предоставит вам доступ ко всем схемам заработка!",
        reply_markup=keyboard,
        parse_mode="Markdown"
    )

@dp.message(Command("info"))
async def info_handler(message: types.Message):
    keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="🚀 Запустить Приложение", web_app=WebAppInfo(url=WEB_APP_URL))]
    ])
    await message.answer(
        "ℹ️ *Информация о нашей экосистеме:*\\n\\n"
        "• Данное решение представляет собой связку Telegram-канала, бота-префильтра и Mini App.\\n"
        "• Трафик подписывается на канал и с помощью бота отфильтровывается для перехода на Mini App.\\n"
        "• Монетизация базируется на продаже доступа к материалам повышенной ценности.\\n"
        "• Средняя годовая доходность одного такого контейнера составляет от *1 200 000 до 3 600 000 рублей* при минимальном сопровождении.\\n\\n"
        "Подходит как для самозанятых, так и для ИП в РФ.",
        reply_markup=keyboard,
        parse_mode="Markdown"
    )

@dp.message(Command("legal"))
async def legal_handler(message: types.Message):
    keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [
            InlineKeyboardButton(text="📄 Текст Оферты", callback_data="offer_doc"),
            InlineKeyboardButton(text="💸 Правила возврата", callback_data="refund_rules")
        ],
        [
            InlineKeyboardButton(text="💬 Наш Консультант", callback_data="support_contact")
        ]
    ])
    legal_text = (
        "📜 *Юридическая информация и оферта ст. 437 ГК РФ:*\\n\\n"
        "Все транзакции проводятся официально оператором платежной инфраструктуры.\\n\\n"
        "📍 *Реквизиты Продавца:*\\n"
        "• *Самозанятая Себиева Рояна*\\n"
        "• *ИНН:* 770980461804\\n"
        "• *Режим налога:* НПД (Самозанятый)\\n"
        "• *Электронная почта:* help@startappai.ru\\n\\n"
        "Каждая транзакция формирует официальный чек в соответствии с ФЗ-54."
    )
    await message.answer(legal_text, reply_markup=keyboard, parse_mode="Markdown")

@dp.message(Command("support"))
async def support_handler(message: types.Message):
    await message.answer(
        "💬 *Юридическая и техническая служба поддержки:*\\n\\n"
        "• Если у вас возникли вопросы по списаниям или требуется возврат средств согласно ст. 26.1 Закона РФ «О защите прав потребителей», отправьте письмо на *help@startappai.ru*. Обработка заявок длится не более 24 часов.\\n"
        "• По вопросам легального заведения налогового кабинета (Самозанятость) пишите нашему ИИ-юристу напрямую.",
        parse_mode="Markdown"
    )

# Обработка Callback-кнопок меню
@dp.callback_query()
async def callback_query_handler(callback: types.CallbackQuery):
    if callback.data == "buy_tariff":
        await buy_handler(callback.message)
    elif callback.data == "info_project":
        await info_handler(callback.message)
    elif callback.data == "legal_info":
        await legal_handler(callback.message)
    elif callback.data == "support_contact":
        await support_handler(callback.message)
    elif callback.data == "offer_doc":
        await callback.message.answer(
            "📄 *Публичная оферта (Самозанятая Себиева Рояна):*\\n\\n"
            "Договор купли-продажи цифровой подписки на информационную базу данных. "
            "Доступ открывается автоматически после успешного проведения платежа через сервис ЮKassa.",
            parse_mode="Markdown"
        )
    elif callback.data == "refund_rules":
        await callback.message.answer(
            "💸 *Правила возврата средств:*\\n\\n"
            "Возврат возможен до момента предоставления доступа к секретной базе. "
            "Если доступ уже был получен, услуга считается оказанной в полном объеме.",
            parse_mode="Markdown"
        )
    await callback.answer()

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
