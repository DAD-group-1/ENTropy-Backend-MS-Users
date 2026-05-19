import { User } from '../../users/interfaces/user.interface';

export enum InstructorStatus {
  ACTIVE = 'Active',
  PENDING = 'Inactive',
}

export interface Instructor extends User {
  id: number;
  department_id: number;
  status: InstructorStatus;
  hire_date: Date;
  specialization_id: number;
}
