FROM node:18.15

# Copy or mount node app here
WORKDIR /data/

COPY package*.json ./

# Create node_modules directory and .cache as root, then give node user ownership
RUN mkdir -p /data/node_modules/.cache && chown -R node:node /data/

# Switch to 'node' user and install dependencies
USER node
RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
