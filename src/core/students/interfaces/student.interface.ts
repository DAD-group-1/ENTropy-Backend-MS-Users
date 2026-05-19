import { User } from '../../users/interfaces/user.interface';

export enum StudentStatus {
  ACTIVE = 'Active',
  PENDING = 'Inactive',
}

export interface Student extends User {
  id: number;
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
