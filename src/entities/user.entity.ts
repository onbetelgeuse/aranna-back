import { Injectable } from '@nestjs/common';
import { Exclude } from 'class-transformer';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SecurityPasswordResult } from '../auth/security/interfaces/security-password-result';
import { Role } from './role.entity';

@Injectable()
@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index({ unique: true })
  email: string;

  @Column()
  name: string;

  @Exclude()
  @Column({ nullable: true })
  private passwordHash: string;

  @Exclude()
  @Column({ nullable: true })
  private passwordSalt: string;

  @Column({ nullable: true })
  resetPasswordToken: string;

  @Column({ nullable: true })
  resetPasswordTokenExpiry: Date;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: true })
  enabled: boolean;

  @Column({ default: false })
  external: boolean;

  @ManyToMany(() => Role, (rel) => rel.users, { eager: true })
  @JoinTable({ name: 'user_role' })
  roles: Role[];

  @BeforeInsert()
  @BeforeUpdate()
  updateName() {
    this.name = `${this.firstName} ${this.lastName}`;
  }

  @BeforeInsert()
  @BeforeUpdate()
  updateEmail() {
    this.email = this.email.toLowerCase();
  }

  setCredentials(securityPassword: SecurityPasswordResult) {
    if (securityPassword) {
      this.passwordSalt = securityPassword.passwordSalt;
      this.passwordHash = securityPassword.passwordHash;
    }
  }

  validateCredentials(
    password: string,
    validate: (
      password: string,
      passwordHash: string,
      passwordSalt: string,
    ) => boolean,
  ): boolean {
    return validate(password, this.passwordHash, this.passwordSalt);
  }
}
