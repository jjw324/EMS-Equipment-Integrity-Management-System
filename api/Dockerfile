FROM node:current-alpine3.10
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm i
COPY . .
EXPOSE 3001
CMD [ "npm", "run", "dev"]