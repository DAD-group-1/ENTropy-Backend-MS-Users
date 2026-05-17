import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern({ cmd: 'create_user' })
  async create(@Payload() data: CreateUserDto) {
    console.log(data);
    return this.usersService.create(data);
  }

  @MessagePattern({ cmd: 'find_all_users' })
  async findAll() {
    return this.usersService.findAll();
  }

  @MessagePattern({ cmd: 'find_one_user' })
  async findOne(@Payload() id: string) {
    return this.usersService.findOne(Number(id));
  }

  @MessagePattern({ cmd: 'update_user' })
  async update(
    @Payload() payload: { id: string; updateUserDto: UpdateUserDto },
  ) {
    return this.usersService.update(Number(payload.id), payload.updateUserDto);
  }

  @MessagePattern({ cmd: 'remove_user' })
  async remove(@Payload() id: string) {
    return this.usersService.remove(Number(id));
  }
}
