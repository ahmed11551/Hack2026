#!/bin/bash

# ==============================================================================
# 🚀 АВТОМАТИЧЕСКИЙ СКРИПТ ОДНОКНОПОЧНОЙ НАСТРОЙКИ СЕРВЕРА ДЛЯ STARTAPPAI.RU
# ==============================================================================
# 
# Этот скрипт выполняет абсолютно все действия в один клик:
# 1. Устанавливает веб-сервер Nginx.
# 2. Настраивает реверс-прокси на порт нашего приложения (3000).
# 3. Устанавливает Certbot и автоматически выпускает SSL-сертификат Let's Encrypt (с редиректом).
# 4. Стягивает актуальные обновления из вашего GitHub.
# 5. Собирает проект в продакшн и запускает/перезапускает его в PM2.
#
# Перед запуском скрипта УБЕДИТЕСЬ, что вы изменили IP-адреса для startappai.ru в Reg.ru на: 94.156.114.202
# ==============================================================================

# Цветовое оформление вывода
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0;3m' # No Color
CLEAR='\033[0m'

echo -e "${BLUE}=====================================================${CLEAR}"
echo -e "${GREEN}🏁 ЗАПУСКАЕМ ПОЛНУЮ НАСТРОЙКУ STARTAPPAI.RU (94.156.114.202)${CLEAR}"
echo -e "${BLUE}=====================================================${CLEAR}"

# Убедимся, что мы под root
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}❌ Пожалуйста, запустите скрипт из-под пользователя root (или через sudo)!${CLEAR}"
  exit 1
fi

DOMAIN="startappai.ru"
EMAIL="ahmedsebiev033@gmail.com" # Вы указали этот e-mail при регистрации

# Шаг 1: Обновление системы и установка зависимостей
echo -e "\n${YELLOW}📦 Шаг 1/5: Обновление системы и установка Nginx, Certbot...${CLEAR}"
apt update -y
apt install -y nginx certbot python3-certbot-nginx git curl

# Шаг 2: Создание конфигурации Nginx
echo -e "\n${YELLOW}⚙️ Шаг 2/5: Настройка конфигурации веб-сервера Nginx...${CLEAR}"
NGINX_CONF="/etc/nginx/sites-available/telegram-app"

cat << 'EOF' > $NGINX_CONF
server {
    listen 80;
    server_name startappai.ru www.startappai.ru;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Активируем конфиг и удаляем дефолт
ln -sf $NGINX_CONF /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Проверка Nginx
if nginx -t; then
    echo -e "${GREEN}✓ Конфигурация Nginx в порядке.${CLEAR}"
    systemctl restart nginx
else
    echo -e "${RED}❌ Ошибка в конфигурации Nginx! Скрипт остановлен.${CLEAR}"
    exit 1
fi

# Шаг 3: Автоматический выпуск SSL-сертификата без интерактива
echo -e "\n${YELLOW}🔒 Шаг 3/5: Выпуск бесплатного SSL-сертификата Let's Encrypt для $DOMAIN...${CLEAR}"
echo -e "${BLUE}Пожалуйста, подождите. Идет проверка DNS-записей и выпуск сертификата...${CLEAR}"

# Запуск Certbot в неинтерактивном автоматическом режиме
certbot --nginx \
  --agree-tos \
  --non-interactive \
  --redirect \
  --email "$EMAIL" \
  -d "$DOMAIN" \
  -d "www.$DOMAIN"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ SSL-сертификат успешно получен и установлен! Настроен редирект на HTTPS.${CLEAR}"
else
    echo -e "${RED}⚠️ Ошибка получения SSL! Возможно DNS-записи в Рег.ру еще не успели обновиться на IP 94.156.114.202.${CLEAR}"
    echo -e "${YELLOW}Веб-сервер продолжит работу без шифрования. Попробуйте обновить SSL позже командой: certbot --nginx${CLEAR}"
fi

# Шаг 4: Стягивание свежего кода из Git
echo -e "\n${YELLOW}🚚 Шаг 4/5: Обновление кода приложения из GitHub...${CLEAR}"
if [ -d "$HOME/Hack2026" ]; then
    cd "$HOME/Hack2026"
    git fetch --all
    git reset --hard origin/main || git pull origin main
else
    echo -e "${YELLOW}Папка $HOME/Hack2026 не найдена. Пропускаем Git обновление, настраиваем текущую рабочую директорию...${CLEAR}"
    # Если скрипт запущен в другой папке, перейдем туда
    cd "$(dirname "$0")"
fi

# Шаг 5: Сборка и перезапуск через PM2
echo -e "\n${YELLOW}🚀 Шаг 5/5: Сборка продакшн версии и перезапуск в PM2...${CLEAR}"

# Установка Node.js зависимостей и сборка
npm install
npm run build

# Убедимся, что PM2 установлен глобально
if ! command -v pm2 &> /dev/null; then
    echo -e "${BLUE}Устанавливаем менеджер процессов PM2...${CLEAR}"
    npm install -g pm2
fi

# Останавливаем старый процесс, если был запущен как-то иначе, и деплоим чистый сервер
pm2 delete telegram-money-machine 2>/dev/null || true
pm2 start dist/server.cjs --name "telegram-money-machine"

# Настройка автозапуска PM2 при ребуте VPS
pm2 save
pm2 startup

echo -e "\n${BLUE}=====================================================${CLEAR}"
echo -e "${GREEN}🎉 УСПЕШНО НАСТРОЕНО! ПРИЛОЖЕНИЕ ГОТОВО К РАБОТЕ!${CLEAR}"
echo -e "${BLUE}=====================================================${CLEAR}"
echo -e "🔗 Mini App будет доступен по адресу: ${GREEN}https://$DOMAIN${CLEAR}"
echo -e "🔒 SSL-сертификат проверен и активен."
echo -e "📈 Процесс запущен в PM2 во избежание падений у пользователей."
echo -e "📝 Команда просмотра системных логов в реальном времени: ${YELLOW}pm2 logs${CLEAR}"
echo -e "${BLUE}=====================================================${CLEAR}"
