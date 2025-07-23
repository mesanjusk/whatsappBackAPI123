FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --production --silent || true
COPY . .
CMD ["node", "server.js"]
