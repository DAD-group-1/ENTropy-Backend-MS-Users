import { Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { InternalInstructor } from '@dad-group-1/backend-common';

@Entity()
export class Instructor extends InternalInstructor {
  @OneToOne(() => User, (user) => user.id, { cascade: true })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
