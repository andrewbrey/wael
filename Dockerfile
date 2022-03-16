# base node image
FROM node:16-bullseye-slim as base

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl python3-dev python3 python3-pip

# Install all node_modules, including dev dependencies
FROM base as deps

RUN mkdir /workspace
WORKDIR /workspace

ADD package.json yarn.lock ./
RUN yarn --production=false

# Setup production node_modules
FROM base as production-deps

RUN mkdir /workspace
WORKDIR /workspace

COPY --from=deps /workspace/node_modules /workspace/node_modules
ADD package.json yarn.lock ./
RUN npm prune --production

# Build the app
FROM base as build

ENV NODE_ENV=production

RUN mkdir /workspace
WORKDIR /workspace

COPY --from=deps /workspace/node_modules /workspace/node_modules

ADD prisma ./prisma
RUN npx prisma generate

ADD . .
RUN npm run build

# Finally, build the production image with minimal footprint
FROM base

ENV NODE_ENV=production

RUN mkdir /workspace && chown -R node:node /workspace
WORKDIR /workspace

COPY --from=production-deps --chown=node:node /workspace/node_modules /workspace/node_modules
COPY --from=build --chown=node:node /workspace/node_modules/.prisma /workspace/node_modules/.prisma
COPY --from=build --chown=node:node /workspace/build /workspace/build
COPY --from=build --chown=node:node /workspace/public /workspace/public

USER node
ADD --chown=node:node . .

CMD ["bash", "./start_with_migrations.sh"]