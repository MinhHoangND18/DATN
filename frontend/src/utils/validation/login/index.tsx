import * as Yup from "yup";

const LoginValidation = Yup.object().shape({
  email: Yup.string().required("Email không được để trống"),
  password: Yup.string().required("Mật khẩu không được để trống"),
});

const RegisterValidation = Yup.object().shape({
  username: Yup.string().required("Tên tài khoản không được để trống"),
  email: Yup.string()
    .email("Email không đúng định dạng")
    .required("Email không được để trống"),
  password: Yup.string().required("Mật khẩu không được để trống"),
  ["re-password"]: Yup.string()
    .oneOf([Yup.ref("password")], "Mật khẩu không trùng khớp")
    .required("Không được để trống"),
});

export { LoginValidation, RegisterValidation };