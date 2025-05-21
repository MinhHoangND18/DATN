import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '@/user/entities/user.entity';
import { ERole } from '@/role/enum/roles.enum';

const data: Partial<User>[] = [
  {
    username: 'admin',
    full_name: 'Admin',
    email: 'admin@admin.com',
    password: '123123',
    active: true,
    role: ERole.SUPER_ADMIN,
  },
];

@Injectable()
export class UserSeed {
  constructor(
    @InjectRepository(User)
    protected readonly repository: Repository<User>,
  ) {}

  async seed() {
    const count = await Promise.all([this.repository.count()]);

    if (!count[0]) {
      await Promise.all(
        data.map(user => {
          const u = this.repository.create(user);
          u.setPassword(u.password);
          return this.repository.save(u);
        }),
      );
    }
  }
}
