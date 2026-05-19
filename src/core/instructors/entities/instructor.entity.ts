import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { InstructorStatus } from '../interfaces/instructor.interface';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Instructor extends User {
  @PrimaryGeneratedColumn()
  declare id: number;
  @Column()
  department_id: number;
  @Column()
  status: InstructorStatus;
  @Column()
  hire_date: Date;
  @Column()
  specialization_id: number;
}
