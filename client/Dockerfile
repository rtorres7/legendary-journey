FROM node:16.19

# Copy or mount node app here
WORKDIR /data/

COPY package*.json ./

RUN npm install

EXPOSE 8080

CMD ["npm", "run", "dev:container"]
