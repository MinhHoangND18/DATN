import ApiProduct from '@/api/ApiProduct'
import { useQuery } from '@tanstack/react-query'
import { Button, Col, Divider, InputNumber, Row, Spin, Tag, Typography } from 'antd'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import ProductSlide from './components/ProductSlide'
import { ShoppingCartOutlined } from '@ant-design/icons'
const { Title, Text } = Typography;
function ProductDetail() {
    const { id } = useParams()

    const { data: product, isLoading } = useQuery(['get_product', id], () => ApiProduct.get(id), { enabled: !!id })
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [quantity, setQuantity] = useState<number>(1);


    const handleAddToCart = () => {
        // Thêm logic thêm vào giỏ hàng ở đây
        console.log('Add to cart', { product, selectedColor, quantity });
    };

    return (
        <div className="p-4 max-w-6xl">
            <h1 className="text-xl font-bold mb-4">Chi tiết sản phẩm</h1>
            {isLoading ? (
                <div className="flex justify-center">
                    <Spin size="large" />
                </div>
            ) : (
                <Row gutter={18}>
                    <Col span={12}>
                        <ProductSlide image={[]}></ProductSlide>
                    </Col>
                    <Col xs={24} md={14}>
                        <Title level={4}>{product?.name}</Title>

                        {/* Giá & giảm giá */}
                        <div className="flex items-center mb-2">
                            <Text className="text-red-500 font-bold text-xl mr-2">
                                {product.price.toLocaleString('vi-VN')}₫
                            </Text>
                            {product.oldPrice && (
                                <Text delete className="text-gray-500 mr-2">
                                    {product.oldPrice.toLocaleString('vi-VN')}₫
                                </Text>
                            )}
                            {product.discountPercent && (
                                <Tag color="red">- {product.discountPercent}%</Tag>
                            )}
                        </div>

                        <Divider />

                        {/* Màu sắc */}
                        <div className="mb-4">
                            <Text className="font-semibold">Màu sắc:</Text>
                            <div className="flex items-center mt-2 space-x-2">
                                {product?.variants?.map((variant: any) => (
                                    <div
                                        key={variant.type}
                                        onClick={() => setSelectedColor(variant.type)}
                                        className={`border rounded-full p-1 cursor-pointer ${variant.type === selectedColor ? 'border-blue-500' : 'border-gray-300'
                                            }`}
                                        title={variant.type}
                                    >
                                        <img src={variant.image} alt={variant.type} />
                                    </div>
                                ))}
                            </div>
                            {selectedColor && (
                                <Text className="mt-1 block text-gray-600">
                                    Đã chọn: <strong>{selectedColor}</strong>
                                </Text>
                            )}
                        </div>

                        {/* Số lượng & thêm vào giỏ */}
                        <div className="flex items-center space-x-4 mb-4">
                            <div>
                                <Text className="font-semibold mr-2">Số lượng:</Text>
                                <InputNumber
                                    min={1}
                                    max={100}
                                    value={quantity}
                                    onChange={(value) => setQuantity(value || 1)}
                                />
                            </div>
                            <Button
                                type="primary"
                                icon={<ShoppingCartOutlined />}
                                onClick={handleAddToCart}
                            >
                                Thêm vào giỏ
                            </Button>
                        </div>

                        <Divider />

                        {/* KHUYẾN MÃI - ƯU ĐÃI */}
                        <div className="mb-4">
                            <div className="flex items-center mb-2">
                                <img
                                    alt="KHUYẾN MÃI - ƯU ĐÃI"
                                    src="https://bizweb.dktcdn.net/100/476/370/themes/893647/assets/icon-product-promotion.png"
                                    width={20}
                                    height={20}
                                    className="mr-2"
                                />
                                <Text className="font-bold">KHUYẾN MÃI - ƯU ĐÃI</Text>
                            </div>
                            {/* <ul className="list-disc list-inside text-gray-700">
                                {product.promotions.map((promo: any, idx) => (
                                    <li key={idx}>{promo}</li>
                                ))}
                            </ul> */}
                        </div>

                        {/* Mã giảm giá */}
                        {/* {product.discountCodes.length > 0 && (
                            <div className="mb-4">
                                <Text strong className="mr-2">
                                    Mã giảm giá:
                                </Text>
                                {product.discountCodes.map((code, idx) => (
                                    <Tag color="blue" key={idx}>
                                        {code}
                                    </Tag>
                                ))}
                            </div>
                        )} */}
                    </Col>
                </Row>



            )}
        </div>
    )
}

export default ProductDetail