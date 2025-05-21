import { useEffect, useMemo, useState } from "react";
import { Card, Checkbox, Col, Divider, Row, Select, Spin, Input, Button } from "antd";
import ProductItem from "./components/ProductItem";
import { useQuery } from "@tanstack/react-query";
import ApiCategory from "@/api/ApiCategory";
import ApiProduct from "@/api/ApiProduct";
import { useSearchParams } from "react-router-dom";
import { SearchOutlined, FilterOutlined, DownOutlined } from "@ant-design/icons";
import "./styles.scss";

const priceRanges = [
  { id: "duoi-50000", label: "Giá dưới 50.000₫", value: "(<50000)" },
  { id: "50000-100000", label: "50.000₫ - 100.000₫", value: "(>=50000 AND <=100000)" },
  { id: "100000-300000", label: "100.000₫ - 300.000₫", value: "(>=100000 AND <=300000)" },
  { id: "300000-500000", label: "300.000₫ - 500.000₫", value: "(>=300000 AND <=500000)" },
  { id: "500000-7000000", label: "500.000₫ - 7.000.000₫", value: "(>=500000 AND <=7000000)" },
  { id: "7000000-10000000", label: "7.000.000₫ - 10.000.000₫", value: "(>=7000000 AND <=10000000)" },
  { id: "tren10000000", label: "Giá trên 10.000.000₫", value: "(>=10000000)" },
];

export default function ProductList() {
  const [selectedCategory, setSelectedCategory] = useState<number[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [params, setParams] = useState<Query & { price_min?: number, price_max?: number, sort_by?: string }>({
    page: 1,
    limit: 9999,
    sort_by: 'newest'
  });
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('category');
  const [searchText, setSearchText] = useState('');

  const { data: categories, isLoading: cLoading } = useQuery(
    ['get_categories'],
    () => ApiCategory.list({ page: 1, limit: 9999 })
  );

  const { data: products, isLoading: pLoading } = useQuery(
    ['get_products', params],
    () => ApiProduct.list(params)
  );

  const handleChangeCategory = (e: any, id: number) => {
    if (e.target.checked) {
      setSelectedCategory((p) => [...p, id])
    } else {
      setSelectedCategory(p => p.filter(r => r != id))
    }
  }

  const handleChangePriceRange = (e: any, range: any) => {
    if (e.target.checked) {
      setSelectedPriceRange(range.id);
      // Xử lý giá trị price_min và price_max từ value của range
      const priceValue = range.value;
      const matches = priceValue.match(/\d+/g);
      if (matches) {
        if (priceValue.startsWith('(<')) {
          setParams(p => ({ ...p, price_max: Number(matches[0]) }));
        } else if (priceValue.startsWith('(>=')) {
          setParams(p => ({
            ...p,
            price_min: Number(matches[0]),
            price_max: matches[1] ? Number(matches[1]) : undefined
          }));
        }
      }
    } else {
      setSelectedPriceRange(null);
      setParams(p => ({
        ...p,
        price_min: undefined,
        price_max: undefined
      }));
    }
  }

  const handleChangeSort = (value: string) => {
    setSortBy(value);
    setParams(p => ({ ...p, sort_by: value }));
  }

  useEffect(() => {
    if (selectedCategory.length) {
      setParams(p => ({
        ...p,
        filter: `{"category.id": "$in:${selectedCategory.join(',')}"}`
      }));
    } else {
      setParams(p => ({
        ...p,
        filter: undefined
      }));
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (categoryId) {
      setSelectedCategory([Number(categoryId)]);
    }
  }, [categoryId]);

  return (
    <div className="product-page">
      <div className="product-header">
        <h1 className="product-title">Sản phẩm</h1>
        <div className="product-search">
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            prefix={<SearchOutlined />}
            value={params.search}
            onChange={(e) => setParams(p => ({ ...p, search: e.target.value }))}
          />
        </div>
      </div>

      {cLoading || pLoading ? (
        <div className="loading-container">
          <Spin size="large" />
        </div>
      ) : (
        <div className="product-content">
          <div className="product-sidebar">
            <div className="filter-section">
              <h3 className="filter-title">
                <FilterOutlined /> Bộ lọc
              </h3>
              <div className="category-list">
                <h4 className="category-title">Danh mục</h4>
                {categories?.results.map(c => (
                  <div key={c.name} className="category-item">
                    <Checkbox
                      checked={selectedCategory.includes(c.id)}
                      onChange={(e) => handleChangeCategory(e, c.id)}
                    >
                      {c.name}
                    </Checkbox>
                  </div>
                ))}
              </div>

              <Divider className="filter-divider" />

              <div className="price-filter">
                <h4 className="price-title">Khoảng giá</h4>
                {priceRanges.map((range) => (
                  <div key={range.id} className="price-item">
                    <Checkbox
                      checked={selectedPriceRange === range.id}
                      onChange={(e) => handleChangePriceRange(e, range)}
                    >
                      {range.label}
                    </Checkbox>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="product-grid">
            <div className="product-sort">
              <Select
                value={sortBy}
                style={{ width: 200 }}
                suffixIcon={<DownOutlined />}
                onChange={handleChangeSort}
                options={[
                  { value: 'popular', label: 'Phổ biến nhất' },
                  { value: 'newest', label: 'Mới nhất' },
                  { value: 'price_asc', label: 'Giá thấp đến cao' },
                  { value: 'price_desc', label: 'Giá cao đến thấp' },
                ]}
              />
            </div>
            <Row gutter={[24, 24]}>
              {products?.results.map((product, index) => (
                <Col key={index} span={6}>
                  <ProductItem product={product} />
                </Col>
              ))}
            </Row>
          </div>
        </div>
      )}
    </div>
  );
}
