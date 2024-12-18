import React, { Fragment, useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import "../../styles/pages/customerList.css";

const CustomerList = ({ searchResults }) => {
  const token = localStorage.getItem('token');
  const url = `http://localhost:3000/admin`;
  const [customers, setcustomersList] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  useEffect(() => {
    if (!searchResults || searchResults.length === 0) {
        // Fetch toàn bộ danh sách sản phẩm khi không có kết quả tìm kiếm
        fetch(`${url}/customers`, {
            method: 'GET',
            headers: { "Content-type": "application/json", 'Authorization': 'Bearer ' + token }
        })
            .then(res => res.json())
            .then(data => {
              console.log(data)
              setcustomersList(data)})
            
            .catch(error => console.error('Error fetching product list:', error));
    }
}, [token, searchResults]);

  const handleDelete = async (userId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khách hàng này?")) {
      try {
        const response = await fetch(`${url}/customerDelete/${userId}`, {
          method: 'DELETE',
          headers: {
            "Content-type": "application/json",
            'Authorization': 'Bearer ' + token
          }
        });

        if (!response.ok) {
          const errorResponse = await response.json();
          alert(errorResponse.message || "Không thể xóa khách hàng.");
        } else {
          alert("Đã xóa khách hàng.");
          setcustomersList(prev => prev.filter(customer => customer.User_ID !== userId));
        }
      } catch (error) {
        console.error('Error deleting customer:', error);
        setError("Không thể xóa khách hàng.");
      }
    }
  };

  // Hiển thị searchResults nếu có, nếu không sẽ hiển thị toàn bộ customers
  const displayCustomers = searchResults && searchResults.length > 0 ? searchResults : customers;

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="box-productlist">
      <div className="headertop-admin">
        <div className="header_admin">
          <h2>DANH SÁCH KHÁCH HÀNG</h2>
          <button className="button_admin">
            <Link to="/admin/customerAdd">THÊM KHÁCH HÀNG</Link>
          </button>
        </div>
      </div>
      <div className="grid-container-customer">
        <div className="grid-header">ID</div>
        <div className="grid-header">Tên người dùng</div>
        <div className="grid-header">Email</div>
        <div className="grid-header">Điện thoại</div>
        <div className="grid-header">Vai trò</div>
        <div className="grid-header">Thao tác</div>
        {displayCustomers.map((customer) => (
          <Fragment key={customer.User_ID}>
            <div className="grid-item grid-item-element">{customer.User_ID}</div>
            <div className="grid-item grid-item-element">{customer.User_Name}</div>
            <div className="grid-item grid-item-element">{customer.Email || 'N/A'}</div>
            <div className="grid-item grid-item-element">{customer.Phone || 'N/A'}</div>
            <div className="grid-item grid-item-element">{customer.Role === 1 ? 'Admin' : 'User'}</div>
            <div className="grid-item grid-item-button">
              <Link to={`/admin/customerUpdate/${customer.User_ID}`} className="edit-btn">✏️</Link>
              <button className="delete-btn" onClick={() => handleDelete(customer.User_ID)}>🗑️</button>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default CustomerList;
