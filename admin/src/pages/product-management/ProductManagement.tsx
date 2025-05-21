import ApiProduct from "@/api/ApiProduct";
import ApiService, { IServiceRes } from "@/api/ApiService";
import { InputSearchGlobal, SelectGlobal } from "@/components/AntdGlobal";
import ButtonGlobal from "@/components/ButtonGlobal";
import ModalCreateEditProduct from "@/components/ModalGlobal/ModalCreateEditProduct";
import ModalCreateEditService from "@/components/ModalGlobal/ModalCreateEditCategory";
import Notification from "@/components/Notification";
import TableGlobal, {
    IChangeTable,
    TABLE_DEFAULT_VALUE,
} from "@/components/TableGlobal";
import PermissionWarpper from "@/layouts/PermissionWarpper";
import {
    ERole,
    checkPermission,
} from "@/lazyLoading";
import { EditOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Row, Space, Switch } from "antd";
import { ColumnsType } from "antd/lib/table";
import { useMemo, useState } from "react";

export default function ProductManagement() {
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [params, setParams] = useState<Query>({
        page: 1,
        limit: TABLE_DEFAULT_VALUE.defaultPageSize,
    });
    const [selected, setSelected] = useState<any>();

    const { data: products } = useQuery(
        ["get_products", params],
        () => ApiProduct.list(params),
        {
            keepPreviousData: true,
        }
    );

    const handleCloseModal = () => {
        setSelected(undefined);
        setIsOpenModal(false);
    };

    const handleChangeTable = (value: IChangeTable) => {
        setParams({
            ...params,
            page: value.page,
            limit: value.pageSize,
        });
    };

    const activeMutation = useMutation(ApiProduct.active);

    const columns: ColumnsType<any> = [
        {
            title: "Mã",
            align: "center",
            dataIndex: 'id',
            width: 80,
            render: (value) => 'SP' + value,
        },
        {
            title: "Tên sản phẩm",
            dataIndex: "name",
            align: "center",
            width: 200,

        },
        {
            title: "Giá",
            dataIndex: "price",
            align: "center",
            width: 200,
            render: (value) => Number(String(value)).toLocaleString()
        },
        {
            title: "Loại sản phẩm",
            dataIndex: ['category', 'name'],
            align: "center",
            width: 200,
        },
        // {
        //     title: "Mô tả",
        //     dataIndex: "description",
        //     align: "center",
        //     width: 400,
        //     render: (value) => <div dangerouslySetInnerHTML={{ __html: value }}></div>
        // },
        {
            title: 'Trạng thái',
            dataIndex: 'active',
            align: 'center',
            width: 200,
            render(_, record) {
                return <Switch
                    checkedChildren="On"
                    unCheckedChildren="Off"
                    defaultChecked={record.active}
                    loading={activeMutation.isLoading}
                    onChange={(e) => {
                        activeMutation.mutate(
                            { id: record.id, active: e },
                            {
                                onSuccess: (resp) => {
                                    Notification.notificationSuccess(resp);
                                },
                            }
                        );
                    }}
                ></Switch>
            }
        },
        {
            title: "Hành động",
            align: "center",
            width: 200,
            fixed: "right",
            render: (_, record) => (
                <>
                    <PermissionWarpper permissions={[ERole.SUPER_ADMIN]}>
                        <span
                            className="m-3 p-2 cursor-pointer"
                            role="presentation"
                            onClick={() => {
                                setSelected(record);
                                setIsOpenModal(true);
                            }}
                        >
                            <EditOutlined />
                        </span>
                    </PermissionWarpper>
                </>

            ),
        },
    ]

    return (
        <div>
            <Row className="mb-5" justify="space-between">
                <Space>
                    <InputSearchGlobal
                        onChange={(e) => setSearchValue(e.target.value.trim())}
                        onSearch={() =>
                            setParams({ ...params, search: searchValue })
                        }
                        placeholder="Nhập tên sản phẩm"
                    />

                </Space>

                <Space>
                    <PermissionWarpper permissions={[ERole.SUPER_ADMIN]}>
                        <ButtonGlobal
                            title="Thêm sản phẩm"
                            onClick={() => setIsOpenModal(true)}
                        />
                    </PermissionWarpper>
                </Space>

            </Row>
            <TableGlobal
                total={products?.metadata.totalItems}
                dataSource={products?.results}
                columns={columns}
                onChangeTable={handleChangeTable}
            />
            <ModalCreateEditProduct
                isOpenModal={isOpenModal}
                handleCloseModal={handleCloseModal}
                selected={selected}
            />
        </div>
    );
}
