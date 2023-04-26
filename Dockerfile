FROM node:16.19

WORKDIR /data/

COPY package*.json ./

RUN npm install

RUN mkdir /data/node_modules/.cache && chmod -R 777 /data/node_modules/.cache && chown -R node:node /data/node_modules

EXPOSE 3000

CMD ["npm", "start"]
