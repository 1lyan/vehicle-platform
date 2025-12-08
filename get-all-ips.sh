#!/bin/bash
# get-all-ips.sh

CLUSTER="vehicle-platform-cluster"
REGION="us-east-1"

echo "=== Vehicle Platform Public IP Addresses ==="
echo ""

# Для каждого сервиса
declare -A SERVICES=(
    ["postgres-service"]="PostgreSQL Database"
    ["rabbitmq-service"]="RabbitMQ Message Broker"
    ["user-service"]="User Service API"
    ["vehicle-service"]="Vehicle Service API"
    ["frontend-service"]="Frontend Application"
)

for SERVICE in "${!SERVICES[@]}"; do
    echo "🔧 ${SERVICES[$SERVICE]}"
    
    TASK_ARN=$(aws ecs list-tasks \
        --cluster $CLUSTER \
        --service-name $SERVICE \
        --region $REGION \
        --query 'taskArns[0]' \
        --output text 2>/dev/null)
    
    if [ "$TASK_ARN" != "None" ] && [ ! -z "$TASK_ARN" ]; then
        ENI_ID=$(aws ecs describe-tasks \
            --cluster $CLUSTER \
            --tasks $TASK_ARN \
            --region $REGION \
            --query 'tasks[0].attachments[0].details[?name==`networkInterfaceId`].value' \
            --output text 2>/dev/null)
        
        if [ ! -z "$ENI_ID" ]; then
            PUBLIC_IP=$(aws ec2 describe-network-interfaces \
                --network-interface-ids $ENI_ID \
                --region $REGION \
                --query 'NetworkInterfaces[0].Association.PublicIp' \
                --output text 2>/dev/null)
            
            if [ ! -z "$PUBLIC_IP" ]; then
                case $SERVICE in
                    "postgres-service")
                        echo "   📍 Host: $PUBLIC_IP:5432"
                        echo "   👤 User: admin"
                        echo "   🔑 Password: postgres123"
                        ;;
                    "rabbitmq-service")
                        echo "   🌐 Web UI: http://$PUBLIC_IP:15672"
                        echo "   📡 AMQP: $PUBLIC_IP:5672"
                        echo "   👤 User: admin"
                        echo "   🔑 Password: rabbitmq123"
                        ;;
                    "user-service")
                        echo "   🔌 API: http://$PUBLIC_IP:3001"
                        echo "   📍 Port: 3001"
                        ;;
                    "vehicle-service")
                        echo "   🔌 API: http://$PUBLIC_IP:3002"
                        echo "   📍 Port: 3002"
                        ;;
                    "frontend-service")
                        echo "   🌍 Application: http://$PUBLIC_IP:3000"
                        echo "   📍 Port: 3000"
                        ;;
                esac
            else
                echo "   ⚠️  No public IP assigned"
            fi
        else
            echo "   ⚠️  No network interface found"
        fi
    else
        echo "   ⚠️  Service not running"
    fi
    
    echo ""
done