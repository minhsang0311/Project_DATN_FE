import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../styles/components/ChangePassword.css'
import toast, { Toaster } from "react-hot-toast";

const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPasswordOld, setShowPasswordOld] = useState(false)
    const [showPasswordNew, setShowPasswordNew] = useState(false)
    const [showPasswordConfirmChangePW, setShowPasswordConfirmChangePW] = useState(false)
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const tokenUser = localStorage.getItem("tokenUser");
        const tokenRole = JSON.parse(localStorage.getItem("user"));

        if (!tokenUser) {
            alert('Bạn cần phải đăng nhập để đổi mật khẩu');
            navigate('/register_login');
        } else {
            if (tokenRole.role !== 0) {
                alert('Tài khoản không thể đổi đổi mật khẩu');
                navigate('/register_login');
            }
        }
    }, [navigate]);

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (newPassword !== confirmPassword) {
            toast.error("Mật khẩu mới và xác nhận mật khẩu không đúng.");
            return;
        }

        try {
            // Lấy token từ localStorage
            const tokenUser = localStorage.getItem("tokenUser");

            // Gửi yêu cầu tới API đổi mật khẩu
            const response = await axios.post(
                `${process.env.REACT_APP_HOST_URL}user/change-password`,
                { oldPassword, newPassword },
                { headers: { Authorization: `Bearer ${tokenUser}` } }
            );

            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
            toast.success("Bạn đã thay đổi mật khẩu thành công!");
            navigate('/register_login');
        } catch (err) {
            if (err.response && err.response.data) {
                toast.error(err.response.data.message);
            } else {
                setError("Đã xảy ra lỗi khi đổi mật khẩu.");
            }
        }
    };

    return (
        <div className="change-password">
                            <Toaster position="top-right" reverseOrder={false} /> {/* Thêm Toaster */}

            <h2>Thay đổi mật khẩu</h2>
            {/* {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>} */}

            <form onSubmit={handleChangePassword}>
                <div className="form-group">
                    <label>Mật khẩu cũ:</label>
                    <div className="input-container">

                        <input
                            type={showPasswordOld ? "text" : "password"}
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                        />
                        <span
                            className="icon"
                            onClick={() => setShowPasswordOld(!showPasswordOld)}
                        >
                            {showPasswordOld ? <i class="bi bi-eye"></i> : <i class="bi bi-eye-slash"></i>}
                        </span>
                    </div>
                </div>
                <div className="form-group">
                    <label>Mật khẩu mới:</label>
                    <div className="input-container">
                        <input
                            type={showPasswordNew ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <span
                            className="icon"
                            onClick={() => setShowPasswordNew(!showPasswordNew)}
                        >
                            {showPasswordNew ? <i class="bi bi-eye"></i> : <i class="bi bi-eye-slash"></i>}
                        </span>
                    </div>
                </div>
                <div className="form-group">
                    <label>Xác nhận mật khẩu mới:</label>
                    <div className="input-container">
                        <input
                            type={showPasswordConfirmChangePW ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <span
                            className="icon"
                            onClick={()=>setShowPasswordConfirmChangePW(!showPasswordConfirmChangePW)}
                        >
                            {showPasswordConfirmChangePW ? <i class="bi bi-eye"></i> : <i class="bi bi-eye-slash"></i>}

                        </span>
                    </div>
                </div>
                <button type="submit" className="change_pw">Đổi mật khẩu</button>
            </form>
        </div>
    );
};

export default ChangePassword;
