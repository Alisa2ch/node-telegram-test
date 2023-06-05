FROM node:16-slim

WORKDIR /usr/src

COPY ./package*.json ./

RUN npm install

COPY . ./

CMD [ "npx" "prisma" "migrate" "dev" "--name" "init" ]

CMD [ "npm", "run", "start:webhook" ]
