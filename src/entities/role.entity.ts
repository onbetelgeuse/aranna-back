import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('role')
export class Role {
  @PrimaryColumn()
  name: string;

  @Column()
  @Index({ unique: true })
  label: string;

  users: User[];
}
