import { downloadFile, fetcher } from './Fetcher';

export interface IGetStatParams {
  start_date?: string;
  end_date?: string;
  days?: number;
}

export interface IGetRoomStatisticParams {
  year: number;
  month?: number;
  day?: number;
}

export interface IRevenueStatisticParams {
  year: number;
}

export interface IRevenueStatistic {
  date: string;
  total_revenue: number;
  total_orders: number;
  average_order_value: number;
}

export interface IOrderStatistic {
  date: string;
  total_orders: number;
  completed_orders: number;
  pending_orders: number;
  failed_orders: number;
  completion_rate: number;
}

export interface IConversionStatistic {
  date: string;
  page_views: number;
  cart_adds: number;
  successful_orders: number;
  view_to_cart_rate: number;
  cart_to_order_rate: number;
  view_to_order_rate: number;
}

export interface ITotalRevenueResponse {
  total_revenue: number;
  total_orders: number;
  average_order_value: number;
}

export interface ITotalOrderResponse {
  total_orders: number;
  completed_orders: number;
  pending_orders: number;
  failed_orders: number;
  completion_rate: number;
}

export interface ITotalConversionResponse {
  total_page_views: number;
  total_cart_adds: number;
  total_successful_orders: number;
  view_to_cart_rate: number;
  cart_to_order_rate: number;
  view_to_order_rate: number;
}

const ApiStatistic = {
  getRevenueStatistics: (params: IGetStatParams) => {
    return fetcher<IRevenueStatistic[]>({
      url: '/statistics/revenue',
      method: 'GET',
      params,
    });
  },

  getTotalRevenue: (params: IGetStatParams) => {
    return fetcher<ITotalRevenueResponse>({
      url: '/statistics/revenue/total',
      method: 'GET',
      params,
    });
  },

  getOrderStatistics: (params: IGetStatParams) => {
    return fetcher<IOrderStatistic[]>({
      url: '/statistics/orders',
      method: 'GET',
      params,
    });
  },

  getTotalOrderStatistics: (params: IGetStatParams) => {
    return fetcher<ITotalOrderResponse>({
      url: '/statistics/orders/total',
      method: 'GET',
      params,
    });
  },

  getConversionStatistics: (params: IGetStatParams) => {
    return fetcher<IConversionStatistic[]>({
      url: '/statistics/conversion',
      method: 'GET',
      params,
    });
  },

  getTotalConversionStatistics: (params: IGetStatParams) => {
    return fetcher<ITotalConversionResponse>({
      url: '/statistics/conversion/total',
      method: 'GET',
      params,
    });
  },
};

export default ApiStatistic;
