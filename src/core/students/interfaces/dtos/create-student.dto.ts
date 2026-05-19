import { StudentStatus } from '../student.interface';
import { CreateUserDto } from '../../../users/interfaces/dtos/create-user.dto';

export class CreateStudentDto extends CreateUserDto {
  program_id: number;
  enrollment_year: number;
  status: StudentStatus;
  address: string;
  city: string;
  zip_code: string;
  emergency_contact: string;
  emergency_phone: string;
}
