FROM node:18-alpine

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

# install netcat to check dependencies availability
RUN apk add --no-cache netcat-openbsd

# copy entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# copy app
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

# build app
RUN npm run build

# create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# assign ownership
RUN chown -R nestjs:nodejs /usr/src/app
USER nestjs

ENTRYPOINT ["docker-entrypoint.sh"]

EXPOSE 3001
CMD ["node", "dist/main"]