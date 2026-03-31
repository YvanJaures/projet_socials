# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build (compile TypeScript, generate Prisma client)
RUN npm run build --if-present || true

RUN npx prisma generate

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install only production dependencies
COPY package.json package-lock.json ./

RUN npm ci --only=production

# Copy built app from builder
COPY --from=builder /app/. .

EXPOSE 5001

ENV NODE_ENV=production

CMD ["npm", "start"]
