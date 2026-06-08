import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { Role } from './entities/role.entity';

@Injectable()
export class AuthorizationService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    /*@InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,*/
  ) {}
  /*async addUserRole(
    user_id: number,
    roleId: number,
  ): Promise<{ user_id: number; role_id: number }> {
    const user = await this.usersRepository.findOneBy({ id: user_id });
    if (!user) {
      throw new RpcException({
        message: 'User not found',
        code: HttpStatus.NOT_FOUND,
      });
    }

    const role = await this.roleRepository.findOneBy({ id: roleId });
    if (!role) {
      throw new RpcException({
        message: 'Role not found',
        code: HttpStatus.NOT_FOUND,
      });
    }

    if (
      await this.userRoleRepository.existsBy({
        user_id: user.id,
        role_id: role.id,
      })
    ) {
      throw new RpcException({
        message: 'User already has this role',
        code: HttpStatus.CONFLICT,
      });
    }

    const userRole = this.userRoleRepository.create({
      user_id: user.id,
      role_id: role.id,
    });

    await this.userRoleRepository.save(userRole);

    return {
      user_id: user.id,
      role_id: role.id,
    };
  }

  async removeUserRole(user_id: number, roleId: number) {
    if (!(await this.usersRepository.existsBy({ id: user_id }))) {
      throw new RpcException({
        message: 'User not found',
        code: HttpStatus.NOT_FOUND,
      });
    }

    if (!(await this.roleRepository.existsBy({ id: roleId }))) {
      throw new RpcException({
        message: 'Role not found',
        code: HttpStatus.NOT_FOUND,
      });
    }

    const userRole = await this.userRoleRepository.findOneBy({
      user_id: user_id,
      role_id: roleId,
    });

    if (!userRole) {
      throw new RpcException({
        message: "User doesn't have this role",
        code: HttpStatus.NOT_FOUND,
      });
    }
    await this.userRoleRepository.remove(userRole);
  }

  async getUserRoles(user_id: number): Promise<UserRole[]> {
    return await this.userRoleRepository.findBy({ user_id: user_id });
  }*/

  async getUserRole(user_id: number): Promise<Role> {
    const user = await this.usersRepository.findOne({
      where: { id: user_id },
      relations: { role: true },
    });
    if (!user) {
      throw new RpcException({
        message: 'User not found',
        code: HttpStatus.NOT_FOUND,
      });
    }

    return user.role;
  }

  async assignRole(user_id: number, role_id: number): Promise<User> {
    if (!(await this.roleRepository.existsBy({ id: role_id }))) {
      throw new RpcException({
        message: `Role with ID ${role_id} not found`,
        code: HttpStatus.NOT_FOUND,
      });
    }

    const user = await this.usersRepository.findOneBy({ id: user_id });
    if (!user) {
      throw new RpcException({
        message: 'User not found',
        code: HttpStatus.NOT_FOUND,
      });
    }

    user.role_id = role_id;

    return await this.usersRepository.save(user);
  }

  async createRole(name: string, description: string): Promise<Role> {
    const role = this.roleRepository.create({ name, description });
    return await this.roleRepository.save(role);
  }

  async findRole(role_id: number): Promise<Role> {
    const role = await this.roleRepository.findOneBy({ id: role_id });
    if (!role) {
      throw new RpcException({
        message: `Role with ID ${role_id} not found`,
        code: HttpStatus.NOT_FOUND,
      });
    }
    return role;
  }

  async updateRole(
    role_id: number,
    updateData: Partial<Pick<Role, 'name' | 'description'>>,
  ): Promise<Role> {
    const role = await this.findRole(role_id);
    Object.assign(role, updateData);
    return await this.roleRepository.save(role);
  }

  async removeRole(role_id: number): Promise<DeleteResult> {
    return await this.roleRepository.delete({ id: role_id });
  }

  async getRoles(): Promise<Role[]> {
    return await this.roleRepository.find();
  }
}
