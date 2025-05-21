import { useMemo, useRef } from "react";
import { Formik, FormikProps } from "formik";
import { Col, Row } from "antd";
import ModalGlobal from "..";
import ApiService, { ICreateTypeServiceBody, ITypeService } from "@/api/ApiService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Notification from "@/components/Notification";
import FormGlobal, {
  FormItemGlobal,
  InputFormikGlobal,
  InputNumberFormikGlobal,
  RadioGroupFormikGlobal,
  TextAreaFormikGlobal,
} from "@/components/FormGlobal";
import { TypeServiceValidation } from "@/utils/validation/service";

interface IModalCreateEditTypeService {
  isOpenModal: boolean;
  handleCloseModal: () => void;
  selectedService?: ITypeService;
}

export default function ModalCreateEditTypeService({
  isOpenModal,
  handleCloseModal,
  selectedService,
}: IModalCreateEditTypeService) {

  const innerRef = useRef<FormikProps<ICreateTypeServiceBody>>(null);
  const queryClient = useQueryClient();

  const initialValues: ICreateTypeServiceBody = useMemo(() => {
    return {
      name: selectedService?.name ?? "",
      description: selectedService?.description ?? "",
      price: selectedService?.price ?? 1000,
    };
  }, [selectedService]);

  const onCancel = () => {
    handleCloseModal();
    innerRef.current?.resetForm();
  };

  const createServiceMutation = useMutation(ApiService.createTypeService);
  const updateServiceMutation = useMutation(ApiService.updateTypeService);
  const handleSubmit = async (values: ICreateTypeServiceBody) => {

    if (selectedService) {
      updateServiceMutation.mutate(
        { id: +selectedService.id, data: values },
        {
          onSuccess: () => {
            Notification.notificationSuccess("Thành công");
            queryClient.refetchQueries(["get_type_services"]);
            onCancel();
          },
        }
      );
      return;
    }
    createServiceMutation.mutate(values, {
      onSuccess: () => {
        Notification.notificationSuccess("Thành công");
        queryClient.refetchQueries(["get_type_services"]);
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
      validationSchema={TypeServiceValidation}
    >
      {({ handleSubmit, setFieldValue }): JSX.Element => {

        return (
          <ModalGlobal
            open={isOpenModal}
            title={selectedService ? "Sửa thông tin loại dịch vụ" : "Tạo loại dịch vụ"}
            onOk={handleSubmit}
            onCancel={onCancel}
            isLoadingOK={
              createServiceMutation.isLoading || updateServiceMutation.isLoading
            }
            width={500}
          >
            <FormGlobal>
              <Row gutter={[16, 0]}>
                <Col span={24}>
                  <FormItemGlobal name="name" label="Tên dịch vụ" required>
                    <InputFormikGlobal name="name" placeholder="Tên dịch vụ" />
                  </FormItemGlobal>
                  <FormItemGlobal name="price" label="Giá dịch vụ" required>
                    <InputNumberFormikGlobal name="price" min={1000} max={900000000} />
                  </FormItemGlobal>
                  {/* <FormItemGlobal name={'insurance'} label="BHYT hỗ trợ">
                    <RadioGroupFormikGlobal name="insurance" options={[{
                      label: 'Có', value: true
                    },

                    {
                      label: 'Không', value: false
                    }]}></RadioGroupFormikGlobal>
                  </FormItemGlobal> */}
                  <FormItemGlobal name="description" label="Mô tả">
                    <TextAreaFormikGlobal name="description" placeholder="Mô tả" resize="block" />
                  </FormItemGlobal>
                </Col>
              </Row>
            </FormGlobal>
          </ModalGlobal>
        );
      }}
    </Formik >
  );
}
