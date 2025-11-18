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
# Install offline (all deps for build)
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
RUN pnpm --filter mint-ws run build


########################
# Deploy: mint-api
########################
FROM builder AS deploy-mint-api

RUN pnpm deploy --filter=mint-api --prod /repo/deploy/mint-api
RUN cp -r /repo/apps/mint-api/dist /repo/deploy/mint-api/dist


########################
# Deploy: mint-admin
########################
FROM builder AS deploy-mint-admin

RUN pnpm deploy --filter=mint-admin --prod /repo/deploy/mint-admin
RUN cp -r /repo/apps/mint-admin/dist /repo/deploy/mint-admin/dist


########################
# Deploy: mint-ws
########################
FROM builder AS deploy-mint-ws

RUN pnpm deploy --filter=mint-ws --prod /repo/deploy/mint-ws
RUN cp -r /repo/apps/mint-ws/dist /repo/deploy/mint-ws/dist


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
FROM nginx:alpine AS mint-admin-runtime
RUN rm -rf /usr/share/nginx/html/*
COPY --from=deploy-mint-admin /repo/deploy/mint-admin/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


########################
# Runtime: mint-ws
########################
FROM node:24-slim AS mint-ws-runtime
WORKDIR /app
COPY --from=deploy-mint-ws /repo/deploy/mint-ws ./
CMD ["node", "dist/main.js"]
