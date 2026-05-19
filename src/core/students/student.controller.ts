import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateStudentDto } from './interfaces/dtos/create-student.dto';
import { UpdateUserDto } from '../users/interfaces/dtos/update-user.dto';
import { StudentService } from './student.service';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @MessagePattern({ cmd: 'create_student' })
  async createStudent(@Payload() data: CreateStudentDto) {
    console.log(data);
    return this.studentService.create(data);
  }

  @MessagePattern({ cmd: 'find_all_students' })
  async findAllStudents() {
    return this.studentService.findAll();
  }

  @MessagePattern({ cmd: 'find_one_student' })
  async findOneStudent(@Payload() id: string) {
    return this.studentService.findOne(Number(id));
  }

  @MessagePattern({ cmd: 'update_student' })
  async updateStudent(
    @Payload() payload: { id: string; updateStudentDto: UpdateUserDto },
  ) {
    return this.studentService.update(
      Number(payload.id),
      payload.updateStudentDto,
    );
  }

  @MessagePattern({ cmd: 'remove_student' })
  async removeStudent(@Payload() id: string) {
    return this.studentService.remove(Number(id));
  }
}
