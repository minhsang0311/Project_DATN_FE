import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import '../../styles/pages/manufacturerList.css';

const ManufacturerList = ({ searchResults }) => {
  const token = localStorage.getItem('token'); // Get the token from localStorage
  const [manufacturers, setManufacturers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch manufacturers from the API
  useEffect(() => {
    if (!searchResults || searchResults.length === 0) {
      const fetchManufacturers = async () => {
        try {
          setLoading(true);
          
          // Making the request with token in the Authorization header
          const response = await axios.get('http://localhost:3000/admin/brands', {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`  // Include token in headers for authorization
            }
          });

          setManufacturers(response.data);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching manufacturers:', err);
          setError('Failed to load manufacturers');
          setLoading(false);
        }
      };

      fetchManufacturers();
    }
  }, [searchResults, token]);

  const deleteManufacturer = async (id) => {
    const confirmDelete = window.confirm('Bạn có chắc là bạn muốn xóa nhà sản xuất này?');
    if (!confirmDelete) return;

    try {
      // Send delete request with token for authorization
      const response = await axios.delete(`http://localhost:3000/admin/brandDelete/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Include token in headers for authorization
        }
      });

      if (response.status === 200) {
        setManufacturers(manufacturers.filter(manufacturer => manufacturer.Brand_ID !== id));
        alert('Nhà sản xuất đã được xóa.');
      }
    } catch (err) {
      console.error('Lỗi xóa nhà sản xuất:', err);
      setError('Không thể xóa nhà sản xuất');
      alert('Không thể xóa nhà sản xuất.');
    }
  };

  const displayManufacturers = searchResults && searchResults.length > 0 ? searchResults : manufacturers;

  return (
    <div className="box-productlist">
      <div className="headertop-admin">
        <div className="header_admin">
          <h2>DANH SÁCH NHÀ SẢN XUẤT</h2>
          <button className="button_admin">
            <Link to="/admin/manufacturerAdd">THÊM NHÀ SẢN XUẤT</Link>
          </button>
        </div>
      </div>
      
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : error ? (
        <p>{error}</p>
      ) : manufacturers.length > 0 ? (
        <div className="grid-container-manufacturerList">
          <div className="grid-header">ID</div>
          <div className="grid-header">Tên nhà sản xuất</div>
          <div className="grid-header">Thao tác</div>
          {displayManufacturers.map(manufacturer => (
            <Fragment key={manufacturer.Brand_ID}>
              <div className="grid-item grid-item-element">{manufacturer.Brand_ID}</div>
              <div className="grid-item grid-item-element">{manufacturer.Brand_Name}</div>
              <div className="grid-item grid-item-button">
                <Link to={`/admin/manufacturerUpdate/${manufacturer.Brand_ID}`} className="edit-btn">✏️</Link>
                <button className="delete-btn" onClick={() => deleteManufacturer(manufacturer.Brand_ID)}>🗑️</button>
              </div>
            </Fragment>
          ))}
        </div>
      ) : (
        <p className='manufacturerList-p'>Không có nhà sản xuất nào để hiển thị.</p>
      )}
    </div>
  );
};

export default ManufacturerList;
