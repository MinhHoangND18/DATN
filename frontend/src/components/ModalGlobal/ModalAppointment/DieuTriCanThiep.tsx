import ApiAppointment, { IAppointment } from '@/api/ApiAppointment'
import { IPatient } from '@/api/ApiPatient'
import React, { useEffect, useMemo, useState } from 'react'
import DescriptionAppointment from './DescriptionAppointment'
import TableGlobal from '@/components/TableGlobal'
import { SelectGlobal } from '@/components/AntdGlobal'
import { ColumnsType } from 'antd/lib/table'
import moment from 'moment'
import { useMutation, useQuery } from '@tanstack/react-query'
import ApiService from '@/api/ApiService'
import { AutoComplete, Button, Col, DatePicker, Input, Row, Select, TimePicker } from 'antd'
import { IUser } from '@/api/ApiUser'
import EditorCustom from '../../EditorCustom'
import Notification from '@/components/Notification'
import { useGetUserRedux } from '@/redux/slices/UserSlice'
import { ERole } from '@/lazyLoading'
import { PrinterFilled } from '@ant-design/icons'

function DieuTriCanThiep({ patient, appointment, refetch, isDisable }: { refetch: any, patient: IPatient, appointment: IAppointment, isDisable: boolean }) {
    const [listLieuTrinh, setListLieuTrinh] = useState<Array<any>>([]);
    const [treatmentRegimen, setTreatmentRegimen] = useState(appointment.diagnosis?.treatment?.treatment_regimen ?? '');
    const [disable, setDisable] = useState(isDisable);

    useEffect(() => {
        const treament = appointment.diagnosis?.treatment;
        let data = []
        if (treament && treament?.used_services) {
            for (const us of treament?.used_services) {
                data.push({
                    doctor_id: us?.doctor?.id,
                    name: us.service.name,
                    price: us.price,
                    date: [moment(us.start_date), moment(us.end_date)],
                    area: us?.area,
                    quantity: us.quantity,
                    clinic_room_name: us?.doctor?.clinic_room?.name,
                    id: us.service.id
                })
            }
        }

        setListLieuTrinh(data)
    }, [])

    console.log(listLieuTrinh);


    const dtctMutation = useMutation(ApiAppointment.saveDTCT)

    const { data: services } = useQuery(
        ["get_services"],
        () => ApiService.getServices({ page: 1, limit: 1000 }),
        {
            keepPreviousData: true,
        }
    );

    const { data } = useQuery(['data_doctor'], () => ApiAppointment.getDoctor({}))

    const dataDoctor = useMemo(() => {
        return data?.map((v) => ({ value: v.id, label: v.full_name }))
    }, [data])

    const handleSubmit = () => {
        dtctMutation.mutate({
            id: appointment.diagnosis.id,
            treatment_regimen: treatmentRegimen,
            list: listLieuTrinh.map(v => ({
                id: v.id,
                quantity: v.quantity,
                start_date: v.date[0].format('YYYY-MM-DD'),
                end_date: v.date[1].format('YYYY-MM-DD'),
                area: v.area,
                doctor_id: v.doctor_id,
            }))
        }, {
            onSuccess() {
                refetch()
                Notification.notificationSuccess('Lưu thành công')
            }
        })
    }

    const columns: ColumnsType<any> = [
        {
            title: "STT",
            align: "center",
            width: 40,
            render: (_, __, i) => i + 1,
        },
        {
            title: "Tên liệu trình",
            dataIndex: 'name',
            align: "center",
            width: 100,
        },
        {
            title: "Từ ngày - Đến ngày",
            align: "center",
            width: 200,
            render: (_, record) => <DatePicker.RangePicker
                disabled={disable}
                value={record?.date}
                onChange={e => setListLieuTrinh((prev) => {
                    const data: any = [];
                    for (const a of prev) {
                        if (a.id == record.id) {
                            data.push({ ...a, date: e })
                        }
                        else data.push(a);
                    }

                    return data
                })
                }
                disabledDate={(current) => {
                    // Disable dates before today
                    return current && current < moment().startOf('day');
                }}
            ></DatePicker.RangePicker>
        },
        {
            title: "Số lượng",
            dataIndex: 'quantity',
            align: "center",
            width: 100,
            render: (value, record) => <Input
                disabled={disable}
                type='number'
                value={value}
                min={1}
                onChange={(e) => setListLieuTrinh((prev) => {
                    const data: any = [];
                    for (const a of prev) {
                        if (a.id == record.id) {
                            data.push({ ...a, quantity: e.target.value })
                        }
                        else data.push(a);
                    }

                    return data
                })}></Input>
        },
        {
            title: "Giá",
            dataIndex: 'price',
            align: "center",
            width: 100,
        },
        {
            title: "Thành tiền",
            align: "center",
            width: 100,
            render: (_, record) => (record.price * record.quantity) || 0
        },
        {
            title: "Vùng",
            dataIndex: 'area',
            align: "center",
            width: 100,
            render: (_, record) => <Input
                disabled={disable}
                value={record.area}
                onChange={(e) => setListLieuTrinh((prev) => {
                    const data: any = [];
                    for (const a of prev) {
                        if (a.id == record.id) {
                            data.push({ ...a, area: e.target.value })
                        }
                        else data.push(a);
                    }

                    return data
                })}></Input>
        },
        {
            title: "Người thực hiện",
            align: "center",
            width: 100,
            render: (_, record) => <SelectGlobal
                disabled={disable}
                options={dataDoctor} value={record.doctor_id}
                onChange={(value) => setListLieuTrinh((prev) => {
                    // const d = prev.find(v => v.id == record.id);
                    const dataTemp: any = [];


                    for (const a of prev) {
                        if (a.id == record.id) {
                            dataTemp.push({ ...a, doctor_id: value, clinic_room_name: data?.find((v: IUser) => v?.id == value)?.clinic_room?.name })
                        }
                        else dataTemp.push(a);
                    }

                    // d.doctor_id = value;
                    return dataTemp
                })}></SelectGlobal>
        },
        {
            title: "Buồng Khám",
            align: "center",
            dataIndex: 'clinic_room_name',
            width: 100,
        },

    ];

    const handleChangeLieuTrinh = (values: number[]) => {
        const data: any = [];

        for (const num of values) {
            let check = false;
            for (const value of listLieuTrinh) {
                if (value.id == num) {
                    data.push(value);
                    check = true;
                }
            }

            if (!check) {
                const f = services?.results.filter(v => Number(v.id) == num);
                if (f?.length) data.push({ ...f[0], quantity: 1 })
            }
        }

        setListLieuTrinh(data)
    }

    const user = useGetUserRedux()

    useEffect(() => {
        if (user.role !== ERole.BAC_SI) {
            setDisable(true)
        }
    }, [user])
    const printMutation = useMutation(ApiAppointment.printLT)
    return (
        <div>
            <DescriptionAppointment appointment={appointment} patient={patient} />
            <hr className='my-3'></hr>
            <div className='text-xl'><b>ĐIỀU TRỊ CAN THIỆP</b></div>
            <Row gutter={10}>
                <Col span={12}>
                    <ul>
                        <li><b>Số Phiếu:</b> {appointment.diagnosis?.treatment?.id && `LT${appointment.diagnosis?.treatment?.id}`}</li>
                        <li className='flex'><b className='mr-2'>Chẩn đoán: </b> <p dangerouslySetInnerHTML={{ __html: appointment?.diagnosis?.content }}></p></li>
                        <li><b>Ngày lập: </b> {appointment.diagnosis?.treatment?.createdAt && moment(appointment.diagnosis.treatment.createdAt).format('DD/MM/YYYY')}</li>
                    </ul></Col>
                <Col span={12}>
                    <EditorCustom disable={disable} value={treatmentRegimen} setValue={setTreatmentRegimen} name='Phác đồ điều trị'></EditorCustom>
                </Col>
            </Row>


            <hr className='my-3'></hr>
            <div>
                <div className='flex justify-between'>
                    <div className='text-xl'><b>CHI TIẾT</b></div>
                    <div>
                        {appointment?.diagnosis?.treatment && <Button type='dashed' className='w-[80px] mr-6' onClick={() => printMutation.mutate(appointment.id as number)} ><PrinterFilled /></Button>}
                        <Button onClick={handleSubmit} disabled={disable} loading={dtctMutation.isLoading} type='primary' className='w-[80px] mr-6'>Lưu</Button>

                    </div>
                </div>

                <div className='my-2'><b className='mr-3'>Chọn liệu trình: </b>
                    <Select
                        disabled={disable}
                        mode='multiple'
                        options={services?.results.filter(v => v.active).map((v) => ({ value: v.id, label: v.name }))}
                        className='w-[70%]'
                        onChange={handleChangeLieuTrinh}
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        showSearch
                        value={listLieuTrinh.map((lieutrinh: any) => lieutrinh.id)}
                    />
                </div>

            </div>
            <TableGlobal columns={columns} dataSource={listLieuTrinh}></TableGlobal>
        </div>
    )
}

export default DieuTriCanThiep