FROM node:16-alpine AS builder
WORKDIR /app

COPY ./package.json ./
COPY ./yarn.lock ./

# install dependencies
RUN yarn --frozen-lockfile

COPY . .

RUN yarn clean && yarn build

# remove development dependencies
RUN npm prune --production
RUN yarn install --production

FROM node:16-alpine

WORKDIR /app

# copy from build image
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["node", "/app/dist/index.js"]