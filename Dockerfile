########################
# Base
########################
FROM node:24-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app


########################
# Fetch dependencies (max cache)
########################
FROM base AS fetcher

WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps ./apps
COPY packages ./packages

RUN pnpm fetch


########################
# Install offline
########################
FROM base AS installer

WORKDIR /app
COPY --from=fetcher /pnpm /pnpm
COPY --from=fetcher /app /app

RUN pnpm install --offline



#######################################################################
# BUILDER MINT-API — ne build que mint-api
#######################################################################
FROM installer AS builder-mint-api

WORKDIR /app

# Recrée les symlinks workspaces
RUN pnpm install --frozen-lockfile

# Build uniquement mint-api
RUN pnpm --filter mint-api run build



#######################################################################
# BUILDER MINT-ADMIN — ne build que mint-admin
#######################################################################
FROM installer AS builder-mint-admin

WORKDIR /app
RUN pnpm install --frozen-lockfile

# Build uniquement mint-admin (Vite)
RUN pnpm --filter mint-admin run build



#######################################################################
# BUILDER MINT-WS — ne build que mint-ws
#######################################################################
FROM installer AS builder-mint-ws

WORKDIR /app
RUN pnpm install --frozen-lockfile

# Build uniquement mint-ws
RUN pnpm --filter mint-ws run build



#######################################################################
# DEPLOY MINT-API
#######################################################################
FROM builder-mint-api AS deploy-mint-api

RUN pnpm deploy --filter=mint-api --prod /app/deploy/mint-api
RUN cp -r /app/apps/mint-api/dist /app/deploy/mint-api/dist



#######################################################################
# DEPLOY MINT-ADMIN (Vite)
#######################################################################
FROM builder-mint-admin AS deploy-mint-admin

RUN pnpm deploy --filter=mint-admin --prod /app/deploy/mint-admin
RUN cp -r /app/apps/mint-admin/dist /app/deploy/mint-admin/dist



#######################################################################
# DEPLOY MINT-WS
#######################################################################
FROM builder-mint-ws AS deploy-mint-ws

RUN pnpm deploy --filter=mint-ws --prod /app/deploy/mint-ws
RUN cp -r /app/apps/mint-ws/dist /app/deploy/mint-ws/dist



#######################################################################
# RUNTIME MINT-API
#######################################################################
FROM node:24-slim AS mint-api-runtime
WORKDIR /app
COPY --from=deploy-mint-api /app/deploy/mint-api ./
CMD ["node", "dist/main.js"]



#######################################################################
# RUNTIME MINT-ADMIN
#######################################################################
FROM node:24-slim AS mint-admin-runtime
WORKDIR /app
COPY --from=deploy-mint-admin /app/deploy/mint-admin ./
CMD ["node", "dist/main.js"]



#######################################################################
# RUNTIME MINT-WS
#######################################################################
FROM node:24-slim AS mint-ws-runtime
WORKDIR /app
COPY --from=deploy-mint-ws /app/deploy/mint-ws ./
CMD ["node", "dist/main.js"]
