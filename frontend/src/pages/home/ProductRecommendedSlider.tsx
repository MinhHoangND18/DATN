import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useQuery } from '@tanstack/react-query';
import ApiProduct from '@/api/ApiProduct';
import { Card, Checkbox, Col, Divider, Row, Select, Spin } from 'antd';
import ProductItem from '../product/components/ProductItem.tsx';

function ProductRecommendedSlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
  };

  const { data: products, isLoading: pLoading } = useQuery(
    ['get_products_recommend', { page: 1, limit: 9999 }],
    () => ApiProduct.recommend({ page: 1, limit: 9999 }),
  );

  return (
    <>
      <Row gutter={12}>
        <span
          style={{
            fontSize: '1.4rem',
            fontWeight: '600',
            color: 'rgba(0,0,0,0.64)',
            marginLeft: '8px',
            marginBottom: '8px',
          }}
        >
          Gợi Ý Cho Bạn
        </span>
      </Row>
      <div className="slider-container">
        <Slider {...settings}>
          {products?.map((product: any, index: any) => (
            <div key={index} style={{ margin: '0 8px' }}>
              <ProductItem product={product} extraClassName={'w-96-percent'}></ProductItem>
            </div>
          ))}
        </Slider>
      </div>
    </>
  );
}

export default ProductRecommendedSlider;
