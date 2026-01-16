// src/user/user.entity.ts (Perbaikan Final)

import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  name: string;

  @Column()
  password: string;

  // PERBAIKAN: Set default count ke 0 agar data lama tidak NULL
  @Column({ default: 0 }) 
  followers: number;

  // PERBAIKAN: Set default count ke 0 agar data lama tidak NULL
  @Column({ default: 0 })
  following: number;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}