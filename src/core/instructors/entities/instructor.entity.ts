import { Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { InternalInstructor } from '@dad-group-1/backend-common';
import { Department } from '../../external/entities/department.entity';
import { Specialization } from '../../external/entities/specialization.entity';

@Entity()
export class Instructor extends InternalInstructor {
  @OneToOne(() => User, (user) => user.id, { cascade: true })
  @JoinColumn({ name: 'user_id' })
  user: User;
  @ManyToOne(() => Department, (department) => department.instructors)
  @JoinColumn({ name: 'department_id' })
  department: Department;
  @ManyToOne(
    () => Specialization,
    (specialization) => specialization.instructors,
  )
  @JoinColumn({ name: 'specialization_id' })
  specialization: Specialization;
}
