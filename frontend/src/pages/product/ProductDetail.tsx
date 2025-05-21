import { Card, Tag, Button, Row, Col, Divider, List, Radio, Typography, InputNumber, Modal, Spin } from 'antd';
import { CheckOutlined, MinusOutlined, PlusOutlined, ShoppingCartOutlined, ThunderboltOutlined, WalletOutlined, QrcodeOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import ApiProduct from '@/api/ApiProduct';
import { useCart } from '../cart/useCart';
import { toast } from 'react-toastify';
// import { copyToClipboard } from './utils'; // Giả sử có hàm copy từ clipboard lib
import Swal from 'sweetalert2'
import 'sweetalert2/src/sweetalert2.scss'
import { useGetUserRedux } from '@/redux/slices/UserSlice';
import './index.scss'
import axios from 'axios';
import ApiCart from '@/api/ApiCart';

const { Title, Text } = Typography;

const ProductDetail = () => {
    const [variant, setVariant] = useState<any>();
    const [activeCoupon, setActiveCoupon] = useState('');
    const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'momo' | null>(null);

    const navigate = useNavigate()

    const user = useGetUserRedux()

    const { id } = useParams();
    const { data: product1, isLoading: isLoading1 } = useQuery(['get_product', id], () => ApiProduct.get(id), { enabled: !!(id && user?.id) });
    const { data: product2, isLoading: isLoading2 } = useQuery(['get_product_client', id], () => ApiProduct.getClient(id), { enabled: !!id });

    const product = user?.id ? product1 : product2;
    const idLoading = user?.id ? isLoading1 : isLoading2

    // Thêm query cho sản phẩm liên quan
    const { data: relatedProducts, isLoading: isLoadingRelated } = useQuery(['related_products', id], () => ApiProduct.getRelatedClient(id as string), { enabled: !!id });

    useEffect(() => {
        if (product) setVariant(product?.variants?.[0])
    }, [product])

    const colorOptions = product?.variants?.map((v: any) => {
        return { label: v.type, value: v.id }
    })

    const promotions = [
        'Chất liệu cotton khử mùi',
        'NHẬP MÃ FREESHIP GIẢM NGAY 30.000đ phí vận chuyển',
        'Kiểm tra hàng trước khi thanh toán (COD)',
        'Đổi trả miễn phí trong 7 ngày nếu có lỗi từ NSX'
    ];

    const [quantity, setQuantity] = useState<number>(1);

    const { addToCart } = useCart();

    const handleAddToCart = () => {
        if (!user) {
            Swal.fire({
                title: "Bạn cần đăng nhập để sủ dụng tính năng này",
                // text: "Đăng nhập ngay",
                icon: "question",
                confirmButtonText: 'Đăng nhập ngay',

            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/login')
                }
            });
            return;
        }
        if (!variant) {
            toast.error('Vui lòng chọn một biến thể!');
            return;
        }
        if (quantity > variant.stock) {
            toast.error('Số lượng vượt quá tồn kho!');
            return;
        }

        addToCart(variant.id, quantity);
        toast.success(`${product.name} (${variant.type}) đã được thêm vào giỏ hàng!`);
        setQuantity(1);
    };

    const handleQuantityChange = (value: any) => {
        if (value >= 1 && value <= 99) setQuantity(value);
    };

    const handleBuyNow = () => {
        if (!user) {
            Swal.fire({
                title: "Bạn cần đăng nhập để sủ dụng tính năng này",
                icon: "question",
                confirmButtonText: 'Đăng nhập ngay',
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/login')
                }
            });
            return;
        }
        if (!variant) {
            toast.error('Vui lòng chọn một biến thể!');
            return;
        }
        if (quantity > variant.stock) {
            toast.error('Số lượng vượt quá tồn kho!');
            return;
        }
        setIsPaymentModalVisible(true);
    };

    const paymentMutation = useMutation(ApiCart.buyNow)
    const createPaymentMutation = useMutation(ApiCart.createPayment)


    const handlePaymentMethodSelect = async (method: 'cash' | 'momo') => {
        setPaymentMethod(method);
        try {
            if (method === 'cash') {
                // Xử lý thanh toán tiền mặt
                paymentMutation.mutate({
                    variantId: variant.id,
                    quantity: quantity
                }, {
                    onSuccess: (data: any) => {
                        toast.success('Đặt hàng thành công!');
                        setIsPaymentModalVisible(false);
                    }
                })
            } else if (method === 'momo') {
                // Xử lý thanh toán qua Momo
                createPaymentMutation.mutate({
                    variantId: variant.id,
                    quantity: quantity
                }, {
                    onSuccess: (data: any) => {
                        console.log(data);

                        window.location.href = data.paymentUrl;
                    }
                })
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra!');
        }
    };

    return (
        <div className="my-6" >
            <h1 className="text-xl font-bold mb-4">Chi tiết sản phẩm</h1>
            <Card>
                <Row gutter={[24, 24]}>
                    {/* Product Images Section - Giả sử ở đây */}
                    <Col span={12}>
                        <div className="bg-gray-100 h-96 flex items-center justify-center">
                            <img className='object-contain w-full h-full' src={product?.variants?.find((v: any) => v.id == variant?.id)?.image ?? product?.variants?.[0]?.image}></img>
                        </div>
                    </Col>

                    {/* Product Info Section */}
                    <Col span={12}>
                        <Title level={2} className="!text-2xl !mb-2">
                            {product?.name?.toUpperCase()}
                        </Title>

                        <div className="mb-4">
                            <Text type="secondary">Thương hiệu: {product?.category?.name}</Text>
                            <br />
                            <Text className="text-red-500">Đã bán 315 sản phẩm</Text>
                        </div>

                        {/* Price Section */}
                        <div className="mb-6">
                            <Row align="middle" gutter={8}>
                                <Col>
                                    <Title level={3} className="!text-red-500 !m-0">{product?.price?.toLocaleString()} đ</Title>
                                </Col>
                            </Row>
                        </div>

                        <Divider />

                        {/* Promotions */}
                        <List
                            header={<Text strong>KHUYẾN MÃI - ƯU ĐÃI</Text>}
                            dataSource={promotions}
                            renderItem={item => (
                                <List.Item>
                                    <CheckOutlined className="text-green-500 mr-2" />
                                    {item}
                                </List.Item>
                            )}
                            className="mb-6"
                        />

                        {/* Color Selection */}
                        <div className="mb-8">
                            <Text strong className="block mb-2">Phân loại:</Text>
                            <Radio.Group
                                options={colorOptions}
                                optionType="button"
                                value={variant?.id}
                                onChange={(e) => setVariant(product.variants.find((v: any) => e.target.value == v.id))}
                            />
                        </div>

                        <div className="mb-8">
                            <Text strong className="block mb-2">Số lượng:</Text>
                            <div className="flex items-center gap-2">
                                <Button
                                    icon={<MinusOutlined />}
                                    onClick={() => handleQuantityChange(quantity - 1)}
                                    disabled={quantity <= 1}
                                />
                                <InputNumber
                                    min={1}
                                    max={99}
                                    value={quantity}
                                    onChange={handleQuantityChange}
                                    className="w-16 text-center"
                                />
                                <Button
                                    icon={<PlusOutlined />}
                                    onClick={() => handleQuantityChange(quantity + 1)}
                                    disabled={quantity >= 99}
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <Row gutter={16}>
                            <Col span={12}>
                                <Button
                                    icon={<ShoppingCartOutlined />}
                                    size="large"
                                    className="w-full"
                                    onClick={handleAddToCart}
                                >
                                    Thêm vào giỏ
                                </Button>
                            </Col>
                            <Col span={12}>
                                <Button
                                    type="primary"
                                    icon={<ThunderboltOutlined />}
                                    size="large"
                                    className="w-full bg-blue-600 hover:bg-blue-700"
                                    onClick={handleBuyNow}
                                >
                                    Mua ngay
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Card>
            <br></br>
            <Row gutter={22}>
                <Col span={16}>
                    <Card>
                        <h1 className="text-lg font-bold mb-4">Mô tả sản phẩm</h1>
                        <Divider></Divider>
                        <div dangerouslySetInnerHTML={{ __html: product?.description }}></div>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title={<div className='text-center font-bold'>SẢN PHẨM LIÊN QUAN</div>}>
                        {isLoadingRelated ? (
                            <div className="flex justify-center items-center h-40">
                                <Spin />
                            </div>
                        ) : relatedProducts?.length! > 0 ? (
                            <div className="space-y-4">
                                {relatedProducts!.map((relatedProduct: any) => (
                                    <div
                                        key={relatedProduct.id}
                                        className="cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                                        onClick={() => navigate(`/product/${relatedProduct.id}`)}
                                    >
                                        <div className="flex gap-3">
                                            <img
                                                src={relatedProduct.variants?.[0]?.image}
                                                alt={relatedProduct.name}
                                                className="w-20 h-20 object-cover rounded"
                                            />
                                            <div>
                                                <Text strong className="block text-sm">
                                                    {relatedProduct.name}
                                                </Text>
                                                <Text type="secondary" className="text-xs block">
                                                    {relatedProduct.category?.name}
                                                </Text>
                                                <Text strong className="text-red-500 text-sm">
                                                    {relatedProduct.price?.toLocaleString()} đ
                                                </Text>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 py-8">
                                Không có sản phẩm liên quan
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>

            {/* Payment Method Modal */}
            <Modal
                title={<div className="text-center text-xl font-bold" > Chọn phương thức thanh toán</div>}
                open={isPaymentModalVisible}
                onCancel={() => setIsPaymentModalVisible(false)}
                footer={null}
                width={500}
                className="payment-modal"
            >
                <div className="space-y-6">
                    {/* Order Summary */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-4 mb-4">
                            <img
                                src={product?.variants?.find((v: any) => v.id == variant?.id)?.image ?? product?.variants?.[0]?.image}
                                alt={product?.name}
                                className="w-20 h-20 object-cover rounded"
                            />
                            <div>
                                <h3 className="font-semibold">{product?.name}</h3>
                                <p className="text-gray-600">{variant?.type}</p>
                                <p className="text-red-500 font-semibold">
                                    {(product?.price * quantity).toLocaleString()} đ
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Số lượng:</span>
                            <span>{quantity}</span>
                        </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="space-y-4">
                        <div className="text-center text-gray-500 mb-4">
                            Vui lòng chọn phương thức thanh toán
                        </div>

                        <Button
                            type="primary"
                            icon={<WalletOutlined />}
                            size="large"
                            className="w-full h-14 text-base hover:bg-blue-600 transition-colors"
                            onClick={() => handlePaymentMethodSelect('cash')}
                        >
                            <span>Thanh toán tiền mặt (COD)</span>
                        </Button>

                        <Button
                            type="primary"
                            icon={<QrcodeOutlined />}
                            size="large"
                            className="w-full h-14 text-base bg-pink-600 hover:bg-pink-700 transition-colors"
                            onClick={() => handlePaymentMethodSelect('momo')}
                        >
                            <span>Thanh toán qua Momo</span>
                        </Button>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-700">
                        <div className="flex items-center gap-2 mb-2">
                            <InfoCircleOutlined />
                            <span className="font-semibold">Thông tin thanh toán</span>
                        </div>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Thanh toán tiền mặt: Thanh toán khi nhận hàng</li>
                            <li>Thanh toán Momo: Chuyển hướng đến trang thanh toán Momo</li>
                        </ul>
                    </div>
                </div>
            </Modal >
        </div >
    );
};

export default ProductDetail;