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
    TextAreaFormikGlobal,
} from "@/components/FormGlobal";
import ApiAppointment, { IAppointment, ICreateAppointment } from "@/api/ApiAppointment";
import moment from "moment";
import ApiService from "@/api/ApiService";

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
        };
    }, [selectedAppointment]);



    const onCancel = () => {
        handleCloseModal();
        innerRef.current?.resetForm();
    };

    const { data: dataTypeService } = useQuery(['data_type_services'], () => ApiService.getAllTypeService())

    const updateAppointmentMutation = useMutation(ApiAppointment.updateFuture);

    const handleSubmit = async (values: Record<string, string>) => {
        console.log(values);

        if (selectedAppointment) {
            updateAppointmentMutation.mutate(
                { id: selectedAppointment.id, data: { ...values } },
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
                        title={"Chuyển lịch hẹn sang khám chữa bệnh"}
                        onOk={handleSubmit}
                        onCancel={onCancel}
                        isLoadingOK={
                            updateAppointmentMutation.isLoading
                        }
                        width={800}
                        className="!overflow-hidden !max-h-max"
                    >
                        <FormGlobal>
                            <div className="mb-2 text-xl"><b>Thông tin khám bệnh</b></div>
                            <Row gutter={33}>
                                <Col span={12}>


                                    {/* <FormItemGlobal name={'insurance'} label={'Có BHYT không?'} required>
                                        <RadioGroupFormikGlobal name="insurance" options={[{ label: 'Có', value: true }, { label: 'Không', value: false }]} />
                                    </FormItemGlobal>
                                    <ul className="mt-[-10px]">
                                        {
                                            getFieldProps('insurance').value && <li className="flex items-center mb-4">
                                                <b className="mr-3">Mã BHYT:</b>
                                                {
                                                    !selectedAppointment?.patient.BHYT ? <FormItemGlobal name={'BHYT'} className="w-[70%] !mb-0">
                                                        <InputFormikGlobal name="BHYT" className="!min-h-[20px] !h-[30px]" />
                                                    </FormItemGlobal>
                                                        : selectedAppointment?.patient.BHYT
                                                }
                                            </li>
                                        }

                                    </ul> */}


                                </Col>
                                <Col span={24}>
                                    <FormItemGlobal name={'type_service_id'} label={'Dịch vụ khám'} required>
                                        <SelectFormikGlobal mode="multiple" name="type_service_id"
                                            options={dataTypeService?.map(v => ({
                                                label: v.name,
                                                value: v.id
                                            }))} ></SelectFormikGlobal>
                                    </FormItemGlobal>
                                    <FormItemGlobal name="symptoms" label="Mô tả triệu chứng" required>
                                        <TextAreaFormikGlobal name="symptoms" placeholder="Mô tả" resize="block" />
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
