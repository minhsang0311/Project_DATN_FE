import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux"; // Import useDispatch từ Redux
import { addToCart } from "./cartSlice"; // Import action addToCart từ cartSlice
import '../styles/components/sanphamlienquan.css';

const SPLienQuan = ({ id, sosp }) => {
  const [listsp, setListSP] = useState([]); // Khởi tạo listsp là một mảng rỗng
  const dispatch = useDispatch(); // Khởi tạo useDispatch
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_HOST_URL}user/san_pham_lien_quan/${id}/${sosp}`)
      .then((res) => res.json())
      .then((data) => {
        console.log('Dữ liệu trả về từ API:', data); // Log để kiểm tra cấu trúc dữ liệu
        if (Array.isArray(data) && data.length > 0) {
          setListSP(data);
        } else if (data && data.products && Array.isArray(data.products) && data.products.length > 0) {
          setListSP(data.products); // Nếu sản phẩm nằm trong trường 'products'
        } else {
          console.error('Dữ liệu trả về không có sản phẩm liên quan hoặc không phải mảng');
          setListSP([]); // Gán mảng rỗng nếu không tìm thấy sản phẩm liên quan
        }
      })
      .catch((error) => {
        console.error('Lỗi khi lấy dữ liệu:', error);
        setListSP([]); // Gán mảng rỗng nếu có lỗi
      });
  }, [id, sosp]);


  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  const handleAddToCart = (product) => {
    const cartItem = {
      id: product.Product_ID,
      image: product.Image,
      name: product.Product_Name,
      price: product.Promotion > 0 ? product.Price - (product.Promotion * product.Price) / 100 : product.Price,
      quantity: 1 // Mặc định là 1
    };
    dispatch(addToCart(cartItem)); // Gửi hành động thêm vào giỏ hàng
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000); // Hiện thông báo trong 3 giây
  };

  console.log('Danh sách sản phẩm liên quan:', listsp); // Log danh sách sản phẩm liên quan

  return (
    <div className="splienquan">
      <h2>Sản phẩm liên quan</h2>
      {showToast && <div className="toast">Đã thêm vào giỏ hàng</div>}
      <div className="products-grid">
        {listsp.length > 0 ? (
          listsp?.slice(0, 5)?.map((sp, i) => (
            <div className="relatedproduct" key={i}>
              {sp.Promotion > 0 && (
                <div className="discount-label">
                  -{sp.Promotion}%
                </div>
              )}
              <div className="img-wrapper">
                <img src={sp.Image} alt="" />
              </div>
              <Link to={"/productDetail/" + sp.Product_ID}><a>{sp.Product_Name}</a></Link>
              <div className="price_giohang">
                <div className="price">
                  {sp.Promotion > 0 ? (
                    <>
                      <p className="old-price">{formatCurrency(sp.Price)}</p>
                      <p className="new-price">{formatCurrency(sp.Price - (sp.Promotion * sp.Price) / 100)}</p>
                    </>
                  ) : (
                    <p className="new-price">{formatCurrency(sp.Price)}</p>
                  )}
                </div>

                <button className="add-to-cart" onClick={() => handleAddToCart(sp)}>Giỏ hàng</button>
              </div>
            </div>
          ))
        ) : (
          <p>Không có sản phẩm liên quan</p>
        )}
      </div>
    </div>
  );
};

export default SPLienQuan;
