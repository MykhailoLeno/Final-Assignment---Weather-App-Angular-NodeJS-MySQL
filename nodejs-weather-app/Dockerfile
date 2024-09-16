# Dockerfile
FROM node:18

# Встановлення робочої директорії
WORKDIR /app

# Копіювання package.json і package-lock.json
COPY package*.json ./

# Встановлення залежностей
RUN npm install

# Копіювання всіх файлів проекту
COPY . .

# Відкриття порту
EXPOSE 3000

# Запуск сервера
CMD ["node", "server.js"]
