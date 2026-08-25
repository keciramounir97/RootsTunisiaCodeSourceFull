# syntax=docker/dockerfile:1
# ----------------------------------------------------
# Stage 1: Build NestJS TypeScript application
# ----------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
COPY package*.json tsconfig*.json ./
RUN npm ci --legacy-peer-deps

# Copy source and build
COPY . .
RUN mkdir -p /app/public
RUN npm run build

# ----------------------------------------------------
# Stage 2: Production Runtime
# ----------------------------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Install production dependencies only
COPY package*.json ./
RUN npm ci --only=production --legacy-peer-deps

# Copy built application and database assets from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/src/db ./src/db
COPY --from=builder /app/knexfile.js ./knexfile.js
COPY --from=builder /app/server.js ./server.js
COPY --from=builder /app/.env.production ./.env.production
COPY --from=builder /app/uploads ./uploads

# Ensure uploads directory exists
RUN mkdir -p uploads/gallery uploads/books uploads/audios uploads/documents uploads/trees private_uploads/trees

# Expose backend port 5000
EXPOSE 5000

# Start NestJS backend
CMD ["node", "dist/main.js"]
