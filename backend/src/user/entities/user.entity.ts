import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcryptjs';
import { ERole } from '@/role/enum/roles.enum';
import { AbstractEntity } from '@/base/service/abstract-entity.service';
import { EGender } from '../user.constant';

@Entity()
export class User extends AbstractEntity {
  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  full_name: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true, length: 10 })
  phone: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true, default: true })
  active: boolean;

  @Column({
    type: 'enum',
    enum: EGender,
    default: EGender.Other,
    nullable: true,
  })
  gender: EGender;

  @Column({ nullable: true })
  birthday: Date;

  @Column({ nullable: false, type: 'enum', enum: ERole })
  role: ERole;

  setPassword(password: string) {
    this.password = bcrypt.hashSync(password, 10);
  }

  comparePassword(rawPassword: string): boolean {
    const userPassword = this.password;
    return bcrypt.compareSync(rawPassword, userPassword);
  }
}
