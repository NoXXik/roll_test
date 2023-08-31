# Используйте базовый образ Node.js
FROM node:14

# Установите рабочую директорию внутри контейнера
WORKDIR /app

# Скопируйте package.json и package-lock.json для установки зависимостей
COPY package*.json ./

# Установите зависимости
RUN npm install --legacy-peer-deps

# Скопируйте остальные файлы проекта
COPY . .

# Откройте порт 3000, который будет использоваться приложением Nest.js
EXPOSE 3000

# Команда запуска приложения
CMD ["npm", "run", "start:prod"]
