import { Button, Col, DatePicker, Descriptions, Divider, Popconfirm, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import DescriptionAppointment from './DescriptionAppointment'
import { IPatient } from '@/api/ApiPatient'
import ApiAppointment, { AppointmentStatus, IAppointment } from '@/api/ApiAppointment'
import moment, { Moment } from 'moment'
import FormGlobal from '@/components/FormGlobal'
import { Formik } from 'formik'
import EditorCustom from '../../EditorCustom'
import { QueryClient, useMutation } from '@tanstack/react-query'
import Notification from '@/components/Notification'
import { useGetUserRedux } from '@/redux/slices/UserSlice'
import { ERole } from '@/lazyLoading'
import { PrinterFilled } from '@ant-design/icons'

function KetQuaKham({ patient, appointment, refetch, isDisable }: { patient: IPatient, appointment: IAppointment, refetch: any, isDisable: boolean }) {
    const [content, setContent] = useState(appointment.diagnosis?.content ?? '')
    const [advice, setAdvice] = useState(appointment.diagnosis?.advide ?? '')
    const [description, setDescription] = useState(appointment.diagnosis?.description ?? '')
    const [nextDate, setNextDate] = useState<Moment | null>(appointment.diagnosis?.next_appointment ? moment(appointment.diagnosis?.next_appointment) : null)
    const [disable, setDisable] = useState(isDisable);

    const kqMutation = useMutation(ApiAppointment.saveKetQua)
    const cfMutation = useMutation(ApiAppointment.waitting)
    const handleSubmit = () => {
        kqMutation.mutate({
            content,
            advide: advice,
            description,
            next_appointment: nextDate?.format('YYYY-MM-DD'),
            id: appointment.id
        }, {
            onSuccess() {
                refetch()
                Notification.notificationSuccess('Lưu thành công')

            }
        })
    }
    const user = useGetUserRedux()

    useEffect(() => {
        if (user.role !== ERole.BAC_SI || ![AppointmentStatus.Doing].includes(appointment.status)) {
            setDisable(true)
        }

    }, [user, appointment])

    const printMutation = useMutation(ApiAppointment.printKQKB)
    return (
        <div>
            <DescriptionAppointment appointment={appointment} patient={patient} />
            <hr className='my-3'></hr>
            <div className='text-xl'><b>KẾT QUẢ KHÁM BỆNH</b></div>
            <div>
                <Row gutter={22}>
                    <Col span={12} className='mb-3'>
                        <div className='mb-2'><b>Số phiếu:</b> KQ{appointment.id}</div>
                        {/* <div><b>Ngày khám:</b> {moment(appointment.appointment_date).format('hh:mm DD/MM/YYYY')}</div> */}
                    </Col>
                    {/* <Col span={12}>
                        <div><b>Ngày tái khám:</b></div>
                    </Col> */}
                    <Col span={12}>
                        <div><b>Dịch vụ khám:</b></div>
                        <table className='w-[100%]'>
                            <tr>
                                <th className='w-[10%]'>STT</th>
                                <th>Tên Dịch vụ khám</th>
                                {/* <th>Bác sĩ thực hiện</th> */}
                            </tr>
                            {
                                appointment.used_type_services.map((v, i) => {
                                    return (
                                        <tr key={i}>
                                            <td>{i + 1}</td>
                                            <td>{v.type_service.name}</td>

                                            {/* {i === 0 && <td>{appointment.doctor?.full_name}</td>
                                            } */}
                                        </tr>
                                    )
                                })
                            }


                        </table>
                    </Col>

                    <Col span={24}  >
                        <div className='flex items-center' >
                            <b className='mr-4'>Ngày khám lại:</b>
                            <DatePicker disabled={disable} value={nextDate} onChange={(e: any) => setNextDate(e)}></DatePicker>
                        </div>
                    </Col>
                </Row>
            </div>

            <hr className='my-3'></hr>
            <div className='flex justify-between'>
                <div className='text-xl'><b>CHI TIẾT</b></div>
                <div>
                    <Button onClick={() => printMutation.mutate(appointment.id as number)} loading={printMutation.isLoading} type='dashed' className='w-[80px] mr-6'><PrinterFilled /></Button>
                    <Popconfirm title='Hoàn thành ca khám này?'
                        onConfirm={() => {
                            cfMutation.mutate({ id: appointment.id }, {
                                onSuccess() {
                                    refetch()
                                }
                            })
                        }}>
                        {user.role == ERole.BAC_SI && <Button className='w-[100px] mr-6 !bg-green-500 !text-white'>Hoàn thành</Button>}
                    </Popconfirm>
                    <Button onClick={handleSubmit} loading={kqMutation.isLoading} disabled={disable} type='primary' className='w-[80px] mr-6'>Lưu</Button>

                </div>
            </div>
            <div>
                <Formik
                    initialValues={{ a: '' }}
                    enableReinitialize
                    onSubmit={() => { }}

                >
                    {(): JSX.Element => {
                        return (<FormGlobal disabled={disable}>
                            <Row gutter={12}>
                                <Col span={12}>
                                    <EditorCustom value={description} setValue={setDescription} name='Mô tả bệnh án' disable={disable}></EditorCustom>
                                </Col>
                                <Col span={12}>
                                    <EditorCustom value={content} setValue={setContent} name='Chẩn đoán' disable={disable}></EditorCustom>
                                </Col>
                                <Col span={24}>
                                    <EditorCustom value={advice} setValue={setAdvice} name='Tư vấn xử lý' disable={disable}></EditorCustom>
                                </Col>
                            </Row>
                        </FormGlobal>)
                    }}
                </Formik>
            </div>
        </div>
    )
}

export default KetQuaKham