import { Module } from '@nestjs/common';
import { InstructorController } from './instructor.controller';
import { InstructorService } from './instructor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Instructor } from './entities/instructor.entity';
import { User } from '../users/entities/user.entity';
import { UserModule } from '../users/user.module';
import { Logger } from 'winston';

@Module({
  imports: [TypeOrmModule.forFeature([Instructor, User]), UserModule],
  providers: [InstructorService, Logger],
  controllers: [InstructorController],
})
export class InstructorModule {}
