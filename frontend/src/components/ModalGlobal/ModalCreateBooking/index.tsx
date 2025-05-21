import { useMemo, useRef } from "react";
import { Formik, FormikProps } from "formik";
import { Col, Divider, Row, Space, Tooltip } from "antd";
import ModalGlobal from "..";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Notification from "@/components/Notification";
import FormGlobal, {
  DatePickerFormikGlobal,
  FormItemGlobal,
  InputFormikGlobal,
  InputNumberFormikGlobal,
  RadioGroupFormikGlobal,
  SelectFormikGlobal,
} from "@/components/FormGlobal";
import ApiBookRoom, { EPaymentType } from "@/api/ApiBookRoom";
import moment, { Moment } from "moment";
import ApiRoom from "@/api/ApiRoom";
import { BookingValidation } from "@/utils/validation/booking";
import ApiUser, { EGender } from "@/api/ApiUser";
import SeachRoom from "@/components/SearchRoom";
import "./index.scss";
import ButtonGlobal from "@/components/ButtonGlobal";
import TableGlobal from "@/components/TableGlobal";
import { ColumnsType } from "antd/lib/table";
import { ArrowRightOutlined } from "@ant-design/icons";

interface ICreateBookingBody {
  username: string;
  gender: EGender;
  email: string;
  phone: string;
  checkin: Moment;
  checkout: Moment;
  quantity: number;
  type_room_id?: number;
  payment_type: EPaymentType;
  check_mail?: string;
  id?: number;
}

interface IModalCreateBooking {
  isOpenModal: boolean;
  handleCloseModal: () => void;
}

export default function ModalCreateBooking({
  isOpenModal,
  handleCloseModal,
}: IModalCreateBooking) {
  const innerRef = useRef<FormikProps<ICreateBookingBody>>(null);
  const queryClient = useQueryClient();

  const checkMail = useMutation(ApiUser.checkMail);

  const initialValues: ICreateBookingBody = useMemo(() => {
    return {
      username: "",
      gender: EGender.Female,
      email: "",
      phone: "",
      checkin: moment().startOf("day"),
      checkout: moment().startOf("day").add(1, "day"),
      quantity: 0,
      idRoom: undefined,
      payment_type: EPaymentType.Cash,

      check_mail: "",
    };
  }, [isOpenModal]);

  const { data: rooms } = useQuery(["get_rooms"], () => ApiRoom.getRooms());
  const convertRoomsValue = useMemo(() => {
    return rooms?.results.map((item) => ({
      label: item.name,
      value: item.id,
    }));
  }, [rooms]);

  const onCancel = () => {
    handleCloseModal();
    innerRef.current?.resetForm();
  };

  const calculateNight = (sd: Moment, ed: Moment) => {
    const roomPrice =
      rooms?.results.find(
        (item) =>
          Number(item.id) == (innerRef.current?.values?.type_room_id as number)
      )?.price ?? 0;

    return (
      ed.diff(sd, "days") *
      roomPrice *
      (innerRef.current?.values.quantity ?? 0)
    ).toLocaleString();
  };

  const createBookingMutation = useMutation(ApiBookRoom.createBooking);
  const handleSubmit = async (values: ICreateBookingBody) => {
    delete values.check_mail;

    const newValues = {
      ...values,
      checkin: moment(values.checkin).format("YYYY-MM-DD"),
      checkout: moment(values.checkout).format("YYYY-MM-DD"),
    };

    createBookingMutation.mutate(newValues as any, {
      onSuccess: () => {
        Notification.notificationSuccess("Thành công");
        queryClient.refetchQueries(["get_bookings"]);
        onCancel();
      },
    });
  };

  const handleSearch = (email?: string) => {
    if (email) checkMail.mutate({ email });
  };

  const columns: (setFieldValue: any) => ColumnsType<any> = (setFieldValue) => [
    {
      title: "STT",
      align: "center",
      render: (_, __, i) => i + 1,
      width: 50,
    },
    {
      title: "Email",
      dataIndex: ["email"],
      align: "center",
    },
    {
      title: "Tên khách hàng",
      dataIndex: ["username"],
      align: "center",
    },
    {
      title: "phone",
      dataIndex: ["phone"],
      align: "center",
    },
    {
      title: "cccd",
      dataIndex: ["cccd"],
      align: "center",
    },
    {
      title: "Địa chỉ",
      align: "center",
      dataIndex: ["address"],
    },

    {
      title: "Hành động",
      align: "center",
      width: 100,
      fixed: "right",
      render: (_, record) => (
        <Space>
          <Tooltip title="Dùng">
            <span
              className="p-2 cursor-pointer"
              role="presentation"
              onClick={() => {
                for (const [key, value] of Object.entries(record)) {
                  setFieldValue(key, value);
                }
              }}
            >
              <ArrowRightOutlined />
            </span>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Formik
      innerRef={innerRef}
      initialValues={initialValues}
      enableReinitialize
      onSubmit={handleSubmit}
      validationSchema={BookingValidation}
    >
      {({ handleSubmit, values, setFieldValue }): JSX.Element => {
        return (
          <ModalGlobal
            open={isOpenModal}
            title="Đặt phòng"
            onOk={handleSubmit}
            onCancel={onCancel}
            isLoadingOK={createBookingMutation.isLoading}
          // width={1000}
          >
            <FormGlobal>
              <Row gutter={33}>
                <Col span={14}>
                  <Row gutter={[0, 33]}>
                    <Col span={24} className="col-search-room">
                      <div className="text-center">Tìm kiếm phòng trống</div>
                      <SeachRoom></SeachRoom>
                    </Col>
                    <Divider></Divider>
                    <Col span={24} className="col-search w-full">
                      <div className="text-center mb-4 div-text">
                        Tìm kiếm người dùng
                      </div>
                      <div>
                        <Row gutter={[0, 33]}>
                          <Col span={24} className="col-email">
                            <Row gutter={33}>
                              <Col span={20}>
                                <FormItemGlobal name="Email" className="mb-20">
                                  <InputFormikGlobal
                                    name="check_mail"
                                    placeholder="email"
                                  ></InputFormikGlobal>
                                </FormItemGlobal>
                              </Col>
                              <Col span={4}>
                                <div>
                                  <ButtonGlobal
                                    title="Tìm kiếm"
                                    onClick={() =>
                                      handleSearch(values?.check_mail)
                                    }
                                  ></ButtonGlobal>
                                </div>
                              </Col>
                            </Row>
                          </Col>
                          <Col span={24}>
                            <div className="flex justify-center items-center h-full">
                              <Row className="w-full" gutter={[0, 10]}>
                                <TableGlobal
                                  columns={columns(setFieldValue)}
                                  dataSource={checkMail?.data}
                                ></TableGlobal>
                              </Row>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  </Row>
                </Col>
                <Col span={10}>
                  <Row gutter={[8, 0]}>
                    <Col span={12}>
                      <FormItemGlobal name="username" label="Tên" required>
                        <InputFormikGlobal name="username" placeholder="Tên" />
                      </FormItemGlobal>

                      <FormItemGlobal name="email" label="Email" required>
                        <InputFormikGlobal name="email" placeholder="email" />
                      </FormItemGlobal>

                      <FormItemGlobal name="cccd" label="CCCD" required>
                        <InputFormikGlobal name="cccd" placeholder="CCCD" />
                      </FormItemGlobal>

                      <FormItemGlobal
                        name="type_room_id"
                        label="Phòng"
                        required
                      >
                        <SelectFormikGlobal
                          name="type_room_id"
                          placeholder="Phòng"
                          options={convertRoomsValue}
                          allowClear={false}
                        />
                      </FormItemGlobal>

                      <FormItemGlobal name="checkin" label="Check-in" required>
                        <DatePickerFormikGlobal
                          name="checkin"
                          placeholder="Check-in"
                          allowClear={false}
                          disabledDate={(d) =>
                            d <= moment().subtract(1, "days") ||
                            d >= values.checkout
                          }
                          onChange={(date) => {
                            setFieldValue("checkin", date?.startOf("day"));
                          }}
                        />
                      </FormItemGlobal>
                    </Col>
                    <Col span={12}>
                      <FormItemGlobal
                        name="phone"
                        label="Số điện thoại"
                        required
                      >
                        <InputFormikGlobal
                          name="phone"
                          placeholder="Số điện thoại"
                        />
                      </FormItemGlobal>

                      <FormItemGlobal name="address" label="Địa chỉ" required>
                        <InputFormikGlobal
                          name="address"
                          placeholder="Nhập địa chỉ"
                        />
                      </FormItemGlobal>
                      <FormItemGlobal name="gender" label="Giới tính">
                        <SelectFormikGlobal
                          name="gender"
                          placeholder="Giới tính"
                          options={[
                            { label: "Nam", value: EGender.Male },
                            { label: "Nữ", value: EGender.Female },
                          ]}
                        />
                      </FormItemGlobal>

                      <FormItemGlobal
                        name="quantity"
                        label="Số lượng phòng"
                        required
                      >
                        <InputNumberFormikGlobal
                          name="quantity"
                          placeholder="Số lượng phòng"
                          min={1}
                        />
                      </FormItemGlobal>

                      <FormItemGlobal
                        name="checkout"
                        label="Check-out"
                        required
                      >
                        <DatePickerFormikGlobal
                          name="checkout"
                          placeholder="Check-out"
                          allowClear={false}
                          disabledDate={(d) => d <= values.checkin}
                          onChange={(date) => {
                            setFieldValue("checkout", date?.startOf("day"));
                          }}
                        />
                      </FormItemGlobal>
                    </Col>
                    <span className="font-bold mx-2">
                      Số tiền thanh toán:{" "}
                      {calculateNight(values.checkin, values.checkout)} VNĐ
                    </span>
                    <Divider />
                    <div className="mt-5 mx-2">
                      <span className="font-bold">Phương thức thanh toán</span>
                      <FormItemGlobal name="payment_type" required>
                        <RadioGroupFormikGlobal
                          name="payment_type"
                          options={[
                            { label: "Momo", value: EPaymentType.Momo },
                            { label: "Vnpay", value: EPaymentType.Vnpay },
                            { label: "Zalopay", value: EPaymentType.Zalopay },
                            { label: "Cash", value: EPaymentType.Cash },
                          ]}
                        />
                      </FormItemGlobal>
                    </div>
                  </Row>
                </Col>
              </Row>
            </FormGlobal>
          </ModalGlobal>
        );
      }}
    </Formik>
  );
}
