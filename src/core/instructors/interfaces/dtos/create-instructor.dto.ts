import { InstructorStatus } from '../instructor.interface';
import { CreateUserDto } from '../../../users/interfaces/dtos/create-user.dto';

export class CreateInstructorDto extends CreateUserDto {
  departement_id: number;
  status: InstructorStatus;
  hire_date: Date;
  specialization_id: number;
}
