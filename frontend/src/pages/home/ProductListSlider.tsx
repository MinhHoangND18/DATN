import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useQuery } from '@tanstack/react-query';
import ApiProduct from '@/api/ApiProduct';
import { Typography, Spin } from 'antd';
import ProductItem from '../product/components/ProductItem.tsx';
import './styles.scss';

const { Title } = Typography;

function ProductListSlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  const { data: products, isLoading } = useQuery(
    ['get_products_view', { page: 1, limit: 9999 }],
    () => ApiProduct.view({ page: 1, limit: 9999 }),
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="product-slider-section py-8">
      <div className="container mx-auto px-4">
        <Title level={3} className="text-gray-700 mb-6">
          Sản Phẩm Nổi Bật
        </Title>
        <div className="product-slider">
          <Slider {...settings}>
            {products?.map((product: any, index: number) => (
              <div key={index} className="px-2">
                <div className="product-slide-item">
                  <ProductItem product={product} extraClassName={'w-full'}></ProductItem>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
}

export default ProductListSlider;
