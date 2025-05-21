import { useMemo, useRef } from "react";
import { Formik, FormikProps } from "formik";
import { Col, Row } from "antd";
import ModalGlobal from "..";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Notification from "@/components/Notification";
import FormGlobal, {
  DatePickerFormikGlobal,
  FormItemGlobal,
  InputFormikGlobal,
  InputPasswordFormikGlobal,
  RadioGroupFormikGlobal,
  SelectFormikGlobal,
} from "@/components/FormGlobal";
import ApiUser, { ICreateUser, IUser } from "@/api/ApiUser";
import { UserValidation } from "@/utils/validation/user";
import { ERole } from "@/lazyLoading";
import ApiClinic from "@/api/ApiClinic";
import ApiDepartment from "@/api/ApiDepartment";
import moment from "moment";

interface IModalCreateEditUser {
  isOpenModal: boolean;
  handleCloseModal: () => void;
  selectedUser?: IUser;
}

// interface ICreateUserBody {
//   full_name: string;
//   username: string;
//   email: string;
//   role?: ERole;
//   password: string;
//   cccd: string;
//   birthday: string;

// }

export default function ModalCreateEditUser({
  isOpenModal,
  handleCloseModal,
  selectedUser,
}: IModalCreateEditUser) {
  const innerRef = useRef<FormikProps<any>>(null);
  const queryClient = useQueryClient();


  const initialValues: any = useMemo(() => {
    return {
      username: selectedUser?.username ?? "",
      email: selectedUser?.email ?? "",
      role: selectedUser?.role ?? "",
      password: selectedUser?.password ?? "",
      // cccd: selectedUser?.cccd ?? "",
      full_name: selectedUser?.full_name ?? "",
      gender: selectedUser?.gender ?? 'Nam',
      phone: selectedUser?.phone ?? '',
      address: selectedUser?.address ?? '',
      birthday: moment(selectedUser?.birthday ?? new Date()),
    };
  }, [selectedUser]);

  const onCancel = () => {
    handleCloseModal();
    innerRef.current?.resetForm();
  };

  const createUserMutation = useMutation(ApiUser.createUser);
  const updateUserMutation = useMutation(ApiUser.updateUser);

  const handleSubmit = async (values: any) => {
    if (selectedUser) {
      updateUserMutation.mutate(
        { id: selectedUser.id, data: values },
        {
          onSuccess: () => {
            Notification.notificationSuccess("Thành công");
            queryClient.refetchQueries(["get_users"]);
            onCancel();
          },
        }
      );
      return;
    }

    createUserMutation.mutate(values as ICreateUser, {
      onSuccess: () => {
        Notification.notificationSuccess("Thêm nhân viên thành công");
        queryClient.refetchQueries(["get_users"]);
        onCancel();
      },
    });
  };

  return (
    <Formik
      innerRef={innerRef}
      initialValues={initialValues}
      enableReinitialize
      onSubmit={handleSubmit}
      validationSchema={UserValidation}
    >
      {({ handleSubmit, setFieldValue, values }): JSX.Element => {
        return (
          <ModalGlobal
            open={isOpenModal}
            title={selectedUser ? "Sửa thông tin nhân viên" : "Tạo nhân viên"}
            onOk={handleSubmit}
            onCancel={onCancel}
            isLoadingOK={
              createUserMutation.isLoading || updateUserMutation.isLoading
            }
            width={1000}
          >
            <FormGlobal>
              <Row gutter={[16, 0]}>
                <Col span={12}>
                  <FormItemGlobal
                    name="full_name"
                    label="Tên nhân viên"
                    required
                  >
                    <InputFormikGlobal
                      name="full_name"
                      placeholder="Tên nhân viên"
                    />
                  </FormItemGlobal>

                  <FormItemGlobal
                    name={'phone'}
                    label='Số điện thoại'
                    required
                  >
                    <InputFormikGlobal name="phone" />
                  </FormItemGlobal>

                  <FormItemGlobal name="email" label="Email" required>
                    <InputFormikGlobal name="email" placeholder="email" />
                  </FormItemGlobal>

                  <FormItemGlobal name={'birthday'} label={'Ngày sinh'} required>
                    <DatePickerFormikGlobal name="birthday" disabledDate={(current) => {
                      // Disable all future dates
                      return current && current > moment().endOf('day');
                    }} />
                  </FormItemGlobal>

                  <FormItemGlobal name={'gender'} label={'Giới tính'} required>
                    <RadioGroupFormikGlobal
                      name="gender"
                      options={[
                        {
                          label: 'Nam',
                          value: 'Nam'
                        },
                        {
                          label: 'Nữ',
                          value: 'Nữ'
                        }
                      ]}

                    />
                  </FormItemGlobal>


                </Col>

                <Col span={12}>
                  <FormItemGlobal name="username" label="Tài khoản người dùng" required>
                    <InputFormikGlobal name="username" required />
                  </FormItemGlobal>
                  <FormItemGlobal name="password" label="Mật khẩu" required>
                    <InputPasswordFormikGlobal
                      name="password"
                      placeholder="Mật khẩu"
                    />
                  </FormItemGlobal>
                  <FormItemGlobal name="role" label="Chức vụ" required>
                    <SelectFormikGlobal
                      name="role"
                      placeholder="Chức vụ"
                      options={Object.entries(ERole).map(([_, value]) => ({ label: value, value }))}
                    />
                  </FormItemGlobal>
                  <FormItemGlobal name={'address'} label="Địa chỉ" required>
                    <InputFormikGlobal name="address" />
                  </FormItemGlobal>
                </Col>
              </Row>
            </FormGlobal>
          </ModalGlobal>
        );
      }}
    </Formik>
  );
}
