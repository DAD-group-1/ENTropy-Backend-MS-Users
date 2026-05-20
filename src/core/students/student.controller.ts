import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { StudentService } from './student.service';
import {
  CreateStudentDto,
  UpdateStudentDto,
} from './interfaces/dtos/student.dto';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @MessagePattern({ cmd: 'create_student' })
  async createStudent(@Payload() data: CreateStudentDto) {
    return this.studentService.create(data);
  }

  @MessagePattern({ cmd: 'find_all_students' })
  async findAllStudents() {
    return this.studentService.findAll();
  }

  @MessagePattern({ cmd: 'find_one_student' })
  async findOneStudent(@Payload() id: number) {
    return this.studentService.findOne(id);
  }

  @MessagePattern({ cmd: 'update_student' })
  async updateStudent(
    @Payload() payload: { id: number; updateStudentDto: UpdateStudentDto },
  ) {
    return this.studentService.update(payload.id, payload.updateStudentDto);
  }

  @MessagePattern({ cmd: 'remove_student' })
  async removeStudent(@Payload() id: number) {
    return this.studentService.remove(id);
  }
}
