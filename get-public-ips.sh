SERVICES="postgres-service rabbitmq-service user-service vehicle-service frontend-service"

for SERVICE in $SERVICES; do
    echo "=== $SERVICE ==="
    
    TASK_ARN=$(aws ecs list-tasks \
        --cluster vehicle-platform-cluster \
        --service-name $SERVICE \
        --region us-east-1 \
        --query 'taskArns[0]' \
        --output text)
    
    if [ "$TASK_ARN" != "None" ]; then
        ENI_ID=$(aws ecs describe-tasks \
            --cluster vehicle-platform-cluster \
            --tasks $TASK_ARN \
            --region us-east-1 \
            --query 'tasks[0].attachments[0].details[?name==`networkInterfaceId`].value' \
            --output text)
        
        PUBLIC_IP=$(aws ec2 describe-network-interfaces \
            --network-interface-ids $ENI_ID \
            --region us-east-1 \
            --query 'NetworkInterfaces[0].Association.PublicIp' \
            --output text)
        
        echo "Public IP: $PUBLIC_IP"
        
        # define port
        case $SERVICE in
            "postgres-service") PORT=5432 ;;
            "rabbitmq-service") PORT=15672 ;;
            "user-service") PORT=3001 ;;
            "vehicle-service") PORT=3002 ;;
            "frontend-service") PORT=3000 ;;
        esac
        
        echo "Port: $PORT"
        echo "URL: http://$PUBLIC_IP:$PORT"
    else
        echo "Service not running"
    fi
    
    echo ""
done