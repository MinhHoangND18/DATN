import { Global, Module } from '@nestjs/common';
import { BehaviorService } from './behavior.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Behavior } from './entities/behavior.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { User } from '@/user/entities/user.entity';
import { Product } from '@/product/entities/product.entity';
import { BehaviorController } from './behavior.controller';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Behavior, User, Product]), ScheduleModule.forRoot()],
  providers: [BehaviorService],
  controllers: [BehaviorController],
  exports: [BehaviorService],
})
export class BehaviorModule {}
