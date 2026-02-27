import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  private readonly logger = new Logger(RabbitMQService.name);
  private channel: any = null;

  async onModuleInit() {
    this.logger.log('Initializing RabbitMQ connection...');
    await this.connect();
  }

  async connect() {
    try {
      const connection = await amqp.connect('amqp://rabbitmq:5672');
      this.channel = await connection.createChannel();
      await this.channel.assertExchange('user_events', 'topic', { durable: true });
      console.log('User Service connected to RabbitMQ');
    } catch (error) {
      console.error('RabbitMQ connection error:', error);
      setTimeout(() => this.connect(), 10000);
    }
  }

  async publishMessage(routingKey: string, message: any) {
    if (!this.channel) {
      this.logger.warn('Channel not available, reconnecting...');
      await this.connect();
    }

    if (this.channel) {
      this.logger.log(`Publishing message to routing key: ${routingKey}`);
      this.channel.publish(
        'user_events',
        routingKey,
        Buffer.from(JSON.stringify(message)),
        { persistent: true }
      );
      this.logger.log('Message published successfully');
    } else {
      this.logger.error('Failed to publish message - channel is null');
    }

  }
}