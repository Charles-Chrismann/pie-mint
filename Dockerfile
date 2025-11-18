########################
# Base stage
########################
FROM node:24-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /repo


########################
# Fetch dependencies (max cache)
########################
FROM base AS fetcher

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps ./apps
COPY packages ./packages

RUN pnpm fetch


########################
# Install offline
########################
FROM base AS installer

COPY --from=fetcher /pnpm /pnpm
COPY --from=fetcher /repo /repo

RUN pnpm install --offline


########################
# Build all apps
########################
FROM installer AS builder

RUN pnpm --filter mint-api run build
RUN pnpm --filter mint-admin run build
RUN pnpm --filter mint-ws-runners run build


########################
# Deploy: mint-api
########################
FROM builder AS deploy-mint-api

# 1. Deploy sans build
RUN pnpm deploy --filter=mint-api --prod /repo/deploy/mint-api

# 2. Copier le dist manuellement depuis l’app
RUN cp -r /repo/apps/mint-api/dist /repo/deploy/mint-api/dist


########################
# Deploy: mint-admin
########################
FROM builder AS deploy-mint-admin

RUN pnpm deploy --filter=mint-admin --prod /repo/deploy/mint-admin
RUN cp -r /repo/apps/mint-admin/dist /repo/deploy/mint-admin/dist


########################
# Deploy: mint-ws-runners
########################
FROM builder AS deploy-mint-ws-runners

RUN pnpm deploy --filter=mint-ws-runners --prod /repo/deploy/mint-ws-runners
RUN cp -r /repo/apps/mint-ws-runners/dist /repo/deploy/mint-ws-runners/dist


########################
# Runtime: mint-api
########################
FROM node:24-slim AS mint-api-runtime
WORKDIR /app
COPY --from=deploy-mint-api /repo/deploy/mint-api ./
CMD ["node", "dist/main.js"]


########################
# Runtime: mint-admin
########################
FROM node:24-slim AS mint-admin-runtime
WORKDIR /app
COPY --from=deploy-mint-admin /repo/deploy/mint-admin ./
CMD ["node", "dist/main.js"]


########################
# Runtime: mint-ws-runners
########################
FROM node:24-slim AS mint-ws-runners-runtime
WORKDIR /app
COPY --from=deploy-mint-ws-runners /repo/deploy/mint-ws-runners ./
CMD ["node", "dist/main.js"]
