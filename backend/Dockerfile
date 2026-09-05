FROM node:18-alpine

WORKDIR /app

# Copy backend dependencies
COPY package*.json ./
RUN npm install --production

# Copy backend source
COPY . .

EXPOSE 5000

ENV NODE_ENV=production
ENV PORT=5000

CMD ["node", "server.js"]
