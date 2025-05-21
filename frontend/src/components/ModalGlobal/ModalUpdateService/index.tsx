import "./index.scss";
import { useMemo, useRef } from "react";
import { FieldArray, Formik, FormikProps } from "formik";
import { Space } from "antd";
import ModalGlobal from "..";
import ApiService from "@/api/ApiService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Notification from "@/components/Notification";
import FormGlobal, {
  FormItemGlobal,
  InputNumberFormikGlobal,
  SelectFormikGlobal,
} from "@/components/FormGlobal";
import ApiBookRoom, { IBookingRes } from "@/api/ApiBookRoom";

interface IModalUpdateService {
  isOpenModal: boolean;
  handleCloseModal: () => void;
  selectedBooking: IBookingRes;
}

interface IInitialValues {
  service_quantity: { service_id?: number; quantity?: number }[];
}

export default function ModalUpdateService({
  isOpenModal,
  handleCloseModal,
  selectedBooking,
}: IModalUpdateService) {
  const innerRef = useRef<FormikProps<IInitialValues>>(null);
  const queryClient = useQueryClient();

  const initialValues: IInitialValues = useMemo(() => {
    return {
      service_quantity: [],
    };
  }, [selectedBooking]);

  const { data: services } = useQuery(["get_services_active"], () =>
    ApiService.getServicesActive()
  );
  const convertServicesValue = useMemo(() => {
    return services?.results.map((item) => ({
      label: item.name,
      value: item.id,
    }));
  }, [services]);

  const onCancel = () => {
    handleCloseModal();
    innerRef.current?.resetForm();
  };

  const updateServiceMutation = useMutation(ApiBookRoom.updateService);
  const handleSubmit = async (values: IInitialValues) => {
    updateServiceMutation.mutate(
      { id: selectedBooking.id, body: values.service_quantity },
      {
        onSuccess: () => {
          Notification.notificationSuccess("Thành công");
          queryClient.refetchQueries(["get_bookings"]);
          onCancel();
        },
      }
    );
  };

  return (
    <Formik
      innerRef={innerRef}
      initialValues={initialValues}
      enableReinitialize
      onSubmit={handleSubmit}
    >
      {({ handleSubmit, values }): JSX.Element => {
        return (
          <ModalGlobal
            open={isOpenModal}
            title={"Cập nhật dịch vụ sử dụng"}
            onOk={handleSubmit}
            onCancel={onCancel}
            isLoadingOK={updateServiceMutation.isLoading}
            width={500}
          >
            <FormGlobal>
              <FieldArray name="service_quantity">
                {({ remove, push }) => (
                  <>
                    <div className="flex items-center mb-[8px]">
                      <span className="text-base mr-2">Dịch vụ - Số lượng</span>
                      <button
                        className="px-2 py-[1px] text-white bg-blue-600"
                        type="button"
                        onClick={() =>
                          push({ service_id: undefined, quantity: 1 })
                        }
                      >
                        +
                      </button>
                    </div>
                    {values.service_quantity?.map((_, index) => (
                      <FormItemGlobal
                        key={index}
                        className="service-quantity-form-item"
                        name={`service_quantity.${index}.service`}
                      >
                        <Space>
                          <SelectFormikGlobal
                            name={`service_quantity.${index}.service_id`}
                            allowClear={false}
                            options={convertServicesValue}
                          />
                          <InputNumberFormikGlobal
                            name={`service_quantity.${index}.quantity`}
                            min={1}
                          />
                          <button
                            className="px-4 py-2 text-white bg-blue-600"
                            type="button"
                            onClick={() => remove(index)}
                          >
                            x
                          </button>
                        </Space>
                      </FormItemGlobal>
                    ))}
                  </>
                )}
              </FieldArray>
            </FormGlobal>
          </ModalGlobal>
        );
      }}
    </Formik>
  );
}
