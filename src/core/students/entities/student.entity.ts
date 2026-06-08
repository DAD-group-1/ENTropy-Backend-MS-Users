import { Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { InternalStudent } from '@dad-group-1/backend-common';
import { Program } from '../../external/entities/program.entity';

@Entity()
export class Student extends InternalStudent {
  @OneToOne(() => User, (user) => user.id, { cascade: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Program, (program) => program.students)
  @JoinColumn({ name: 'program_id' })
  program: Program;
}
