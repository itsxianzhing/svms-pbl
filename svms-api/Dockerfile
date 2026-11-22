# =============================================================================
# Dockerfile — svms-api
# Framework : Express + Prisma
# Runtime   : Node.js 22 Alpine
# Strategy  : Multi-stage build with a non-root runtime user.
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1 — BUILDER
# Prisma is generated here and development dependencies are removed afterwards.
# -----------------------------------------------------------------------------
FROM node:22-alpine AS builder

WORKDIR /app

# Prisma's Alpine engine requires OpenSSL.
RUN apk add --no-cache openssl

COPY package*.json ./
# npm ci is deterministic and already enforces the lockfile for npm projects.
# prisma-markdown 4 currently declares a Prisma 7 peer while this app uses
# Prisma 6, so npm's legacy peer resolver is required for the existing dev tool.
RUN npm config set legacy-peer-deps true && npm ci

COPY prisma ./prisma
COPY prisma.config.ts ./prisma.config.ts
RUN npx prisma generate

# src/generated is excluded from the build context so this copy cannot replace
# the Prisma client generated inside the image.
COPY src ./src

RUN npm prune --omit=dev

# -----------------------------------------------------------------------------
# Stage 2 — RUNTIME
# Only production dependencies, application files, and the Prisma CLI remain.
# -----------------------------------------------------------------------------
FROM node:22-alpine AS runtime

WORKDIR /app
RUN apk add --no-cache openssl

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/package.json ./package.json
COPY --from=builder --chown=node:node /app/prisma ./prisma
COPY --from=builder --chown=node:node /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder --chown=node:node /app/src ./src
COPY --chmod=755 --chown=node:node docker-entrypoint.sh ./docker-entrypoint.sh

EXPOSE 3000

# Run the API as the built-in non-root node user.
USER node
ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "src/server.js"]
