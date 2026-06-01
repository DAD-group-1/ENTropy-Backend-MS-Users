import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { StudentModule } from './core/students/student.module';
import { InstructorModule } from './core/instructors/instructor.module';
import { AuthenticationModule } from './core/authentication/authentication.module';
import { AuthorizationModule } from './core/authorization/authorization.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    DatabaseModule,
    StudentModule,
    InstructorModule,
    AuthenticationModule,
    AuthorizationModule,
  ],
})
export class AppModule {}
