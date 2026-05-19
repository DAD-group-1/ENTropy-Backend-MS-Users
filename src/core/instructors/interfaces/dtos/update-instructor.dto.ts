import { InstructorStatus } from '../instructor.interface';
import { UpdateUserDto } from '../../../users/interfaces/dtos/update-user.dto';

export class UpdateInstructorDto extends UpdateUserDto {
  departement_id?: number;
  status?: InstructorStatus;
  hire_date?: Date;
  specialization_id?: number;
}
