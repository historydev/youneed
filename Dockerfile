FROM node:16
WORKDIR /usr/src/app

COPY ./package*.json ./
COPY ./lerna.json ./

RUN npm install

WORKDIR /usr/src/app/packages/backend

COPY ./packages/backend ./

RUN npm install

WORKDIR /usr/src/app/packages/frontend

COPY ./packages/frontend ./

RUN npm install --legacy-peer-deps

WORKDIR /usr/src/app/packages/static_hoster

COPY ./packages/static_hoster ./

RUN npm install

WORKDIR /usr/src/app

RUN npm run build

COPY . .
