import {Controller} from '@nestjs/common';
import {InstructorService} from './instructor.service';
import {MessagePattern, Payload} from '@nestjs/microservices';
import {CreateInstructorDto, UpdateInstructorDto,} from '@dad-group-1/backend-common';

@Controller('instructors')
export class InstructorController {
  constructor(private readonly instructorService: InstructorService) {}

  @MessagePattern({ cmd: 'create_instructor' })
  async create(@Payload() data: CreateInstructorDto) {
    return this.instructorService.create(data);
  }

  @MessagePattern({ cmd: 'find_all_instructors' })
  findAll() {
    return this.instructorService.findAll();
  }

  @MessagePattern({ cmd: 'find_one_instructor' })
  findOne(@Payload() id: number) {
    return this.instructorService.findOne(id);
  }

  @MessagePattern({ cmd: 'update_instructor' })
  update(
    @Payload()
    payload: {
      id: number;
      updateData: UpdateInstructorDto;
    },
  ) {
    return this.instructorService.update(payload.id, payload.updateData);
  }

  @MessagePattern({ cmd: 'remove_instructor' })
  remove(@Payload() id: number) {
    return this.instructorService.remove(id);
  }
}
