import { Controller, Get, Post, Put, Delete, Body, Param, Logger } from '@nestjs/common';
import { VehicleService } from '../services/vehicle.service';
import { Vehicle } from '../models/vehicle.entity';

@Controller('vehicles')
export class VehicleController {
  private readonly logger = new Logger(VehicleController.name);
  constructor(private readonly vehicleService: VehicleService) {}

  @Post()
  async create(@Body() vehicleData: Partial<Vehicle>): Promise<Vehicle> {
    return this.vehicleService.create(vehicleData);
  }

  @Get()
  async findAll(): Promise<Vehicle[]> {
    return this.vehicleService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Vehicle> {
    return this.vehicleService.findOne(id);
  }

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: number): Promise<Vehicle[]> {
    return this.vehicleService.findByUserId(userId);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() vehicleData: Partial<Vehicle>): Promise<Vehicle> {
    return this.vehicleService.update(id, vehicleData);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<{message: string}> {
    this.logger.log(`Deleting vehicle with ID: ${id}`);
    await this.vehicleService.remove(id);
    return { message: 'Vehicle deleted successfully' };
  }
}