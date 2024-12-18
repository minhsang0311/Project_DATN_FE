import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/components/OrderStatus.css';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';

function OrderStatus() {
    const [orders, setOrderList] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('tokenUser');
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user?.id;

        if (!token) {
            alert('Bạn cần phải đăng nhập để xem trạng thái đơn hàng');
            navigate('/register_login');
        } else {
            if (user.role !== 0) {
                alert('Tài khoản không thể xem trạng thái đơn hàng');
                navigate('/register_login');
            }
        }

        if (userId && token) {
            axios.get(`${process.env.REACT_APP_HOST_URL}user/orders/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
            .then((res) => setOrderList(res.data))
            .catch((err) => setError('Không thể lấy dữ liệu đơn hàng'));
        }
    }, [navigate]);

    const handleViewOrderDetails = (Order_Detail_ID) => {
        navigate(`/orderDetail/${Order_Detail_ID}`);
    };

    return (
        <Fragment>
            <Header />
            <div className="order-status">
                <h2>Trạng thái đơn hàng của bạn</h2>
                {error && <p className="error">{error}</p>}
                <table>
                    <thead>
                        <tr>
                            <th>Mã đơn hàng</th>
                            <th>Tên sản phẩm</th>
                            <th>Ngày đặt hàng</th>
                            <th>Địa chỉ</th>
                            <th>Tổng tiền</th>
                            <th>Trạng thái đơn hàng</th>
                            <th>Chi tiết đơn hàng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            
                            <tr key={order.Order_ID}>
                                <td>{order.Order_ID}</td>
                                <td>{order.Product_Name}</td>
                                <td>{order.created_at}</td>
                                <td>{order.Address}</td> 
                                <td>{order.total_amount} VND</td>
                                 <td>{order.Status}</td>
                                <td>
                                <button className="button-detail" onClick={() => handleViewOrderDetails(order.Order_Detail_ID)}>
    Xem Chi Tiết
</button>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Footer />
        </Fragment>
    );
}

export default OrderStatus;
