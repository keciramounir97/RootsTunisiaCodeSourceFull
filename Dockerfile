# syntax=docker/dockerfile:1
# ----------------------------------------------------
# Stage 1: Build Frontend Assets with Node.js
# ----------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (better layer caching)
COPY frontend/package*.json ./
RUN npm ci --legacy-peer-deps

# Copy frontend source code and build
COPY frontend/ .
ARG VITE_API_URL=https://server.rootstunisia.com
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ----------------------------------------------------
# Stage 2: Serve with Lightweight Nginx on Port 80
# ----------------------------------------------------
FROM nginx:alpine AS runner

# Remove default Nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy built static files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
