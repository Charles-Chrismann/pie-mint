FROM node:alpine

WORKDIR /app

COPY package.json ./

RUN npm install --production=false

COPY . .

COPY start.sh ./
RUN chmod +x start.sh
CMD ["./start.sh"]