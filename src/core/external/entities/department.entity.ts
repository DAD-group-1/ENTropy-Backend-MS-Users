import { Entity, OneToMany } from 'typeorm';
import { InternalDepartment } from '@dad-group-1/backend-common';
import { Instructor } from './instructor.entity';

@Entity()
export class Department extends InternalDepartment {
  @OneToMany(() => Instructor, (instructor) => instructor.department)
  instructors: Instructor[];
}
