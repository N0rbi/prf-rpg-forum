FROM node:8.11.2-alpine as node

WORKDIR /usr/src/app

COPY *.json ./

RUN npm install

COPY src src

EXPOSE 4200
RUN npm run build

ENTRYPOINT ["npm", "start"]
