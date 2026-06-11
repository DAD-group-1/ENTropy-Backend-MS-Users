import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthorizationService } from './authorization.service';
import {
  CreateRoleDto,
  DeleteRoleDto,
  GetUserRoleDto,
  UpdateRoleDto,
} from '@dad-group-1/backend-common';

@Controller('authorization')
export class AuthorizationController {
  private readonly logger = new Logger(AuthorizationController.name);
  constructor(private authorizationService: AuthorizationService) {}

  /*  @MessagePattern({ cmd: 'add_role_to_user' })
  async addRoleToUser(
    @Payload() body: { user_id: number; role_id: number },
  ): Promise<UserRoleResponseDto> {
    return await this.authorizationService.addUserRole(
      body.user_id,
      body.role_id,
    );
  }

  @MessagePattern({ cmd: 'remove_user_role' })
  async removeRoleFromUser(
    @Payload() body: { user_id: number; role_id: number },
  ) {
    await this.authorizationService.removeUserRole(body.user_id, body.role_id);
    return null;
  }*/

  @MessagePattern({ cmd: 'assign_role_to_user' })
  async assignRolesToUser(
    @Payload() payload: { user_id: number; role_id: number },
  ) {
    this.logger.log('Assigning role to user', {
      user_id: payload.user_id,
      role_id: payload.role_id,
    });
    return await this.authorizationService.assignRole(
      payload.user_id,
      payload.role_id,
    );
  }

  @MessagePattern({ cmd: 'get_user_role' })
  async getUserRole(@Payload() body: GetUserRoleDto) {
    this.logger.log('Getting user role', { user_id: body.user_id });
    return await this.authorizationService.getUserRole(body.user_id);
  }

  /*@MessagePattern({ cmd: 'get_user_roles' })
  async getUserRoles(@Payload() body: GetUserRoleDto) {
    return await this.authorizationService.getUserRoles(body.user_id);
  }*/

  @MessagePattern({ cmd: 'create_role' })
  async createRole(@Payload() body: CreateRoleDto) {
    this.logger.log('Creating role', { name: body.name });
    return this.authorizationService.createRole(body.name, body.description);
  }

  @MessagePattern({ cmd: 'get_roles' })
  async getRoles() {
    this.logger.log('Getting all roles');
    return await this.authorizationService.getRoles();
  }

  @MessagePattern({ cmd: 'get_role' })
  async getRole(@Payload() role_id: number) {
    this.logger.log('Getting role', { role_id });
    return await this.authorizationService.findRole(role_id);
  }

  @MessagePattern({ cmd: 'update_role' })
  async updateRole(
    @Payload() payload: { id: number; updateData: UpdateRoleDto },
  ) {
    this.logger.log('Updating role', {
      role_id: payload.id,
      updateData: payload.updateData,
    });
    return await this.authorizationService.updateRole(
      payload.id,
      payload.updateData,
    );
  }

  @MessagePattern({ cmd: 'delete_role' })
  async deleteRole(@Payload() body: DeleteRoleDto) {
    this.logger.log('Deleting role', { role_id: body.role_id });
    return await this.authorizationService.removeRole(body.role_id);
  }
}
