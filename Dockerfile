FROM node:8

# app
ADD . /app

WORKDIR /app

# install app dependencies
RUN npm install

# run webpack
RUN npm run pack --unsafe-perm=true --allow-root

EXPOSE  80

CMD ["node", "/app/server.prod.js"]