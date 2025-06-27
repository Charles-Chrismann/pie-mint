FROM node:alpine

WORKDIR /app

RUN npm install -g @nestjs/cli

RUN apk add --no-cache docker-cli curl \
 && mkdir -p /usr/local/lib/docker/cli-plugins \
 && curl -SL https://github.com/docker/compose/releases/download/v2.18.1/docker-compose-linux-x86_64 -o /usr/local/lib/docker/cli-plugins/docker-compose \
 && chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

COPY package.json ./

RUN npm install --production=false

COPY . .

CMD ["npm", "run", "dev"]