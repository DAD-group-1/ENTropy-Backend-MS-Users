import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './interfaces/dtos/create-user.dto';
import { UpdateUserDto } from './interfaces/dtos/update-user.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createData: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createData);
    try {
      return await this.userRepository.save(user);
    } catch (error) {
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
    if (!user) return null;

    this.userRepository.merge(user, updateData);
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<User | null> {
    const user = await this.findOne(id);
    if (!user) return null;

    await this.userRepository.remove(user);
    return user;
  }
}
