FROM node:19.0.0-bullseye-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends tini=0.19.0-1 \
    && rm -rf /var/lib/apt/lists/*

ENTRYPOINT [ "/usr/bin/tini", "--"]

WORKDIR /app

COPY package.json .

RUN npm install && npm cache clean --force

COPY . .

RUN chown -R node:node .

ENV PORT=8080 \
    MONGODBSERVERNAME=stocksdb \
    MONGODBSERVERPORT=27017 \
    STOCKSDB=stocks \
    STOCKSAPISERVER=lnx1 \
    STOCKSAPISERVERPORT=8080 \
    NODE_ENV=production

EXPOSE $PORT

USER node

CMD [ "node", "server.js" ]