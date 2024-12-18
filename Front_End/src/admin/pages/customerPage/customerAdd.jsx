import { useState } from 'react';
import bcrypt from 'bcryptjs'; // Import bcryptjs
import '../../styles/pages/customerAdd.css';

const CustomerAdd = () => {
    const [customer, setCustomer] = useState({ User_Name: '', Email: '', Password: '', Phone: '', Role: 0 });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token'); // Get the token from localStorage

    const handleSubmit = async (evt) => {
        evt.preventDefault();

        // Basic form validation
        if (!customer.User_Name || !customer.Email || !customer.Password || !customer.Phone) {
            setError('Vui lòng điền đầy đủ thông tin.');
            return;
        }

        // Optional: Email regex validation
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(customer.Email)) {
            setError('Email không hợp lệ.');
            return;
        }

        setLoading(true); // Set loading state to true before making the request

        // Hash the password before sending to the server
        const hashedPassword = bcrypt.hashSync(customer.Password, 10);

        const data = {
            User_Name: customer.User_Name,
            Email: customer.Email,
            Password: hashedPassword, // Use the hashed password here
            Phone: customer.Phone,
            Role: customer.Role
        };

        const url = `http://localhost:3000/admin/customerAdd`; // Make sure this is correct
        const options = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Include token in the Authorization header
            },
            body: JSON.stringify(data)
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Đã xảy ra lỗi khi thêm khách hàng');
            }

            // Success: Clear form and redirect
            setCustomer({ User_Name: '', Email: '', Password: '', Phone: '', Role: 0 });
            setError('');
            window.location.href = '/admin/customerList'; // Redirect to customer list page
        } catch (err) {
            setLoading(false);
            setError(err.message || 'Lỗi khi thêm khách hàng');
        }
    };

    return (
        <div className="form-container-productadd">
            <div className="form-header-addproduct">
                <h2 className="form-h2">THÊM KHÁCH HÀNG</h2>
            </div>
            <form className="productadd-form" onSubmit={handleSubmit}>
                {error && <p className="error-message">{error}</p>}
                <div className="input-customer-add">
                    <div className="form-group">
                        <label htmlFor="customer-name">Tên Khách Hàng</label>
                        <input
                            type="text"
                            id="customer-name"
                            placeholder="Nhập tên khách hàng..."
                            value={customer.User_Name}
                            onChange={e => setCustomer({ ...customer, User_Name: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="customer-email">Email</label>
                        <input
                            type="email"
                            id="customer-email"
                            placeholder="Nhập email..."
                            value={customer.Email}
                            onChange={e => setCustomer({ ...customer, Email: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="customer-password">Mật khẩu</label>
                        <input
                            type="password"
                            id="customer-password"
                            placeholder="Nhập mật khẩu..."
                            value={customer.Password}
                            onChange={e => setCustomer({ ...customer, Password: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="customer-phone">Số Điện Thoại</label>
                        <input
                            type="text"
                            id="customer-phone"
                            placeholder="Nhập số điện thoại..."
                            value={customer.Phone}
                            onChange={e => setCustomer({ ...customer, Phone: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Vai Trò</label>
                        <div className="radio-group">
                            <label>
                                <input
                                    type="radio"
                                    name="role"
                                    value="0"
                                    checked={customer.Role === 0}
                                    onChange={() => setCustomer({ ...customer, Role: 0 })}
                                /> User
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="role"
                                    value="1"
                                    checked={customer.Role === 1}
                                    onChange={() => setCustomer({ ...customer, Role: 1 })}
                                /> Admin
                            </label>
                        </div>
                    </div>
                </div>
                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Đang thêm...' : 'XÁC NHẬN'}
                </button>
            </form>
        </div>
    );
};

export default CustomerAdd;
