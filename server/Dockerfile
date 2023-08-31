FROM node:12.13-alpine

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]
