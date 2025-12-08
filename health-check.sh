#!/bin/bash
# health-check.sh

CLUSTER="vehicle-platform-cluster"
REGION="us-east-1"

echo "=== Vehicle Platform Health Check ==="
echo "Timestamp: $(date)"
echo ""

# Проверка статуса сервисов
echo "📊 Service Status:"
aws ecs describe-services \
    --cluster $CLUSTER \
    --services postgres-service rabbitmq-service user-service vehicle-service frontend-service \
    --region $REGION \
    --query 'services[].{Service:serviceName,Status:status,Desired:desiredCount,Running:runningCount}' \
    --output table

echo ""
echo "🔍 Recent Logs Check:"

# Проверка последних логов
for SERVICE in user-service vehicle-service; do
    echo ""
    echo "📝 $SERVICE logs (last 5 lines):"
    aws logs get-log-events \
        --log-group-name "/ecs/$SERVICE" \
        --log-stream-name $(aws logs describe-log-streams \
            --log-group-name "/ecs/$SERVICE" \
            --region $REGION \
            --query 'logStreams[-1].logStreamName' \
            --output text 2>/dev/null) \
        --region $REGION \
        --limit 5 2>/dev/null | \
        grep -o '"message": "[^"]*"' | \
        cut -d'"' -f4 | \
        while read line; do echo "   $line"; done
done