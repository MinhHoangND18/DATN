import { useEffect, useMemo, useRef, useState } from "react";
import { Formik, FormikProps } from "formik";
import { Col, Row } from "antd";
import ModalGlobal from "..";
import ApiPromotion, { IPromotionRes } from "@/api/ApiPromotion";
import Upload, { RcFile, UploadChangeParam, UploadFile } from "antd/lib/upload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Notification from "@/components/Notification";
import FormGlobal, {
    DatePickerFormikGlobal,
    FormItemGlobal,
    InputFormikGlobal,
    InputNumberFormikGlobal,
    TextAreaFormikGlobal,
} from "@/components/FormGlobal";
import moment, { Moment } from "moment";
import { PromotionValidation } from "@/utils/validation/promotion";
import ApiDepartment, { ICreateDepartment, IDepartment } from "@/api/ApiDepartment";

interface ICreatePromotionBody {
    name: string;
    description: string;
    start_date: Moment;
    end_date: Moment;
    discount: number;
    quantity: number;
    file?: RcFile[];
}

interface IModalCreateEditDepartment {
    isOpenModal: boolean;
    handleCloseModal: () => void;
    selectedDepartment?: IDepartment;
}

export default function ModalCreateEditDepartment({
    isOpenModal,
    handleCloseModal,
    selectedDepartment,
}: IModalCreateEditDepartment) {

    const innerRef = useRef<FormikProps<ICreateDepartment>>(null);
    const queryClient = useQueryClient();

    const initialValues: ICreateDepartment = useMemo(() => {
        return {
            name: selectedDepartment?.name ?? "",
            description: selectedDepartment?.description ?? "",
        };
    }, [selectedDepartment]);

    const onCancel = () => {
        handleCloseModal();
        innerRef.current?.resetForm();
    };

    const createDepartmentMutation = useMutation(ApiDepartment.create);
    const updateDepartmentMutation = useMutation(ApiDepartment.update);
    const handleSubmit = async (values: ICreateDepartment) => {

        if (selectedDepartment) {
            updateDepartmentMutation.mutate({ id: selectedDepartment.id, data: values }, {
                onSuccess: () => {
                    Notification.notificationSuccess("Thành công");
                    queryClient.refetchQueries(["get_departments"]);
                    onCancel();
                },
            });
            return;
        }
        createDepartmentMutation.mutate(values, {
            onSuccess: () => {
                Notification.notificationSuccess("Thành công");
                queryClient.refetchQueries(["get_departments"]);
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
        // validationSchema={}
        >
            {({ handleSubmit }): JSX.Element => {

                return (
                    <ModalGlobal
                        open={isOpenModal}
                        title={
                            selectedDepartment ? "Sửa thông tin phòng ban" : "Tạo phòng ban"
                        }
                        onOk={handleSubmit}
                        onCancel={onCancel}
                        isLoadingOK={
                            createDepartmentMutation.isLoading ||
                            updateDepartmentMutation.isLoading
                        }
                        width={600}
                    >
                        <FormGlobal>
                            <Row gutter={[8, 0]}>
                                <Col span={24}>
                                    <FormItemGlobal name="name" label="Tên phòng ban" required>
                                        <InputFormikGlobal
                                            name="name"
                                            placeholder="Tên phòng ban"
                                        />
                                    </FormItemGlobal>


                                    <FormItemGlobal name="description" label="Mô tả">
                                        <TextAreaFormikGlobal name="description" placeholder="Mô tả" />
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
