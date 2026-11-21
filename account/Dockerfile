FROM node:20-alpine

WORKDIR /app

# Сначала копируем файлы зависимостей для эффективного кеширования слоев Docker
COPY package.json yarn.lock ./

# Устанавливаем все зависимости (включая devDependencies для миграций и e2e-тестов)
RUN yarn install --frozen-lockfile

# Копируем остальной исходный код сервиса
COPY . .

# Собираем проект NestJS в папку dist
RUN yarn build

# Запускаем скомпилированное приложение
CMD ["yarn", "start:prod"]
