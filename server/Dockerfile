FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Copy both package.json and package-lock.json if exists
COPY package*.json ./

RUN npm install

# Copy your local folder excluding the file in dockerignore
COPY . .

# Expose the docker internal port where the app is running
EXPOSE 3000

# build
RUN npm run build

#run node dist/main.js
CMD [ "node", "dist/main.js" ]
