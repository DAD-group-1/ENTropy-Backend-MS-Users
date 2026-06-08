import { Module } from '@nestjs/common';
import { InstructorController } from './instructor.controller';
import { InstructorService } from './instructor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Instructor } from './entities/instructor.entity';
import { User } from '../users/entities/user.entity';
import { UserModule } from '../users/user.module';
import { Specialization } from '../external/entities/specialization.entity';
import { Department } from '../external/entities/department.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Instructor, User, Specialization, Department]),
    UserModule,
  ],
  providers: [InstructorService],
  controllers: [InstructorController],
})
export class InstructorModule {}
