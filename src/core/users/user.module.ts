import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { Logger } from 'winston';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, Logger],
  exports: [UserService],
})
export class UserModule {}
