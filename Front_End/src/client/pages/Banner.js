import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import hook điều hướng
import { Link } from 'react-router-dom';
import '../styles/components/Banner.css';

const Banner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDanhMucVisible, setIsDanhMucVisible] = useState(false);
  const [listbrands, setListbrands] = useState([]);
  const totalImages = 4;
  const navigate = useNavigate(); // Hook điều hướng
  
  useEffect(() => {
    fetch(`${process.env.REACT_APP_HOST_URL}user/brand`)
      .then((res) => res.json())
      .then((data) => setListbrands(data));
  }, []);

  // Tự động chuyển ảnh sau mỗi 4 giây
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalImages);
    }, 4000);
    return () => clearInterval(interval);
  }, [totalImages]);

  // Danh sách ảnh với productId tương ứng
  const images = [
    { src: '../assets/img/banner1.jpg', productId: 63 },
    { src: '../assets/img/banner2.jpg', productId: 64 },
    { src: '../assets/img/banner3.webp', productId: 65 },
    { src: '../assets/img/banner4.png', productId: 17 },
  ];

  // Xử lý khi click vào ảnh
  const handleImageClick = (productId) => {
    navigate(`/productDetail/${productId}`); // Chuyển hướng đến trang chi tiết sản phẩm
  };

  return (
    <div className="banner">
      {/* Menu danh mục */}
      <div className="menu-doc">
        <div className="danh-muc" onClick={() => setIsDanhMucVisible(!isDanhMucVisible)}>
          <i className="fa-solid fa-bars"></i> <p>Hãng sản phẩm</p>
        </div>
        <ul id="danh-muc-list" style={{ display: isDanhMucVisible ? 'none' : 'block' }}>
          {listbrands.map((brand) => (
            <li key={brand.Brand_ID}>
              <Link to={`/brand/${brand.Brand_ID}`}>{brand.Brand_Name}</Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Banner chính */}
      <div className="trai">
        <div
          className="image-container"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <img
              key={index}
              src={image.src}
              alt={`Banner ${index + 1}`}
              className="banner-image"
              onClick={() => handleImageClick(image.productId)} // Thêm sự kiện onClick
            />
          ))}
        </div>

        {/* Nút chuyển ảnh */}
        <div className="prev-next">
          <i
            className="fa-solid fa-chevron-left"
            onClick={() =>
              setCurrentIndex((currentIndex === 0 ? totalImages : currentIndex) - 1)
            }
          ></i>
          <i
            className="fa-solid fa-chevron-right"
            onClick={() => setCurrentIndex((currentIndex + 1) % totalImages)}
          ></i>
        </div>

        {/* Chỉ báo ảnh */}
        <div className="indicators">
          {images.map((_, index) => (
            <div
              key={index}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Banner;
