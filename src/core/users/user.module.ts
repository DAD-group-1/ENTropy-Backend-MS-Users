import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserRole } from '../authorization/entities/user-role.entity';
import { Role } from '../authorization/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRole, Role])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
