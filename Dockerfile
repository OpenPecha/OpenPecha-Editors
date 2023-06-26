# develop stage
FROM node:18.16.1-alpine3.18 as develop-stage

WORKDIR /app

RUN apk add python3=3.8.12-r1 py3-pip
RUN which python3

COPY package*.json ./
RUN yarn global add @quasar/cli
COPY . .

# build stage
FROM develop-stage as build-stage
RUN yarn

ARG OPENPECHA_API_URL
ARG APP_DOMAIN_DEV
ARG APP_DOMAIN_STAG
ARG APP_DOMAIN_PROD
ARG APP_NAME
ARG APP_ENV
ARG GITHUB_OAUTH_CLIENT_ID
ARG GITHUB_OAUTH_URL
ARG AUTH0_DOMAIN
ARG AUTH0_CLIENT_ID
ARG AUTH0_RESPONSETYPE
ARG AUTH0_AUDIENCE
ARG AUTH0_SCOPE
ARG IFFFServerURL
ARG T_GOOGLE_PECHA_ID
ARG T_NAMSEL_PECHA_ID
ARG K_GOOGLE_PECHA_ID
ARG K_NAMSEL_PECHA_ID
ARG K_TEXT_ID_PREFIX
ARG T_TEXT_LIST_URL
ARG K_TEXT_LIST_URL

RUN quasar build

# production stage
FROM nginx:1.17.10 as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist/spa /app
COPY nginx.conf /etc/nginx/nginx.conf
