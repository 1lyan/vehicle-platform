import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleController } from './controllers/vehicle.controller';
import { VehicleService } from './services/vehicle.service';
import { Vehicle } from './models/vehicle.entity';
import { RabbitModule } from './rabbit/rabbit.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_DATABASE || 'vehicle_db',
      entities: [Vehicle],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Vehicle]),
    RabbitModule,
  ],
  controllers: [VehicleController],
  providers: [VehicleService],
})
export class AppModule {}