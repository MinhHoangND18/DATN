export class OrderStatisticDto {
  date: string;
  total_orders: number;
  completed_orders: number;
  pending_orders: number;
  failed_orders: number;
  completion_rate: number;
}
