import * as Yup from 'yup';

const UserValidation = () =>
  Yup.object().shape({
    username: Yup.string().trim().required('Tên không được để trống'),
    email: Yup.string().trim().required('email không được để trống'),
    role: Yup.string().trim().required('Chức vụ không được để trống'),
    password: Yup.string().trim().required('Mật khẩu không được để trống'),
  });

export { UserValidation };
