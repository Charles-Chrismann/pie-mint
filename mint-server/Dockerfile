# FROM node:alpine

# WORKDIR /app

# RUN npm install -g @nestjs/cli

# RUN apk add --no-cache docker-cli curl \
#  && mkdir -p /usr/local/lib/docker/cli-plugins \
#  && curl -SL https://github.com/docker/compose/releases/download/v2.18.1/docker-compose-linux-x86_64 -o /usr/local/lib/docker/cli-plugins/docker-compose \
#  && chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

# COPY package.json ./

# RUN npm install --production=false

# COPY . .

# CMD ["npm", "run", "dev"]

# ---------- Base ----------
FROM node:alpine AS base
WORKDIR /app
COPY package.json package-lock.json* ./

# ---------- Dependencies ----------
FROM base AS deps
RUN npm install

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
