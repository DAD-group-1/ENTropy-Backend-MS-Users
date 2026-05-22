import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { User } from '../users/entities/user.entity';
import { UserModule } from '../users/user.module';
import { Logger } from 'winston';

@Module({
  imports: [TypeOrmModule.forFeature([Student, User]), UserModule],
  providers: [StudentService, Logger],
  controllers: [StudentController],
})
export class StudentModule {}
