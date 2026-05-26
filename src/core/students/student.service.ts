import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { RpcException } from '@nestjs/microservices';
import { UserService } from '../users/user.service';
import { Logger } from '@nestjs/common';
import {
  CreateStudentDto,
  UpdateStudentDto,
} from '@dad-group-1/backend-common';

@Injectable()
export class StudentService {
  private readonly logger = new Logger(StudentService.name);

  constructor(
    @InjectRepository(Student) private studentRepository: Repository<Student>,
    private readonly userService: UserService,
  ) {}

  /**
   * Create a new student.
   * This method first creates a new user using the provided data,
   * then creates a new student with the user ID of the newly created user.
   * @param createData The data to create the student with
   * @returns The created student
   * @throws RpcException if there is an error creating the user or student
   */
  async create(createData: CreateStudentDto): Promise<Student> {
    await this.userService.assertDoesntExist({ email: createData.email });

    const savedUser = await this.userService.create({ ...createData });

    createData.user_id = savedUser.id;
    const student = this.studentRepository.create(createData);

    try {
      const savedStudent = await this.studentRepository.save(student);

      return {
        ...savedStudent,
        user: savedUser,
      };
    } catch (error) {
      await this.userService.remove(savedUser.id);
      this.logger.error(
        `Failed to create student: ${error.message || 'Unknown error'}`,
      );
      throw new RpcException({
        message: error.message || 'Failed to create student',
        code: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  /**
   * Get all students.
   * @returns An array of all students
   * @throws RpcException if there is an error retrieving the students
   */
  findAll(): Promise<Student[]> {
    return this.studentRepository.find({
      relations: { user: true },
    });
  }

  /**
   * Get the student with the given ID. If the student is not found, an RpcException with a 404 status code is thrown.
   * @param id The ID of the student to find
   * @returns The student with the given ID, or null if not found
   * @throws RpcException with a 404 status code if the student is not found
   */
  async findOne(id: number): Promise<Student | null> {
    const student = await this.studentRepository.findOne({
      where: { user: { id } },
      relations: { user: true },
    });

    if (!student) {
      this.logger.error(`Student with ID ${id} not found`);
      throw new RpcException({
        message: `Student with ID ${id} not found`,
        code: HttpStatus.NOT_FOUND,
      });
    }

    return student;
  }

  /**
   * Update the student with the given ID using the provided update data. If the student is not found, null is returned.
   * @param id The ID of the student to update
   * @param updateData The data to update the student with
   * @returns The updated student
   * @see {@link findOne} for error handling when the student is not found
   */
  async update(
    id: number,
    updateData: UpdateStudentDto,
  ): Promise<Student | null> {
    const student = await this.findOne(id);
    if (!student) {
      this.logger.error(`Student with ID ${id} not found for update`);
      throw new RpcException({
        message: `Student with ID ${id} not found for update`,
        code: HttpStatus.NOT_FOUND,
      });
    }

    // Update the user data first
    const updatedUser = await this.userService.update(id, updateData);

    // Then update the student data
    this.studentRepository.merge(student, updateData);
    const updatedStudent = await this.studentRepository.save(student);

    // Attach the updated user to the student before returning
    if (updatedUser) {
      updatedStudent.user = updatedUser;
    }

    return updatedStudent;
  }

  async remove(id: number): Promise<Student | null> {
    const student = await this.findOne(id);
    if (!student) {
      this.logger.error(`Student with ID ${id} not found for deletion`);
      throw new RpcException({
        message: `Student with ID ${id} not found for deletion`,
        code: HttpStatus.NOT_FOUND,
      });
    }

    await this.studentRepository.remove(student);
    await this.userService.remove(id); // ALWAYS remove after removing the student to maintain data integrity
    return student;
  }
}
