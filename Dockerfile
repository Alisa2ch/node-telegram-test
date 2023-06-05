FROM node:lts-slim

WORKDIR /usr/src

COPY ./package*.json ./

RUN npm install

COPY . ./

ENTRYPOINT npm run prisma_migrate

CMD [ "npm", "run", "start:webhook" ]
