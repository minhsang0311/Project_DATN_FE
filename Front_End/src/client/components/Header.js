import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Nav from './Nav';
import '../styles/components/Header.css';
import { useSelector } from 'react-redux';

function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [userName, setUserName] = useState(null); // Lấy thông tin người dùng từ localStorage
  const [showDropdown, setShowDropdown] = useState(false); // Hiện menu dropdown
  const [wishlistCount, setWishlistCount] = useState(0); // Lưu số lượng sản phẩm yêu thích
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${searchQuery}`); // Điều hướng với query
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser); // Parse chuỗi JSON từ localStorage
      if (user.role === 0) {
        setUserName(user.username); // Lấy tên người dùng từ dữ liệu và lưu vào state
      }
    }
  }, []);

  // Lấy userId từ localStorage
  const storedUser = localStorage.getItem('user');
  const userId = storedUser ? JSON.parse(storedUser).id : null;

  useEffect(() => {
    if (userId) {
      // Lấy số lượng sản phẩm trong danh sách yêu thích
      fetch(`${process.env.REACT_APP_HOST_URL}user/wishlist/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          setWishlistCount(data.length); // Cập nhật số lượng sản phẩm yêu thích
        })
        .catch((err) => console.error('Lỗi khi lấy danh sách yêu thích:', err));
    }
  }, [userId]);

  const cartItems = useSelector((state) => state.cart.items);
  // Tính tổng số lượng sản phẩm trong giỏ hàng
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header>
      <div className="top">
        <ul className="trai">
          <Link to="/about">Giới thiệu</Link>|
          <Link to="/contact">Liên hệ</Link>|
          <li>
            <a href="tel:+8427718379">
              Hotline: <span><b>+84277718379</b></span>
            </a>
          </li>
        </ul>
        <ul className="phai1">
          {userName ? (
            <li
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              Xin chào, {userName}
              {showDropdown && (
                <div className="dropdown">
                  <Link to="/change-password" className="change-pw">Đổi mật khẩu</Link>
                  <button onClick={() => { localStorage.removeItem('tokenUser'); localStorage.removeItem('user'); setUserName(null); navigate('/'); }}>Thoát</button>
                </div>
              )}
            </li>
          ) : (
            <li><Link to="/register_login">Xin chào!</Link></li>
          )}
        </ul>
      </div>
      <hr className="hr" />
      <div className="middle">
        <div className="logo_trangchu">
          <Link to="/"><img src="../assets/img/logo3.png" alt="Logo" /></Link>
        </div>
        <div>
          <form className="timkiem" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Sản phẩm muốn tìm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
        <div className="right">
          <div className="icon_user">
            <Link to="/register_login">
              <i className="fa-solid fa-user fa-2x"></i>
            </Link>
          </div>
          <div className="giohang">
            <Link to="/cart">
              <div className="cart-icon">
                <i className="fa-solid fa-cart-shopping"></i>
                {totalQuantity > 0 && <span className="cart-count">{totalQuantity}</span>}
              </div>
            </Link>
          </div>
          <div className="wishlist">
            {/* Sử dụng userId từ localStorage trong đường dẫn */}
            {userId && (
              <Link to={`/wishlist/${userId}`}>
                <div className="wishlist-icon">
                  <i className="bi bi-heart-fill"></i>
                  {wishlistCount > 0 && <span className="wishlist-count">{wishlistCount}</span>}
                </div>
              </Link>
            )}
          </div>
          <div className="trangthai">
            <Link to="/order"><i className="bi bi-truck"></i></Link>
          </div>
        </div>
      </div>
      <Nav />
    </header>
  );
}

export default Header;
