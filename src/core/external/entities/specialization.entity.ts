import { Entity, OneToMany } from 'typeorm';
import { InternalSpecialization } from '@dad-group-1/backend-common';
import { Instructor } from './instructor.entity';

@Entity()
export class Specialization extends InternalSpecialization {
  @OneToMany(() => Instructor, (instructor) => instructor.specialization)
  instructors: Instructor[];
}
