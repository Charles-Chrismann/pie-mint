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
# Final runtime (minimal)
########################
FROM node:24-slim AS runner

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable
WORKDIR /app

# Copie les node_modules installés
COPY --from=installer /repo/node_modules ./node_modules

# On laisse docker build sélectionner le bon stage avec --target
# Les fichiers construits seront copiés via un buildx propre à chaque image
CMD [ "node", "dist/main" ]
