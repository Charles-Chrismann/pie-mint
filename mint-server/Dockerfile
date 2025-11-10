# ---------- Base ----------
FROM node:22-slim AS base
WORKDIR /app
COPY package.json package-lock.json* ./

# ---------- Dependencies ----------
FROM base AS deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    libvips-dev && \
    rm -rf /var/lib/apt/lists/*

RUN npm ci --include=optional

# ---------- Development ----------
FROM base AS development
ENV NODE_ENV=development
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm install -g @nestjs/cli
CMD ["npm", "run", "dev"]

# ---------- Production ----------
FROM base AS production
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build
CMD ["node", "dist/src/main"]
