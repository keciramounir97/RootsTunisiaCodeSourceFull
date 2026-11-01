#!/bin/bash
set -e

# ==============================================================================
# Roots Tunisia - Zero-Downtime Blue-Green Deployment Script
# ==============================================================================

COMPOSE_FILE="docker-compose.blue-green.yml"
NGINX_CONF="nginx/blue-green.conf"

echo "=========================================================="
echo "🚀 Starting Roots Tunisia Blue-Green Deployment"
echo "=========================================================="

# 1. Determine currently active environment
CURRENT_UPSTREAM=$(grep -o 'backend_[a-z]*:5000' "$NGINX_CONF" | head -n 1)

if [ "$CURRENT_UPSTREAM" == "backend_blue:5000" ]; then
    CURRENT="blue"
    TARGET="green"
    TARGET_PORT=5002
    TARGET_CONTAINER="rootstunisia_backend_green"
else
    CURRENT="green"
    TARGET="blue"
    TARGET_PORT=5001
    TARGET_CONTAINER="rootstunisia_backend_blue"
fi

echo "📍 Current Active Environment : $CURRENT ($CURRENT_UPSTREAM)"
echo "📍 Target Deployment Target   : $TARGET (port $TARGET_PORT)"

# 2. Build and start target environment
echo "🔨 Building and starting $TARGET container..."
docker compose -f "$COMPOSE_FILE" up -d --build "backend_$TARGET"

# 3. Wait and healthcheck the target container
echo "🩺 Performing health check on $TARGET environment (http://localhost:$TARGET_PORT/api/health)..."
MAX_ATTEMPTS=20
ATTEMPT=1
HEALTHY=false

while [ $ATTEMPT -le $MAX_ATTEMPTS ]; do
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$TARGET_PORT/api/health" || true)
    if [ "$HTTP_STATUS" == "200" ]; then
        echo "✅ Health check passed on attempt $ATTEMPT! Container is healthy."
        HEALTHY=true
        break
    fi
    echo "⏳ Attempt $ATTEMPT/$MAX_ATTEMPTS: HTTP $HTTP_STATUS received. Waiting 3s..."
    sleep 3
    ATTEMPT=$((ATTEMPT + 1))
done

if [ "$HEALTHY" != "true" ]; then
    echo "❌ Health check failed on $TARGET environment! Aborting cutover."
    echo "🛑 Rolling back: Stopping $TARGET container..."
    docker compose -f "$COMPOSE_FILE" stop "backend_$TARGET"
    exit 1
fi

# 4. Switch Nginx upstream configuration
echo "🔄 Switching active upstream in $NGINX_CONF to backend_$TARGET:5000..."
sed -i "s/backend_$CURRENT:5000/backend_$TARGET:5000/g" "$NGINX_CONF"

# 5. Reload Nginx without downtime
echo "🔁 Reloading Nginx configuration..."
docker exec rootstunisia_proxy nginx -s reload

echo "🎉 Traffic seamlessly routed to $TARGET environment!"

# 6. Stop previous environment safely after grace period
echo "⏸️ Waiting 10 seconds grace period for existing connections to complete..."
sleep 10

echo "⏹️ Stopping previous ($CURRENT) container..."
docker compose -f "$COMPOSE_FILE" stop "backend_$CURRENT"

echo "=========================================================="
echo "✅ Blue-Green Deployment Completed Successfully!"
echo "   Active Backend: $TARGET"
echo "=========================================================="
