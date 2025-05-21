import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatiticService } from './statitic.service';
import { StatiticController } from './statitic.controller';
import { Bill } from '@/bill/entities/bill.entity';
import { Behavior } from '@/behavior/entities/behavior.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bill, Behavior])],
  controllers: [StatiticController],
  providers: [StatiticService],
  exports: [StatiticService],
})
export class StatiticModule {}
