import "./index.scss";
import { useMemo, useRef } from "react";
import { FieldArray, Formik, FormikProps } from "formik";
import { Space } from "antd";
import ModalGlobal from "..";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Notification from "@/components/Notification";
import FormGlobal, {
  FormItemGlobal,
  InputFormikGlobal,
} from "@/components/FormGlobal";
import ApiRoom, { IRoomRes } from "@/api/ApiRoom";

interface IModalUpdateRoomName {
  isOpenModal: boolean;
  handleCloseModal: () => void;
  selectedRoom: IRoomRes;
}

interface IInitialValues {
  roomName: { id?: string; name: string }[];
}

export default function ModalUpdateRoomName({
  isOpenModal,
  handleCloseModal,
  selectedRoom,
}: IModalUpdateRoomName) {
  const innerRef = useRef<FormikProps<IInitialValues>>(null);
  const queryClient = useQueryClient();

  const initialValues: IInitialValues = useMemo(() => {
    return {
      roomName:
        selectedRoom.rooms?.map((item) => ({
          name: item.name,
          id: item.id,
        })) ?? [],
    };
  }, [selectedRoom]);

  const onCancel = () => {
    handleCloseModal();
    innerRef.current?.resetForm();
  };

  const updateRoomNameMutation = useMutation(ApiRoom.updateRoomName);
  const handleSubmit = async (values: IInitialValues) => {
    updateRoomNameMutation.mutate(
      { id: selectedRoom.id, body: values.roomName },
      {
        onSuccess: () => {
          Notification.notificationSuccess("Thành công");
          queryClient.refetchQueries(["get_rooms"]);
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
            title={"Cập nhật tên phòng con sử dụng"}
            onOk={handleSubmit}
            onCancel={onCancel}
            isLoadingOK={updateRoomNameMutation.isLoading}
            width={500}
          >
            <FormGlobal>
              <FieldArray name="roomName">
                {({ remove, push }) => (
                  <>
                    <div className="flex items-center mb-[8px]">
                      <span className="text-base mr-2">Thêm tên phòng con</span>
                      <button
                        className="px-2 py-[1px] text-white bg-blue-600"
                        type="button"
                        onClick={() => push({ id: null, name: "501" })}
                      >
                        +
                      </button>
                    </div>
                    {values.roomName?.map((_, index) => (
                      <FormItemGlobal
                        key={index}
                        className="room-name-form-item"
                        name={`roomName.${index}.name`}
                      >
                        <Space>
                          <InputFormikGlobal
                            name={`roomName.${index}.name`}
                            min={2}
                          />
                          <button
                            className="px-2 py-0.5 text-white bg-blue-600"
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
