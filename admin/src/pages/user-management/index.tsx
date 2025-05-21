import ApiUser from '@/api/ApiUser';
import { InputSearchGlobal } from '@/components/AntdGlobal'
import ButtonGlobal from '@/components/ButtonGlobal';
import ModalCreateEditUser from '@/components/ModalGlobal/ModalCreateEditUser';
import Notification from '@/components/Notification';
import TableGlobal, { IChangeTable, TABLE_DEFAULT_VALUE } from '@/components/TableGlobal';
import PermissionWarpper from '@/layouts/PermissionWarpper';
import { checkPermission, ERole } from '@/lazyLoading';
import { EditOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Row, Space, Switch } from 'antd'
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import React, { useState } from 'react'

export default function UserManagement() {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [listParams, setListParams] = useState<Query>({
    page: 1,
    limit: TABLE_DEFAULT_VALUE.defaultPageSize,
  });
  const [selected, setSelected] = useState<any>();

  const handleCloseModal = () => {
    setSelected(undefined);
    setIsOpenModal(false);
  };

  const { data } = useQuery(
    ["get_users", listParams],
    () => ApiUser.getUser(listParams),
    {
      keepPreviousData: true,
    }
  );

  const handleChangeTable = (value: IChangeTable) => {
    setListParams((prev) => ({
      ...prev,
      page: value.page,
      limit: value.pageSize,
    }));
  };

  const activeMutation = useMutation(ApiUser.activeUser)

  const columns: ColumnsType<any> = [
    {
      title: "Mã",
      align: "center",
      dataIndex: 'id',
      width: 80,
      render: (value) => 'NV' + value,
    },
    {
      title: "Tên",
      dataIndex: "full_name",
      align: "center",
      width: 200,
    },
    {
      title: "Tài khoản",
      dataIndex: "username",
      align: "center",
      width: 150,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      align: "center",
      width: 150,
    },
    {
      title: "Ngày sinh",
      dataIndex: "birthday",
      align: "center",
      width: 150,
      render: (value) => moment(value).format("DD-MM-YYYY"),
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      align: "center",
      width: 150,
    },
    {
      title: "Chức vụ",
      dataIndex: "role",
      align: "center",
      width: 130,
    },
    {
      title: "Hành động",
      align: "center",
      width: 140,
      fixed: "right",
      render: (_, record) => (
        <PermissionWarpper permissions={[ERole.SUPER_ADMIN]}>
          <Switch
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
          <span
            className="p-2 cursor-pointer"
            role="presentation"
            onClick={() => {
              setSelected(record);
              setIsOpenModal(true);
            }}
          >
            <EditOutlined />
          </span>
        </PermissionWarpper>
      ),
    },
  ]

  return (
    <div className="">
      <Row className="mb-5" justify="space-between">
        <Space>
          <InputSearchGlobal
            onChange={(e) => setSearchValue(e.target.value.trim())}
            onSearch={() =>
              setListParams(prev => ({ ...prev, search: searchValue }))
            }
            placeholder="Nhập tên nhân viên"
          />
        </Space>
        <Space>
          <ButtonGlobal
            title="Thêm nhân viên"
            onClick={() => setIsOpenModal(true)}
          />
        </Space>
      </Row>
      <TableGlobal
        total={data?.metadata.totalItems}
        dataSource={data?.results}
        columns={columns}
        onChangeTable={handleChangeTable}
        scrollX={1200}
      />
      <ModalCreateEditUser
        isOpenModal={isOpenModal}
        handleCloseModal={handleCloseModal}
        selectedUser={selected}
      />
    </div >
  )
}