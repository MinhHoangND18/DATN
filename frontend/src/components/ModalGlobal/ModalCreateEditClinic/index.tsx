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
} from "@/components/FormGlobal"
import ApiClinic, { IClinic, ICreateClinic } from "@/api/ApiClinic";

interface IModalCreateEditClinic {
    isOpenModal: boolean;
    handleCloseModal: () => void;
    selectedClinic?: IClinic;
}

export default function ModalCreateEditClinic({
    isOpenModal,
    handleCloseModal,
    selectedClinic,
}: IModalCreateEditClinic) {

    const innerRef = useRef<FormikProps<ICreateClinic>>(null);
    const queryClient = useQueryClient();

    const initialValues: ICreateClinic = useMemo(() => {
        return {
            name: selectedClinic?.name ?? "",
            description: selectedClinic?.description ?? "",
        };
    }, [selectedClinic]);

    const onCancel = () => {
        handleCloseModal();
        innerRef.current?.resetForm();
    };

    const createClinicMutation = useMutation(ApiClinic.create);
    const updateClinicMutation = useMutation(ApiClinic.update);

    const handleSubmit = async (values: ICreateClinic) => {

        if (selectedClinic) {
            updateClinicMutation.mutate({ id: selectedClinic.id, data: values }, {
                onSuccess: () => {
                    Notification.notificationSuccess("Thành công");
                    queryClient.refetchQueries(["get_clinics"]);
                    onCancel();
                },
            });
            return;
        }
        createClinicMutation.mutate(values, {
            onSuccess: () => {
                Notification.notificationSuccess("Thành công");
                queryClient.refetchQueries(["get_clinics"]);
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
                            selectedClinic ? "Sửa thông tin buồng khám" : "Tạo buồng khám"
                        }
                        onOk={handleSubmit}
                        onCancel={onCancel}
                        isLoadingOK={
                            createClinicMutation.isLoading ||
                            updateClinicMutation.isLoading
                        }
                        width={600}
                    >
                        <FormGlobal>
                            <Row gutter={[8, 0]}>
                                <Col span={24}>
                                    <FormItemGlobal name="name" label="Tên buồng khám" required>
                                        <InputFormikGlobal
                                            name="name"
                                            placeholder="Tên buồng khám"
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
