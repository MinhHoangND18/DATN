import { useEffect, useMemo, useRef, useState } from "react";
import { Formik, FormikProps } from "formik";
import { Col, Row } from "antd";
import ModalGlobal from "..";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Notification from "@/components/Notification";
import FormGlobal, {
  DatePickerFormikGlobal,
  FormItemGlobal,
  InputFormikGlobal,
  InputPasswordFormikGlobal,
  RadioGroupFormikGlobal,
  SelectFormikGlobal,
} from "@/components/FormGlobal";
import ApiUser, { ICreateUser, IUser } from "@/api/ApiUser";
import { UserValidation } from "@/utils/validation/user";
import { ERole } from "@/lazyLoading";
import ApiClinic from "@/api/ApiClinic";
import ApiDepartment from "@/api/ApiDepartment";
import moment from "moment";
import ApiPatient, { IPatient } from "@/api/ApiPatient";
import axios from "axios";

interface IModalCreateEditPatient {
  isOpenModal: boolean;
  handleCloseModal: () => void;
  patient?: IPatient;
}

export default function ModalCreateEditPatient({
  isOpenModal,
  handleCloseModal,
  patient,
}: IModalCreateEditPatient) {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');

  const innerRef = useRef<FormikProps<any>>(null);
  const queryClient = useQueryClient();

  const { data: dataDepartment } = useQuery(['data_department'], () => ApiDepartment.getAll())
  const { data: dataClinic } = useQuery(['data_clinic'], () => ApiClinic.getAll())

  const initialValues: any = useMemo(() => {
    return {
      full_name: patient?.full_name ?? '',
      phone: patient?.phone ?? '',
      gender: patient?.gender ?? 'Nam',
      province_id: patient?.province.id ?? '',
      district_id: patient?.district.id ?? '',
      ward_id: patient?.wards.id ?? '',
      birthday: moment(patient?.birthday),
    };
  }, [patient]);

  const onCancel = () => {
    handleCloseModal();
    innerRef.current?.resetForm();
  };
  useEffect(() => {
    patient?.province.id && setSelectedProvince(patient?.province.id)
    patient?.district.id && setSelectedDistrict(patient.district.id)
  }, [patient])

  // Lấy danh sách tỉnh/thành từ API khi component mount
  const { refetch: provinceRF } = useQuery(['provinces'],
    () => axios.get('https://vapi.vnappmob.com/api/province/')
      .then((response) => {
        setProvinces(response.data.results.map((v: any) => ({ label: v.province_name, value: v.province_id })))
        return response.data.results
      })
      .catch((error) => console.error('Error fetching provinces:', error)),
    { enabled: false }
  )

  const { refetch: districtRF } = useQuery(['districts', selectedProvince],
    () => axios.get(`https://vapi.vnappmob.com/api/province/district/${selectedProvince}`)
      .then((response) => {
        setDistricts(response.data.results.map((v: any) => ({ label: v.district_name, value: v.district_id })))
        return response.data.results;
      })
      .catch((error) => console.error('Error fetching districts:', error)),
    { enabled: false }
  )

  const { refetch: wardRF } = useQuery(['wards', selectedDistrict],
    () => axios.get(`https://vapi.vnappmob.com/api/province/ward/${selectedDistrict}`)
      .then((response) => {
        setWards(response.data.results.map((v: any) => ({ label: v.ward_name, value: v.ward_id })))
        return response.data.results

      })
      .catch((error) => console.error('Error fetching wards:', error)),
    { enabled: false }
  )

  useEffect(() => {
    provinceRF()
  }, []);

  // Lấy danh sách quận/huyện khi người dùng chọn tỉnh/thành
  useEffect(() => {
    if (selectedProvince) {
      districtRF()
    }
  }, [selectedProvince]);

  // Lấy danh sách phường/xã khi người dùng chọn quận/huyện
  useEffect(() => {
    if (selectedDistrict) {
      wardRF()
    }
  }, [selectedDistrict]);

  const createUserMutation = useMutation(ApiUser.createUser);
  const updateUserMutation = useMutation(ApiPatient.update);

  const handleSubmit = async (values: any) => {
    if (patient?.id) {
      updateUserMutation.mutate(
        { id: patient.id, data: values },
        {
          onSuccess: () => {
            Notification.notificationSuccess("Thành công");
            queryClient.refetchQueries(["get_patients"]);
            onCancel();
          },
        }
      );
      return;
    }

    // createUserMutation.mutate(values as ICreateUser, {
    //   onSuccess: () => {
    //     Notification.notificationSuccess("Thêm bệnh nhân thành công");
    //     queryClient.refetchQueries(["get_users"]);
    //     onCancel();
    //   },
    // });
  };

  return (
    <Formik
      innerRef={innerRef}
      initialValues={initialValues}
      enableReinitialize
      onSubmit={handleSubmit}
    // validationSchema={UserValidation}
    >
      {({ handleSubmit, setFieldValue, }): JSX.Element => {
        return (
          <ModalGlobal
            open={isOpenModal}
            title={patient ? "Sửa thông tin bệnh nhân" : "Tạo bệnh nhân"}
            onOk={handleSubmit}
            onCancel={onCancel}
            isLoadingOK={
              createUserMutation.isLoading || updateUserMutation.isLoading
            }
            width={1000}
          >
            <FormGlobal>
              <Row gutter={[16, 0]}>
                <Col span={12}>
                  <FormItemGlobal
                    name="full_name"
                    label="Tên bệnh nhân"
                    required
                  >
                    <InputFormikGlobal
                      name="full_name"
                      placeholder="Tên bệnh nhân"
                    />
                  </FormItemGlobal>

                  <FormItemGlobal
                    name={'phone'}
                    label='Số điện thoại'
                    required
                  >
                    <InputFormikGlobal name="phone" />
                  </FormItemGlobal>

                  {/* <FormItemGlobal name="email" label="Email" required>
                    <InputFormikGlobal name="email" placeholder="email" />
                  </FormItemGlobal> */}



                  <FormItemGlobal name={'birthday'} label={'Ngày sinh'} required>
                    <DatePickerFormikGlobal name="birthday"
                      disabledDate={(current) => {
                        // Disable all future dates
                        return current && current > moment().endOf('day');
                      }} />
                  </FormItemGlobal>

                  <FormItemGlobal name={'gender'} label={'Giới tính'} required>
                    <RadioGroupFormikGlobal
                      name="gender"
                      options={[
                        {
                          label: 'Nam',
                          value: 'Nam'
                        },
                        {
                          label: 'Nữ',
                          value: 'Nữ'
                        }
                      ]}

                    />
                  </FormItemGlobal>
                </Col>

                <Col span={12}>
                  <FormItemGlobal name={'province_id'} label={'Tỉnh/TP'} required>
                    <SelectFormikGlobal name="province_id" options={provinces} onChange={(value) => { setSelectedProvince(value); setFieldValue('district_id', ''); setFieldValue('ward_id', '') }} />
                  </FormItemGlobal>

                  <FormItemGlobal name={'district_id'} label={'Huyện/Thị xã'} required>
                    <SelectFormikGlobal name="district_id" options={districts} onChange={(value) => { setSelectedDistrict(value); setFieldValue('ward_id', '') }} ></SelectFormikGlobal>
                  </FormItemGlobal>

                  <FormItemGlobal name={'ward_id'} label={'Xã/Phường'} required>
                    <SelectFormikGlobal name="ward_id" options={wards} onChange={(value) => { setSelectedWard(value) }} ></SelectFormikGlobal>
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
