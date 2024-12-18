import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/components/resetPassword.css';  // Cập nhật đường dẫn đến file CSS của bạn nếu cần
import toast, { Toaster } from 'react-hot-toast';

const ResetPassword = () => {
    const { token } = useParams();  // Lấy token từ URL
    const navigate = useNavigate();  // Để điều hướng người dùng sau khi reset mật khẩu
    const [newPassword, setNewPassword] = useState('');
    const [showPasswordReset, setShowPasswordReset] = useState(false)
    const [showPasswordResetConfirm, setShowPasswordResetConfirm] = useState(false)
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error('Mật khẩu không khớp, vui lòng thử lại.');
            return;
        }

        setLoading(true); // Bắt đầu quá trình gửi yêu cầu
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_HOST_URL}user/reset-password/${token}`,
                { newPassword }
            );
            console.log(response)
            console.log(response.data.message)
          toast.success(response.data.message);

            navigate('/register_login'); // Chuyển hướng người dùng đến trang đăng nhập
        } catch (error) {
            toast.error(error.response ? error.response.data.message : 'Có lỗi xảy ra.');
        }
    };

    return (
        <div className="reset_password">
                 <Toaster position="top-right" reverseOrder={false} /> {/* Thêm Toaster */}

            <h2>Đặt lại mật khẩu</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div className="input-container-reset">
                    <input
                        type={showPasswordReset ? "text" : "password"}
                        placeholder="Nhập mật khẩu mới"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <span
                        className="icon_reset"
                        onClick={()=>setShowPasswordReset(!showPasswordReset)}
                    >
                        {showPasswordReset ? <i class="bi bi-eye"></i> : <i class="bi bi-eye-slash"></i>}
                    </span>
                </div>
                <div className='input-container-reset'>
                <input
                    type={showPasswordResetConfirm ? "text" : "password"}
                    placeholder="Xác nhận mật khẩu mới"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <span
                    className='icon_reset'
                    onClick={()=> setShowPasswordResetConfirm(!showPasswordResetConfirm)}
                >
                    {showPasswordResetConfirm ? <i class="bi bi-eye"></i> : <i class="bi bi-eye-slash"></i>}
                </span>
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;
