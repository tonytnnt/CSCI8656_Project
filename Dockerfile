ARG NODE_VERSION=18.0.0

FROM --platform=linux/amd64 node:${NODE_VERSION}-alpine as base

WORKDIR /usr/src/app

FROM base as build

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

COPY . .

RUN npm run build


FROM base as final

ENV NODE_ENV production

COPY package.json .
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/.next ./.next
COPY --from=build /usr/src/app/prisma ./prisma

EXPOSE 3000

CMD npm start
