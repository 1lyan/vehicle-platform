import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from '../models/vehicle.entity';

@Injectable()
export class VehicleService {
  private readonly logger = new Logger(VehicleService.name);

  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
  ) {}

  async create(vehicleData: Partial<Vehicle>): Promise<Vehicle> {
    this.logger.log(`Creating vehicle: ${JSON.stringify(vehicleData)}`);
    const vehicle = this.vehicleRepository.create(vehicleData);

    const savedVehicle = await this.vehicleRepository.save(vehicle);
    this.logger.log(`Vehicle created with ID: ${savedVehicle.id}`);
    return savedVehicle;
  }

  async findAll(): Promise<Vehicle[]> {
    return await this.vehicleRepository.find();
  }

  async findOne(id: number): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findOne({ where: { id } });
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }
    return vehicle;
  }

  async findByUserId(userId: number): Promise<Vehicle[]> {
    return await this.vehicleRepository.find({ where: { userId } });
  }

  async update(id: number, vehicleData: Partial<Vehicle>): Promise<Vehicle> {
    await this.vehicleRepository.update(id, vehicleData);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.vehicleRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }
    this.logger.log(`Vehicle with ID: ${id} deleted successfully`);
  }
}