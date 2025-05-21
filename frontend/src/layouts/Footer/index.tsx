import React from "react";
import "./index.scss"

function Footer() {
    return (
        <footer className="bg-white py-6">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Logo & Contact */}
                    <div>
                        <a href="/" className="mb-3 block">
                            <img
                                src="https://cotat.vn/wp-content/uploads/2024/06/cropped-logo-ctt-ngang-03-time-skip-355b465042.png"
                                alt="Có tất"
                                width={174}
                                height={50}
                            />
                        </a>
                        <div className="space-y-2">
                            <div className="flex items-start">
                                <i className="fas fa-map-marker-alt text-gray-600 mr-2" />
                                <span><strong>Địa chỉ:</strong> 35 Trung Yên 9, Trung Hòa, Cầu Giấy</span>
                            </div>
                            <div className="flex items-center">
                                <i className="fas fa-mobile-alt text-gray-600 mr-2" />
                                <span><strong>Số điện thoại:</strong> <a href="tel:0902692646" className="text-blue-500">0902 69 26 46</a></span>
                            </div>
                            <div className="flex items-center">
                                <i className="fas fa-envelope text-gray-600 mr-2" />
                                <span><strong>Email:</strong> <a href="mailto:cotat@gmail.com" className="text-blue-500">cotat@gmail.com</a></span>
                            </div>
                        </div>
                    </div>
                    {/* Customer Support */}
                    <div>
                        <h4 className="text-lg font-semibold mb-2">Hỗ trợ khách hàng</h4>
                        <ul className="space-y-2">
                            <li><a href="/" className="text-gray-600 hover:text-blue-500">Trang chủ</a></li>
                            <li><a href="/introduce" className="text-gray-600 hover:text-blue-500">Giới thiệu</a></li>
                            <li><a href="/product" className="text-gray-600 hover:text-blue-500">Sản phẩm</a></li>
                            {/* <li><a href="/tin-tuc" className="text-gray-600 hover:text-blue-500">Tin tức</a></li> */}
                            <li><a href="/" className="text-gray-600 hover:text-blue-500">Liên hệ</a></li>
                        </ul>
                    </div>
                    {/* Policies */}
                    <div>
                        <h4 className="text-lg font-semibold mb-2">Chính sách</h4>
                        <ul className="space-y-2">
                            <li><a href="/chinh-sach-mua-hang" className="text-gray-600 hover:text-blue-500">Chính sách mua hàng</a></li>
                            <li><a href="/chinh-sach-doi-tra" className="text-gray-600 hover:text-blue-500">Chính sách đổi trả</a></li>
                            <li><a href="/chinh-sach-van-chuyen" className="text-gray-600 hover:text-blue-500">Chính sách vận chuyển</a></li>
                        </ul>
                    </div>
                    {/* Fanpage & Payment */}
                    <div>
                        <h4 className="text-lg font-semibold mb-2">Fanpage</h4>
                        <div className="mb-4">
                            <div className="fb-page" data-href="https://www.facebook.com/cotat/" data-tabs="" data-width="" data-height="" data-small-header="true" data-adapt-container-width="true" data-hide-cover="false" data-show-facepile="true"></div>
                        </div>
                        <h4 className="text-lg font-semibold mb-2">Phương thức thanh toán</h4>
                        <a href="/" target="_blank">
                            <img
                                className="w-64 h-auto"
                                src="//bizweb.dktcdn.net/100/476/370/themes/893647/assets/footer_trustbadge.jpg?1729095712074"
                                alt=""
                            />
                        </a>
                    </div>
                </div>
            </div>
            <div className="bg-gray-100 py-2 mt-6 text-center text-sm">
                <span>
                    © Bản quyền thuộc về <a href="/" className="text-blue-500 font-semibold">Có tất</a>
                </span>
            </div>
        </footer>
    );
}
export default Footer;
