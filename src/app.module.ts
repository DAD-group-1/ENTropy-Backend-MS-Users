import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { StudentModule } from './core/students/student.module';
import { InstructorModule } from './core/instructors/instructor.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    DatabaseModule,
    StudentModule,
    InstructorModule,
  ],
})
export class AppModule {}
