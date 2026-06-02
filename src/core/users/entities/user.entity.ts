import { Entity, OneToMany } from 'typeorm';
import { InternalUser } from '@dad-group-1/backend-common';
import { UserRole } from '../../authorization/entities/user-role.entity';

@Entity()
export class User extends InternalUser {
  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles: UserRole[];
}
