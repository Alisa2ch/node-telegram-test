FROM node:16-slim

WORKDIR /usr/src

COPY ./package*.json ./

RUN npm install

COPY . ./

RUN echo $DATABASE_URL

RUN npx prisma generate

RUN npx prisma migrate dev --name init

CMD [ "npm", "run", "start:webhook" ]
