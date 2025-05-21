import React, { useState } from 'react';
import { Card, Col, Row, Typography, Empty, Divider, Tag, Spin } from 'antd';
import { useQuery } from '@tanstack/react-query';
import moment from 'moment'; // Dùng moment để format thời gian
import ApiBill from '@/api/ApiBill';
import { ShoppingOutlined, ClockCircleOutlined } from '@ant-design/icons';
import './styles.scss';

const { Title, Text } = Typography;

const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'pending':
            return 'warning';
        case 'confirmed':
            return 'processing';
        case 'delivered':
            return 'success';
        case 'cancelled':
            return 'error';
        default:
            return 'default';
    }
};

const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
        case 'pending':
            return 'Chờ xác nhận';
        case 'confirmed':
            return 'Đã xác nhận';
        case 'delivered':
            return 'Đã giao hàng';
        case 'cancelled':
            return 'Đã hủy';
        default:
            return status;
    }
};

const OrderHistory = () => {
    const [params, setParams] = useState<Query>({
        limit: 999,
        page: 1,
    })
    // Lấy dữ liệu lịch sử mua hàng bằng useQuery
    const { data: orders, isLoading, error } = useQuery({
        queryKey: ['order_history', params],
        queryFn: () => ApiBill.list(params),
    });

    if (isLoading) {
        return (
            <div className="order-history-loading">
                <Spin size="large" />
                <Text className="loading-text">Đang tải lịch sử đơn hàng...</Text>
            </div>
        );
    }

    if (error) {
        return (
            <div className="order-history-error">
                <Text>Không thể tải lịch sử đơn hàng</Text>
                <Text className="error-message">{(error as Error).message}</Text>
            </div>
        );
    }

    if (!orders || orders.results.length === 0) {
        return (
            <div className="order-history-empty">
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                        <div className="empty-content">
                            <Title level={4}>Chưa có đơn hàng nào</Title>
                            <Text className="empty-text">Hãy mua sắm để có đơn hàng đầu tiên của bạn</Text>
                        </div>
                    }
                />
            </div>
        );
    }

    return (
        <div className="order-history">
            <div className="order-history-header">
                <ShoppingOutlined className="header-icon" />
                <Title level={2}>Lịch sử đơn hàng</Title>
            </div>

            <div className="orders-container">
                {orders.results.map((order: any) => {
                    const totalPrice = order?.cart.cart_items?.reduce(
                        (sum: number, item: any) => sum + item.variant.product.price * item.quantity,
                        0
                    );

                    return (
                        <Card key={order.id} className="order-card">
                            <div className="order-header">
                                <div className="order-info">
                                    <Text strong>Đơn hàng #{order.id}</Text>
                                    <Tag color={getStatusColor(order.status)}>{getStatusText(order.status)}</Tag>
                                </div>
                                <div className="order-date">
                                    <ClockCircleOutlined />
                                    <Text>{moment(order.created_at).format('HH:mm - DD/MM/YYYY')}</Text>
                                </div>
                            </div>

                            <div className="order-items">
                                {order?.cart?.cart_items.map((item: any) => (
                                    <div key={item.id} className="order-item">
                                        <div className="item-image">
                                            <img
                                                src={item.variant.image || 'https://via.placeholder.com/100'}
                                                alt={item.variant.type}
                                            />
                                        </div>
                                        <div className="item-details">
                                            <Text strong className="item-name">
                                                {item.variant.product.name}
                                            </Text>
                                            <Text className="item-variant">Phân loại: {item.variant.type}</Text>
                                            <div className="item-price-qty">
                                                <Text className="item-price">
                                                    {(item.variant.product.price || 0).toLocaleString()}₫
                                                </Text>
                                                <Text className="item-quantity">x{item.quantity}</Text>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Divider />

                            <div className="order-footer">
                                <div className="total-section">
                                    <Text>Tổng tiền:</Text>
                                    <Text strong className="total-amount">
                                        {totalPrice.toLocaleString()}₫
                                    </Text>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default OrderHistory;