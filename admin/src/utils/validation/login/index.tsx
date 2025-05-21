import * as Yup from "yup";

const LoginValidation = Yup.object().shape({
  username: Yup.string().required("Tên đăng nhập không được để trống"),
  password: Yup.string().required("Mật khẩu không được để trống"),
});

export { LoginValidation };
