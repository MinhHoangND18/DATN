import React from 'react';
import './index.scss';

function IntroducePage() {
    return (
        <>
            <div className="max-w-6xl mx-auto bg-white p-8 shadow-lg grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Phần văn bản */}
                <div>
                    <h1 className="text-3xl font-bold mb-4">Câu chuyện về Có Tất</h1>
                    <h2 className="text-xl font-semibold mb-4">Bắt đầu từ 2018</h2>
                    <p className="text-gray-700 mb-4">
                        Câu chuyện khởi đầu, chỉ đơn giản là để tìm cho chính mình dùng. Đôi tất vừa có màu hợp
                        gu, mẫu mã đẹp lại có chất lượng thật tốt. Sau đó vì thấy khoảng trống này ở thị trường
                        và nhiều bạn bè cũng có nhu cầu tương tự nên Có Tất ra đời nhằm mục đích mang những sản
                        phẩm tất/vớ vừa chất lượng cao, vừa mẫu mã đẹp và đủ đa dạng để thỏa mãn trải nghiệm và
                        sợ thích.
                        <br />
                        <br />
                        Theo thời gian, mức độ kỹ tính tăng dần, Có Tất nâng dần level kỹ tính từ tiêu chuẩn
                        Việt Nam, sang tất tiêu chuẩn xuất khâu cho thị trường EU, rồi đến sang tiêu chuẩn tất
                        Nhật Bản.
                        <br />
                        <br />
                        Có Tất không chỉ đơn thuần là một thương hiệu tất, mà còn là tâm huyết của những người
                        làm sản phẩm dành cho những người trân trọng từng chi tiết nhỏ. Chúng tôi hiểu rằng, mỗi
                        đôi chân đều xứng đáng được nâng niu, và mỗi cá nhân đều có một phong cách riêng biệt.
                        <br />
                        <br />
                        Chính vì vậy, mỗi sản phẩm của Có Tất đều là kết tinh của sự tỉ mỉ và tâm huyết. Chúng
                        tôi không ngừng tìm tòi, thử nghiệm và chọn lọc những chất liệu tốt nhất, từ cotton mềm
                        mại, thoáng khí đến len cashmere cao cấp, để mang đến cho bạn những trải nghiệm êm ái và
                        thoải mái nhất.
                        <br />
                        <br />
                        Không chỉ “xịn” về chất liệu, Có Tất còn “chuẩn gu” trong từng thiết kế. Chúng tôi hợp
                        tác với những nhà thiết kế tài năng, không ngừng sáng tạo để mang đến những mẫu mã đa
                        dạng, độc đáo, từ cổ điển đến hiện đại, từ đơn giản đến phá cách, đáp ứng mọi nhu cầu và
                        phong cách của bạn.
                        <br />
                        <br />
                        Có Tất đã dành khá nhiều năm, chỉ bán và bán vớ. Muốn mang đến cho thị trường những đôi
                        tất tốt hơn kỳ vọng của người dùng với thị trường hiện tại mà ít bên nào theo đuổi được.
                    </p>
                </div>
                {/* Phần hình ảnh */}
                <div className="flex justify-center">
                    <img
                        src="https://cotat.vn/wp-content/uploads/2024/06/images-upload-woo2F2662f987f026a6b621a7f65982e7ba97-1.jpg"
                        alt="Hình ảnh Có Tất"
                        className="rounded-lg shadow-md w-full h-auto object-cover"
                    />
                </div>
            </div>
            <div className="max-w-7xl mx-auto bg-white p-8 shadow-lg grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                {/* Hình ảnh bên trái */}
                <div className="flex justify-center">
                    <img
                        src="https://cotat.vn/wp-content/uploads/2024/06/z5512266249552e3340-time-skip-ffb2f4cdc1-768x1024.webp"
                        alt="Hình ảnh hộp tất"
                        className="rounded-lg shadow-md w-full h-auto object-cover"
                    />
                </div>
                {/* Phần văn bản ở giữa */}
                <div>
                    <h1 className="text-3xl font-bold mb-4">Như thế nào là một đôi tất tốt?</h1>
                    <p className="text-gray-700 mb-4">
                        Không mất nhiều thời gian để chúng tôi tìm thấy câu trả lời. Khi Có Tất chỉ làm tất và
                        làm tất trong 5 năm qua.
                        <br />
                        <br />
                        Với Có Tất, đó là đôi tất không chỉ tô điểm cho ngày dài của bạn, mà còn làm nó thêm
                        phần phong phú, thậm chí thay đổi cả ngày của bạn.
                        <br />
                        <br />
                        Đó là đôi tất mà ngay từ khoảnh khắc bạn cảm trên tay, xỏ vào chân, hay cởi ra, bạn đều
                        cảm nhận được sự khác biệt rõ rệt.
                        <br />
                        <br />
                        Đó là đôi tất mà ngày mai bạn vẫn muốn mang lại.
                        <br />
                        <br />
                        Ấm khi lạnh, mát khi nóng. Chúng tôi không làm ra những đôi tất "tạm được", mà luôn trăn
                        trở làm sao để chúng tốt hơn nữa.
                    </p>
                </div>
                {/* Hình ảnh bên phải */}
                <div className="flex justify-center">
                    <img
                        src="https://cotat.vn/wp-content/uploads/2024/06/z5515138282939da6f4-time-skip-a884ce2653-770x1024.jpg"
                        alt="Hình ảnh tất trên chân"
                        className="rounded-lg shadow-md w-full h-auto object-cover"
                    />
                </div>
            </div>
            <div className="max-w-7xl mx-auto bg-white p-8 shadow-lg">
                <h1 className="text-3xl font-bold text-center mb-6">Bộ sưu tập tất</h1>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                    <img
                        src="https://cotat.vn/wp-content/uploads/2024/06/images-upload-woo2Fea19fb517ff74ced663ae5101438aecb.jpg"
                        alt="Hình 1"
                        className="rounded-lg shadow-md object-cover w-full h-[240px]"
                    />
                    <img
                        src="https://cotat.vn/wp-content/uploads/2024/06/images-upload-woo2Fdd755a312b0d6a8d8717739b74c5a72d-1.jpg"
                        alt="Hình 2"
                        className="rounded-lg shadow-md object-cover w-full h-[240px]"
                    />
                    <img
                        src="https://cotat.vn/wp-content/uploads/2024/06/images-upload-woo2F2e5441eea6a1a51457b0bd6667f89649-2.jpg"
                        alt="Hình 3"
                        className="rounded-lg shadow-md object-cover w-full h-[240px]"
                    />
                    <img
                        src="https://cotat.vn/wp-content/uploads/2024/06/images-upload-woo2F2ebf98214df2ab1a12f467b56328743b-1.jpg"
                        alt="Hình 4"
                        className="rounded-lg shadow-md object-cover w-full h-[240px]"
                    />
                    <img
                        src="https://cotat.vn/wp-content/uploads/2024/06/images-upload-woo2Fc7e8733f8cf8c2ab900f227319cb73f2-1.jpg"
                        alt="Hình 5"
                        className="rounded-lg shadow-md object-cover w-full h-[240px]"
                    />
                    <img
                        src="https://cotat.vn/wp-content/uploads/2024/06/images-upload-woo2F4d19f3f5c869acdf098bafd96a560141-1.jpg"
                        alt="Hình 6"
                        className="rounded-lg shadow-md object-cover w-full h-[240px]"
                    />
                    <img
                        src="https://cotat.vn/wp-content/uploads/2024/06/images-upload-woo2Faa3f58acdd6089ec60fe82539ace9414-1.jpg"
                        alt="Hình 7"
                        className="rounded-lg shadow-md object-cover w-full h-[240px]"
                    />
                    <img
                        src="https://cotat.vn/wp-content/uploads/2024/06/images-upload-woo2Fbe27e499dfaab5d6b06b6336449ce69b.jpg"
                        alt="Hình 8"
                        className="rounded-lg shadow-md object-cover w-full h-[240px]"
                    />
                </div>
            </div>
            <div className="max-w-6xl mx-auto bg-white shadow-md p-6 flex flex-col md:flex-row items-start">
                <div className="md:w-1/2 p-4">
                    <img
                        src="https://cotat.vn/wp-content/uploads/2024/06/img3349-time-skip-da4a6c2e42-769x1024.webp"
                        alt="Hình ảnh tất"
                        className="w-full rounded-lg shadow-lg"
                    />
                </div>
                <div className="md:w-1/2 p-4">
                    <h2 className="text-2xl font-bold text-gray-800">Mong muốn</h2>
                    <p className="mt-4 text-gray-600">
                        Sau nhiều thời gian, chúng tôi chỉ muốn Có Tất được khách hàng nhớ đến như là một brand
                        bán những đôi tất chất lượng cao và có các hoạt động marketing độc đáo, thú vị, đồng
                        điệu với đời sống của khách hàng.
                    </p>
                    <p className="mt-2 text-gray-600">
                        Cùng với hơn 500.000 khách hàng trên khắp mọi miền đất nước, Có Tất đã không ngừng thử
                        nghiệm, chọn lọc và cải tiến để mang đến những sản phẩm tốt nhất...
                    </p>
                    <p className="mt-2 text-gray-600">
                        Có Tất không chỉ là những đôi tất, mà còn là người bạn đồng hành trên mọi nẻo đường...
                    </p>
                    <p className="mt-2 text-gray-600">
                        Hãy để Có Tất đồng hành cùng bạn, khám phá và thể hiện cá tính riêng của mình...
                    </p>
                    <div className="text-end">
                        <p className="mt-4 font-bold text-gray-800">Có Tất Là Có Tất,</p>
                        <p className="text-gray-600">Trân trọng</p>
                    </div>
                </div>
            </div>
        </>
    );
}
export default IntroducePage;
