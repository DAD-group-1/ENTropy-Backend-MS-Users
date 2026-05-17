import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(createData: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createData);
    return this.usersRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async update(id: number, updateData: UpdateUserDto): Promise<User | null> {
    const user = await this.findOne(id);
    if (!user) return null;

    this.usersRepository.merge(user, updateData);
    return this.usersRepository.save(user);
  }

  async remove(id: number): Promise<User | null> {
    const user = await this.findOne(id);
    if (user) {
      await this.usersRepository.remove(user);
      user.id = id;
    }
    return user;
  }
}
