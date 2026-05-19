import { StudentStatus } from '../student.interface';
import { UpdateUserDto } from '../../../users/interfaces/dtos/update-user.dto';

export class UpdateStudentDto extends UpdateUserDto {
  program_id?: number;
  enrollment_year?: number;
  status?: StudentStatus;
  address?: string;
  city?: string;
  zip_code?: string;
  emergency_contact?: string;
  emergency_phone?: string;
}
