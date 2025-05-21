import ApiAppointment, { AppointmentStatus, IAppointment } from '@/api/ApiAppointment'
import { IPatient } from '@/api/ApiPatient'
import React, { useEffect, useMemo, useState } from 'react'
import DescriptionAppointment from './DescriptionAppointment'
import TableGlobal from '@/components/TableGlobal'
import { SelectGlobal } from '@/components/AntdGlobal'
import { ColumnsType } from 'antd/lib/table'
import moment from 'moment'
import { useMutation, useQuery } from '@tanstack/react-query'
import ApiService from '@/api/ApiService'
import { AutoComplete, Button, DatePicker, Input, Popconfirm, Select, TimePicker } from 'antd'
import Notification from '@/components/Notification'
import { useGetUserRedux } from '@/redux/slices/UserSlice'
import { ERole } from '@/lazyLoading'
import { PrinterFilled } from '@ant-design/icons'
const thuoc =
    [
        {
            "id": 1,
            "name": "Hydrocortisone",
            "noi_san_xuat": "Pfizer",
            "cong_dung": "Giảm viêm, ngứa do viêm da dị ứng và chàm.",
            "don_vi": "Tuýp",
            "chi_dinh": "Thoa lên vùng da bị viêm 1-2 lần mỗi ngày.",
            "price": 50000
        },
        {
            "id": 2,
            "name": "Clobetasol",
            "noi_san_xuat": "GlaxoSmithKline",
            "cong_dung": "Điều trị viêm da nặng và bệnh vẩy nến.",
            "don_vi": "Tuýp",
            "chi_dinh": "Thoa một lượng nhỏ lên vùng da bị viêm 1-2 lần mỗi ngày.",
            "price": 75000
        },
        {
            "id": 3,
            "name": "Betamethasone",
            "noi_san_xuat": "Schering-Plough",
            "cong_dung": "Điều trị các bệnh da liễu như viêm da dị ứng, chàm.",
            "don_vi": "Tuýp",
            "chi_dinh": "Thoa lên vùng da bị ảnh hưởng 1 lần mỗi ngày.",
            "price": 60000
        },
        {
            "id": 4,
            "name": "Tacrolimus",
            "noi_san_xuat": "Astellas Pharma",
            "cong_dung": "Điều trị viêm da dị ứng khi các loại thuốc khác không hiệu quả.",
            "don_vi": "Tuýp",
            "chi_dinh": "Thoa 2 lần mỗi ngày lên vùng da bị viêm.",
            "price": 90000
        },
        {
            "id": 5,
            "name": "Mupirocin",
            "noi_san_xuat": "GlaxoSmithKline",
            "cong_dung": "Điều trị nhiễm khuẩn da và chốc lở.",
            "don_vi": "Tuýp",
            "chi_dinh": "Thoa lên vùng da bị nhiễm khuẩn 3 lần mỗi ngày.",
            "price": 85000
        },
        {
            "id": 6,
            "name": "Tetracycline",
            "noi_san_xuat": "Pfizer",
            "cong_dung": "Điều trị mụn trứng cá và nhiễm khuẩn da.",
            "don_vi": "Viên",
            "chi_dinh": "Uống 1-2 lần mỗi ngày sau bữa ăn.",
            "price": 45000
        },
        {
            "id": 7,
            "name": "Clindamycin",
            "noi_san_xuat": "Pfizer",
            "cong_dung": "Điều trị nhiễm trùng da do vi khuẩn.",
            "don_vi": "Lọ",
            "chi_dinh": "Thoa lên vùng da bị ảnh hưởng 2 lần mỗi ngày.",
            "price": 65000
        },
        {
            "id": 8,
            "name": "Metronidazole",
            "noi_san_xuat": "Teva Pharmaceuticals",
            "cong_dung": "Điều trị viêm da do mụn trứng cá đỏ.",
            "don_vi": "Tuýp",
            "chi_dinh": "Thoa lên vùng da bị viêm 1-2 lần mỗi ngày.",
            "price": 70000
        },
        {
            "id": 9,
            "name": "Azelaic acid",
            "noi_san_xuat": "Bayer",
            "cong_dung": "Điều trị mụn trứng cá và giảm viêm.",
            "don_vi": "Tuýp",
            "chi_dinh": "Thoa 2 lần mỗi ngày lên vùng da bị mụn.",
            "price": 60000
        },
        {
            "id": 10,
            "name": "Benzoyl Peroxide",
            "noi_san_xuat": "Galderma",
            "cong_dung": "Điều trị mụn trứng cá bằng cách giảm vi khuẩn trên da.",
            "don_vi": "Tuýp",
            "chi_dinh": "Thoa lên vùng da bị mụn 1 lần mỗi ngày.",
            "price": 50000
        },
        {
            "id": 11,
            "name": "Adapalene",
            "noi_san_xuat": "Galderma",
            "cong_dung": "Điều trị mụn trứng cá và ngăn ngừa tắc nghẽn lỗ chân lông.",
            "don_vi": "Tuýp",
            "chi_dinh": "Thoa 1 lần mỗi ngày vào buổi tối.",
            "price": 80000
        },
        {
            "id": 12,
            "name": "Tretinoin",
            "noi_san_xuat": "Ortho Dermatologics",
            "cong_dung": "Điều trị mụn trứng cá và giảm nếp nhăn.",
            "don_vi": "Tuýp",
            "chi_dinh": "Thoa một lượng nhỏ lên da vào buổi tối.",
            "price": 95000
        },
        {
            "id": 13,
            "name": "Salicylic Acid",
            "noi_san_xuat": "Neutrogena",
            "cong_dung": "Điều trị mụn trứng cá và giảm bã nhờn.",
            "don_vi": "Tuýp",
            "chi_dinh": "Thoa 1-2 lần mỗi ngày lên vùng da bị mụn.",
            "price": 40000
        },
        {
            "id": 14,
            "name": "Fluorouracil",
            "noi_san_xuat": "Taro Pharmaceuticals",
            "cong_dung": "Điều trị ung thư da không hắc tố và dày sừng quang hóa.",
            "don_vi": "Tuýp",
            "chi_dinh": "Thoa 2 lần mỗi ngày lên vùng da bị tổn thương.",
            "price": 120000
        },
        {
            "id": 15,
            "name": "Calcipotriol",
            "noi_san_xuat": "Leo Pharma",
            "cong_dung": "Điều trị bệnh vẩy nến bằng cách điều chỉnh sự tăng trưởng của tế bào da.",
            "don_vi": "Tuýp",
            "chi_dinh": "Thoa lên vùng da bị ảnh hưởng 1-2 lần mỗi ngày.",
            "price": 100000
        },
        {
            "id": 16,
            "name": "Nystatin",
            "noi_san_xuat": "Bristol-Myers Squibb",
            "cong_dung": "Điều trị nhiễm nấm trên da và niêm mạc.",
            "don_vi": "Tuýp",
            "chi_dinh": "Thoa lên vùng da bị nhiễm nấm 2-3 lần mỗi ngày.",
            "price": 50000
        },
        {
            "id": 17,
            "name": "Ketoconazole",
            "noi_san_xuat": "Janssen Pharmaceuticals",
            "cong_dung": "Điều trị nấm da và viêm da tiết bã.",
            "don_vi": "Tuýp",
            "chi_dinh": "Thoa lên vùng da bị nhiễm nấm 1 lần mỗi ngày.",
            "price": 75000
        },
        {
            "id": 18,
            "name": "Fluocinonide",
            "noi_san_xuat": "Valeant Pharmaceuticals",
            "cong_dung": "Giảm viêm và ngứa do bệnh vẩy nến và eczema.",
            "don_vi": "Tuýp",
            "chi_dinh": "Thoa một lượng nhỏ lên vùng da bị ảnh hưởng 1-2 lần mỗi ngày.",
            "price": 90000
        },
        {
            "id": 19,
            "name": "Bacitracin",
            "noi_san_xuat": "Bristol-Myers Squibb",
            "cong_dung": "Điều trị nhiễm khuẩn da nhẹ.",
            "don_vi": "Tuýp",
            "chi_dinh": "Thoa lên vùng da bị nhiễm khuẩn 1-3 lần mỗi ngày.",
            "price": 60000
        },
        {
            "id": 20,
            "name": "Erythromycin",
            "noi_san_xuat": "Abbott Laboratories",
            "cong_dung": "Điều trị mụn trứng cá và nhiễm khuẩn da.",
            "don_vi": "Lọ",
            "chi_dinh": "Thoa 2 lần mỗi ngày lên vùng da bị ảnh hưởng.",
            "price": 65000
        },
        {
            "id": 21,
            "name": "Dexamethasone",
            "noi_san_xuat": "Merck & Co.",
            "cong_dung": "Giảm viêm trong các tình trạng da liễu nghiêm trọng.",
            "don_vi": "Tuýp",
            "chi_dinh": "Thoa lên vùng da bị viêm 1 lần mỗi ngày.",
            "price": 70000
        },
        {
            "id": 22,
            "name": "Sulfamethoxazole/Trimethoprim",
            "noi_san_xuat": "Roche",
            "cong_dung": "Điều trị nhiễm trùng da do vi khuẩn.",
            "don_vi": "Viên",
            "chi_dinh": "Uống 1-2 lần mỗi ngày sau bữa ăn.",
            "price": 80000
        },
        {
            "id": 23,
            "name": "Levocetirizine",
            "noi_san_xuat": "UCB",
            "cong_dung": "Điều trị triệu chứng dị ứng da như nổi mày đay.",
            "don_vi": "Viên",
            "chi_dinh": "Uống 1 lần mỗi ngày vào buổi tối.",
            "price": 40000
        },
        {
            "id": 24,
            "name": "Olopatadine",
            "noi_san_xuat": "Alcon",
            "cong_dung": "Điều trị triệu chứng viêm kết mạc dị ứng.",
            "don_vi": "Giọt",
            "chi_dinh": "Nhỏ 1-2 giọt vào mỗi mắt 1-2 lần mỗi ngày.",
            "price": 75000
        },
        {
            "id": 25,
            "name": "Oxybenzone",
            "noi_san_xuat": "Neutrogena",
            "cong_dung": "Bảo vệ da khỏi tác hại của tia UV.",
            "don_vi": "Tuýp",
            "chi_dinh": "Thoa lên da 15-30 phút trước khi ra ngoài nắng.",
            "price": 60000
        },
        {
            "id": 26,
            "name": "Aloe Vera",
            "noi_san_xuat": "Forever Living Products",
            "cong_dung": "Giúp làm dịu da bị cháy nắng và khô.",
            "don_vi": "Tuýp",
            "chi_dinh": "Thoa lên vùng da bị ảnh hưởng 1-2 lần mỗi ngày.",
            "price": 50000
        },
        {
            "id": 27,
            "name": "Zinc oxide",
            "noi_san_xuat": "CeraVe",
            "cong_dung": "Bảo vệ và làm dịu da, thường dùng cho trẻ em.",
            "don_vi": "Tuýp",
            "chi_dinh": "Thoa lên da trước khi ra ngoài trời.",
            "price": 55000
        },
        {
            "id": 28,
            "name": "Hydroquinone",
            "noi_san_xuat": "Obagi",
            "cong_dung": "Giảm sắc tố da, làm sáng da.",
            "don_vi": "Tuýp",
            "chi_dinh": "Thoa lên vùng da cần điều trị 1-2 lần mỗi ngày.",
            "price": 85000
        },
        {
            "id": 29,
            "name": "Niacinamide",
            "noi_san_xuat": "The Ordinary",
            "cong_dung": "Giảm viêm và làm sáng da.",
            "don_vi": "Tuýp",
            "chi_dinh": "Thoa lên da sau bước làm sạch 1-2 lần mỗi ngày.",
            "price": 95000
        },
        {
            "id": 30,
            "name": "Tea Tree Oil",
            "noi_san_xuat": "Thursday Plantation",
            "cong_dung": "Giảm viêm và nhiễm khuẩn, thường dùng cho mụn.",
            "don_vi": "Tuýp",
            "chi_dinh": "Thoa trực tiếp lên vùng da bị mụn 1-2 lần mỗi ngày.",
            "price": 60000
        }
    ]




function DonThuoc({ patient, appointment, isDisable }: { patient: IPatient, appointment: IAppointment, isDisable: boolean }) {
    const [listDonThuoc, setListDonThuoc] = useState<Array<any>>(appointment.diagnosis?.prescriptions?.map((v: any) => {
        const pre = thuoc.find(t => t.id == v.medicine_id)

        return {
            ...pre, id: v.id, id_thuoc: pre?.id, quantity: v.quantity, cong_dung: v.usage_instructions
        }
    }) ?? []);
    const [value, setValue] = useState(appointment?.diagnosis.doctor_advice_prescriptions ?? '');
    const [disable, setDisable] = useState(isDisable);

    const dtMutation = useMutation(ApiAppointment.saveDonThuoc)
    const printMutation = useMutation(ApiAppointment.print)

    const handleSubmit = () => {
        dtMutation.mutate({
            id: appointment.diagnosis.id,
            doctor_advice_prescriptions: value,
            list: listDonThuoc.map(v => ({
                medicine_name: v.name,
                medicine_id: v.id_thuoc,
                quantity: v.quantity,
                usage_instructions: v.chi_dinh,
                unit: v.don_vi
            }))
        }, {
            onSuccess() {
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
            title: "Tên thuốc",
            dataIndex: 'name',
            align: "center",
            width: 100,
            render: (value, record) =>
                <Select
                    disabled={disable}
                    value={value}
                    showSearch
                    options={thuoc.map((v) => ({ value: v.id, label: v.name }))}
                    className='w-full'
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    onChange={(e) => setListDonThuoc((prev) => {
                        const data: any = [];

                        for (const a of prev) {
                            if (a.id == record.id) {
                                const { id, ...rest } = thuoc.filter(v => v.id == e)[0];
                                data.push({ ...rest, quantity: 1, id: a.id, id_thuoc: id })
                            }
                            else data.push(a);
                        }

                        return data
                    })}
                >

                </Select>
        },
        {
            title: "số lượng",
            align: "center",
            width: 100,
            dataIndex: 'quantity',
            render: (value, record) => <Input type='number' value={value} min={1} disabled={disable} onChange={(e) => setListDonThuoc((prev) => {
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
            title: "Đơn vị",
            dataIndex: 'don_vi',
            align: "center",
            width: 100,
        },
        {
            title: "Chỉ định",
            dataIndex: 'chi_dinh',
            align: "center",
            width: 150,
            render: (value, record) => <Input.TextArea value={value} disabled={disable} onChange={(e) => setListDonThuoc((prev) => {
                const data: any = [];
                for (const a of prev) {
                    if (a.id == record.id) {
                        data.push({ ...a, chi_dinh: e.target.value })
                    }
                    else data.push(a);
                }

                return data
            })}></Input.TextArea>

        },
        {
            title: 'Hành động',
            align: 'center',
            fixed: 'right',
            width: 80,
            render: (_, record) => <Popconfirm title='Bạn muốn xóa thuốc này' disabled={disable} onConfirm={() => {
                setListDonThuoc((prev) => {
                    const data: any = [];
                    for (const a of prev) {
                        if (a.id == record.id) {
                            continue
                        }
                        else data.push(a);
                    }

                    return data
                })
            }}>
                <Button type='text' disabled={disable}
                >Xóa</Button>
            </Popconfirm>
        }
    ];

    const user = useGetUserRedux()

    useEffect(() => {
        if (user.role !== ERole.BAC_SI || ![AppointmentStatus.Doing].includes(appointment.status)) {
            setDisable(true)
        }
    }, [user, appointment])
    return (
        <div>
            <DescriptionAppointment appointment={appointment} patient={patient} />
            <hr className='my-3'></hr>

            <div>
                <div className='flex justify-between'>
                    <div className='text-xl'><b>CHI TIẾT ĐƠN THUỐC</b></div>
                    <div>
                        <Button onClick={() => printMutation.mutate(appointment.diagnosis.id)} type='dashed' className='mr-2' ><PrinterFilled /></Button>
                        <Button onClick={handleSubmit} loading={dtMutation.isLoading} type='primary' disabled={disable} className='w-[80px] mr-6'>Lưu</Button>
                    </div>
                </div>
                <div className='flex'>Chẩn đoán: <p className='ml-2' dangerouslySetInnerHTML={{ __html: appointment.diagnosis?.content }}></p></div>
                <div>
                    <label htmlFor="">Lời dặn của bác sĩ:</label>
                    <Input name='doctor_advice_prescriptions' value={value} disabled={disable} onChange={(e) => setValue(e.target.value)} />
                </div>

                <div className='flex items-center justify-between'>
                    <Button disabled={disable} onClick={() => setListDonThuoc(prev => [...prev, { id: new Date().getTime() }])} className='my-2'>Thêm đơn thuốc</Button>

                </div>
            </div>
            <TableGlobal columns={columns} dataSource={listDonThuoc}></TableGlobal>

        </div>
    )
}

export default DonThuoc