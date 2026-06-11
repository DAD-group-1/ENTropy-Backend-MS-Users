import { Controller, Logger } from '@nestjs/common';
import { InstructorService } from './instructor.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  CreateInstructorDto,
  PaginationQueryDto,
  UpdateInstructorDto,
} from '@dad-group-1/backend-common';

@Controller('instructors')
export class InstructorController {
  private readonly logger = new Logger(InstructorController.name);
  constructor(private readonly instructorService: InstructorService) {}

  @MessagePattern({ cmd: 'create_instructor' })
  async create(@Payload() data: CreateInstructorDto) {
    this.logger.log(`Creating a new instructor record`);
    return this.instructorService.create(data);
  }

  @MessagePattern({ cmd: 'find_all_instructors' })
  findAll(@Payload() query: PaginationQueryDto) {
    this.logger.log('Retrieving all instructor records with pagination');
    return this.instructorService.findAll(query);
  }

  @MessagePattern({ cmd: 'find_one_instructor' })
  findOne(@Payload() id: number) {
    this.logger.log('Retrieving instructor record with ID: ' + id);
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
    this.logger.log('Updating instructor record with ID: ' + payload.id);
    return this.instructorService.update(payload.id, payload.updateData);
  }

  @MessagePattern({ cmd: 'remove_instructor' })
  remove(@Payload() id: number) {
    this.logger.log('Removing instructor record with ID: ' + id);
    return this.instructorService.remove(id);
  }
}
