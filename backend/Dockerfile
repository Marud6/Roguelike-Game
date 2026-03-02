# --- 1) Build stage ---
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

FROM node:20-alpine AS production

WORKDIR /app

COPY --from=builder /app /app

EXPOSE 5000

CMD ["npm", "run", "start"]
