# First stage - Base
ARG NODE_IMAGE=node:18-alpine

FROM $NODE_IMAGE AS base
RUN apk add dumb-init curl
WORKDIR /home/node/app
RUN chown node:node /home/node/app
USER node
RUN mkdir tmp

# Second stage - dependencies
FROM base AS dependencies
COPY --chown=node:node ./package*.json ./
RUN npm ci
COPY --chown=node:node . .

# Third stage - build
FROM dependencies AS build
RUN node ace build --production

# Fourth stage - production
FROM base AS production
ENV NODE_ENV=production
ENV PORT=$PORT
ENV DOPPER_TOKEN=$DOPPER_TOKEN
ENV HOST=0.0.0.0
COPY --chown=node:node --from=build /home/node/app/build .
RUN npm ci --production
EXPOSE $PORT
CMD [ "dumb-init", "node", "server.js" ]
