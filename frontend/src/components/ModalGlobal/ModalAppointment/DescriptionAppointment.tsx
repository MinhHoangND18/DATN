import { IAppointment } from '@/api/ApiAppointment'
import { IPatient } from '@/api/ApiPatient'
import { Descriptions } from 'antd'
import moment from 'moment'
import React from 'react'

function DescriptionAppointment({ patient, appointment }: { patient: IPatient, appointment: IAppointment }) {
    return (
        <div>
            <Descriptions column={5}>
                <Descriptions.Item label="Mã bệnh nhân" labelStyle={{ fontWeight: 'bold' }}>BN{patient?.id}</Descriptions.Item>
                <Descriptions.Item label="Họ và tên" labelStyle={{ fontWeight: 'bold' }} >{patient?.full_name}</Descriptions.Item>
                <Descriptions.Item label="Ngày sinh" labelStyle={{ fontWeight: 'bold' }}>{moment(patient?.birthday).format('DD/MM/YYYY')}</Descriptions.Item>
                <Descriptions.Item label="Giới tính" labelStyle={{ fontWeight: 'bold' }}>{patient?.gender}</Descriptions.Item>
                <Descriptions.Item label="Địa chỉ" labelStyle={{ fontWeight: 'bold' }}>
                    {patient?.wards.name} - {patient?.district.name} - {patient?.province.name}
                </Descriptions.Item>
                <Descriptions.Item label="Số điện thoại" labelStyle={{ fontWeight: 'bold' }}>{patient?.phone}</Descriptions.Item>

                <Descriptions.Item label='Bác sĩ khám bệnh' labelStyle={{ fontWeight: 'bold' }}>
                    {appointment?.doctor?.full_name}
                </Descriptions.Item>
                <Descriptions.Item label='Ngày khám' labelStyle={{ fontWeight: 'bold' }}>
                    {moment(appointment?.appointment_date).format('HH:mm DD/MM/YYYY')}
                </Descriptions.Item>
            </Descriptions>
        </div>
    )
}

export default DescriptionAppointment