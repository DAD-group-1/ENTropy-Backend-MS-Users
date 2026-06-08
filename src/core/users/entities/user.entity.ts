import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { InternalUser } from '@dad-group-1/backend-common';
import { Role } from '../../authorization/entities/role.entity';
import { Campus } from '../../external/entities/campus.entity';

@Entity()
export class User extends InternalUser {
  /*@OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles: UserRole[];*/

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ManyToOne(() => Campus, (campus) => campus.users)
  @JoinColumn({ name: 'campus_id' })
  campus: Campus;
}
