# Этап 1: Установка зависимостей для разработки
FROM node:14 as builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --legacy-peer-deps

# Этап 2: Копирование и настройка переменных окружения
FROM node:14 as runner

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY . .

# Задайте переменные окружения для продакшн среды
#ENV NODE_ENV=production
#ENV DATABASE_HOST=postgres-service
#ENV DATABASE_PORT=5432
#ENV DATABASE_USERNAME=myuser
#ENV DATABASE_PASSWORD=admin
#ENV DATABASE_DB=mydb

EXPOSE 3000

CMD ["npm", "start"]
