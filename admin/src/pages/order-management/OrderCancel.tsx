import React, { useState } from 'react';
import { Card, Col, Row, Typography, Empty, Image, Tag, Space } from 'antd';
import { useQuery } from '@tanstack/react-query';
import moment from 'moment';
import ApiBill, { BillStatus } from '@/api/ApiBill';
import { IChangeTable, TABLE_DEFAULT_VALUE } from '@/components/TableGlobal';
import { PhoneOutlined, HomeOutlined, ClockCircleOutlined, DollarOutlined } from '@ant-design/icons';

const { Text } = Typography;

export default function OrderCancel() {
    const [params, setParams] = useState<Query>({
        page: 1,
        limit: TABLE_DEFAULT_VALUE.defaultPageSize,
        filter: `{"status": "${BillStatus.cancel}"}`
    });

    const { data: orders, isLoading, error } = useQuery(
        ["get_orders_cancel", params],
        () => ApiBill.list(params),
        {
            keepPreviousData: true,
        }
    );

    const handleChangeTable = (value: IChangeTable) => {
        setParams({
            ...params,
            page: value.page,
            limit: value.pageSize,
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-gray-600">Đang tải dữ liệu...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-red-500">Lỗi: {(error as Error).message}</div>
            </div>
        );
    }

    if (!orders || orders.results.length === 0) {
        return (
            <Empty
                description="Chưa có đơn hàng nào"
                className="py-16"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
        );
    }

    return (
        <div className="space-y-6">
            {orders.results.map((order: any) => {
                const totalPrice = order?.cart.cart_items?.reduce(
                    (sum: number, item: any) => sum + item.variant.product.price * item.quantity,
                    0
                );

                return (
                    <Card
                        key={order.id}
                        className="overflow-hidden hover:shadow-md transition-shadow duration-300"
                        bordered={false}
                        bodyStyle={{ padding: '24px' }}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center mb-6 pb-4 border-b">
                            <Space size="large">
                                <Text strong className="text-lg">
                                    Đơn hàng #{order.id}
                                </Text>
                                <Space>
                                    <ClockCircleOutlined className="text-gray-400" />
                                    <Text className="text-gray-500">
                                        {moment(order.created_at).format('DD/MM/YYYY HH:mm')}
                                    </Text>
                                </Space>
                            </Space>
                            <Tag color="red">Đã huỷ</Tag>
                        </div>

                        {/* Customer Info */}
                        <div className="mb-6">
                            <Space direction="vertical" size="small">
                                <Space>
                                    <HomeOutlined className="text-gray-400" />
                                    <Text className="text-gray-600">
                                        {order?.cart?.user?.address || 'Chưa có địa chỉ'}
                                    </Text>
                                </Space>
                                {order?.cart?.user?.phone && (
                                    <Space>
                                        <PhoneOutlined className="text-gray-400" />
                                        <Text className="text-gray-600">
                                            {order?.cart?.user?.phone}
                                        </Text>
                                    </Space>
                                )}
                            </Space>
                        </div>

                        {/* Products */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            {order?.cart?.cart_items.map((item: any) => (
                                <div key={item.id} className="py-4 first:pt-0 last:pb-0 border-b last:border-0">
                                    <Row align="middle" gutter={[16, 16]}>
                                        <Col xs={6} md={3}>
                                            <Image
                                                src={item.variant.image || 'https://via.placeholder.com/100'}
                                                alt={item.variant.type}
                                                className="rounded-lg object-cover"
                                                width={80}
                                                height={80}
                                                preview={false}
                                            />
                                        </Col>
                                        <Col xs={18} md={21}>
                                            <Space direction="vertical" size="small" className="w-full">
                                                <Text strong className="text-gray-800">
                                                    {item.variant.product.name}
                                                </Text>
                                                <Text className="text-gray-500">
                                                    Phân loại: {item.variant.type}
                                                </Text>
                                                <div className="flex justify-between items-center">
                                                    <Text className="text-gray-600">
                                                        {(item.variant.product.price || 0).toLocaleString()} VNĐ x {item.quantity}
                                                    </Text>
                                                    <Text strong className="text-blue-600">
                                                        {(item.variant.product.price * item.quantity).toLocaleString()} VNĐ
                                                    </Text>
                                                </div>
                                            </Space>
                                        </Col>
                                    </Row>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="flex justify-between items-center">
                            <Space size="large">
                                <Space>
                                    <DollarOutlined className="text-gray-400" />
                                    <Text className="text-gray-600">Tổng tiền:</Text>
                                </Space>
                                <Text strong className="text-lg text-blue-600">
                                    {totalPrice.toLocaleString()} VNĐ
                                </Text>
                            </Space>
                        </div>
                    </Card>
                )
            })}
        </div>
    );
}
