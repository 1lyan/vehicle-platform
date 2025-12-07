#!/bin/sh
set -e

echo "=== User Service Startup (no healthcheck) ==="

wait_for() {
  local host=$1
  local port=$2
  local name=$3
  
  echo "Waiting for $name at $host:$port..."
  
  for i in $(seq 1 30); do
    if nc -z "$host" "$port" >/dev/null 2>&1; then
      echo "✓ $name is ready"
      return 0
    fi
    echo "  Attempt $i/30: $name not ready..."
    sleep 2
  done
  
  echo "✗ ERROR: $name not available after 60 seconds"
  return 1
}

# wait for dependencies
wait_for "$RABBITMQ_HOST" "$RABBITMQ_PORT" "RabbitMQ"
wait_for "$DB_HOST" "$DB_PORT" "PostgreSQL"

echo "All dependencies ready. Starting NestJS application..."
exec "$@"