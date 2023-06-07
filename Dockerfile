FROM node:lts-slim

WORKDIR /usr/src

COPY ./package*.json ./

RUN npm install

COPY . ./

CMD [ "deploy.sh" ]
