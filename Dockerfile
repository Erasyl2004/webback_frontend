FROM node:alpine

WORKDIR ./app

<<<<<<< HEAD
COPY package*.json
=======
COPY package*.json .
>>>>>>> 34ae416534751930370c8ff0bfd6669984d6fbf7

RUN npm install

COPY . .

<<<<<<< HEAD
CMD ["npm","run","start"]
=======
CMD ["npm","run","start"]
>>>>>>> 34ae416534751930370c8ff0bfd6669984d6fbf7
