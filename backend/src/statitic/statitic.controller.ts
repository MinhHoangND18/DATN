import { Controller, Get, Query } from '@nestjs/common';
import { StatiticService } from './statitic.service';
import { RevenueStatisticDto } from './dto/revenue-statistic.dto';
import { OrderStatisticDto } from './dto/order-statistic.dto';
import { ConversionStatisticDto } from './dto/conversion-statistic.dto';

@Controller('statistics')
export class StatiticController {
  constructor(private readonly statiticService: StatiticService) {}

  @Get('revenue')
  async getRevenueStatistics(@Query('days') days: number = 30): Promise<RevenueStatisticDto[]> {
    return this.statiticService.getRevenueStatistics(days);
  }

  @Get('revenue/total')
  async getTotalRevenue(@Query('days') days: number = 30) {
    return this.statiticService.getTotalRevenue(days);
  }

  @Get('orders')
  async getOrderStatistics(@Query('days') days: number = 30): Promise<OrderStatisticDto[]> {
    return this.statiticService.getOrderStatistics(days);
  }

  @Get('orders/total')
  async getTotalOrderStatistics(@Query('days') days: number = 30) {
    return this.statiticService.getTotalOrderStatistics(days);
  }

  @Get('conversion')
  async getConversionStatistics(
    @Query('days') days: number = 30,
  ): Promise<ConversionStatisticDto[]> {
    return this.statiticService.getConversionStatistics(days);
  }

  @Get('conversion/total')
  async getTotalConversionStatistics(@Query('days') days: number = 30) {
    return this.statiticService.getTotalConversionStatistics(days);
  }
}
