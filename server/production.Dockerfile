FROM node:18.17-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build:production

FROM node:18.17-alpine AS final
WORKDIR /app
COPY --from=builder ./app/dist ./dist
COPY package*.json .
RUN npm install --omit=dev
CMD ["npm", "run", "start:production"]
