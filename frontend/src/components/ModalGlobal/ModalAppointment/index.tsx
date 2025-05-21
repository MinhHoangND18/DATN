import { useMemo, useRef } from "react";
import { Formik, FormikProps } from "formik";
import { Input, Button, Form, Row, Col, DatePicker, Select, Pagination, Tabs, Descriptions, TabsProps, Tag } from "antd";
import ModalGlobal from "..";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Notification from "@/components/Notification";
import ApiBookRoom from "@/api/ApiBookRoom";
import moment from "moment";
import { AppointmentStatus, IAppointment } from "@/api/ApiAppointment";
import { IPatient } from "@/api/ApiPatient";
import KetQuaKham from "./KetQuaKham";
import DieuTriCanThiep from "./DieuTriCanThiep";
import DonThuoc from "./DonThuoc";
import HoaDon from "./HoaDon";
import { useGetUserRedux } from "@/redux/slices/UserSlice";
import { ERole } from "@/lazyLoading";

interface IModalAppointment {
    isOpenModal: boolean;
    handleCloseModal: () => void;
    appointment?: IAppointment;
    patient?: IPatient,
    refetch: any,
    disable: boolean
}

export default function ModalAppointment({
    isOpenModal,
    handleCloseModal,
    appointment,
    patient,
    refetch,
    disable
}: IModalAppointment) {
    const innerRef = useRef<FormikProps<any>>(null);
    const queryClient = useQueryClient();

    const initialValues: any = useMemo(() => {
        return {
            // appointmentNumber: appointment?.id || '',
            // examinationDate: moment(appointment?.appointment_date) || '',
            // doctor: appointment?.doctor?.name || '',
            // reExaminationDate: appointment?.re_examination_date ? moment(appointment?.re_examination_date) : null,
            // description: appointment?.description || '',
            // diagnosis: appointment?.diagnosis || '',
            // notes: appointment?.notes || '',
            // treatment: appointment?.treatment || '',
        };
    }, [isOpenModal, appointment]);

    const onCancel = () => {
        handleCloseModal();
        innerRef.current?.resetForm();
    };

    const createBookingMutation = useMutation(ApiBookRoom.createBooking);
    const handleSubmit = async (values: any) => {
        const newValues = {
            ...values,
            checkin: moment(values.checkin).format("YYYY-MM-DD"),
            checkout: moment(values.checkout).format("YYYY-MM-DD"),
        };

        createBookingMutation.mutate(newValues, {
            onSuccess: () => {
                Notification.notificationSuccess("Thành công");
                queryClient.refetchQueries(["get_bookings"]);
                onCancel();
            },
        });
    };

    const user = useGetUserRedux()


    const items: TabsProps['items'] = [
        { label: 'Kết quả khám bệnh', key: 'item-1', children: <>{appointment && patient && <KetQuaKham patient={patient} appointment={appointment} refetch={refetch} isDisable={disable} />}</> }, // remember to pass the key prop
        { disabled: !appointment?.diagnosis, label: 'Điều trị can thiệp', key: 'item-2', children: <>{appointment && patient && <DieuTriCanThiep patient={patient} appointment={appointment} refetch={refetch} isDisable={disable} />}</> },
        { disabled: !appointment?.diagnosis, label: 'Đơn thuốc', key: 'item-3', children: <>{appointment && patient && <DonThuoc patient={patient} appointment={appointment} isDisable={disable} />}</> },
        [ERole.NHAN_VIEN_TIEP_DON, ERole.QUAN_LY, ERole.SUPER_ADMIN].includes(user.role as ERole) && { disabled: !appointment?.diagnosis, label: 'Hóa đơn', key: 'item-4', children: <>{appointment && patient && <HoaDon patient={patient} appointment={appointment} refetch={refetch} isDisable={disable} />}</> }
    ].filter(Boolean) as TabsProps['items'];

    const renderStatus = (status: AppointmentStatus = AppointmentStatus.Pending) => {
        switch (status) {
            case AppointmentStatus.Doing: return 'green'
            case AppointmentStatus.Finish: return 'blue'
            case AppointmentStatus.Waitting: return 'gray'
            case AppointmentStatus.Waitting_Payment: return 'red'
        }

        return 'yellow'
    }

    return (
        <Formik
            innerRef={innerRef}
            initialValues={initialValues}
            enableReinitialize
            onSubmit={handleSubmit}
        >
            {({ handleSubmit, values, setFieldValue }): JSX.Element => {
                return (
                    <ModalGlobal
                        open={isOpenModal}
                        title={<div className="flex justify-center items-center">Phiếu Khám Bệnh <Tag color={renderStatus(appointment?.status)} className="!ml-4">{appointment?.status}</Tag></div>}
                        onOk={handleSubmit}
                        onCancel={onCancel}
                        isLoadingOK={createBookingMutation.isLoading}
                        width={1200}
                        footer={<></>}
                    >
                        <Tabs items={items} />
                    </ModalGlobal>
                );
            }}
        </Formik>
    );
}
