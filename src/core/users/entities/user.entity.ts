import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { InternalUser } from '@dad-group-1/backend-common';
import { Role } from '../../authorization/entities/role.entity';

@Entity()
export class User extends InternalUser {
  /*@OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles: UserRole[];*/

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'role_id' })
  role: Role;
}
