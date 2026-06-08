import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import { PaginationQueryDto } from '@dad-group-1/backend-common';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'find_all_users' })
  async findAllUsers(@Payload() data: PaginationQueryDto) {
    return this.userService.findAll(data);
  }

  @MessagePattern({ cmd: 'find_one_user' })
  async findOneUser(@Payload() id: number) {
    return this.userService.findOneUser(id);
  }
}
