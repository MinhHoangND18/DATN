import React, { useState } from 'react';
import { Tabs, Typography } from 'antd';
import type { TabsProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import Order from './Order';
import { QueryClient } from '@tanstack/react-query';
import OrderConfirm from './OrderConfirm';
import OrderSuccess from './OrderSuccess';
import OrderCancel from './OrderCancel';
import { ShoppingCartOutlined, CheckCircleOutlined, CheckOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Title } = Typography;

const items: TabsProps['items'] = [
    {
        key: '1',
        label: (
            <span className="flex items-center gap-2">
                <ShoppingCartOutlined />
                Đơn mới
            </span>
        ),
        children: <Order />,
    },
    {
        key: '2',
        label: (
            <span className="flex items-center gap-2">
                <CheckOutlined />
                Đã xác nhận
            </span>
        ),
        children: <OrderConfirm />,
    },
    {
        key: '3',
        label: (
            <span className="flex items-center gap-2">
                <CheckCircleOutlined />
                Thành công
            </span>
        ),
        children: <OrderSuccess />,
    },
    {
        key: '4',
        label: (
            <span className="flex items-center gap-2">
                <CloseCircleOutlined />
                Đã huỷ
            </span>
        ),
        children: <OrderCancel />,
    },
];

const OrderManagement = () => {
    const navigate = useNavigate()
    const clientQuery = new QueryClient()
    const [tab, setTab] = useState('1')

    const onChange = (key: string) => {
        setTab(key)
    };

    return (
        <div className="p-6">
            <Title level={2} className="mb-6">Quản lý đơn hàng</Title>
            <div className="bg-white rounded-lg shadow-sm p-6">
                <Tabs
                    defaultActiveKey={tab}
                    items={items}
                    onChange={onChange}
                    type="card"
                    className="order-tabs"
                    size="large"
                />
            </div>
        </div>
    )
}

export default OrderManagement;