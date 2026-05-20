import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Instructor } from './entities/instructor.entity';
import { Repository } from 'typeorm';
import {
  CreateInstructorDto,
  UpdateInstructorDto,
} from './interfaces/dtos/instructor.dto';
import { UserService } from '../users/user.service';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class InstructorService {
  constructor(
    @InjectRepository(Instructor)
    private instructorRepository: Repository<Instructor>,
    private readonly userService: UserService,
  ) {}

  async create(createData: CreateInstructorDto): Promise<Instructor> {
    const savedUser = await this.userService.create({ ...createData });

    createData.user_id = savedUser.id;
    const instructor = this.instructorRepository.create(createData);
    try {
      const savedInstructor = await this.instructorRepository.save(instructor);

      return {
        ...savedInstructor,
        user: savedUser,
      };
    } catch (error) {
      await this.userService.remove(savedUser.id);
      throw new RpcException({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
        message: error.message || 'Failed to create instructor',
        code: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  findAll(): Promise<Instructor[]> {
    return this.instructorRepository.find({
      relations: { user: true },
    });
  }

  async findOne(id: number): Promise<Instructor | null> {
    const instructor = await this.instructorRepository.findOne({
      where: { user_id: id },
      relations: { user: true },
    });

    if (!instructor) {
      throw new RpcException({
        message: `Instructor with ID ${id} not found`,
        code: HttpStatus.NOT_FOUND,
      });
    }

    return instructor;
  }

  async update(
    id: number,
    updateData: UpdateInstructorDto,
  ): Promise<Instructor | null> {
    const instructor = await this.findOne(id);
    if (!instructor) return null;

    const updatedUser = await this.userService.update(id, updateData);

    this.instructorRepository.merge(instructor, updateData);
    const updatedInstructor = await this.instructorRepository.save(instructor);

    if (updatedUser) {
      updatedInstructor.user = updatedUser;
    }

    return updatedInstructor;
  }

  async remove(id: number): Promise<Instructor | null> {
    const instructor = await this.findOne(id);
    if (!instructor) return null;

    await this.instructorRepository.remove(instructor);
    await this.userService.remove(id);
    return instructor;
  }
}
