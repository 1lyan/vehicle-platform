FROM node:18-alpine

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

RUN chown -R nestjs:nodejs /usr/src/app
USER nestjs

EXPOSE 3000

CMD ["node", "dist/main"]