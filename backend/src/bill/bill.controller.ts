import { Controller, Get, Post, Body, Patch, Param, Query } from '@nestjs/common';
import { BillService } from './bill.service';
import { ListDto } from '@/shared/dtos/common.dto';
import { BillStatus } from './bill.constant';
import { GetUser } from '@/auth/decorator/get-user.decorator';
import { User } from '@/user/entities/user.entity';

@Controller('bill')
export class BillController {
  constructor(private readonly billService: BillService) {}

  @Get()
  findAll(@Query() query: ListDto, @GetUser() user: User) {
    return this.billService.findAll(query, user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body('status') status: string) {
    return this.billService.update(+id, status as BillStatus);
  }
}
