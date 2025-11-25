import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as amqp from 'amqplib';
import { VehicleService } from '../services/vehicle.service';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  private channel: any = null;
  private readonly logger = new Logger(RabbitMQService.name);

  constructor(private readonly vehicleService: VehicleService) {}

  async onModuleInit() {
    this.logger.log('Initializing RabbitMQ connection for Vehicle Service...');
    await this.connect();
  }

  async connect() {
    try {
      const rabbitUrl = 'amqp://rabbitmq:5672';
      this.logger.log(`Connecting to RabbitMQ at: ${rabbitUrl}`);

      const connection = await amqp.connect(rabbitUrl);
      this.channel = await connection.createChannel();

      this.logger.log('Creating exchange and queue...');
      await this.channel.assertExchange('user_events', 'topic', { durable: true });
      
      const queue = await this.channel.assertQueue('vehicle_service_queue', { durable: true });
      await this.channel.bindQueue(queue.queue, 'user_events', 'user.created');
      
      this.logger.log(`Queue created: ${queue.queue}`);
      this.logger.log('Vehicle Service successfully connected to RabbitMQ');

      await this.setupConsumer();
    } catch (error) {
      this.logger.error(`RabbitMQ connection error: ${error}`);
      setTimeout(() => this.connect(), 20000);
    }
  }

  async setupConsumer() {
    if (!this.channel) {
      this.logger.error('Cannot setup consumer - channel is null');
      await this.connect();
      return;
    }

    this.logger.log('Setting up message consumer...');
    this.channel.consume('vehicle_service_queue', async (msg) => {
      if (msg) {
        this.logger.log(`Received message: ${msg.content.toString()}`);
        try {
          const content = JSON.parse(msg.content.toString());
          this.logger.log(`Parsed message: ${JSON.stringify(content)}`);
          await this.handleMessage(content);
          this.channel!.ack(msg);
          this.logger.log('Message processed successfully');
        } catch (error) {
          this.logger.error(`Error processing message: ${error.message}`);
          this.channel!.nack(msg);
        }
      }
    });
  }

  private async handleMessage(message: any) {
    this.logger.log(`Handling message type: ${message.type}`);
    
    if (message.type === 'USER_CREATED') {
      this.logger.log(`Creating default vehicle for user ${message.data.id}`);
      
      try {
        const vehicle = await this.vehicleService.create({
          make: 'Unknown',
          model: 'Unknown',
          year: null,
          userId: message.data.id,
        });
        this.logger.log(`Default vehicle created with ID: ${vehicle.id}`);
      } catch (error) {
        this.logger.error(`Error creating default vehicle: ${error.message}`);
      }
    } else {
      this.logger.warn(`Unknown message type: ${message.type}`);
    }
  }
}