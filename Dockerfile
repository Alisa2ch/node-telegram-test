FROM node:lts-slim

WORKDIR /usr/src

COPY ./package*.json ./

RUN apt update -y

RUN apt install -y openssl

RUN npm install

COPY . ./

CMD [ "npm", "run", "start:webhook" ]
