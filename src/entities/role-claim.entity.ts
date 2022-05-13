import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './role.entity';

@Entity()
export class RoleClaim {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  roleName: string;
  @Column()
  claimType: string;
  @Column()
  claimValue: string;

  @ManyToOne(() => Role, (rel) => rel.roleClaims)
  @JoinColumn({ name: 'roleName' })
  role: Role;
}
