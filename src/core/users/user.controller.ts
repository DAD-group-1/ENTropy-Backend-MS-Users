import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import { PaginationQueryDto } from '@dad-group-1/backend-common';

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'find_all_users' })
  async findAllUsers(@Payload() data: PaginationQueryDto) {
    this.logger.log('Retrieving all user records with pagination');
    return this.userService.findAll(data);
  }

  @MessagePattern({ cmd: 'find_one_user' })
  async findOneUser(@Payload() id: number) {
    this.logger.log('Retrieving user record with ID: ' + id);
    return this.userService.findOneUser(id);
  }
}
