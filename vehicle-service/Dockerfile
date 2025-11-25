FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

EXPOSE 3000

CMD ["node", "dist/main"]