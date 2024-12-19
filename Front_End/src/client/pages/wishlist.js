import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import '../styles/components/Wishlist.css';

function Wishlist() {
    const navigate = useNavigate();
    const [wishlist, setWishList] = useState([]);
    const [error, setError] = useState(null);

    const tokenUser = localStorage.getItem("tokenUser");
    const tokenRole = JSON.parse(localStorage.getItem("user"));
    const userId = tokenRole?.id;

    useEffect(() => {
        if (!tokenUser) {
            alert("Bạn cần phải đăng nhập để xem sản phẩm đã yêu thích.");
            navigate("/register_login");
            return;
        }

        if (tokenRole?.role !== 0) {
            alert("Tài khoản không có quyền xem sản phẩm yêu thích.");
            navigate("/register_login");
            return;
        }

        fetch(`${process.env.REACT_APP_HOST_URL}user/wishlist/${userId}`)
            .then((res) => {
                if (!res.ok) {
                    return res.json().then((errorData) => {
                        throw new Error(errorData.message || "Lỗi khi gọi API");
                    });
                }
                return res.json();
            })
            .then((data) => {
                setWishList(data);
            })
            .catch((err) => {
                setError(err.message);
                console.error("Lỗi khi lấy dữ liệu wishlist:", err);
            });
    }, [navigate, tokenRole, tokenUser, userId]);

    const handleDelete = (productId) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi danh sách yêu thích?")) {
            return;
        }

        fetch(`${process.env.REACT_APP_HOST_URL}user/wishlist`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${tokenUser}`,
            },
            body: JSON.stringify({ userId, productId }), // Gửi userId và productId trong body
        })
            .then((res) => {
                if (!res.ok) {
                    return res.json().then((errorData) => {
                        throw new Error(errorData.message || "Lỗi khi xóa sản phẩm yêu thích.");
                    });
                }
                return res.json();
            })
            .then(() => {
                alert("Sản phẩm đã được xóa khỏi danh sách yêu thích.");
                setWishList((prevWishlist) => prevWishlist?.filter((item) => item.Product_ID !== productId));
            })
            .catch((err) => {
                console.error("Lỗi khi xóa sản phẩm yêu thích:", err);
                alert("Có lỗi xảy ra khi xóa sản phẩm.");
            });
    };

    return (
        <Fragment>
            <Header />
            <div className="box-wishlist">
                <div className="headertop-admin">
                    <div className="header_admin">
                        <h2>Danh sách sản phẩm yêu thích</h2>
                    </div>
                </div>
                <div className="grid-container-wishlist">
                    <div className="grid-header">STT</div>
                    <div className="grid-header">Tên sản phẩm</div>
                    <div className="grid-header">Hình ảnh</div>
                    <div className="grid-header">Giá</div>
                    <div className="grid-header">Mô tả</div>
                    <div className="grid-header">Thao tác</div>
                    {wishlist?.map((product, index) => (
                        <Fragment key={product.Product_ID}>

                            <div className="grid-item grid-item-element">{index + 1}</div>
                            <div className="grid-item grid-item-element">
                                <Link to={`/productDetail/${product.Product_ID}`}>
                                    {product.Product_Name}
                                </Link>
                            </div>
                            <div className="grid-item grid-item-element">
                                <Link to={`/productDetail/${product.Product_ID}`}>
                                    <img src={product.Image} alt={product.Product_Name} className="product-img" />
                                </Link>
                            </div>
                            <div className="grid-item grid-item-element">{Number(product.Price).toLocaleString("vi")} VNĐ</div>
                            <div className="grid-item">
                                {product.Description.split('\n')?.map((desc, index) => (
                                    <div className="description" key={index}>{desc.replace('-', '')}</div>
                                ))}
                            </div>
                            <div className="grid-item grid-item-button">
                                <button
                                    className="delete-btn"
                                    onClick={() => handleDelete(product.Product_ID)}
                                >
                                    🗑️
                                </button>
                            </div>
                        </Fragment>
                    ))}
                </div>
            </div>
            <Footer />
        </Fragment>
    );
}

export default Wishlist;
