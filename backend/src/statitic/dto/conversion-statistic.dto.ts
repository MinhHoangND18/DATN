export class ConversionStatisticDto {
  date: string;
  page_views: number; // Số lượt xem trang
  cart_adds: number; // Số lượt thêm vào giỏ
  successful_orders: number; // Số đơn hàng thành công
  view_to_cart_rate: number; // Tỉ lệ xem trang -> thêm vào giỏ
  cart_to_order_rate: number; // Tỉ lệ thêm vào giỏ -> đặt hàng thành công
  view_to_order_rate: number; // Tỉ lệ xem trang -> đặt hàng thành công
}
