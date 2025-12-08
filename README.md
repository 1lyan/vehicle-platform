Vehicle Service Platform 🚗
Microservice platform for user and vehicle management with automatic synchronization via RabbitMQ.

📋 Review
This project consists of three main components:

User Service - a microservice for user management

Vehicle Service - a microservice for vehicle management

Frontend - React application for interacting with services

RabbitMQ - message broker for inter-service communication

🛠 Technology stack
Backend
Node.js + NestJS + TypeScript

PostgreSQL (separate database for each service)

RabbitMQ for inter-service communication

Docker + Docker Compose

Frontend
React + TypeScript

Vite для for local builds

Axios for HTTP requests

🚀 Quick Start
Preliminary Considerations
Docker Desktop

Node.js 18+ (for local development)

Start the project for local development
### Cloning the repository (if necessary)
git clone <repository-url>
cd vehicle-platform

### Start all services
docker compose up --build

### Running in background mode
docker compose up --build -d

📊 Access to services
After successful launch, the services will be available at the following addresses:

Frontend	http://localhost:3000
User Service API	http://localhost:3001
Vehicle Service API	http://localhost:3002
RabbitMQ Management	http://localhost:15672

Credentials for RabbitMQ:

Username: guest
Password: guest

🛠 Useful commands for working with a project
Basic Docker Compose commands
### Start all services
docker compose up --build

### Running in background mode
docker compose up -d

### Stop all services
docker compose down

### Clean all images, containers, and volumes
docker system prune -f

### Or just clean up the images of our project
docker compose down --rmi all

### Restart all services
docker compose restart

### View service status
docker compose ps

### Updating services after code changes
docker compose up --build -d

### View logs of all services
docker compose logs -f

### View logs for a specific service
docker compose logs -f user-service
docker compose logs -f vehicle-service
docker compose logs -f frontend
docker compose logs -f rabbitmq

### View database logs
docker compose logs -f user-db
docker compose logs -f vehicle-db

### Restart a specific service
docker compose restart user-service
docker compose restart vehicle-service

### Stopping a specific service
docker compose stop user-service

### Run a specific service
docker compose start user-service

### Rebuild a specific service
docker compose up --build user-service

### Connecting to the User Service database
docker exec -it user-db psql -U postgres -d user_db

### Connecting to the Vehicle Service database
docker exec -it vehicle-db psql -U postgres -d vehicle_db

🧪 Local Testing

Step 1: Check RabbitMQ

Open RabbitMQ Management Console: http://localhost:15672

Log in with credentials: guest/guest

Verify that queues and exchanges have been created:

Exchange: user_events

Queue: vehicle_service_queue

Step 2: Create a user

Through Frontend:

Open http://localhost:3000

Go to the "Users" page

Fill out the user creation form

Click "Create User"

Through API (Postman):

http
POST http://localhost:3001/users
Content-Type: application/json

{
  "email": "test@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
Step 3: Verify automatic vehicle creation
After creating a user, the system will automatically create an "empty" vehicle:

Through API:

http
GET http://localhost:3002/vehicles/user/1
Expected response:

json
[
  {
    "id": 1,
    "make": "Unknown",
    "model": "Unknown",
    "year": null,
    "userId": 1,
    "createdAt": "2024-01-01T10:00:00.000Z"
  }
]
Step 4: Verify data connection
Getting the user with their vehicles:

http
GET http://localhost:3001/users/1
GET http://localhost:3002/vehicles/user/1

🔧 Development and changes

### User Service
cd user-service
npm install
npm run start:dev

### Vehicle Service  
cd vehicle-service
npm install
npm run start:dev

### Frontend
cd frontend
npm install
npm run dev

### Оновлення в конкретному сервісі
cd user-service
npm update

🐛 Solving Problems
### Check logs
docker compose logs

### Checking ports availability
netstat -ano | findstr :3000

### Restart the database
docker compose restart user-db vehicle-db

### Checking connections
docker compose logs user-db

### Clearing queues (note: will delete all messages)
docker compose restart rabbitmq

# A complete step-by-step guide to deploying the Vehicle Platform on AWS ECS Fargate

## AWS Deployment

## 📋 Prerequisites
1. AWS CLI installed and configured
2. Docker installed locally
3. Application source code with Dockerfile
4. AWS account with required permissions

## 1.1 Creating a VPC (if there is no existing one)

```
VPC_ID=$(aws ec2 create-vpc \
    --cidr-block 10.0.0.0/16 \
    --region us-east-1 \
    --query 'Vpc.VpcId' \
    --output text)

echo "VPC created: $VPC_ID"
```

### 1.2 Creating public subnets
```
SUBNET1=$(aws ec2 create-subnet \
    --vpc-id $VPC_ID \
    --cidr-block 10.0.1.0/24 \
    --availability-zone us-east-1a \
    --region us-east-1 \
    --query 'Subnet.SubnetId' \
    --output text)

SUBNET2=$(aws ec2 create-subnet \
    --vpc-id $VPC_ID \
    --cidr-block 10.0.2.0/24 \
    --availability-zone us-east-1b \
    --region us-east-1 \
    --query 'Subnet.SubnetId' \
    --output text)

# Make subnets public
aws ec2 modify-subnet-attribute \
    --subnet-id $SUBNET1 \
    --map-public-ip-on-launch \
    --region us-east-1

aws ec2 modify-subnet-attribute \
    --subnet-id $SUBNET2 \
    --map-public-ip-on-launch \
    --region us-east-1
```

### 1.3 Create Security Group
```
SG_ID=$(aws ec2 create-security-group \
    --group-name vehicle-platform-sg \
    --description "Security group for Vehicle Platform" \
    --vpc-id $VPC_ID \
    --region us-east-1 \
    --query 'GroupId' \
    --output text)

echo "Security Group created: $SG_ID"
```

### 1.4 Add rules to the Security Group
```
# Open ports for all services
PORTS="80 443 3000 3001 3002 5432 5672 15672"

for PORT in $PORTS; do
    aws ec2 authorize-security-group-ingress \
        --group-id $SG_ID \
        --protocol tcp \
        --port $PORT \
        --cidr 0.0.0.0/0 \
        --region us-east-1
    echo "Added port: $PORT"
done
```

### 1.5 Create ECS cluster
```
aws ecs create-cluster \
    --cluster-name vehicle-platform-cluster \
    --region us-east-1
```

## 🚀 STEP 2: Configure IAM roles

### 2.1 Creating a role to perform ECS tasks
```
# Create role
aws iam create-role \
    --role-name ecsTaskExecutionRole \
    --assume-role-policy-document '{
        "Version": "2012-10-17",
        "Statement": [{
            "Effect": "Allow",
            "Principal": {"Service": "ecs-tasks.amazonaws.com"},
            "Action": "sts:AssumeRole"
        }]
    }' \
    --region us-east-1

# Attach policies
aws iam attach-role-policy \
    --role-name ecsTaskExecutionRole \
    --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy \
    --region us-east-1

aws iam attach-role-policy \
    --role-name ecsTaskExecutionRole \
    --policy-arn arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly \
    --region us-east-1
    
```

## 🚀 Step 3: Create ECS repositories

### 3.1 Creating repositories for each service
```
SERVICES="frontend user-service vehicle-service"

for SERVICE in $SERVICES; do
    aws ecr create-repository \
        --repository-name "vehicle-platform-$SERVICE" \
        --region us-east-1
    echo "Создан репозиторий: vehicle-platform-$SERVICE"
done
```

### 3.2 ECR authorization
```
aws ecr get-login-password --region us-east-1 | \
    docker login --username AWS --password-stdin 748782584345.dkr.ecr.us-east-1.amazonaws.com
```

## 🚀 STEP 4: Build and download Docker images

### 4.1 Build images locally
```
# For each service in its directory:
docker build -t vehicle-platform-frontend:latest ./frontend
docker build -t vehicle-platform-user-service:latest ./user-service
docker build -t vehicle-platform-vehicle-service:latest ./vehicle-service
```

### 4.2 Create tags and push to ECR
```
ACCOUNT_ID= put the ID here
REGION=us-east-1
REGISTRY=$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com

for SERVICE in frontend user-service vehicle-service; do
    # tags
    docker tag "vehicle-platform-$SERVICE:latest" "$REGISTRY/vehicle-platform-$SERVICE:latest"
    
    # push to ECR
    docker push "$REGISTRY/vehicle-platform-$SERVICE:latest"
    
    echo "image pushed: vehicle-platform-$SERVICE"
done
```

## 🚀 STEP 5: Create Task Definitions

### 5.1 PostgreSQL Task Definition
```
{
    "family": "postgres-task",
    "networkMode": "awsvpc",
    "requiresCompatibilities": ["FARGATE"],
    "cpu": "512",
    "memory": "1024",
    "executionRoleArn": "arn:aws:iam::748782584345:role/ecsTaskExecutionRole",
    "containerDefinitions": [
        {
            "name": "postgres",
            "image": "postgres:15-alpine",
            "essential": true,
            "portMappings": [{"containerPort": 5432}],
            "environment": [
                {"name": "POSTGRES_DB", "value": "vehicle_db"},
                {"name": "POSTGRES_USER", "value": "admin"},
                {"name": "POSTGRES_PASSWORD", "value": "postgres123"}
            ],
            "logConfiguration": {
                "logDriver": "awslogs",
                "options": {
                    "awslogs-group": "/ecs/postgres",
                    "awslogs-region": "us-east-1",
                    "awslogs-stream-prefix": "ecs"
                }
            }
        }
    ]
}

aws ecs register-task-definition \
    --cli-input-json file://postgres-task.json \
    --region us-east-1
```

### 5.2 RabbitMQ Task Definition
```
{
    "family": "rabbitmq-task",
    "networkMode": "awsvpc",
    "requiresCompatibilities": ["FARGATE"],
    "cpu": "512",
    "memory": "1024",
    "executionRoleArn": "arn:aws:iam::748782584345:role/ecsTaskExecutionRole",
    "containerDefinitions": [
        {
            "name": "rabbitmq",
            "image": "rabbitmq:3-management-alpine",
            "essential": true,
            "portMappings": [
                {"containerPort": 5672},
                {"containerPort": 15672}
            ],
            "environment": [
                {"name": "RABBITMQ_DEFAULT_USER", "value": "admin"},
                {"name": "RABBITMQ_DEFAULT_PASS", "value": "rabbitmq123"}
            ],
            "logConfiguration": {
                "logDriver": "awslogs",
                "options": {
                    "awslogs-group": "/ecs/rabbitmq",
                    "awslogs-region": "us-east-1",
                    "awslogs-stream-prefix": "ecs"
                }
            }
        }
    ]
}

aws ecs register-task-definition \
    --cli-input-json file://rabbitmq-task.json \
    --region us-east-1
```


### 5.3 User Service Task Definition
```
{
    "family": "user-service-task",
    "networkMode": "awsvpc",
    "requiresCompatibilities": ["FARGATE"],
    "cpu": "256",
    "memory": "512",
    "executionRoleArn": "arn:aws:iam::748782584345:role/ecsTaskExecutionRole",
    "containerDefinitions": [
        {
            "name": "user-service",
            "image": "748782584345.dkr.ecr.us-east-1.amazonaws.com/vehicle-platform-user-service:latest",
            "essential": true,
            "portMappings": [{"containerPort": 3001}],
            "environment": [
                {"name": "DB_HOST", "value": "postgres-service"},
                {"name": "DB_PORT", "value": "5432"},
                {"name": "DB_NAME", "value": "vehicle_db"},
                {"name": "DB_USERNAME", "value": "admin"},
                {"name": "DB_PASSWORD", "value": "postgres123"},
                {"name": "RABBITMQ_HOST", "value": "rabbitmq-service"},
                {"name": "RABBITMQ_PORT", "value": "5672"},
                {"name": "SERVER_PORT", "value": "3001"}
            ],
            "logConfiguration": {
                "logDriver": "awslogs",
                "options": {
                    "awslogs-group": "/ecs/user-service",
                    "awslogs-region": "us-east-1",
                    "awslogs-stream-prefix": "ecs"
                }
            }
        }
    ]
}

aws ecs register-task-definition \
    --cli-input-json file://user-service-task.json \
    --region us-east-1
```

### 5.4 Vehicle Service Task Definition
```
{
    "family": "vehicle-service-task",
    "networkMode": "awsvpc",
    "requiresCompatibilities": ["FARGATE"],
    "cpu": "256",
    "memory": "512",
    "executionRoleArn": "arn:aws:iam::748782584345:role/ecsTaskExecutionRole",
    "containerDefinitions": [
        {
            "name": "vehicle-service",
            "image": "748782584345.dkr.ecr.us-east-1.amazonaws.com/vehicle-platform-vehicle-service:latest",
            "essential": true,
            "portMappings": [{"containerPort": 3002}],
            "environment": [
                {"name": "DB_HOST", "value": "postgres-service"},
                {"name": "RABBITMQ_HOST", "value": "rabbitmq-service"},
                {"name": "SERVER_PORT", "value": "3002"}
            ],
            "logConfiguration": {
                "logDriver": "awslogs",
                "options": {
                    "awslogs-group": "/ecs/vehicle-service",
                    "awslogs-region": "us-east-1",
                    "awslogs-stream-prefix": "ecs"
                }
            }
        }
    ]
}

aws ecs register-task-definition \
    --cli-input-json file://vehicle-service-task.json \
    --region us-east-1
```

### 5.5 Frontend Task Definition
```
{
    "family": "frontend-task",
    "networkMode": "awsvpc",
    "requiresCompatibilities": ["FARGATE"],
    "cpu": "256",
    "memory": "512",
    "executionRoleArn": "arn:aws:iam::748782584345:role/ecsTaskExecutionRole",
    "containerDefinitions": [
        {
            "name": "frontend",
            "image": "748782584345.dkr.ecr.us-east-1.amazonaws.com/vehicle-platform-frontend:latest",
            "essential": true,
            "portMappings": [{"containerPort": 3000}],
            "environment": [
                {"name": "API_URL", "value": "http://user-service:3001"}
            ],
            "logConfiguration": {
                "logDriver": "awslogs",
                "options": {
                    "awslogs-group": "/ecs/frontend",
                    "awslogs-region": "us-east-1",
                    "awslogs-stream-prefix": "ecs"
                }
            }
        }
    ]
}

aws ecs register-task-definition \
    --cli-input-json file://frontend-task.json \
    --region us-east-1
```

## 🚀 STEP 6: Create CloudWatch Log Groups

```
for SERVICE in postgres rabbitmq user-service vehicle-service frontend; do
    aws logs create-log-group \
        --log-group-name "/ecs/$SERVICE" \
        --region us-east-1
    echo "Создан Log Group: /ecs/$SERVICE"
done
```

## 🚀 Step 7: Create ECS services

### 7.1 PostgreSQL Service
```
aws ecs create-service \
    --cluster vehicle-platform-cluster \
    --service-name postgres-service \
    --task-definition postgres-task:1 \
    --desired-count 1 \
    --launch-type FARGATE \
    --network-configuration "awsvpcConfiguration={subnets=[$SUBNET1,$SUBNET2],securityGroups=[$SG_ID],assignPublicIp=ENABLED}" \
    --region us-east-1
```

### 7.2 RabbitMQ Service
```
aws ecs create-service \
    --cluster vehicle-platform-cluster \
    --service-name rabbitmq-service \
    --task-definition rabbitmq-task:1 \
    --desired-count 1 \
    --launch-type FARGATE \
    --network-configuration "awsvpcConfiguration={subnets=[$SUBNET1,$SUBNET2],securityGroups=[$SG_ID],assignPublicIp=ENABLED}" \
    --region us-east-1
```

### 7.3 User Service
```
aws ecs create-service \
    --cluster vehicle-platform-cluster \
    --service-name user-service \
    --task-definition user-service-task:1 \
    --desired-count 1 \
    --launch-type FARGATE \
    --network-configuration "awsvpcConfiguration={subnets=[$SUBNET1,$SUBNET2],securityGroups=[$SG_ID],assignPublicIp=ENABLED}" \
    --region us-east-1
```

### 7.4 Vehicle Service
```
aws ecs create-service \
    --cluster vehicle-platform-cluster \
    --service-name vehicle-service \
    --task-definition vehicle-service-task:1 \
    --desired-count 1 \
    --launch-type FARGATE \
    --network-configuration "awsvpcConfiguration={subnets=[$SUBNET1,$SUBNET2],securityGroups=[$SG_ID],assignPublicIp=ENABLED}" \
    --region us-east-1
```

### 7.5 Frontend Service
```
aws ecs create-service \
    --cluster vehicle-platform-cluster \
    --service-name frontend-service \
    --task-definition frontend-task:1 \
    --desired-count 1 \
    --launch-type FARGATE \
    --network-configuration "awsvpcConfiguration={subnets=[$SUBNET1,$SUBNET2],securityGroups=[$SG_ID],assignPublicIp=ENABLED}" \
    --region us-east-1
```

## 🚀 Step 8: Solve connection problems

### 8.1 Obtaining Private IP addresses of running services
```
# Get IP RabbitMQ
RABBIT_TASK=$(aws ecs list-tasks \
    --cluster vehicle-platform-cluster \
    --service-name rabbitmq-service \
    --region us-east-1 \
    --query 'taskArns[0]' \
    --output text)

ENI_ID=$(aws ecs describe-tasks \
    --cluster vehicle-platform-cluster \
    --tasks $RABBIT_TASK \
    --region us-east-1 \
    --query 'tasks[0].attachments[0].details[?name==`networkInterfaceId`].value' \
    --output text)

RABBIT_PRIVATE_IP=$(aws ec2 describe-network-interfaces \
    --network-interface-ids $ENI_ID \
    --region us-east-1 \
    --query 'NetworkInterfaces[0].PrivateIpAddress' \
    --output text)

echo "Private IP RabbitMQ: $RABBIT_PRIVATE_IP"

# Do the same for Postrgres IP
...
echo "Private Postgres IP: $POSTGRES_PRIVATE_IP"
```

### 8.2 Updating Task Definitions with IP Addresses
```
// Update this section of user-service-task.json
{
    "environment": [
        {"name": "DB_HOST", "value": "$POSTGRES_PRIVATE_IP"},
        {"name": "DB_PORT", "value": "5432"},
        {"name": "DB_NAME", "value": "vehicle_db"},
        {"name": "DB_USERNAME", "value": "admin"},
        {"name": "DB_PASSWORD", "value": "postgres123"},
        {"name": "RABBITMQ_HOST", "value": "$RABBIT_PRIVATE_IP"},
        {"name": "RABBITMQ_PORT", "value": "5672"},
        {"name": "SERVER_PORT", "value": "3001"}
    ]
}
```

### 8.3 Do the same for Vehicle Service
...

### 8.4 Registering Updated Task Definitions
```
aws ecs register-task-definition \
    --cli-input-json file://user-service-updated.json \
    --region us-east-1

# Get the new revision
NEW_REVISION=$(aws ecs describe-task-definition \
    --task-definition user-service-task \
    --region us-east-1 \
    --query 'taskDefinition.revision' \
    --output text)

# Update service
aws ecs update-service \
    --cluster vehicle-platform-cluster \
    --service user-service \
    --task-definition user-service-task:$NEW_REVISION \
    --force-new-deployment \
    --region us-east-1
```

### 8.5 Do the same for Vehicle Service
...

## 🚀 STEP 9: Check Availability

### 9.1 Checking the status of all services
```
aws ecs describe-services \
    --cluster vehicle-platform-cluster \
    --services postgres-service rabbitmq-service user-service vehicle-service frontend-service \
    --region us-east-1 \
    --query 'services[].{service:serviceName,status:status,running:runningCount,desired:desiredCount}'
```

### 9.2 Obtaining public IP addresses
```
chmod +x get-public-ips.sh
./get-public-ips.sh
```

### 9.3 Check logs

```
# RabbitMQ
aws logs tail /ecs/rabbitmq --region us-east-1 --since 5m

# Service
aws logs tail /ecs/user-service --region us-east-1 --since 5m

# Vehicle Service
aws logs tail /ecs/vehicle-service --region us-east-1 --since 5m
```

## 🚀 Step 10: Helper Scripts

### 10.1 Obtain all IPs
```
chmod +x get-all-ips.sh
./get-all-ips.sh
```

### 10.2 Health check script
```
chmod +x health-check.sh
./health-check.sh
```

### 10.3 Restart service
```
aws ecs update-service \
    --cluster vehicle-platform-cluster \
    --service vehicle-service \
    --force-new-deployment \
    --region us-east-1
```

📄 MIT License