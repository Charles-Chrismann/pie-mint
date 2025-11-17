# ---------- Base ----------
FROM node:22-slim AS base

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

# ---------- Dependencies ----------
FROM base AS deps

RUN apt-get update && apt-get install -y --no-install-recommends \
    libvips-dev && \
    rm -rf /var/lib/apt/lists/*

RUN pnpm install --frozen-lockfile --include=optional

# ---------- Development ----------
FROM base AS development
ENV NODE_ENV=development

COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN pnpm add -g @nestjs/cli

CMD ["pnpm", "run", "dev"]

# ---------- Production ----------
FROM base AS production
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN pnpm run build

CMD ["node", "dist/src/main"]
