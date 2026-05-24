import {Entity, OneToOne, JoinColumn} from 'typeorm';
import {User} from "../../users/entities/user.entity";
import {InternalStudent} from "@dad-group-1/backend-common";

@Entity()
export class Student extends InternalStudent {
  @OneToOne(() => User, (user) => user.id, { cascade: true })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
