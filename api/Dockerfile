FROM node

RUN mkdir -p /opt/app
WORKDIR /opt/app


COPY src /opt/app/src

COPY package.json /opt/app/package.json

RUN npm install

EXPOSE 8080
ENTRYPOINT ["npm", "start"]
