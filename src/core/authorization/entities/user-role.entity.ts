import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { InternalUserRole } from '@dad-group-1/backend-common';
import { User } from '../../users/entities/user.entity';
import { Role } from './role.entity';

/*
@Entity()
export class UserRole extends InternalUserRole {
  @ManyToOne(() => User, (user) => user.userRoles)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Role, (role) => role.userRoles)
  @JoinColumn({ name: 'role_id' })
  role: Role;
}
*/
