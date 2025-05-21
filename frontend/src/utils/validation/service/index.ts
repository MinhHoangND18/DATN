import * as Yup from 'yup';

const ServiceValidation = () =>
  Yup.object().shape({
    name: Yup.string().trim().required('Tên dịch vụ không được để trống'),
    price: Yup.string().trim().required('Giá dịch vụ không được để trống'),
    unit: Yup.string().trim().required('Đơn vị không được để trống'),
    type_service_id: Yup.number().required(),
  });

const TypeServiceValidation = () =>
  Yup.object().shape({
    name: Yup.string().trim().required('Tên dịch vụ không được để trống'),
  });

export { ServiceValidation, TypeServiceValidation };
