

# Build stage
FROM node:24.4.1 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --force
COPY . .
RUN npm run build --prod

# Production stage
FROM node:24.4.1-alpine
WORKDIR /app
COPY --from=build /app/dist /app/dist
COPY --from=build /app/node_modules /app/node_modules
EXPOSE 4000
RUN ls -R /app/dist
CMD ["/usr/local/bin/node", "/app/dist/server/server.mjs"]
