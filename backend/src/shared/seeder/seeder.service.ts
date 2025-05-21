import { Injectable, OnModuleInit } from '@nestjs/common';
import { UserSeed } from '@shared/seeder/user.seed';

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(private readonly userSeed: UserSeed) {}

  async onModuleInit() {
    console.info('loading seed ...');
    await Promise.all([this.userSeed.seed()]);
    console.info('done!!!!');
  }
}
