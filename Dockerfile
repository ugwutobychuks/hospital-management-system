FROM node:18-alpine

RUN apk add --no-cache dumb-init python3 make g++

WORKDIR /app

COPY package*.json ./

# Install with legacy peer deps to avoid conflicts
RUN npm install --legacy-peer-deps --omit=dev

# Copy application code
COPY . .

EXPOSE 3000

CMD ["dumb-init", "node", "src/server.js"]
