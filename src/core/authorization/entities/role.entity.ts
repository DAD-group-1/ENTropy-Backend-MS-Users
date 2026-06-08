import { Entity, OneToMany } from 'typeorm';
import { InternalRole } from '@dad-group-1/backend-common';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Role extends InternalRole {
  /*@OneToMany(() => UserRole, (userRole) => userRole.role)
  userRoles: UserRole[];*/

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
