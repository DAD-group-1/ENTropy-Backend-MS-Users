import { InstructorStatus } from '../instructor.interface';
import { CreateUserDto } from '../../../users/interfaces/dtos/create-user.dto';
import { PartialType } from '@nestjs/swagger';

export class CreateInstructorDto extends CreateUserDto {
  user_id: number;
  departement_id: number;
  status: InstructorStatus;
  hire_date: Date;
  specialization_id: number;
}

export class UpdateInstructorDto extends PartialType(CreateInstructorDto) {}
