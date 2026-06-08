import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { Role } from '../authorization/entities/role.entity';
import { UserController } from './user.controller';
import { Campus } from '../external/entities/campus.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Campus])],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
