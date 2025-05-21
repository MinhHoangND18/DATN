import { useEffect, useMemo, useRef, useState } from "react";
import { Formik, FormikProps } from "formik";
import { Col, Row } from "antd";
import ModalGlobal from "..";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Notification from "@/components/Notification";
import FormGlobal, {
  FormItemGlobal,
  InputFormikGlobal,
  InputNumberFormikGlobal,
  RadioGroupFormikGlobal,
  SelectFormikGlobal,
  TextAreaFormikGlobal,
} from "@/components/FormGlobal";
import ApiCategory from "@/api/ApiCategory";

interface IModalCreateEdit {
  isOpenModal: boolean;
  handleCloseModal: () => void;
  selected?: any
}

export default function ModalCreateEditCategory({
  isOpenModal,
  handleCloseModal,
  selected,
}: IModalCreateEdit) {

  const innerRef = useRef<FormikProps<any>>(null);
  const queryClient = useQueryClient();

  const initialValues: any = useMemo(() => {
    return {
      name: selected?.name ?? "",
    };
  }, [selected]);

  const onCancel = () => {
    handleCloseModal();
    innerRef.current?.resetForm();
  };

  const createMutation = useMutation(ApiCategory.create);
  const updateMutation = useMutation(ApiCategory.update);
  const handleSubmit = async (values: any) => {

    if (selected) {
      updateMutation.mutate(
        { id: +selected.id, data: values },
        {
          onSuccess: () => {
            Notification.notificationSuccess("Thành công");
            queryClient.refetchQueries(["get_categories"]);
            onCancel();
          },
        }
      );
      return;
    }
    createMutation.mutate(values, {
      onSuccess: () => {
        Notification.notificationSuccess("Thành công");
        queryClient.refetchQueries(["get_categories"]);
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
    // validationSchema={Validation}
    >
      {({ handleSubmit, setFieldValue }): JSX.Element => {

        return (
          <ModalGlobal
            open={isOpenModal}
            title={selected ? "Sửa thông tin loại sản phẩm" : "Tạo loại sản phẩm"}
            onOk={handleSubmit}
            onCancel={onCancel}
            isLoadingOK={
              createMutation.isLoading || updateMutation.isLoading
            }
            width={500}
          >
            <FormGlobal>
              <Row gutter={[16, 0]}>
                <Col span={24}>
                  <FormItemGlobal name="name" label="Tên loại sản phẩm" required>
                    <InputFormikGlobal name="name" placeholder="Tên loại sản phẩm" />
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
