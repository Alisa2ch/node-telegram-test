FROM node:16-slim

WORKDIR /usr/src

COPY ./package*.json ./

RUN npm install

COPY . ./

CMD [ "npm", "start" ]