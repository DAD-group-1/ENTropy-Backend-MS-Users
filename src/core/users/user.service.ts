import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '@dad-group-1/backend-common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createData: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createData);
    try {
      return await this.userRepository.save(user);
    } catch (error) {
      console.log(error.message);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      this.logger.error(`Error creating user: ${error.message || 'Unknown error'}`, { error });
      throw new RpcException({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
        message: error.message || 'Error creating user',
        code: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async findOne(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async update(id: number, updateData: UpdateUserDto): Promise<User | null> {
    const user = await this.findOne(id);
    if (!user) {
      this.logger.warn(`User with id ${id} not found for update`);
      return null;
    }

    this.userRepository.merge(user, updateData);
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<User | null> {
    const user = await this.findOne(id);
    if (!user) {
      this.logger.warn(`User with id ${id} not found for deletion`);
      return null;
    }

    await this.userRepository.remove(user);
    return user;
  }
}
