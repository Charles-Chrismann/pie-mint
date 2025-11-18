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
# Install offline (deps only)
########################
FROM base AS installer

WORKDIR /app
COPY --from=fetcher /pnpm /pnpm
COPY --from=fetcher /app /app

# Installation offline pour profiter du cache
RUN pnpm install --offline


########################
# Builder (relink workspaces + build toutes les apps)
########################
FROM installer AS builder

WORKDIR /app

# Très important : recrée les symlinks des workspaces
RUN pnpm install --frozen-lockfile

# Build des apps
RUN pnpm --filter mint-api run build
RUN pnpm --filter mint-admin run build
RUN pnpm --filter mint-ws run build

########################
# Deploy mint-api
########################
FROM builder AS deploy-mint-api

RUN pnpm deploy --filter=mint-api --prod /app/deploy/mint-api
RUN cp -r /app/apps/mint-api/dist /app/deploy/mint-api/dist


########################
# Deploy mint-admin (Vite → dist)
########################
FROM builder AS deploy-mint-admin

RUN pnpm deploy --filter=mint-admin --prod /app/deploy/mint-admin
RUN cp -r /app/apps/mint-admin/dist /app/deploy/mint-admin/dist


########################
# Deploy mint-ws
########################
FROM builder AS deploy-mint-ws

RUN pnpm deploy --filter=mint-ws --prod /app/deploy/mint-ws
RUN cp -r /app/apps/mint-ws/dist /app/deploy/mint-ws/dist


########################
# RUNTIME mint-api
########################
FROM node:24-slim AS mint-api-runtime
WORKDIR /app
COPY --from=deploy-mint-api /app/deploy/mint-api ./
CMD ["node", "dist/main.js"]


########################
# RUNTIME mint-admin
########################
FROM node:24-slim AS mint-admin-runtime
WORKDIR /app
COPY --from=deploy-mint-admin /app/deploy/mint-admin ./
CMD ["node", "dist/main.js"]


########################
# RUNTIME mint-ws
########################
FROM node:24-slim AS mint-ws-runtime
WORKDIR /app
COPY --from=deploy-mint-ws /app/deploy/mint-ws ./
CMD ["node", "dist/main.js"]
