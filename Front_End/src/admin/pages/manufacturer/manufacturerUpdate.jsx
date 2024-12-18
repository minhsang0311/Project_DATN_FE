import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory
import axios from 'axios';
import '../../styles/pages/manufacturerUpdate.css';

const ManufacturerUpdate = () => {
  const { id } = useParams();  // Get Brand_ID from URL
  const navigate = useNavigate(); // useNavigate hook for navigation
  const token = localStorage.getItem('token'); // Get the token from localStorage

  const [brandName, setBrandName] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch the current brand details when the component mounts
  useEffect(() => {
    axios.get(`http://localhost:3000/admin/brandDetail/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`, // Include token in the Authorization header
      },
    })
      .then(response => {
        const { Brand_Name } = response.data;
        setBrandName(Brand_Name);
      })
      .catch(error => {
        console.error('Error fetching brand details:', error);
      });
  }, [id, token]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('Brand_Name', brandName);

    setLoading(true);

    axios.put(`http://localhost:3000/admin/brandUpdate/${id}`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`, // Include token in the Authorization header
      },
    })
      .then(() => {
        setLoading(false);
        navigate('/admin/manufacturerList'); // Redirect to the list of brands after successful update
      })
      .catch(error => {
        setLoading(false);
        console.error('Error updating brand:', error);
      });
  };

  return (
    <div className="form-container-productadd">
      <div className="form-header-update">
        <h2>CẬP NHẬT NHÀ SẢN XUẤT</h2>
      </div>
      <form onSubmit={handleSubmit} className="productadd-form">
        <div className="form-group">
          <label>Brand Name</label>
          <input
            type="text"
            className="form-control"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Updating...' : 'CẬP NHẬT'}
        </button>
      </form>
    </div>
  );
};

export default ManufacturerUpdate;
