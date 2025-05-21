import * as Yup from "yup";

const RoomValidation = (type: "create" | "edit") =>
  Yup.object().shape({
    name: Yup.string().trim().required("Tên phòng không được để trống"),
    files:
      type === "create"
        ? Yup.array()
            .required("Ảnh minh họa không được để trống")
            .min(1, "Ảnh minh họa không được để trống")
        : Yup.array(),
  });

export { RoomValidation };
