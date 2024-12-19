import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/pages/AdminOrder.css';

const AdminOrder = ({ searchResults }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  // Lấy danh sách đơn hàng từ API
  useEffect(() => {
    if (!searchResults || searchResults.length === 0) {
      const fetchOrders = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
          setError('Không tìm thấy token. Vui lòng đăng nhập lại.');
          setLoading(false);
          return;
        }

        try {
          const response = await axios.get('http://localhost:3000/admin/order', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          // Sắp xếp danh sách đơn hàng theo Order_ID tăng dần
          const sortedOrders = response.data.sort((a, b) => a.Order_ID - b.Order_ID);
          setOrders(sortedOrders);
        } catch (err) {
          setError('Lỗi khi lấy danh sách đơn hàng.');
        } finally {
          setLoading(false);
        }
      };

      fetchOrders();
    }
  }, [searchResults]);

  // Cập nhật trạng thái đơn hàng
  const handleStatusChange = async (orderId) => {
    const token = localStorage.getItem('token');

    try {
      await axios.put(
        `http://localhost:3000/admin/order/${orderId}`,
        { Status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Cập nhật trạng thái trong danh sách đơn hàng
      setOrders((prevOrders) => {
        let updatedOrders = prevOrders?.map((order) =>
          order.Order_ID === orderId ? { ...order, Status: newStatus } : order
        );
        return updatedOrders;
      });

      // Reset trạng thái mới và selectedOrder
      setNewStatus('');
      setSelectedOrder(null);
    } catch (err) {
      setError('Lỗi khi cập nhật trạng thái đơn hàng.');
    }
  };

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">{error}</div>;
  const displayOrders = searchResults && searchResults.length > 0 ? searchResults : orders;

  return (
    <div className="box-productlist">
      <div className="headertop-admin">
        <div className="header_admin">
          <h2>DANH SÁCH ĐƠN HÀNG</h2>
        </div>
      </div>
      <div className="grid-container-order">
        <div className="grid-header">Order ID</div>
        <div className="grid-header">Tên khách hàng</div>
        <div className="grid-header">Email</div>
        <div className="grid-header">Số điện thoại</div>
        <div className="grid-header">Địa chỉ</div>
        <div className="grid-header">Trạng thái</div>
        <div className="grid-header">Cập nhật trạng thái</div>
        {displayOrders?.map((order) => (
          <Fragment key={order.Order_ID}>
            <div className="grid-item grid-item-element">{order.Order_ID}</div>
            <div className="grid-item grid-item-element">{order.User_Name}</div>
            <div className="grid-item grid-item-element">{order.Email}</div>
            <div className="grid-item grid-item-element">{order.Phone}</div>
            <div className="grid-item grid-item-element">{order.Address}</div>
            <div className="grid-item grid-item-element">
              {selectedOrder === order.Order_ID ? (
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="status-select"
                >
                  <option value="1">Chờ xác nhận</option>
                  <option value="2">Đã xác nhận</option>
                  <option value="3">Đang chuẩn bị hàng</option>
                  <option value="4">Đang vận chuyển</option>
                  <option value="5">Đã giao hàng</option>
                  <option value="6">Đã hủy</option>
                </select>
              ) : (
                <span className="status-display">{order.Status}</span>
              )}
            </div>
            <div className="grid-item grid-item-element">
              {selectedOrder === order.Order_ID ? (
                <button
                  className="update-button"
                  onClick={() => handleStatusChange(order.Order_ID)}
                >
                  Cập nhật
                </button>
              ) : (
                <button
                  className="change-status-button"
                  onClick={() => {
                    setSelectedOrder(order.Order_ID);
                    setNewStatus(order.Status); // Hiển thị Fragmentạng thái cũ khi chọn thay đổi
                  }}
                >
                  Thay đổi trạng thái
                </button>
              )}
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default AdminOrder;
