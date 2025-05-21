import { ListDto } from '@/shared/dtos/common.dto';
import { Behavior } from './entities/behavior.entity';
import { Controller, Get, Query } from '@nestjs/common';
import { BehaviorService } from './behavior.service';

@Controller('behavior')
export class BehaviorController {
  constructor(private readonly behaviorService: BehaviorService) {}

  @Get()
  list(@Query() query: ListDto) {
    return this.behaviorService.findList(query);
  }
}
