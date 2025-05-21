import DescriptionAppointment from './DescriptionAppointment'
import { IPatient } from '@/api/ApiPatient'
import ApiAppointment, { BillStatus, IAppointment } from '@/api/ApiAppointment'
import { Button, Col, Popover, Row, Tag } from 'antd'
import TableGlobal from '@/components/TableGlobal'
import { ColumnsType } from 'antd/lib/table'
import { useMutation } from '@tanstack/react-query'
import ApiBill from '@/api/ApiBill'
import Notification from '@/components/Notification'

function HoaDon({ patient, appointment, refetch, isDisable }: { patient: IPatient, appointment: IAppointment, refetch: any, isDisable: boolean }) {
    const statusDV = appointment.bills?.[0]?.status == BillStatus.Resolve;
    const statusLT = appointment.bills?.[1]?.status == BillStatus.Resolve;

    const columns: ColumnsType<any> = [
        {
            title: "STT",
            align: "center",
            render: (_, __, i) => i + 1,
        },
        {
            title: "Tên dịch vụ khám",
            dataIndex: 'name',
            align: "center",
        },
        {
            title: "Giá",
            dataIndex: 'price',
            align: "center",
            render: (value: number) => value.toLocaleString() + ' vnd'
        }
    ];

    const columns1: ColumnsType<any> = [
        {
            title: "STT",
            align: "center",
            render: (_, __, i) => i + 1,
        },
        {
            title: "Tên liệu trình",
            dataIndex: 'name',
            align: "center",
        },
        {
            title: "Số lượng",
            dataIndex: 'quantity',
            align: "center",
        },
        {
            title: "Giá",
            dataIndex: 'price',
            align: "center",
            render: (value: number) => value.toLocaleString() + ' vnd'
        },
        {
            title: "Thành tiền",
            align: "center",
            render: (_, record) => (record.quantity * record.price || 0).toLocaleString() + ' vnd'
        }
    ];

    const tongtienkham = appointment.used_type_services.reduce((acc, cur) => cur.price + acc, 0)
    const tongtienlieutrinh = (appointment.diagnosis?.treatment?.used_services?.reduce((acc: number, cur: any) => cur.price * cur.quantity + acc, 0) ?? 0);
    const tong = tongtienkham + tongtienlieutrinh;

    const initMutation = useMutation(ApiBill.initPayment);
    const printMutation = useMutation(ApiAppointment.printHD)

    const handlePayment = (type: number) => {

        initMutation.mutate({
            id: appointment.id,
            tong_dich_vu: tongtienkham,
            tong_lieu_trinh: tongtienlieutrinh,
            type
        }, {
            onSuccess(data: any) {
                if (type == 0) {
                    refetch()
                    return Notification.notificationSuccess('Thanh toán thành công')
                }
                const paymentWindow: any = window.open(data, 'Thanh toán', 'width=800,height=600')

                window.addEventListener('message', (event) => {
                    // if (event.origin !== 'https://sandbox.vnpayment.vn') return;
                    // const { status } = event.data;

                    console.log(event);


                    // // Cập nhật trạng thái theo dữ liệu trả về từ VNPay
                    // if (status === 'success') {
                    //     setPaymentStatus('Đã thanh toán');
                    // } else {
                    //     setPaymentStatus('Thanh toán thất bại');
                    // }
                });

                paymentWindow.onbeforeunload = () => {
                    // Khi cửa sổ thanh toán đóng, gửi thông báo trạng thái thanh toán.
                    paymentWindow.postMessage({ status: 'success' }, '*'); // Tùy theo kết quả từ VNPay
                };
            }
        })

    }

    const renderStatus = () => {
        if (statusDV && !statusLT) {
            return <Tag className='!mt-3' color='orange'>Đã thanh toán dịch vụ khám</Tag>
        }

        if (statusDV && statusLT) return <Tag className='!mt-3' color='green'>Đã thanh toán</Tag>

        return <Tag className='!mt-3' color='red'>Chưa thanh toán</Tag>
    }
    return (
        <div>
            <DescriptionAppointment appointment={appointment} patient={patient} />
            <hr className='my-3'></hr>
            <div className='text-xl'><b>HÓA ĐƠN KHÁM BỆNH</b></div>

            <Row gutter={22}>
                <Col span={18}>
                    <TableGlobal scrollX={100} columns={columns} dataSource={appointment.used_type_services.map((v) => ({ ...v, name: v?.type_service?.name }))} footer={undefined} className='mb-3 no-footer-table'></TableGlobal>
                    {appointment.diagnosis?.treatment && <TableGlobal scrollX={100} columns={columns1} dataSource={appointment.diagnosis.treatment.used_services} className='no-footer-table'></TableGlobal>}
                </Col>
                <Col span={6} className='relative !min-h-[260px]'>
                    <div className='px-3 py-2 bg-slate-400 w-full text-white text-center'>Thông tin thanh toán</div>
                    <table className='w-full mt-4'>
                        <tr>
                            <th className='w'>Tổng tiền khám:</th>
                            <td>{tongtienkham.toLocaleString()} vnd</td>
                        </tr>


                        {appointment.diagnosis?.treatment &&
                            <tr>
                                <th>Tổng tiền liệu trình: </th>
                                <td>{tongtienlieutrinh.toLocaleString()} vnd</td>
                            </tr>
                        }

                        <tr>
                            <th>Số tiền phải chi trả:</th>
                            <td className='font-bold'>{tong.toLocaleString()} vnd</td>
                        </tr>

                    </table>
                    {renderStatus()}

                    <div className='absolute bottom-0 right-4'>
                        <Button className='mr-4 !bg-gray-500 !text-white' onClick={() => printMutation.mutate(appointment.id as number)}>In biên lai</Button>
                        <Popover content={
                            <div className='flex flex-col'>
                                <Button disabled={statusDV && statusLT} type='primary' className='mb-3 !bg-green-500' onClick={() => handlePayment(0)} loading={initMutation.isLoading}>Thanh Toán Tiền Mặt</Button>
                                <Button disabled={statusDV && statusLT} type='primary' onClick={() => handlePayment(1)} loading={initMutation.isLoading}>Chuyển khoàn</Button>
                            </div>
                        }>
                            <Button type='primary'>Thanh Toán</Button>
                        </Popover>
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default HoaDon