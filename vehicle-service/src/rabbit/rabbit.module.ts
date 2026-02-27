import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RabbitMQService } from './rabbitmq.service';
import { VehicleService } from '../services/vehicle.service';
import { Vehicle } from '../models/vehicle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle])],
  providers: [RabbitMQService, VehicleService],
  exports: [RabbitMQService],
})
export class RabbitModule {}