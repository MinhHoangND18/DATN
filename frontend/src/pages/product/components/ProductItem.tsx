import React from 'react'
import './index.scss'
import { Button } from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

function ProductItem({ product, extraClassName }: any) {
    return (
        <div className={'product_item_main ' + (extraClassName ? extraClassName : '')}>
            <div className='product_thumbnail'>
                <img src={product?.variants?.[0]?.image}></img>
            </div>
            <div className="product_info">
                <div className="product_title">{product?.name}</div>
                <div className="product_item_cta">
                    <div className="price_box">{(product?.price).toLocaleString()} đ</div>
                    <Link to={`/product/${product.id}`} className="btn_buy h-8 flex justify-center items-center font-bold mr-2">
                        {/* <ShoppingCartOutlined /> */}
                        Chi tiết
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ProductItem