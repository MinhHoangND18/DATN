import { useEffect, useMemo, useRef, useState } from "react";
import { Formik, FormikProps } from "formik";
import { Col, Empty, Row, Spin } from "antd";
import ModalGlobal from "..";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Notification from "@/components/Notification";
import FormGlobal, {
  DatePickerFormikGlobal,
  FormItemGlobal,
  InputFormikGlobal,
  InputNumberFormikGlobal,
  RadioGroupFormikGlobal,
  SelectFormikGlobal,
  TextAreaFormikGlobal,
} from "@/components/FormGlobal";
import { ServiceValidation } from "@/utils/validation/service";
import ApiAppointment, { IAppointment, ICreateAppointmentNew } from "@/api/ApiAppointment";
import axios from "axios";
import ApiService from "@/api/ApiService";
import { InputSearchGlobal } from "@/components/AntdGlobal";
import ApiPatient, { IPatient } from "@/api/ApiPatient";
import moment from "moment";

interface IModalCreateEditAppointment {
  isOpenModal: boolean;
  handleCloseModal: () => void;
  selectedAppointment?: IAppointment;
}

export default function ModalCreateEditAppointment({
  isOpenModal,
  handleCloseModal,
  selectedAppointment,
}: IModalCreateEditAppointment) {
  const [searchValue, setSearchValue] = useState("");
  const [patient, setPatient] = useState<IPatient | null>(selectedAppointment?.patient ?? null)
  const innerRef = useRef<FormikProps<ICreateAppointmentNew>>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    selectedAppointment?.patient && setPatient(selectedAppointment?.patient)
  }, [selectedAppointment])

  const initialValues: any = useMemo(() => {
    return {
      full_name: patient?.full_name ?? '',
      phone: patient?.phone ?? '',
      gender: patient?.gender ?? 'Nam',
      province_id: patient?.province.id ?? '',
      district_id: patient?.district.id ?? '',
      ward_id: patient?.wards.id ?? '',
      birthday: moment(patient?.birthday),
      type_service_id: selectedAppointment?.used_type_services?.map(v => v.type_service.id) ?? [],
      // doctor_id: selectedAppointment?.doctor?.id ?? null,
      symptoms: selectedAppointment?.symptoms ?? ''
    };
  }, [patient, selectedAppointment]);

  const onCancel = () => {
    handleCloseModal();
    innerRef.current?.resetForm();
    setPatient(null)
  };

  const { data: dataTypeService } = useQuery(['data_type_services'], () => ApiService.getAllTypeService())

  const createAppointmentMutation = useMutation(ApiAppointment.create);
  const updateAppointMutation = useMutation(ApiAppointment.update);
  const handleSubmit = async (values: ICreateAppointmentNew) => {
    let dataSend: any = { ...values }
    if (patient?.id) {
      dataSend = {
        patient_id: patient.id,
        type_service_id: values.type_service_id,
        symptoms: values.symptoms
      }
    }


    if (selectedAppointment) {
      updateAppointMutation.mutate(
        { id: selectedAppointment?.id, data: { type_service_id: values.type_service_id, symptoms: values.symptoms } },
        {
          onSuccess: () => {
            Notification.notificationSuccess("Thành công");
            queryClient.refetchQueries(["get_appointments"]);
            onCancel();
          },
        }
      );
      return;
    }
    createAppointmentMutation.mutate(dataSend, {
      onSuccess: () => {
        Notification.notificationSuccess("Thành công");
        queryClient.refetchQueries(["get_appointments"]);
        queryClient.refetchQueries(['get_count'])
        onCancel();
      },
    });
  };

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');

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

  const { data: dataPatient, isLoading: searchLoading, refetch: searchRF } = useQuery(
    ['search_patient'],
    () => ApiPatient.search(searchValue),
    { enabled: false }
  )

  // const { data } = useQuery(['data_doctor'], () => ApiAppointment.getDoctor({}))

  // const dataDoctor = useMemo(() => {
  //   return data?.map((v) => ({ value: v.id, label: v.full_name }))
  // }, [data])

  return (
    <Formik
      innerRef={innerRef}
      initialValues={initialValues}
      enableReinitialize
      onSubmit={handleSubmit}
    // validationSchema={ServiceValidation}
    >
      {({ handleSubmit, setFieldValue }): JSX.Element => {

        return (
          <ModalGlobal
            open={isOpenModal}
            title={selectedAppointment ? "Sửa thông tin khám chữa bệnh" : "Tạo phiếu khám chữa bệnh"}
            onOk={handleSubmit}
            onCancel={onCancel}
            isLoadingOK={
              createAppointmentMutation.isLoading || updateAppointMutation.isLoading
            }
            width={1200}
          >
            <Row gutter={33}>
              <Col span={10}>
                <div className="mt-8">
                  <div className="text-center font-bold text-xl">Tìm kiếm bệnh nhân</div>
                  <InputSearchGlobal
                    onChange={(e) => setSearchValue(e.target.value.trim())}
                    onSearch={() => { searchRF() }}
                    placeholder="Nhập số điện thoại" />

                  {
                    searchValue && dataPatient?.length ?
                      <table className="w-full mt-4">
                        <tr>
                          <th>STT</th>
                          <th>Tên bệnh nhân</th>
                          <th>Số điện thoại</th>
                          <th>Giới tính</th>
                          <th>Ngày sinh</th>
                        </tr>
                        {dataPatient?.map((v, i) => {
                          return (
                            <tr key={v.id} className={`${patient?.id === v.id ? 'bg-gray-200' : ''} cursor-pointer`} onClick={() => setPatient(v)}>
                              <td>{i + 1}</td>
                              <td>{v.full_name}</td>
                              <td>{v.phone}</td>
                              <td>{v.gender}</td>
                              <td>{moment(v.birthday).format('DD-MM-YYYY')}</td>
                            </tr>
                          )
                        })}
                      </table>
                      : <div className="mt-8"><Empty /></div>
                  }
                </div>
              </Col>
              <Col span={14}>
                <FormGlobal>
                  <Row gutter={[16, 0]}>
                    <Col span={8}>
                      <FormItemGlobal name="full_name" label="Tên bệnh nhân" required >
                        <InputFormikGlobal name="full_name" placeholder="Tên bệnh nhân" disabled={Boolean(selectedAppointment?.id)} />
                      </FormItemGlobal>

                      <FormItemGlobal
                        name={'phone'}
                        label='Số điện thoại'
                        required
                      >
                        <InputFormikGlobal name="phone" disabled={Boolean(selectedAppointment?.id)} />
                      </FormItemGlobal>

                      <FormItemGlobal name={'birthday'} label='Ngày sinh' required>
                        <DatePickerFormikGlobal name="birthday" disabled={Boolean(selectedAppointment?.id)} disabledDate={(current) => {
                          // Disable all future dates
                          return current && current > moment().endOf('day');
                        }} />
                      </FormItemGlobal>

                      <FormItemGlobal name={'gender'} label={'Giới tính'} required>
                        <RadioGroupFormikGlobal
                          name="gender"
                          disabled={Boolean(selectedAppointment?.id)}
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
                    <Col span={8}>

                      <FormItemGlobal name={'province_id'} label={'Tỉnh/TP'} required>
                        <SelectFormikGlobal name="province_id" options={provinces} onChange={(value) => setSelectedProvince(value)} disabled={Boolean(selectedAppointment?.id)} />
                      </FormItemGlobal>

                      <FormItemGlobal name={'district_id'} label={'Huyện/Thị xã'} required>
                        <SelectFormikGlobal name="district_id" options={districts} onChange={(value) => setSelectedDistrict(value)} disabled={Boolean(selectedAppointment?.id)}></SelectFormikGlobal>
                      </FormItemGlobal>


                      <FormItemGlobal name={'ward_id'} label={'Xã/Phường'} required>
                        <SelectFormikGlobal name="ward_id" options={wards} onChange={(value) => setSelectedWard(value)} disabled={Boolean(selectedAppointment?.id)}></SelectFormikGlobal>
                      </FormItemGlobal>


                      {/* <FormItemGlobal name={'insurance'} label={'Có BHYT không?'} required>
                        <RadioGroupFormikGlobal name="insurance" options={[{ label: 'Có', value: true }, { label: 'Không', value: false }]} />
                      </FormItemGlobal> */}
                    </Col>
                    <Col span={8}>

                      <FormItemGlobal name={'type_service_id'} label={'Dịch vụ khám'} required>
                        <SelectFormikGlobal mode="multiple" name="type_service_id" options={dataTypeService?.filter(v => v.active).map(v => ({
                          label: v.name,
                          value: v.id
                        }))} onChange={(value) => setSelectedWard(value)} ></SelectFormikGlobal>
                      </FormItemGlobal>

                      {/* <FormItemGlobal name={`doctor_id`} label="Bác sĩ khám bệnh" required>
                        <SelectFormikGlobal name={`doctor_id`} options={dataDoctor} />
                      </FormItemGlobal> */}

                      <FormItemGlobal name="symptoms" label="Mô tả triệu chứng" required>
                        <TextAreaFormikGlobal name="symptoms" placeholder="Mô tả" resize="block" />
                      </FormItemGlobal>

                    </Col>
                  </Row>
                </FormGlobal></Col>
            </Row>
          </ModalGlobal>
        );
      }}
    </Formik>
  );
}
