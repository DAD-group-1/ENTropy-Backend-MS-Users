import { Entity, OneToMany } from 'typeorm';
import { InternalCampus } from '@dad-group-1/backend-common';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Campus extends InternalCampus {
  @OneToMany(() => User, (user) => user.campus)
  users: User[];
}
