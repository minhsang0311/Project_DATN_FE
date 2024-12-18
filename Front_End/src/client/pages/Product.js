import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { addToCart } from './cartSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

function Product({ product }) {
    const dispatch = useDispatch();
    const [isLiked, setIsLiked] = useState(false); // Trạng thái yêu thích sản phẩm
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
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
    };

    const handleAddToWishlist = async (product) => {
        const userId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).id : null;
        const userRole = JSON.parse(localStorage.getItem('user'))
        if (!userId) {
            alert('Bạn cần đăng nhập để quản lý danh sách yêu thích!');
            navigate('/register_login')
            return;
        }
        if (userRole.role !== 0) {
            alert('Tài khoản không thể thêm sản phẩm yêu thích!');
            navigate('/register_login')
            return;
        }

        try {
            setLoading(true);
            if (isLiked) {
                // Nếu đã yêu thích, gửi yêu cầu xoá sản phẩm khỏi danh sách yêu thích (DELETE)
                const response = await fetch(`${process.env.REACT_APP_HOST_URL}user/wishlist`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: userId,
                        productId: product.Product_ID,
                    }),
                });
                const data = await response.json();

                if (response.ok) {
                    setIsLiked(false); // Cập nhật trạng thái yêu thích
                    toast.success(data.message || 'Đã xoá sản phẩm khỏi danh sách yêu thích');
                } else {
                    toast.error(data.message || 'Có lỗi xảy ra khi xoá sản phẩm');
                }
            } else {
                // Nếu chưa yêu thích, gửi yêu cầu thêm vào danh sách yêu thích (POST)
                const response = await fetch(`${process.env.REACT_APP_HOST_URL}user/wishlist`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: userId,
                        productId: product.Product_ID,
                    }),
                });
                const data = await response.json();

                if (response.ok) {
                    setIsLiked(true); // Cập nhật trạng thái yêu thích
                   toast.success(data.message || 'Đã thêm sản phẩm vào danh sách yêu thích');
                } else {
                   toast.error(data.message || 'Có lỗi xảy ra khi thêm sản phẩm');
                }
            }
        } catch (error) {
            console.error('Lỗi khi quản lý danh sách yêu thích:', error);
        } finally {
            setLoading(false);
        }
    };

    // Kiểm tra nếu sản phẩm đã có trong wishlist
    useEffect(() => {
        const checkIfLiked = async () => {
            const userId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).id : null;
            if (userId) {
                const response = await fetch(`${process.env.REACT_APP_HOST_URL}user/wishlist/${userId}`);
                const data = await response.json();
                const isProductInWishlist = data.some(item => item.Product_ID === product.Product_ID);
                setIsLiked(isProductInWishlist); // Cập nhật trạng thái nếu sản phẩm đã có trong wishlist
            }
        };

        checkIfLiked();
    }, [product.Product_ID]);

    return (
        <div className="product">
                        <Toaster position="top-right" reverseOrder={false} /> {/* Thêm Toaster */}

            {product.Promotion > 0 && (
                <div className="discount-label">-{product.Promotion}%</div>
            )}
            <div className="img-wrapper">
                <img src={product.Image} alt={product.Product_Name} />
            </div>
            <Link to={`/productDetail/${product.Product_ID}`}>
                <p>{product.Product_Name}</p>
            </Link>
            <div className="price_giohang">
                <div className="price">
                    {product.Promotion > 0 ? (
                        <>
                            <p className="old-price">{formatCurrency(product.Price)}</p>
                            <p className="new-price">{formatCurrency(product.Price - (product.Promotion * product.Price) / 100)}</p>
                        </>
                    ) : (
                        <p className="new-price">{formatCurrency(product.Price)}</p>
                    )}
                </div>
                <button onClick={() => handleAddToCart(product)} className="add-to-cart">Giỏ hàng</button>
            </div>
            {/* Biểu tượng trái tim yêu thích */}
            <div
                className={`heart-icon ${isLiked ? 'liked' : ''}`}
                onClick={() => handleAddToWishlist(product)}
                style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer' }}
            >
                <i className={`fa${isLiked ? 's' : 'r'} fa-heart`} style={{ fontSize: '24px', color: isLiked ? 'red' : '#ccc' }}></i>
            </div>
        </div>
    );
}

export default Product;
