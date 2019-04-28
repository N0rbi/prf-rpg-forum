FROM node

COPY src src

COPY package.json package.json

RUN npm install

EXPOSE 8080
ENTRYPOINT ["npm", "start"]
