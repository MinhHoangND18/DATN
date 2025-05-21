import { Typography } from 'antd';
import React from 'react';
const { Title } = Typography;
const ContactPage = () => {
  return (
    <section className="page_contact section py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <Title level={2} className="text-center mb-16 text-gray-800 font-bold">
          Liên hệ với chúng tôi
        </Title>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Section */}
          <div className="left-contact bg-white rounded-lg shadow-lg p-8">
            <div className="max-w-3xl mx-auto">
              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Về chúng tôi</h3>
                <p className="text-gray-600 leading-relaxed">
                  Chúng tôi đam mê thời trang và đã dày công xây dựng một đội ngũ có chung tình yêu
                  với những chất liệu tuyệt đẹp và tay nghề thủ công tinh xảo.
                </p>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  Dù bạn đang khám phá cửa hàng trực tuyến của chúng tôi hay đến thăm trực tiếp, chúng
                  tôi luôn sẵn sàng trò chuyện về những nhà thiết kế yêu thích của mình, những câu
                  chuyện đằng sau các sáng tạo của họ, và cách tìm được món đồ hoàn hảo cho tủ quần áo
                  của bạn.
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Thông tin liên hệ</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-gray-600">098 479 49 85</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-600">nhacotat@gmail.com</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-gray-600">35 Trung Yên 9, Cầu Giấy, Hà Nội</span>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Giờ làm việc</h3>
                <p className="text-gray-600">Thứ 2 – Thứ 7: 8:00 - 18:00</p>
              </div>

              <div className="flex justify-center">
                <img
                  src="https://cotat.vn/wp-content/uploads/2024/06/cropped-logo-ctt-ngang-03-time-skip-355b465042.png"
                  alt="Logo Có Tất"
                  className="w-48"
                />
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="space-y-8">
            {/* Google Maps */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.37936366294!2d105.79850967599832!3d21.017501488163855!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab5ea3a64ebd%3A0x801783848f52529e!2zVHJ1bmcgWcOqbiA5QSwgWcOqbiBIb8OgLCBD4bqndSBHaeG6pXksIEjDoCBO4buZaSwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1744554130889!5m2!1svi!2s"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Gửi tin nhắn cho chúng tôi</h2>
              <form method="post" action="/postcontact" className="space-y-6">
                <input type="hidden" name="FormType" value="contact" />
                <input type="hidden" name="utf8" value="true" />
                <div>
                  <input
                    type="text"
                    name="contact[Name]"
                    placeholder="Họ tên*"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="contact[email]"
                    placeholder="Email*"
                    required
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="contact[Phone]"
                    placeholder="Số điện thoại*"
                    required
                    pattern="\d+"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  />
                </div>
                <div>
                  <textarea
                    name="contact[body]"
                    placeholder="Nhập nội dung*"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    rows={5}
                  ></textarea>
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
                  >
                    Gửi liên hệ
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
