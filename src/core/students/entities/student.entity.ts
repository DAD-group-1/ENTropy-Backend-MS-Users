import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { StudentStatus } from '../interfaces/student.interface';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Student {
  @PrimaryColumn()
  user_id: number;

  @OneToOne(() => User, (user) => user.id, { cascade: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  program_id: number;
  @Column()
  enrollment_year: number;
  @Column()
  status: StudentStatus;
  @Column()
  address: string;
  @Column()
  city: string;
  @Column()
  zip_code: string;
  @Column()
  emergency_contact: string;
  @Column()
  emergency_phone: string;
}
