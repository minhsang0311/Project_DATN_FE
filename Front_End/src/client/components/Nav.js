import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import '../styles/components/Nav.css';

const Nav = () => {
  const [list, setListCategories] = useState([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false); // State để toggle menu trên mobile

  useEffect(() => {
    fetch(`${process.env.REACT_APP_HOST_URL}user/category`)
      .then(res => res.json())
      .then(data => setListCategories(data));
  }, []);

  return (
    <div className="bottom_trangchu">
      {/* Icon menu cho mobile */}
      <div className="mobile_menu_icon" onClick={() => setShowMobileMenu(!showMobileMenu)}>
        <i className="fa-solid fa-bars fa-2x"></i>
      </div>

      {/* Menu ngang */}
      <ul className={`menu_trangchu ${showMobileMenu ? 'show' : ''}`}>
        <li><Link to="/">Trang chủ</Link></li>
        <li><Link to="/cuahang">Cửa hàng</Link></li>
        {list?.map((category, index) => (
          <li key={index}>
            <Link to={`/category/${category.Category_ID}`}>{category.Category_Name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Nav;
