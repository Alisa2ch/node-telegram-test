FROM node:16-slim

WORKDIR /usr/src

COPY ./package*.json ./

RUN npm install

COPY . ./

RUN npm run prisma_migrate

CMD [ "npm", "run", "start:webhook" ]
