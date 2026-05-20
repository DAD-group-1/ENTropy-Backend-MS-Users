import { StudentStatus } from '../student.interface';
import { CreateUserDto } from '../../../users/interfaces/dtos/create-user.dto';
import { PartialType } from '@nestjs/swagger';

export class CreateStudentDto extends CreateUserDto {
  /* Note: user_id is not included in the CreateUserDto because it will be generated after creating the user. */
  user_id: number;
  program_id: number;
  enrollment_year: number;
  status: StudentStatus;
  address: string;
  city: string;
  zip_code: string;
  emergency_contact: string;
  emergency_phone: string;
}

export class UpdateStudentDto extends PartialType(CreateStudentDto) {}
