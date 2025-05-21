import { useEffect, useMemo, useRef, useState } from "react";
import { Formik, FormikProps } from "formik";
import { Col, Row } from "antd";
import ModalGlobal from "..";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Notification from "@/components/Notification";
import FormGlobal, {
  FormItemGlobal,
  InputFormikGlobal,
  RadioGroupFormikGlobal,
  SelectFormikGlobal,
} from "@/components/FormGlobal";
import ApiAppointment, { IAppointment, ICreateAppointment } from "@/api/ApiAppointment";
import moment from "moment";

interface IModalAlowAppointment {
  isOpenModal: boolean;
  handleCloseModal: () => void;
  selectedAppointment?: IAppointment;
}

export default function ModalAlowAppointment({
  isOpenModal,
  handleCloseModal,
  selectedAppointment,
}: IModalAlowAppointment) {

  const innerRef = useRef<FormikProps<any>>(null);
  const queryClient = useQueryClient();

  const initialValues: any = useMemo(() => {
    return {
      // insurance: selectedAppointment?.insurance ?? false,
      // doctor_id: selectedAppointment?.doctor?.id
    };
  }, [selectedAppointment]);

  // console.log(initialValues);

  const { data } = useQuery(['data_doctor'], () => ApiAppointment.getDoctor({}))

  const dataDoctor = useMemo(() => {
    return data?.map((v) => ({ value: v.id, label: v.full_name }))
  }, [data])

  const onCancel = () => {
    handleCloseModal();
    innerRef.current?.resetForm();
  };

  const updateAppointmentMutation = useMutation(ApiAppointment.update);

  const handleSubmit = async (values: Record<string, string>) => {

    if (selectedAppointment) {
      updateAppointmentMutation.mutate(
        { id: selectedAppointment.id, data: { doctor_id: values.doctor_id } },
        {
          onSuccess: () => {
            Notification.notificationSuccess("Thành công");
            queryClient.refetchQueries(["get_appointments"]);
            onCancel();
          },
        }
      );
      return;
    }

    // createUserMutation.mutate(values as ICreateUser, {
    //   onSuccess: () => {
    //     Notification.notificationSuccess("Thêm nhân viên thành công");
    //     queryClient.refetchQueries(["get_users"]);
    //     onCancel();
    //   },
    // });
  };

  return (
    <Formik
      innerRef={innerRef}
      initialValues={initialValues}
      enableReinitialize
      onSubmit={handleSubmit}
    // validationSchema={UserValidation}
    >
      {({ handleSubmit, setFieldValue, getFieldProps }): JSX.Element => {
        return (
          <ModalGlobal
            open={isOpenModal}
            title={"Xem trước thông tin khám bệnh"}
            onOk={handleSubmit}
            onCancel={onCancel}
            isLoadingOK={
              updateAppointmentMutation.isLoading
            }
            width={800}
            className="!overflow-hidden !max-h-max"
          >
            <>
              <Row gutter={33}>
                <Col span={12}>
                  <div className="mb-2 text-xl"><b>Thông tin bệnh nhân</b></div>
                  <ul>
                    <li><b>Họ tên:</b> {selectedAppointment?.patient.full_name}</li>
                    <li><b>Ngày sinh:</b> {moment(selectedAppointment?.patient.birthday).format('DD-MM-YYYY')}</li>
                    <li><b>Giới tính:</b> {selectedAppointment?.patient.gender}</li>
                    <li><b>Địa chỉ</b> {`${selectedAppointment?.patient.wards.name} - ${selectedAppointment?.patient.district.name} - ${selectedAppointment?.patient.province.name}`}</li>
                  </ul>
                  <hr />
                  <br />
                  <table className="w-[80%]">
                    <tr>
                      <th className="w-[60%]">Tên dịch vụ</th>
                      <th align="center">Giá</th>
                    </tr>
                    {selectedAppointment?.used_type_services.map((s, index) => {
                      return (
                        <tr key={s?.id}>
                          <td className="py-1">{s.type_service.name}</td>
                          <td align="center">
                            {s.price.toLocaleString()} vnđ
                          </td>
                        </tr>
                      )
                    })}
                    <tr>
                      <td align="right"><b>Tổng:</b></td>
                      <td align="center">{selectedAppointment?.used_type_services.reduce((prev, cur) => cur.price + prev, 0).toLocaleString()} vnđ</td>
                    </tr>
                  </table>
                </Col>
                <Col span={12}>
                  <div className="mb-2 text-xl"><b>Thông tin khám bệnh</b></div>
                  <FormGlobal>
                    <FormItemGlobal name={'insurance'} label={'Có BHYT không?'} required>
                      <RadioGroupFormikGlobal name="insurance" options={[{ label: 'Có', value: true }, { label: 'Không', value: false }]} />
                    </FormItemGlobal>
                    <ul className="mt-[-10px]">
                      {/* {
                        getFieldProps('insurance').value && <li className="flex items-center mb-4">
                          <b className="mr-3">Mã BHYT:</b>
                          {
                            !selectedAppointment?.patient.BHYT ? <FormItemGlobal name={'BHYT'} className="w-[70%] !mb-0">
                              <InputFormikGlobal name="BHYT" className="!min-h-[20px] !h-[30px]" />
                            </FormItemGlobal>
                              : selectedAppointment?.patient.BHYT
                          }
                        </li>
                      } */}

                      {/* <li><b>Bác sĩ khám:</b></li>

                      <FormItemGlobal name={`doctor_id`} className="!mb-[-4px]">
                        <SelectFormikGlobal name={`doctor_id`} options={dataDoctor} disabled />
                      </FormItemGlobal> */}

                    </ul>
                    {/* <table className="w-full mt-[-10px]">
                      <tr>
                        <th className="w-[40%]">
                          Tên dịch vụ
                        </th>
                        <th>
                          Bác sĩ khám
                        </th>
                      </tr>
                     
                    </table> */}
                  </FormGlobal>
                </Col>
              </Row>

            </>
          </ModalGlobal>
        );
      }}
    </Formik>
  );
}
