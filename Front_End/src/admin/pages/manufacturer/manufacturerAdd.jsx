import React, { useState } from 'react';
import '../../styles/pages/ManufacturerAdd.css';

const ManufacturerAdd = () => {
    const [manufacturer, setManufacturer] = useState({ Brand_Name: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (evt) => {
        evt.preventDefault();

        // Check if Brand_Name is filled
        if (!manufacturer.Brand_Name) {
            setError('Vui lòng nhập tên nhà sản xuất.');
            return;
        }

        // Get the token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Token không hợp lệ. Vui lòng đăng nhập lại.');
            return;
        }

        // Create FormData for submission
        const formData = new FormData();
        formData.append('Brand_Name', manufacturer.Brand_Name);

        setLoading(true); // Set loading state to true before making the request

        // Make the API request
        fetch('http://localhost:3000/admin/brandAdd', {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
        .then(res => res.json())
        .then(data => {
            setLoading(false); // Set loading to false after response
            if (data.message === 'Brand added successfully') {
                // Reset form and redirect after success
                setManufacturer({ Brand_Name: '' });
                window.location.href = '/admin/manufacturerList';
            } else {
                setError(data.message || 'Lỗi khi thêm nhà sản xuất');
            }
        })
        .catch(error => {
            setLoading(false); // Set loading to false on error
            console.log("Error adding manufacturer:", error);
            setError('Lỗi khi thêm nhà sản xuất.');
        });
    };

    return (
        <div className="form-container-productadd">
            <div className="form-header-addproduct">
                <h2>THÊM NHÀ SẢN XUẤT</h2>
            </div>
            <form className="productadd-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="manufacturer-name">Tên Nhà Sản Xuất</label>
                    <input
                        type="text"
                        id="manufacturer-name"
                        placeholder="Nhập tên nhà sản xuất ..."
                        value={manufacturer.Brand_Name}
                        onChange={e => setManufacturer({ Brand_Name: e.target.value })}
                        required
                    />
                </div>

                {error && <div className="error-message">{error}</div>}

                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Đang thêm...' : 'THÊM NHÀ SẢN XUẤT'}
                </button>
            </form>
        </div>
    );
};

export default ManufacturerAdd;
