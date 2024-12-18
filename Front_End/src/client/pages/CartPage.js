import React, { Fragment, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, clearCart, incrementQuantity, decrementQuantity } from '../pages/cartSlice';
import '../styles/components/CartPage.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';


const CartPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const items = useSelector(state => state.cart.items);
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const formatCurrency = (value) => {
        return Number(value).toLocaleString('vi') + ' VNĐ';
    };

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
    }, [items]);

    const handlePaymentClick = () => {
        const user = JSON.parse(localStorage.getItem('user')); 
        if (!user) {
            alert("Bạn cần đăng nhập để tiếp tục thanh toán.");
            navigate('/register_login'); 
        } else {
            navigate('/payment');
        }
    };

    return (
        <Fragment>
            <Header />
            <div className="cart-page">
                <h2>Giỏ Hàng Của Bạn</h2>
                {items.length === 0 ? (
                    <p>Giỏ hàng của bạn đang trống.</p>
                ) : (
                    <table className="cart-table">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Tên Sản Phẩm</th>
                                <th>Ảnh</th>
                                <th>Giá</th>
                                <th>Số Lượng</th>
                                <th>Thành Tiền</th>
                                <th>Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{index + 1}</td>
                                    <td >{item.name}</td>
                                    <td>
                                        <img src={item.image} alt={item.name} className="cart-item-image" />
                                    </td>
                                    <td>{formatCurrency(item.price)}</td>
                                    <td>
                                        <div className="quantity-controls">
                                            <button onClick={() => dispatch(decrementQuantity(item.id))}>-</button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => dispatch(incrementQuantity(item.id))}>+</button>
                                        </div>
                                    </td>
                                    <td>{formatCurrency(item.price * item.quantity)}</td>
                                    <td>
                                        <button onClick={() => dispatch(removeFromCart(item.id))}>🗑️</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                <h2>Tổng: {formatCurrency(total)}</h2>
                <button onClick={() => {
                    if (window.confirm("Bạn có chắc chắn muốn xóa tất cả sản phẩm trong giỏ hàng?")) {
                        dispatch(clearCart());
                    }
                }} className="btn-clear-cart">Xóa tất cả</button>
                {items.length > 0 && (
                    <button 
                        onClick={handlePaymentClick}
                        className="btn-payment"
                        style={{ marginTop: '10px' }}
                    >
                        Thanh Toán
                    </button>
                )}
            </div>
            <Footer />
        </Fragment>
    );
};

export default CartPage;
