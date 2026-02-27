import { Controller, Get, Post, Put, Delete, Body, Param, Logger} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { User } from '../models/user.entity';
import { RabbitMQService } from '../rabbit/rabbitmq.service';

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    private readonly userService: UserService,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  @Post()
  async create(@Body() userData: Partial<User>): Promise<User> {
    this.logger.log('Creating new user...');
    const user = await this.userService.create(userData);
    this.logger.log(`User created with ID: ${user.id}`);
    
    const message = {
      type: 'USER_CREATED',
      data: {
        id: user.id,
        email: user.email,
      },
    };

    this.logger.log(`Publishing message to RabbitMQ: ${JSON.stringify(message)}`);

    await this.rabbitMQService.publishMessage('user.created', message);
    this.logger.log('Message sent to RabbitMQ');

    return user;
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<User> {
    return this.userService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() userData: Partial<User>): Promise<User> {
    return this.userService.update(id, userData);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.userService.remove(id);
  }
}