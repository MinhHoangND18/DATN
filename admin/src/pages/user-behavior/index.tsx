import React, { useEffect, useState } from 'react';
import ApiBehavior from '@/api/ApiBehavior';
import TableGlobal from '@/components/TableGlobal';
import { useQuery } from '@tanstack/react-query';

interface BehaviorData {
    user_id: number;
    views: number;
    cart_adds: number;
    purchases: number;
    last_activity: string;
    username: string;
}

const UserBehaviorPage = () => {
    const { data, isLoading } = useQuery(['behavior'], () => ApiBehavior.getUserBehavior());


    const columns = [
        {
            title: 'STT',
            render: (text: string, record: BehaviorData, index: number) => index + 1,
        },
        {
            title: 'Khách hàng',
            dataIndex: 'customer_name',
            key: 'customer_name',
        },
        {
            title: 'Lượt xem',
            dataIndex: 'views',
            key: 'views',
            sorter: (a: BehaviorData, b: BehaviorData) => a.views - b.views,
        },
        {
            title: 'Thêm vào giỏ',
            dataIndex: 'cart_adds',
            key: 'cart_adds',
            sorter: (a: BehaviorData, b: BehaviorData) => a.cart_adds - b.cart_adds,
        },
        {
            title: 'Mua hàng',
            dataIndex: 'purchases',
            key: 'purchases',
            sorter: (a: BehaviorData, b: BehaviorData) => a.purchases - b.purchases,
        },
    ];

    return (


        <TableGlobal
            columns={columns}
            dataSource={data?.results}
            loading={isLoading}
            total={data?.metadata.totalItems}
            pagination={{
                pageSize: data?.metadata.itemsPerPage,
                showSizeChanger: true,
                showTotal: (total) => `Tổng ${total} người dùng`,
            }}
        />


    );
};

export default UserBehaviorPage; 