FROM node:16.19

# Copy or mount node app here
WORKDIR /data/

COPY package*.json ./

RUN npm install

RUN mkdir /data/node_modules/.cache && chmod -R 777 /data/node_modules/.cache && chown -R node:node /data/node_modules

EXPOSE 8080

CMD ["npm", "run", "serve:container"]
