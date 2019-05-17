FROM node:12.1.0-slim

WORKDIR /server

COPY . /server
RUN npm install --production

EXPOSE 3000
CMD [ "npm", "start" ]
