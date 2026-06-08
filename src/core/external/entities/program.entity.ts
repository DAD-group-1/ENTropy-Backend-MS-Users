import { Entity, OneToMany } from 'typeorm';
import { InternalProgram } from '@dad-group-1/backend-common';
import { Student } from '../../students/entities/student.entity';

@Entity()
export class Program extends InternalProgram {
  @OneToMany(() => Student, (student) => student.program)
  students: Student[];
}
