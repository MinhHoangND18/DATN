import * as Yup from "yup";

const BookingValidation = Yup.object().shape({
  username: Yup.string().required("Họ và tên không được để trống"),
  email: Yup.string().trim().required("Email không được để trống"),
  phone: Yup.string().trim().required("Số điện thoại không được để trống"),
  type_room_id: Yup.string().required("Phòng không được để trống"),
  quantity: Yup.string().required("Số lượng phòng không được để trống"),
});

export { BookingValidation };
