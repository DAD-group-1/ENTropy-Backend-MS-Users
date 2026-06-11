import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { StudentService } from './student.service';
import {
  CreateStudentRequestDto,
  PaginationQueryDto,
  UpdateStudentRequestDto,
} from '@dad-group-1/backend-common';

@Controller('students')
export class StudentController {
  private readonly logger = new Logger(StudentController.name);
  constructor(private readonly studentService: StudentService) {}

  @MessagePattern({ cmd: 'create_student' })
  async createStudent(@Payload() data: CreateStudentRequestDto) {
    this.logger.log('Creating a new student record');
    return this.studentService.create(data);
  }

  @MessagePattern({ cmd: 'find_all_students' })
  async findAllStudents(@Payload() data: PaginationQueryDto) {
    this.logger.log('Retrieving all student records with pagination');
    return this.studentService.findAll(data);
  }

  @MessagePattern({ cmd: 'find_one_student' })
  async findOneStudent(@Payload() id: number) {
    this.logger.log('Retrieving student record with ID: ' + id);
    return this.studentService.findOne(id);
  }

  @MessagePattern({ cmd: 'update_student' })
  async updateStudent(
    @Payload() payload: { id: number; updateData: UpdateStudentRequestDto },
  ) {
    this.logger.log('Updating student record with ID: ' + payload.id);
    return this.studentService.update(payload.id, payload.updateData);
  }

  @MessagePattern({ cmd: 'remove_student' })
  async removeStudent(@Payload() id: number) {
    this.logger.log('Removing student record with ID: ' + id);
    return this.studentService.remove(id);
  }
}
