# Meteor 3.4.1 bundles Node 22.22.1 — keep builder and runtime in sync with it.

FROM node:22.22.1-bookworm-slim AS builder

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl ca-certificates git python3 build-essential \
    && rm -rf /var/lib/apt/lists/*

RUN curl https://install.meteor.com/ | sh
ENV PATH="/root/.meteor:${PATH}"
ENV METEOR_ALLOW_SUPERUSER=true

WORKDIR /app
COPY . .

RUN meteor npm install
RUN npm run build

FROM node:22.22.1-bookworm-slim AS runtime

RUN groupadd -r meteor && useradd -r -g meteor meteor
WORKDIR /app
COPY --from=builder --chown=meteor:meteor /app/build/bundle ./bundle

USER meteor
ENV NODE_ENV=production
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD node -e "require('http').get('http://localhost:'+(process.env.PORT||3000)+'/', r => process.exit(r.statusCode < 500 ? 0 : 1)).on('error', () => process.exit(1))"

CMD ["node", "bundle/main.js"]
