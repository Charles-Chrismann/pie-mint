########################
# Base stage
########################
FROM node:24-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /repo


########################
# Fetch dependencies (cache max)
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
# Build: API
########################
FROM installer AS mint-server
WORKDIR /repo/apps/mint-server
COPY apps/mint-server /repo/apps/mint-server
RUN pnpm run build


########################
# Build: Administration
########################
FROM installer AS mint-administration
WORKDIR /repo/apps/mint-administration
COPY apps/mint-administration /repo/apps/mint-administration
RUN pnpm run build


########################
# Build: WS Runners
########################
FROM installer AS mint-ws-runners
WORKDIR /repo/apps/mint-ws-runners
COPY apps/mint-ws-runners /repo/apps/mint-ws-runners
RUN pnpm run build


########################
# Runtime: mint-server
########################
FROM node:24-slim AS mint-server-runtime
WORKDIR /app
COPY --from=installer /repo/node_modules ./node_modules
COPY --from=installer /repo/.pnpm ./.pnpm
COPY --from=installer /repo/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=mint-server /repo/apps/mint-server/dist ./dist
CMD ["node", "dist/main.js"]


########################
# Runtime: mint-administration
########################
FROM node:24-slim AS mint-administration-runtime
WORKDIR /app
COPY --from=mint-administration /repo/apps/mint-administration/dist ./dist
CMD ["node", "dist/main.js"]


########################
# Runtime: mint-ws-runners
########################
FROM node:24-slim AS mint-ws-runners-runtime
WORKDIR /app
COPY --from=installer /repo/node_modules ./node_modules
COPY --from=installer /repo/.pnpm ./.pnpm
COPY --from=installer /repo/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=mint-ws-runners /repo/apps/mint-ws-runners/dist ./dist
CMD ["node", "dist/main.js"]
