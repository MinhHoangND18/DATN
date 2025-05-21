import { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, message, Card, Row, Col, Avatar, DatePicker, Select, Spin, Tooltip } from 'antd';
import { UserOutlined, UploadOutlined, LoadingOutlined, CameraOutlined } from '@ant-design/icons';
import { useForm } from 'antd/es/form/Form';
import ApiUser from '@/api/ApiUser';
import { IUser } from '@/api/ApiUser';
import { EGender } from '@/api/ApiUser';
import dayjs from 'dayjs';
import './styles.scss';
import { loginUser, useGetUserRedux } from '@/redux/slices/UserSlice';
import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const ProfilePage = () => {
    const [form] = useForm();
    const [loading, setLoading] = useState(false);

    const [avatarUrl, setAvatarUrl] = useState<string>('');
    const [uploading, setUploading] = useState(false);

    const userData = useGetUserRedux();

    const userMutation = useMutation({
        mutationFn: ApiUser.getMe,
    });

    const uploadAvatarMutation = useMutation({
        mutationFn: ApiUser.uploadAvatar,
    });

    const dispatch = useDispatch();

    const handleSubmit = async (values: any) => {
        try {
            setLoading(true);
            const formattedValues = {
                ...values,
                birthday: values.birthday ? values.birthday.format('YYYY-MM-DD') : null,
            };
            await ApiUser.updateUser({ id: userData?.id, data: formattedValues });
            message.success('Cập nhật thông tin thành công');
            userMutation.mutate(undefined, {
                onSuccess: (res: IUser) => {
                    dispatch(loginUser({ ...res, accessToken: userData.accessToken as string }));
                },
            });

        } catch (error) {
            message.error('Cập nhật thông tin thất bại');
        } finally {
            setLoading(false);
        }
    };
    const navigate = useNavigate();
    useEffect(() => {
        if (!userData?.id) {
            navigate('/login');
        }
    }, [userData?.id]);
    // const handleAvatarChange = async (info: any) => {
    //     if (info.file.status === 'uploading') {
    //         setUploading(true);
    //         return;
    //     }
    //     if (info.file.status === 'done') {
    //         setAvatarUrl(info.file.response.url);
    //         message.success('Cập nhật ảnh đại diện thành công');
    //         uploadAvatarMutation.mutate({ id: userData?.id, file: info.file.response.url }, {
    //             onSuccess: (res: string) => {
    //                 userMutation.mutate(undefined, {
    //                     onSuccess: (res: IUser) => {
    //                         dispatch(loginUser({ ...res }));
    //                     },
    //                 });
    //             },
    //         });
    //     } else if (info.file.status === 'error') {
    //         message.error('Cập nhật ảnh đại diện thất bại');
    //     }
    //     setUploading(false);
    // };

    const customRequest = async ({ file, onSuccess, onError }: any) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            // Simulate API call
            await ApiUser.uploadAvatar({ id: userData?.id, file: formData });
            userMutation.mutate(undefined, {
                onSuccess: (res: IUser) => {
                    dispatch(loginUser({ ...res, accessToken: userData.accessToken as string }));
                },
            });
            onSuccess();
        } catch (error) {
            onError(error);
        }
    };

    return (
        <div className="profile-page">
            <Row gutter={[24, 24]}>
                <Col xs={24} md={8}>
                    <Card className="profile-card">
                        <div className="avatar-section">
                            <div className="avatar-wrapper">
                                <Avatar
                                    size={120}
                                    src={userData?.avatar}
                                    icon={<UserOutlined />}
                                    className="profile-avatar"
                                />
                                <Upload
                                    name="avatar"
                                    showUploadList={false}
                                    customRequest={customRequest}
                                    className="avatar-upload"
                                >
                                    <div className="avatar-overlay">
                                        <CameraOutlined className="camera-icon" />
                                        <span>Thay đổi ảnh</span>
                                    </div>
                                </Upload>
                                {uploading && (
                                    <div className="uploading-overlay">
                                        <LoadingOutlined />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="user-info">
                            <h2>{userData?.full_name || 'Chưa cập nhật'}</h2>
                            <p>{userData?.email}</p>
                            <p>{userData?.phone || 'Chưa cập nhật'}</p>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} md={16}>
                    <Card title="Thông tin cá nhân" className="info-card">
                        <Spin spinning={loading}>
                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={handleSubmit}
                                initialValues={{ ...userData, birthday: userData.birthday ? dayjs(userData.birthday) : null }}
                            >
                                <Row gutter={[16, 16]}>
                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            name="full_name"
                                            label="Họ và tên"
                                            rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            name="email"
                                            label="Email"
                                            rules={[
                                                { required: true, message: 'Vui lòng nhập email' },
                                                { type: 'email', message: 'Email không hợp lệ' },
                                            ]}
                                        >
                                            <Input disabled />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            name="phone"
                                            label="Số điện thoại"
                                            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            name="gender"
                                            label="Giới tính"
                                            rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
                                        >
                                            <Select>
                                                <Option value={EGender.Male}>Nam</Option>
                                                <Option value={EGender.Female}>Nữ</Option>
                                                <Option value={EGender.Other}>Khác</Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            name="birthday"
                                            label="Ngày sinh"
                                            rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
                                        >
                                            <DatePicker style={{ width: '100%' }} />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            name="address"
                                            label="Địa chỉ"
                                            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" loading={loading}>
                                        Cập nhật thông tin
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Spin>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ProfilePage;
