import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Instructor } from './entities/instructor.entity';
import { Repository } from 'typeorm';
import {
  CreateInstructorRequestDto,
  InstructorListResponseDto,
  InstructorResponseDto,
  PaginationQueryDto,
  UpdateInstructorDto,
} from '@dad-group-1/backend-common';
import { UserService } from '../users/user.service';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class InstructorService {
  private readonly logger = new Logger(InstructorService.name);

  constructor(
    @InjectRepository(Instructor)
    private instructorRepository: Repository<Instructor>,
    private readonly userService: UserService,
  ) {}

  async create(
    createData: CreateInstructorRequestDto,
  ): Promise<InstructorResponseDto> {
    await this.userService.assertDoesntExist({ email: createData.email });

    const savedUser = await this.userService.create({ ...createData });

    const instructor = this.instructorRepository.create({
      ...createData,
      user_id: savedUser.id,
    });
    try {
      const savedInstructor = await this.instructorRepository.save(instructor);

      return {
        ...savedInstructor,
        user: savedUser,
      };
    } catch (error) {
      await this.userService.remove(savedUser.id);

      this.logger.error(
        `Failed to create instructor: ${error.message || 'Unknown error'}`,
      );
      throw new RpcException({
        message: error.message || 'Failed to create instructor',
        code: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async findAll(query: PaginationQueryDto): Promise<InstructorListResponseDto> {
    const { page, limit } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await this.instructorRepository.findAndCount({
      relations: { user: true, specialization: true, department: true },
      skip,
      take: limit,
      order: { user_id: 'DESC' },
    });

    return new InstructorListResponseDto(data, total, page, limit);
  }

  async findOne(id: number): Promise<InstructorResponseDto> {
    const instructor = await this.instructorRepository.findOne({
      where: { user: { id } },
      relations: { user: true, specialization: true, department: true },
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
  ): Promise<InstructorResponseDto> {
    const instructor = await this.instructorRepository.findOne({
      where: { user: { id } },
    });
    if (!instructor) {
      this.logger.error(`Instructor with ID ${id} not found for update`);
      throw new RpcException({
        message: `Instructor with ID ${id} not found`,
        code: HttpStatus.NOT_FOUND,
      });
    }

    const updatedUser = await this.userService.update(id, updateData);

    this.instructorRepository.merge(instructor, updateData);
    const updatedInstructor = await this.instructorRepository.save(instructor);

    if (updatedUser) {
      updatedInstructor.user = updatedUser;
    }

    return updatedInstructor;
  }

  async remove(id: number): Promise<InstructorResponseDto> {
    const instructor = await this.instructorRepository.findOne({
      where: { user: { id } },
    });
    if (!instructor) {
      this.logger.error(`Instructor with ID ${id} not found for deletion`);
      throw new RpcException({
        message: `Instructor with ID ${id} not found`,
        code: HttpStatus.NOT_FOUND,
      });
    }

    await this.instructorRepository.remove(instructor);
    await this.userService.remove(id);
    return instructor;
  }
}
