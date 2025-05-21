import { useEffect, useState } from 'react';
import { Card, Col, Row, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import ApiCategory from '@/api/ApiCategory';
import './styles.scss';

const { Title } = Typography;

function CategoriesSlider() {
  const navigate = useNavigate();

  const { data: categories } = useQuery(['get_categories_home'], () =>
    ApiCategory.list({ page: 1, limit: 9999 }),
  );

  const getCategory = (_categories: any) => {
    if (!_categories) return [];
    const _list = _categories.filter((_: any, idx: any) => idx <= 10);
    if (_list.length === 11) _list.push({ id: 999999999, name: '...' });
    return _list;
  };

  const handleClick = (id: number) => {
    return navigate(`/product?category=${id}`);
  };

  return (
    <div className="categories-section py-8">
      <div className="container mx-auto px-4">
        <Title level={3} className="text-gray-700 mb-6">
          Danh Mục Sản Phẩm
        </Title>
        <Row gutter={[16, 16]} className="categories-grid">
          {getCategory(categories?.results).map((category: any, index: number) => (
            <Col key={category?.id || index} xs={12} sm={8} md={6} lg={4}>
              <div
                onClick={() => handleClick(category.id)}
                className="category-card"
              >
                <div className="category-content">
                  <span className="category-name">
                    {category.name}
                  </span>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}

export default CategoriesSlider;
