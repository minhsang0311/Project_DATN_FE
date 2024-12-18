import React, { Fragment, useState, useEffect } from 'react';
import '../styles/components/PaymentPage.css';
import Header from '../components/Header';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const PaymentPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [voucherCode, setVoucherCode] = useState('');
    const [note, setNote] = useState('');
    const [userId, setUserId] = useState(null);
    const [discount, setDiscount] = useState(0);
    const [voucherMessage, setVoucherMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { productDetails } = location.state || {}; // Nhận thông tin sản phẩm từ "Mua ngay"

    // useEffect để xử lý khi có sản phẩm "Mua ngay"
    useEffect(() => {
        if (productDetails) {
            // Nếu có sản phẩm từ "Mua ngay", chỉ hiển thị sản phẩm này
            setCartItems([{
                ...productDetails,
                quantity: 1 // Mặc định số lượng là 1 khi mua ngay
            }]);
        } else {
            // Nếu không phải "Mua ngay", hiển thị toàn bộ sản phẩm trong giỏ hàng
            const storedCartItems = JSON.parse(localStorage.getItem('cart')) || [];
            setCartItems(storedCartItems);
        }

        const storedUserId = JSON.parse(localStorage.getItem('user'));
        if (!storedUserId) {
           toast.error('Bạn cần phải đăng nhập để thanh toán');
            navigate('/register_login');
        } else {
            if (storedUserId.role !== 0) {
                alert('Tài khoản không thể mua hàng');
                navigate('/register_login');
            }
        }

        setUserId(storedUserId?.id || null);
    }, [navigate, productDetails]);

    useEffect(() => {
        const tokenUser = localStorage.getItem("tokenUser");
        const debounceTimeout = setTimeout(() => {
            if (voucherCode) {
                fetch(`${process.env.REACT_APP_HOST_URL}user/voucher`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${tokenUser}`
                    },
                    body: JSON.stringify({ code: voucherCode }),
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success === true) {
                            toast.error(data.discount);
                            toast.success(`Voucher áp dụng thành công! Giảm ${data.discount}%`);
                        } else {
                            setDiscount(0);
                            toast.error(data.message);
                        }
                    })
                    .catch(() => {
                        setDiscount(0);
                        setVoucherMessage('Lỗi xảy ra vui lòng kiểm tra voucher.');
                    });
            } else {
                setDiscount(0);
                setVoucherMessage('');
            }
        }, 1000); // 1 giây debounce

        return () => clearTimeout(debounceTimeout);
    }, [voucherCode]);

    const handleVoucherChange = (e) => {
        setVoucherCode(e.target.value);
    };

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const finalAmount = total - (total * (discount / 100));
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const handlePayment = () => {
        if (!name || !address || !phone || !email || !userId) {
            return toast.error("Vui lòng nhập đầy đủ thông tin mua hàng trước khi thanh toán.");
        }
        if (!paymentMethod) {
            return toast.error('Vui lòng chọn phương thức thanh toán.');
        }

        const orderData = {
            User_Name: name,
            Address: address,
            Phone: phone,
            Email: email,
            payment_method: paymentMethod,
            total_amount: finalAmount,
            total_quantity: totalQuantity,
            items: cartItems.map(item => ({
                Product_ID: item.id,
                Quantity: item.quantity,
                Price: item.price
            })),
            User_ID: userId,
            Voucher_ID: voucherCode || null,
            Note: note || null
        };

        if (paymentMethod === 'COD') {
            fetch(`${process.env.REACT_APP_HOST_URL}user/payment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success === true) {
                        alert('Thanh toán COD thành công!');
                        if (!productDetails) {
                            localStorage.removeItem('cart'); // Xóa giỏ hàng nếu không phải "Mua ngay"
                        }
                        navigate('/order');
                    } else {
                      
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Lỗi khi xử lý thanh toán COD.');
                });
        } else if (paymentMethod === 'Online') {
            fetch(`${process.env.REACT_APP_HOST_URL}user/payment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success === true) {
                        if (data.url) {
                            window.location.href = data.url;
                            if (!productDetails) localStorage.removeItem('cart');
                        } else {
                            alert('Không thể chuyển đến cổng thanh toán. Vui lòng thử lại.');
                        }
                    } else {
                        alert(data.message);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Lỗi khi xử lý thanh toán online.');
                });
        } else {
            alert('Phương thức thanh toán không hợp lệ.');
        }
    };

    return (
        <Fragment>
            <Header />
            <div className='container-pay'>
            <Toaster position="top-right" reverseOrder={false} /> {/* Thêm Toaster */}

                <h1>THANH TOÁN</h1>
                <div className="container-payment">
                    <div className="section">
                        <h2>Thông tin mua hàng</h2>
                        <form>
                            <div className="form-group">
                                <label htmlFor="ho-ten">Họ và Tên*</label>
                                <input
                                    type="text"
                                    id="ho-ten"
                                    name="ho-ten"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="dia-chi">Địa chỉ nhận hàng*</label>
                                <input
                                    type="text"
                                    id="dia-chi"
                                    name="dia-chi"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="so-dien-thoai">Số điện thoại*</label>
                                <input
                                    type="tel"
                                    id="so-dien-thoai"
                                    name="so-dien-thoai"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email*</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </form>
                    </div>

                    <div className="section">
                        <h2>Phương thức thanh toán</h2>
                        <div className='method-pay'>
                            <div className='section_radio'>
                                <input
                                    type="radio"
                                    value="COD"
                                    checked={paymentMethod === 'COD'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <label>Thanh toán khi nhận hàng</label>
                            </div>
                            <div className='section_radio'>
                                <input
                                    type="radio"
                                    value="Online"
                                    checked={paymentMethod === 'Online'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <label>Thanh toán online</label>
                            </div>
                        </div>
                        <h2>Ghi chú</h2>
                        <textarea
                            name="ghi-chu"
                            id="ghi-chu"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hoặc chỉ dẫn địa điểm giao hàng chi tiết hơn."
                        ></textarea>
                    </div>

                    <div className="section">
                        <h2>Đơn hàng ({cartItems.length} sản phẩm)</h2>
                        {cartItems.map((item, index) => (
                            <div key={index} className="product-payment">
                                <img src={item.image} alt={item.name} />
                                <div className="product-info">
                                    <p><span>Tên sản phẩm:</span> {item.name}</p>
                                    <p><span>Số lượng:</span> x{item.quantity}</p>
                                    <p><span>Giá:</span> {item.price.toLocaleString('vi')}₫</p>
                                </div>
                            </div>
                        ))}
                        <div className='voucher'>
                            <label>
                                Nhập voucher
                                <input
                                    type='text'
                                    value={voucherCode}
                                    onChange={handleVoucherChange}
                                />
                            </label>
                            {voucherMessage && <p className="voucher-message">{voucherMessage}</p>}
                        </div>
                        <div className='money'>
                            <p className='total_money'><span>Tổng tiền: </span>{total.toLocaleString('vi')}₫</p>
                            <p className='total_sale'><span>Tổng tiền sau giảm giá: </span>{finalAmount.toLocaleString('vi')}₫</p>
                        </div>
                        <button className='payment_button' onClick={handlePayment}>Thanh toán</button>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default PaymentPage;
