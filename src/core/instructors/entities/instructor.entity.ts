import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { InstructorStatus } from '../interfaces/instructor.interface';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Instructor {
  @PrimaryColumn()
  user_id: number;
  @OneToOne(() => User, (user) => user.id, { cascade: true })
  @JoinColumn({ name: 'user_id' })
  user: User;
  @Column()
  department_id: number;
  @Column()
  status: InstructorStatus;
  @Column()
  hire_date: Date;
  @Column()
  specialization_id: number;
}
