FROM node:20.6.0-alpine

WORKDIR /opt/backend/src

COPY ./src/package*.json ./

RUN npm install

COPY /src/ .

EXPOSE 3001

CMD ["npm", "run", "start"]