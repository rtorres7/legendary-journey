FROM node:16.19

WORKDIR /data/

COPY package*.json ./

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
