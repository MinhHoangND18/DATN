import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bill } from '@/bill/entities/bill.entity';
import { RevenueStatisticDto } from './dto/revenue-statistic.dto';
import { OrderStatisticDto } from './dto/order-statistic.dto';
import { ConversionStatisticDto } from './dto/conversion-statistic.dto';
import { PaymentStatus } from '@/cart/enums/payment-status.enum';
import { Behavior } from '@/behavior/entities/behavior.entity';
import * as moment from 'moment';

@Injectable()
export class StatiticService {
  constructor(
    @InjectRepository(Bill)
    private readonly billRepository: Repository<Bill>,
    @InjectRepository(Behavior)
    private readonly behaviorRepository: Repository<Behavior>,
  ) {}

  private formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  private generateDates(days: number): Date[] {
    const dates: Date[] = [];
    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dates.push(date);
    }
    return dates;
  }

  async getRevenueStatistics(days: number = 30): Promise<RevenueStatisticDto[]> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const query = `
      SELECT 
        DATE(b.created_at) as date,
        COALESCE(SUM(b.total), 0) as total_revenue,
        COALESCE(COUNT(*), 0) as total_orders,
        COALESCE(SUM(b.total) / NULLIF(COUNT(*), 0), 0) as average_order_value
      FROM bill b
      JOIN cart c ON b.cart_id = c.id
      WHERE b.created_at >= $1
      AND b.created_at <= $2
      AND c.payment_status = $3
      GROUP BY DATE(b.created_at)
      ORDER BY DATE(b.created_at) ASC
    `;
    
    const result = await this.billRepository.query(query, [
      thirtyDaysAgo,
      moment().add(1, 'day').endOf('day').toDate(),
      PaymentStatus.COMPLETED,
    ]);
    const dates = this.generateDates(days);

    return dates.map(date => {
      const dateStr = date.toISOString().split('T')[0];
      const data = result.find(item => item.date.toISOString().split('T')[0] === dateStr);

      return {
        date: this.formatDate(date),
        total_revenue: data ? Number(data.total_revenue) : 0,
        total_orders: data ? Number(data.total_orders) : 0,
        average_order_value: data ? Number(data.average_order_value) : 0,
      };
    });
  }

  async getTotalRevenue(days: number = 30): Promise<{
    total_revenue: number;
    total_orders: number;
    average_order_value: number;
  }> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const query = `
      SELECT 
        COALESCE(SUM(b.total), 0) as total_revenue,
        COALESCE(COUNT(*), 0) as total_orders,
        COALESCE(SUM(b.total) / NULLIF(COUNT(*), 0), 0) as average_order_value
      FROM bill b
      JOIN cart c ON b.cart_id = c.id
      WHERE b.created_at >= $1
      AND b.created_at <= $2
      AND c.payment_status = $3
    `;

    const [result] = await this.billRepository.query(query, [
      thirtyDaysAgo,
      new Date(),
      PaymentStatus.COMPLETED,
    ]);
    return {
      total_revenue: Number(result.total_revenue),
      total_orders: Number(result.total_orders),
      average_order_value: Number(result.average_order_value),
    };
  }

  async getOrderStatistics(days: number = 30): Promise<OrderStatisticDto[]> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const query = `
      SELECT 
        DATE(b.created_at) as date,
        COALESCE(COUNT(*), 0) as total_orders,
        COALESCE(COUNT(*) FILTER (WHERE c.payment_status = $1), 0) as completed_orders,
        COALESCE(COUNT(*) FILTER (WHERE c.payment_status = $2), 0) as pending_orders,
        COALESCE(COUNT(*) FILTER (WHERE c.payment_status = $3), 0) as failed_orders
      FROM bill b
      JOIN cart c ON b.cart_id = c.id
      WHERE b.created_at >= $4
      AND b.created_at <= $5
      GROUP BY DATE(b.created_at)
      ORDER BY DATE(b.created_at) ASC
    `;

    const result = await this.billRepository.query(query, [
      PaymentStatus.COMPLETED,
      PaymentStatus.PENDING,
      PaymentStatus.FAILED,
      thirtyDaysAgo,
      new Date(),
    ]);

    const dates = this.generateDates(days);

    return dates.map(date => {
      const dateStr = date.toISOString().split('T')[0];
      const data = result.find(item => item.date.toISOString().split('T')[0] === dateStr);

      return {
        date: this.formatDate(date),
        total_orders: data ? Number(data.total_orders) : 0,
        completed_orders: data ? Number(data.completed_orders) : 0,
        pending_orders: data ? Number(data.pending_orders) : 0,
        failed_orders: data ? Number(data.failed_orders) : 0,
        completion_rate: data
          ? (Number(data.completed_orders) / Number(data.total_orders)) * 100
          : 0,
      };
    });
  }

  async getTotalOrderStatistics(days: number = 30): Promise<{
    total_orders: number;
    completed_orders: number;
    pending_orders: number;
    failed_orders: number;
    completion_rate: number;
  }> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const query = `
      SELECT 
        COALESCE(COUNT(*), 0) as total_orders,
        COALESCE(COUNT(*) FILTER (WHERE c.payment_status = $1), 0) as completed_orders,
        COALESCE(COUNT(*) FILTER (WHERE c.payment_status = $2), 0) as pending_orders,
        COALESCE(COUNT(*) FILTER (WHERE c.payment_status = $3), 0) as failed_orders
      FROM bill b
      JOIN cart c ON b.cart_id = c.id
      WHERE b.created_at >= $4
      AND b.created_at <= $5
    `;

    const [result] = await this.billRepository.query(query, [
      PaymentStatus.COMPLETED,
      PaymentStatus.PENDING,
      PaymentStatus.FAILED,
      thirtyDaysAgo,
      new Date(),
    ]);

    return {
      total_orders: Number(result.total_orders),
      completed_orders: Number(result.completed_orders),
      pending_orders: Number(result.pending_orders),
      failed_orders: Number(result.failed_orders),
      completion_rate: (Number(result.completed_orders) / Number(result.total_orders)) * 100,
    };
  }

  async getConversionStatistics(days: number = 30): Promise<ConversionStatisticDto[]> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const query = `
      WITH daily_stats AS (
        SELECT 
          DATE(be.created_at) as date,
          SUM(be.views) as total_views,
          SUM(be.cart_adds) as total_cart_adds,
          COUNT(DISTINCT CASE WHEN c.payment_status = $1 THEN b.id END) as successful_orders,
          COUNT(DISTINCT CASE WHEN c.payment_status = $1 THEN c.id END) as unique_carts
        FROM behavior be
        LEFT JOIN bill b ON DATE(b.created_at) = DATE(be.created_at)
        LEFT JOIN cart c ON b.cart_id = c.id
        WHERE be.created_at >= $2
        AND be.created_at <= $3
        GROUP BY DATE(be.created_at)
      )
      SELECT 
        date,
        total_views,
        total_cart_adds,
        successful_orders,
        CASE 
          WHEN total_views > 0 THEN (total_cart_adds::float / total_views) * 100 
          ELSE 0 
        END as view_to_cart_rate,
        CASE 
          WHEN total_cart_adds > 0 THEN (successful_orders::float / total_cart_adds) * 100 
          ELSE 0 
        END as cart_to_order_rate,
        CASE 
          WHEN total_views > 0 THEN (successful_orders::float / total_views) * 100 
          ELSE 0 
        END as view_to_order_rate
      FROM daily_stats
      ORDER BY date ASC
    `;

    const result = await this.billRepository.query(query, [
      PaymentStatus.COMPLETED,
      thirtyDaysAgo,
      new Date(),
    ]);
    const dates = this.generateDates(days);

    return dates.map(date => {
      const dateStr = date.toISOString().split('T')[0];
      const data = result.find(item => item.date.toISOString().split('T')[0] === dateStr);

      return {
        date: this.formatDate(date),
        page_views: data ? Number(data.total_views) : 0,
        cart_adds: data ? Number(data.total_cart_adds) : 0,
        successful_orders: data ? Number(data.successful_orders) : 0,
        view_to_cart_rate: data ? Number(data.view_to_cart_rate) : 0,
        cart_to_order_rate: data ? Number(data.cart_to_order_rate) : 0,
        view_to_order_rate: data ? Number(data.view_to_order_rate) : 0,
      };
    });
  }

  async getTotalConversionStatistics(days: number = 30): Promise<{
    total_page_views: number;
    total_cart_adds: number;
    total_successful_orders: number;
    view_to_cart_rate: number;
    cart_to_order_rate: number;
    view_to_order_rate: number;
  }> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const query = `
      SELECT 
        COALESCE(SUM(be.views), 0) as total_page_views,
        COALESCE(SUM(be.cart_adds), 0) as total_cart_adds,
        COALESCE(COUNT(DISTINCT CASE WHEN c.payment_status = $1 THEN b.id END), 0) as total_successful_orders
      FROM behavior be
      LEFT JOIN bill b ON DATE(b.created_at) = DATE(be.created_at)
      LEFT JOIN cart c ON b.cart_id = c.id
      WHERE be.created_at >= $2
      AND be.created_at <= $3
    `;

    const [result] = await this.billRepository.query(query, [
      PaymentStatus.COMPLETED,
      thirtyDaysAgo,
      new Date(),
    ]);

    return {
      total_page_views: Number(result.total_page_views),
      total_cart_adds: Number(result.total_cart_adds),
      total_successful_orders: Number(result.total_successful_orders),
      view_to_cart_rate: (Number(result.total_cart_adds) / Number(result.total_page_views)) * 100,
      cart_to_order_rate:
        (Number(result.total_successful_orders) / Number(result.total_cart_adds)) * 100,
      view_to_order_rate:
        (Number(result.total_successful_orders) / Number(result.total_page_views)) * 100,
    };
  }
}
