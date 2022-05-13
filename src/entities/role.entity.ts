import { Column, Entity, Index, OneToMany, PrimaryColumn } from 'typeorm';
import { RoleClaim } from './role-claim.entity';
import { User } from './user.entity';

@Entity('role')
export class Role {
  @PrimaryColumn()
  name: string;

  @Column()
  @Index({ unique: true })
  label: string;

  users: User[];

  @OneToMany(() => RoleClaim, (rel) => rel.role)
  roleClaims: RoleClaim[];
}
