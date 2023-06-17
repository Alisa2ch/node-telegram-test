FROM node:lts-alpine3.18

WORKDIR /usr/src

COPY ./package*.json ./

# RUN apk add openssl

RUN npm install

COPY . ./

CMD [ "npm", "run", "start:webhook" ]
