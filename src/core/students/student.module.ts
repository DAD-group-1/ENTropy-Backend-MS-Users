import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { User } from '../users/entities/user.entity';
import { UserModule } from '../users/user.module';
import { Campus } from '../external/entities/campus.entity';
import { Program } from '../external/entities/program.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student, User, Campus, Program]),
    UserModule,
  ],
  providers: [StudentService],
  controllers: [StudentController],
})
export class StudentModule {}
