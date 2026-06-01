import { Entity, OneToMany } from 'typeorm';
import { InternalRole } from '@dad-group-1/backend-common';
import { UserRole } from './user-role.entity';

@Entity()
export class Role extends InternalRole {
  @OneToMany(() => UserRole, (userRole) => userRole.role)
  userRoles: UserRole[];
}
