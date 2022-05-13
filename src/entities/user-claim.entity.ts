import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserClaim {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  userId: number;
  @Column()
  claimType: string;
  @Column()
  claimValue: string;

  @ManyToOne(() => User, (rel) => rel.userClaims)
  @JoinColumn({ name: 'userId' })
  user: User;
}
