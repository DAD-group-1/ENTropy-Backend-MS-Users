import { Controller } from '@nestjs/common';
import { InstructorService } from './instructor.service';
import { MessagePattern } from '@nestjs/microservices';
import { CreateInstructorDto } from './interfaces/dtos/create-instructor.dto';

@Controller('instructors')
export class InstructorController {
  constructor(private readonly instructorService: InstructorService) {}

  @MessagePattern({ cmd: 'create_instructor' })
  async create(data: CreateInstructorDto) {
    return this.instructorService.create(data);
  }

  @MessagePattern({ cmd: 'find_all_instructors' })
  findAll() {
    return this.instructorService.findAll();
  }

  @MessagePattern({ cmd: 'find_one_instructor' })
  findOne(id: string) {
    return this.instructorService.findOne(Number(id));
  }

  @MessagePattern({ cmd: 'update_instructor' })
  update(payload: { id: string; updateData: Partial<CreateInstructorDto> }) {
    return this.instructorService.update(
      Number(payload.id),
      payload.updateData,
    );
  }

  @MessagePattern({ cmd: 'remove_instructor' })
  remove(id: string) {
    return this.instructorService.remove(Number(id));
  }
}
