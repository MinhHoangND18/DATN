import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useMemo } from 'react';
import './styles.scss';

function BannerSlider(props: { products: any }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    arrows: true,
    fade: true,
    cssEase: 'linear',
    dotsClass: 'slick-dots custom-dots',
    customPaging: () => (
      <div className="custom-dot"></div>
    ),
  };

  const images = useMemo(() => {
    let res: any = [];
    if (props.products?.length > 0) {
      props.products.forEach(item => {
        if (item?.variants && item?.variants?.length > 0) {
          res = [...res, item?.variants?.map(i => i?.image)];
        }
      });
    }
    return res;
  }, [props.products]);

  return (
    <div className="banner-slider">
      <div className="slider-container relative">
        <Slider {...settings}>
          {images.map((image, index) => (
            <div key={index} className="banner-slide">
              <div className="relative w-full h-[560px] overflow-hidden">
                <img
                  src={image}
                  alt=""
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default BannerSlider;
