import ApiCategory from "@/api/ApiCategory";
import ApiProduct from "@/api/ApiProduct";
import ApiService, { IServiceRes } from "@/api/ApiService";
import { InputSearchGlobal, SelectGlobal } from "@/components/AntdGlobal";
import ButtonGlobal from "@/components/ButtonGlobal";
import ModalCreateEditCategory from "@/components/ModalGlobal/ModalCreateEditCategory";
import ModalCreateEditProduct from "@/components/ModalGlobal/ModalCreateEditProduct";
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

export default function CategoryManagement() {
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [params, setParams] = useState<Query>({
        page: 1,
        limit: TABLE_DEFAULT_VALUE.defaultPageSize,
    });
    const [selected, setSelected] = useState<any>();

    const { data: categories } = useQuery(
        ["get_categories", params],
        () => ApiCategory.list(params),
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


    const columns: ColumnsType<any> = [
        {
            title: "Mã",
            align: "center",
            dataIndex: 'id',
            width: 80,
            render: (value) => 'M' + value,
        },
        {
            title: "Tên",
            dataIndex: "name",
            align: "center",
            width: 200,
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
                        placeholder="Nhập tên loại sản phẩm"
                    />

                </Space>

                <Space>
                    <PermissionWarpper permissions={[ERole.SUPER_ADMIN]}>
                        <ButtonGlobal
                            title="Thêm loại sản phẩm"
                            onClick={() => setIsOpenModal(true)}
                        />
                    </PermissionWarpper>
                </Space>

            </Row>
            <TableGlobal
                total={categories?.metadata.totalItems}
                dataSource={categories?.results}
                columns={columns}
                onChangeTable={handleChangeTable}
            />
            <ModalCreateEditCategory
                isOpenModal={isOpenModal}
                handleCloseModal={handleCloseModal}
                selected={selected}
            />
        </div>
    );
}
