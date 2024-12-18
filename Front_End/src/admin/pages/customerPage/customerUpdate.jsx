import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from "react-router-dom";
import '../../styles/pages/customerUpdate.css';

const CustomerUpdate = () => {
  const { id } = useParams(); // Lấy `id` từ URL
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // Get the token from localStorage

  const [customer, setCustomer] = useState({
    User_Name: '',
    Email: '',
    Phone: '',
    Role: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/admin/customerDetail/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`  // Include token in the Authorization header
          }
        });
        setCustomer(response.data);
      } catch (error) {
        console.error("Error fetching customer details:", error);
        setError("Không thể tải thông tin khách hàng.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomer({
      ...customer,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/admin/customerUpdate/${id}`, customer, {
        headers: {
          'Authorization': `Bearer ${token}`  // Include token in the Authorization header
        }
      });
      alert("Cập nhật khách hàng thành công!");
      navigate("/admin/customerList"); // Quay lại trang danh sách khách hàng
    } catch (error) {
      console.error("Error updating customer:", error);
      alert("Lỗi cập nhật thông tin khách hàng.");
    }
  };

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="form-container-productadd">
      <div className="form-header-update">
        <h2>CẬP NHẬT THÔNG TIN KHÁCH HÀNG</h2>
      </div>
      <form onSubmit={handleSubmit} className="productadd-form">
        <div className="form-group">
          <label>Tên người dùng</label>
          <input
            type="text"
            name="User_Name"
            value={customer.User_Name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="Email"
            value={customer.Email || ''}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Điện thoại</label>
          <input
            type="text"
            name="Phone"
            value={customer.Phone || ''}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Vai trò</label>
          <select
            name="Role"
            value={customer.Role}
            onChange={handleInputChange}
            required
          >
            <option value={0}>User</option>
            <option value={1}>Admin</option>
          </select>
        </div>

        <button type="submit" className="submit-btn">LƯU THAY ĐỔI</button>
      </form>
    </div>
  );
};

export default CustomerUpdate;
