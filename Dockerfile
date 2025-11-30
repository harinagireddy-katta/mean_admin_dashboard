# Build Stage for Angular
FROM node:20-alpine as build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ .
RUN npm run build

# Production Stage
FROM node:20-alpine
WORKDIR /app

# Copy Server
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm install --production
COPY server/ .

# Copy Built Client to Server Public Directory
COPY --from=build /app/client/dist/client/browser ./public

EXPOSE 3000
CMD ["node", "index.js"]
