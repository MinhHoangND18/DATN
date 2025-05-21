import { useQuery } from "@tanstack/react-query";
import { Column, Line } from "@ant-design/plots";
import { Row, Col, Card, Statistic, Spin } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined, ShoppingCartOutlined, DollarOutlined, ShoppingOutlined, EyeOutlined } from "@ant-design/icons";
import ApiStatistic, {
  IRevenueStatistic,
  IOrderStatistic,
  IConversionStatistic,
  ITotalRevenueResponse,
  ITotalOrderResponse,
  ITotalConversionResponse,
} from "@/api/ApiStatistic";

const StatisticPage = () => {
  const params = { days: 30 };

  // Fetch data
  const { data: revenueData, isLoading: isLoadingRevenue } = useQuery({
    queryKey: ['revenue', params],
    queryFn: () => ApiStatistic.getRevenueStatistics(params),
  });

  const { data: totalRevenue, isLoading: isLoadingTotalRevenue } = useQuery({
    queryKey: ['totalRevenue', params],
    queryFn: () => ApiStatistic.getTotalRevenue(params),
  });

  const { data: orderData, isLoading: isLoadingOrders } = useQuery({
    queryKey: ['orders', params],
    queryFn: () => ApiStatistic.getOrderStatistics(params),
  });

  const { data: totalOrders, isLoading: isLoadingTotalOrders } = useQuery({
    queryKey: ['totalOrders', params],
    queryFn: () => ApiStatistic.getTotalOrderStatistics(params),
  });

  const { data: conversionData, isLoading: isLoadingConversion } = useQuery({
    queryKey: ['conversion', params],
    queryFn: () => ApiStatistic.getConversionStatistics(params),
  });

  const { data: totalConversion, isLoading: isLoadingTotalConversion } = useQuery({
    queryKey: ['totalConversion', params],
    queryFn: () => ApiStatistic.getTotalConversionStatistics(params),
  });

  // Revenue Chart Config
  const revenueConfig = {
    data: revenueData || [],
    xField: 'date',
    yField: 'total_revenue',
    seriesField: 'type',
    columnStyle: { radius: [4, 4, 0, 0] },
    color: ['#1890ff'],
    label: {
      position: 'top' as const,
      style: { fill: '#666' },
      formatter: (datum: any) => `₫${datum.total_revenue.toLocaleString()}`,
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
        interval: 0,
      },
    },
  };

  // Order Status Chart Config
  const orderConfig = {
    data: orderData?.map(item => [
      { date: item.date, type: 'Hoàn thành', value: item.completed_orders },
      { date: item.date, type: 'Đang chờ', value: item.pending_orders },
      { date: item.date, type: 'Thất bại', value: item.failed_orders },
    ]).flat() || [],
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
    stackField: 'type',
    color: ['#52c41a', '#faad14', '#ff4d4f'],
    label: {
      position: 'middle' as const,
      style: { fill: '#fff' },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
        interval: 0,
      },
    },
  };

  // Conversion Rate Chart Config
  const conversionConfig = {
    data: conversionData?.map(item => [
      { date: item.date, type: 'Xem -> Giỏ', value: item.view_to_cart_rate || 0 },
      { date: item.date, type: 'Giỏ -> Đơn', value: item.cart_to_order_rate || 0 },
      { date: item.date, type: 'Xem -> Đơn', value: item.view_to_order_rate || 0 },
    ]).flat() || [],
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
    color: ['#1890ff', '#52c41a', '#faad14'],
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
        interval: 0,
      },
    },
    yAxis: {
      label: {
        formatter: (text: string) => {
          const value = Number(text);
          return isNaN(value) ? '0%' : `${value.toFixed(2)}%`;
        },
      },
    },
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Thống kê tổng quan</h1>

      {/* Revenue Overview */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col span={8}>
          <Card
            className="hover:shadow-lg transition-shadow duration-300"
            bodyStyle={{ padding: '20px' }}
          >
            <Statistic
              title={<span className="text-gray-600">Tổng doanh thu</span>}
              value={totalRevenue?.total_revenue}
              precision={0}
              prefix={<DollarOutlined className="text-blue-500" />}
              suffix="₫"
              valueStyle={{ color: '#1890ff', fontSize: '24px' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            className="hover:shadow-lg transition-shadow duration-300"
            bodyStyle={{ padding: '20px' }}
          >
            <Statistic
              title={<span className="text-gray-600">Tổng đơn hàng</span>}
              value={totalRevenue?.total_orders}
              precision={0}
              prefix={<ShoppingCartOutlined className="text-green-500" />}
              valueStyle={{ color: '#52c41a', fontSize: '24px' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            className="hover:shadow-lg transition-shadow duration-300"
            bodyStyle={{ padding: '20px' }}
          >
            <Statistic
              title={<span className="text-gray-600">Giá trị đơn hàng trung bình</span>}
              value={totalRevenue?.average_order_value}
              precision={0}
              prefix={<ShoppingOutlined className="text-orange-500" />}
              suffix="₫"
              valueStyle={{ color: '#faad14', fontSize: '24px' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Revenue Chart */}
      <Card
        title={<span className="text-lg font-semibold text-gray-800">Doanh thu theo ngày</span>}
        className="mb-6 hover:shadow-lg transition-shadow duration-300"
      >
        <Spin spinning={isLoadingRevenue}>
          <Column {...revenueConfig} />
        </Spin>
      </Card>

      {/* Order Status Overview */}
      <Row gutter={[16, 16]} className="my-6">
        <Col span={6}>
          <Card
            className="hover:shadow-lg transition-shadow duration-300"
            bodyStyle={{ padding: '20px' }}
          >
            <Statistic
              title={<span className="text-gray-600">Tổng đơn hàng</span>}
              value={totalOrders?.total_orders}
              precision={0}
              prefix={<ShoppingCartOutlined className="text-blue-500" />}
              valueStyle={{ fontSize: '20px' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card
            className="hover:shadow-lg transition-shadow duration-300"
            bodyStyle={{ padding: '20px' }}
          >
            <Statistic
              title={<span className="text-gray-600">Đơn hàng thành công</span>}
              value={totalOrders?.completed_orders}
              precision={0}
              prefix={<ArrowUpOutlined className="text-green-500" />}
              valueStyle={{ color: '#52c41a', fontSize: '20px' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card
            className="hover:shadow-lg transition-shadow duration-300"
            bodyStyle={{ padding: '20px' }}
          >
            <Statistic
              title={<span className="text-gray-600">Đơn hàng đang chờ</span>}
              value={totalOrders?.pending_orders}
              precision={0}
              prefix={<ArrowDownOutlined className="text-yellow-500" />}
              valueStyle={{ color: '#faad14', fontSize: '20px' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card
            className="hover:shadow-lg transition-shadow duration-300"
            bodyStyle={{ padding: '20px' }}
          >
            <Statistic
              title={<span className="text-gray-600">Đơn hàng thất bại</span>}
              value={totalOrders?.failed_orders}
              precision={0}
              prefix={<ArrowDownOutlined className="text-red-500" />}
              valueStyle={{ color: '#ff4d4f', fontSize: '20px' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Order Status Chart */}
      <Card
        title={<span className="text-lg font-semibold text-gray-800">Trạng thái đơn hàng theo ngày</span>}
        className="mb-6 hover:shadow-lg transition-shadow duration-300"
      >
        <Spin spinning={isLoadingOrders}>
          <Column {...orderConfig} />
        </Spin>
      </Card>

      {/* Conversion Overview */}
      <Row gutter={[16, 16]} className="my-6">
        <Col span={8}>
          <Card
            className="hover:shadow-lg transition-shadow duration-300"
            bodyStyle={{ padding: '20px' }}
          >
            <Statistic
              title={<span className="text-gray-600">Tổng lượt xem</span>}
              value={totalConversion?.total_page_views}
              precision={0}
              prefix={<EyeOutlined className="text-blue-500" />}
              valueStyle={{ fontSize: '20px' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            className="hover:shadow-lg transition-shadow duration-300"
            bodyStyle={{ padding: '20px' }}
          >
            <Statistic
              title={<span className="text-gray-600">Tổng lượt thêm vào giỏ</span>}
              value={totalConversion?.total_cart_adds}
              precision={0}
              prefix={<ShoppingCartOutlined className="text-green-500" />}
              valueStyle={{ fontSize: '20px' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            className="hover:shadow-lg transition-shadow duration-300"
            bodyStyle={{ padding: '20px' }}
          >
            <Statistic
              title={<span className="text-gray-600">Tổng đơn hàng thành công</span>}
              value={totalConversion?.total_successful_orders}
              precision={0}
              prefix={<ArrowUpOutlined className="text-green-500" />}
              valueStyle={{ fontSize: '20px' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Conversion Rate Chart */}
      <Card
        title={<span className="text-lg font-semibold text-gray-800">Tỉ lệ chuyển đổi theo ngày</span>}
        className="hover:shadow-lg transition-shadow duration-300"
      >
        <Spin spinning={isLoadingConversion}>
          <Line {...conversionConfig} />
        </Spin>
      </Card>
    </div>
  );
};

export default StatisticPage;

