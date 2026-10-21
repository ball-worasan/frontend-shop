FROM oven/bun:1.4.3@sha256:c017a211c49a21adc0e49dda7b60ac8112887c3d9465e01427f434ed107c830e AS build
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY app ./app
COPY public ./public
COPY next.config.ts tsconfig.json ./
RUN bun run build

FROM node:24.22.0-bookworm-slim@sha256:a8efdaa8f2458a83ad61c9b8e957c94c2312a9e60604d5b9b093cf89ad9f5984
WORKDIR /app
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0
LABEL org.opencontainers.image.source="https://github.com/ball-worasan/frontend-shop"
COPY --from=build --chown=1000:1000 /app/.next/standalone ./
COPY --from=build --chown=1000:1000 /app/.next/static ./.next/static
COPY --from=build --chown=1000:1000 /app/public ./public
USER 1000:1000
EXPOSE 3000
CMD ["node", "server.js"]
