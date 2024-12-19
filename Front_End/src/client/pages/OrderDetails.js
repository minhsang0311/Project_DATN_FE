import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/components/OrderDetails.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import toast, { Toaster } from 'react-hot-toast';

function OrderDetail() {
    const { orderId } = useParams();  // Lấy orderId từ URL
    const [orderDetail, setOrderDetail] = useState(null);
    const [error, setError] = useState(null);
    const [cancelReason, setCancelReason] = useState('');
    const [customReason, setCustomReason] = useState(''); // Lưu lý do nhập từ textarea
    const [suggestedReasons] = useState([
        "Đổi ý không muốn mua nữa",
        "Tìm thấy sản phẩm giá tốt hơn",
        "Thời gian giao hàng quá lâu",
        "Đặt nhầm sản phẩm",
        "Lý do khác"
    ]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('tokenUser');
        if (!token) {
            alert('Bạn cần đăng nhập để xem chi tiết đơn hàng');
            navigate('/register_login');
            return;
        }

        axios.get(`http://localhost:3000/user/orderDetail/${orderId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => setOrderDetail(res.data[0]))  // Lấy dữ liệu đơn hàng chi tiết từ API
            .catch(err => {
                setError('Không thể lấy dữ liệu chi tiết đơn hàng');
                toast.error("Không thể lấy dữ liệu chi tiết đơn hàng");
            });
    }, [orderId, navigate]);

    const handleCancelOrder = async () => {
        const finalReason = cancelReason === "Lý do khác" ? customReason : cancelReason;

        if (!finalReason) {
            toast.error("Vui lòng chọn hoặc nhập lý do hủy đơn hàng");
            return;
        }

        const token = localStorage.getItem('tokenUser');
        try {
            await axios.put(`http://localhost:3000/user/cancelOrder/${orderId}`,
                { reason: finalReason },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            toast.success("Đơn hàng đã được hủy");
            navigate('/order');
        } catch (err) {
            toast.error("Không thể hủy đơn hàng");
        }
    };

    if (error) {
        return <p className="error">{error}</p>;
    }

    if (!orderDetail) {
        return <p>Đang tải dữ liệu...</p>;
    }

    return (
        <>
            <Header />
            <div className="order-detail">
                <Toaster position="top-right" reverseOrder={false} />
                <h2>Chi tiết đơn hàng</h2>
                <div className="order-info">
                    <p><strong>Mã đơn hàng:</strong> {orderDetail.Order_ID}</p>
                    <p><strong>Tên khách hàng:</strong> {orderDetail.User_Name}</p>
                    <p><strong>Số điện thoại:</strong> {orderDetail.Phone}</p>
                    <p><strong>Địa chỉ:</strong> {orderDetail.Address}</p>
                    <p>
                        <strong>Phương thức thanh toán:</strong>{' '}
                        {orderDetail.payment_method === 'COD'
                            ? 'Thanh toán khi nhận hàng'
                            : 'Thanh toán online'}
                    </p>
                    <p><strong>Tổng tiền:</strong> {orderDetail.total_amount} VND</p>
                    <p><strong>Số lượng sản phẩm:</strong> {orderDetail.total_quantity}</p>
                    <p><strong>Tên sản phẩm:</strong> {orderDetail.Product_Name}</p>
                    <p><strong>Ghi chú:</strong> {orderDetail.Note || 'Không có ghi chú'}</p>
                    <p><strong>Trạng thái:</strong> {orderDetail.Status}</p>
                    <p><strong>Ngày đặt hàng:</strong> {orderDetail.created_at}</p>
                </div>
                {orderDetail.Status === 'Chờ xác nhận' && (
                    <div className="cancel-order">
                        <select
                            onChange={(e) => setCancelReason(e.target.value)}
                            value={cancelReason}
                        >
                            <option value="">Chọn lý do hủy đơn hàng</option>
                            {suggestedReasons?.map((reason, index) => (
                                <option key={index} value={reason}>{reason}</option>
                            ))}
                        </select>
                        {cancelReason === "Lý do khác" && (
                            <textarea
                                value={customReason} // Giá trị textarea riêng
                                onChange={(e) => setCustomReason(e.target.value)}
                                placeholder="Nhập lý do khác..."
                            />
                        )}
                        <button onClick={handleCancelOrder}>Hủy đơn hàng</button>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}

export default OrderDetail;
