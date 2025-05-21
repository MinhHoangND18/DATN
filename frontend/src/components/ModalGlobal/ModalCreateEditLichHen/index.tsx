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
import ApiAppointment, { IAppointment, ICreateAppointmentFutureNew, ICreateAppointmentNew } from "@/api/ApiAppointment";
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
  const [patient, setPatient] = useState<IPatient | null>(null)
  const innerRef = useRef<FormikProps<ICreateAppointmentFutureNew>>(null);
  const queryClient = useQueryClient();
  useEffect(() => { selectedAppointment?.patient && setPatient(selectedAppointment?.patient) }, [selectedAppointment])

  const initialValues: any = useMemo(() => {
    return {
      full_name: patient?.full_name ?? '',
      phone: patient?.phone ?? '',
      gender: patient?.gender ?? 'Nam',
      province_id: patient?.province.id ?? '',
      district_id: patient?.district.id ?? '',
      ward_id: patient?.wards.id ?? '',
      birthday: moment(patient?.birthday),
      appointment_date: moment().add(1, 'day').set({ hour: 8, minute: 0 })
    };
  }, [patient]);

  const onCancel = () => {
    handleCloseModal();
    setPatient(null)
    innerRef.current?.resetForm();
  };


  const createAppointmentMutation = useMutation(ApiAppointment.createFuture);
  const updateAppointMutation = useMutation(ApiAppointment.updateFuture1);

  const handleSubmit = async (values: ICreateAppointmentFutureNew) => {
    console.log(values);

    let dataSend: any = { ...values }
    if (patient?.id) {
      dataSend = {
        patient_id: patient.id,
        type_service_id: values.type_service_id,
        symptoms: values.symptoms,
        appointment_date: values.appointment_date.format('YYYY-MM-DDTHH:mm:ss')
      }
    }


    if (selectedAppointment) {
      updateAppointMutation.mutate(
        { id: selectedAppointment?.id, data: { appointment_date: values.appointment_date.format('YYYY-MM-DDTHH:mm:ss') } },
        {
          onSuccess: () => {
            Notification.notificationSuccess("Thành công");
            queryClient.refetchQueries(["get_appointments_future"]);
            onCancel();
          },
        }
      );
      return;
    }
    createAppointmentMutation.mutate(dataSend, {
      onSuccess: () => {
        Notification.notificationSuccess("Thành công");
        queryClient.refetchQueries(["get_appointments_future"]);
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

  return (
    <Formik
      innerRef={innerRef}
      initialValues={initialValues}
      enableReinitialize
      onSubmit={handleSubmit}
    // validationSchema={ServiceValidation}
    >
      {({ handleSubmit, setFieldValue, values }): JSX.Element => {

        return (
          <ModalGlobal
            open={isOpenModal}
            title={selectedAppointment ? "Sửa lịch hẹn khám chữa bệnh" : "Tạo lịch hẹn khám chữa bệnh"}
            onOk={handleSubmit}
            onCancel={onCancel}
            isLoadingOK={
              createAppointmentMutation.isLoading
            }
            width={1200}
          >
            <Row gutter={33}>
              {!selectedAppointment && <Col span={10}>
                <div className="mt-8">
                  <div className="text-center font-bold text-xl">Tìm kiếm bệnh nhân</div>
                  <InputSearchGlobal
                    onChange={(e) => setSearchValue(e.target.value.trim())}
                    onSearch={() => { searchRF() }}
                    placeholder="Nhập tên bệnh nhân" />
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
              </Col>}
              <Col span={selectedAppointment ? 24 : 14}>
                <FormGlobal>
                  <Row gutter={[16, 0]}>
                    <Col span={12}>
                      <FormItemGlobal name="full_name" label="Tên bệnh nhân" required>
                        <InputFormikGlobal name="full_name" placeholder="Tên bệnh nhân" disabled={!!selectedAppointment} />
                      </FormItemGlobal>

                      <FormItemGlobal
                        name={'phone'}
                        label='Số điện thoại'
                        required
                      >
                        <InputFormikGlobal name="phone" disabled={!!selectedAppointment} />
                      </FormItemGlobal>

                      <FormItemGlobal name={'birthday'} label='Ngày sinh' required>
                        <DatePickerFormikGlobal name="birthday" disabledDate={(current) => {
                          // Disable all future dates
                          return current && current > moment().endOf('day');
                        }} disabled={!!selectedAppointment} />
                      </FormItemGlobal>

                      <FormItemGlobal name={'gender'} label={'Giới tính'} required>
                        <RadioGroupFormikGlobal
                          disabled={!!selectedAppointment}
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
                        <SelectFormikGlobal name="province_id" options={provinces} onChange={(value) => setSelectedProvince(value)} disabled={!!selectedAppointment} />
                      </FormItemGlobal>

                      <FormItemGlobal name={'district_id'} label={'Huyện/Thị xã'} required>
                        <SelectFormikGlobal name="district_id" options={districts} onChange={(value) => setSelectedDistrict(value)} disabled={!!selectedAppointment}></SelectFormikGlobal>
                      </FormItemGlobal>


                      <FormItemGlobal name={'ward_id'} label={'Xã/Phường'} required>
                        <SelectFormikGlobal name="ward_id" options={wards} onChange={(value) => setSelectedWard(value)} disabled={!!selectedAppointment}></SelectFormikGlobal>
                      </FormItemGlobal>


                      <FormItemGlobal name={'appointment_date'} label={'Ngày tới khám'} required>
                        <DatePickerFormikGlobal format={'HH:mm DD-MM-YYYY'}
                          showTime={{
                            format: 'HH:mm',
                            minuteStep: 30,
                            disabledHours: () => {
                              const hours = Array.from({ length: 24 }, (_, i) => i);
                              const currentDate = values.appointment_date;
                              const compareDate = currentDate.clone().format('DD/MM/YYYY') == moment().format('DD/MM/YYYY');

                              // Disable hours outside of 8 AM to 4 PM
                              return hours.filter(hour => (hour < 8 || hour > 16) || (compareDate && currentDate.hour() < hour));
                            }
                          }}
                          name="appointment_date"
                          onChange={(value) => {
                            // Giữ nguyên múi giờ địa phương khi lưu lại
                            const localTime = value ? moment.parseZone(value.format()) : null;
                            // Sau đó có thể set vào formik field hoặc state
                            setFieldValue("appointment_date", localTime);
                          }}
                          disabledDate={(current) => {

                            // Disable dates in the past
                            return current && current < moment().startOf('day');
                          }}
                        ></DatePickerFormikGlobal>
                      </FormItemGlobal>
                    </Col>
                    {/* <Col span={8}>

                      <FormItemGlobal name={'type_service_id'} label={'Dịch vụ khám'} required>
                        <SelectFormikGlobal mode="multiple" name="type_service_id" options={dataTypeService?.map(v => ({
                          label: v.name,
                          value: v.id
                        }))} onChange={(value) => setSelectedWard(value)} ></SelectFormikGlobal>
                      </FormItemGlobal>
                      <FormItemGlobal name="symptoms" label="Mô tả triệu chứng">
                        <TextAreaFormikGlobal name="symptoms" placeholder="Mô tả" resize="block" />
                      </FormItemGlobal>
                    </Col> */}
                  </Row>
                </FormGlobal></Col>
            </Row>
          </ModalGlobal>
        );
      }}
    </Formik>
  );
}
