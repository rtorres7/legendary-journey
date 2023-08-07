FROM node:18.15

# Copy or mount node app here
WORKDIR /data/

COPY package*.json ./

# Create node_modules directory and .cache as root, then give node user ownership
RUN mkdir -p /data/node_modules/.cache && mkdir -p /data/build/src && chown -R node:node /data/

# Switch to 'node' user and install dependencies
USER node
RUN npm install

EXPOSE 3000

# normal
CMD ["npm", "start"]
# for remote debugging
# CMD ["npm", "run", "start:inspect"]
