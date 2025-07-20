FROM node:20-alpine AS builder

WORKDIR /app

# copia os packages.json e instala as dependências necessárias para compilar o ts para js
COPY package*.json ./
RUN npm install --legacy-peer-deps

# copia o restante do código e compila ts para js
COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /app

# copia package.json e instala apenas dependências de produção
COPY package*.json ./
RUN npm install --only=production --legacy-peer-deps

# copia o código js já compilado de builder
COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/main.js"]
