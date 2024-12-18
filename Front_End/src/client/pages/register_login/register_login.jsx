import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { dalogin } from "../../reducers/authSlice";
import './register.css';
import toast, { Toaster } from "react-hot-toast";


const RegisterLogin = () => {
    // Register
    const [formData, setFormData] = useState({
        User_Name: '',
        Email: '',
        Password: ''
    });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isRightPanelActive, setIsRightPanelActive] = useState(false);
    const [shouldSubmit, setShouldSubmit] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordLogin, setShowPasswordLogin] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    // Login
    const [loginMessage, setLoginMessage] = useState(''); // Thêm trạng thái cho thông báo lỗi đăng nhập
    const userNameRef = useRef();
    const pwRef = useRef();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.Password !== confirmPassword) {
            toast.error('Mật khẩu và xác nhận mật khẩu không khớp!');
            return;
        }
        setShouldSubmit(true);
    };

    useEffect(() => {
        const registerUser = async () => {
            const url = `${process.env.REACT_APP_HOST_URL}auth/register`;
            const opt = {
                method: "POST",
                body: JSON.stringify(formData),
                headers: { 'Content-Type': 'application/json' }
            };
    
            try {
                const response = await fetch(url, opt);
                const data = await response.json();
    
                // Kiểm tra nếu response trả về thông báo lỗi email đã tồn tại
                if (response.ok) {
                    setFormData({ User_Name: '', Email: '', Password: '' });
                    setConfirmPassword('');
                    toast.success('Đăng ký thành công! Vui lòng kiểm tra email để nhận mã khuyến mãi.');
                    setIsRightPanelActive(false);
                } else {
                    if (data.message === "Email đã được đăng ký") {
                        toast.error("Email này đã được đăng ký, vui lòng chọn email khác.");
                    } else {
                        toast.error(data.message || "Có lỗi xảy ra, vui lòng thử lại.");
                    }
                }
            } catch (error) {
                toast.error('Có lỗi xảy ra, vui lòng thử lại.');
            } finally {
                setShouldSubmit(false);
            }
        };
    
        if (shouldSubmit) {
            registerUser();
        }
    }, [shouldSubmit, formData]);
    
    const submitDuLieu = (event) => {
        event.preventDefault();
        if (userNameRef.current.value === "" || pwRef.current.value === "") {
            toast.error("Vui lòng nhập đủ thông tin!");
            return;
        }
        const url = `${process.env.REACT_APP_HOST_URL}auth/login`;
        const tt = { Email: userNameRef.current.value, Password: pwRef.current.value };
        const opt = {
            method: "POST",
            body: JSON.stringify(tt),
            headers: { 'Content-Type': 'application/json' },
        };
        fetch(url, opt)
        .then(res => res.json())
        .then(data => {
            if (data.token) {
                localStorage.setItem('token', data.token);
                dispatch(dalogin(data));
                navigate('/admin');
            } else if (data.tokenUser) {
                localStorage.setItem('tokenUser', data.tokenUser);
                dispatch(dalogin(data));
                navigate('/');
            } else {
                toast.error("Đăng nhập thất bại, vui lòng thử lại!");
            }
        })
        .catch(error => {
            console.error("Đã xảy ra lỗi:", error);
            toast.error("Có lỗi xảy ra, vui lòng thử lại!");
        });
    
    };

    // Xử lý chuyển đổi giữa các panel
    const handleSignUpClick = () => {
        setIsRightPanelActive(true);
        setMessage('');
        setLoginMessage(''); // Xóa thông báo lỗi đăng nhập khi chuyển panel
    };
    const handleSignInClick = () => {
        setIsRightPanelActive(false);
        setMessage('');
        setLoginMessage(''); // Xóa thông báo lỗi đăng nhập khi chuyển panel
    };

    return (
        <div className={`container_register ${isRightPanelActive ? 'right-panel-active' : ''}`} id="container">
                            <Toaster position="top-right" reverseOrder={false} /> {/* Thêm Toaster */}

            <div className="form-container sign-up-container">
                <form onSubmit={handleSubmit} className="form">
                    {message && <p className="message">{message}</p>}
                    <h1>Tạo tài khoản</h1>
                    <input
                        className='input_register'
                        type="text"
                        name="User_Name"
                        placeholder='Nhập họ tên'
                        value={formData.User_Name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        className='input_register'
                        type="email"
                        name="Email"
                        placeholder="Nhập email"
                        value={formData.Email}
                        onChange={handleChange}
                        required
                    />
                    <div className="input-container">
                        <input
                            className='input_register'
                            type={showPassword ? "text" : "password"}
                            name="Password"
                            placeholder="Nhập mật khẩu"
                            value={formData.Password}
                            onChange={handleChange}
                            required
                        />
                        <span
                            className="icon"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <i class="bi bi-eye"></i> : <i class="bi bi-eye-slash"></i>}
                        </span>
                    </div>
                    <div className="input-container">
                        <input
                            className='input_register'
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Nhập lại mật khẩu"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            required
                        />
                        <span
                            className="icon"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <i class="bi bi-eye"></i> : <i class="bi bi-eye-slash"></i>}
                        </span>
                    </div>
                    {/* <input
                        className='input_register'
                        type="number"
                        name="Phone"
                        placeholder="Nhập số điện thoại"
                        value={formData.Phone}
                        onChange={handleChange}
                        required
                    /> */}
                    <button className='button_register' type="submit">Đăng ký</button>
                </form>
            </div>
            <div className="form-container sign-in-container">
                <form action="#" onSubmit={submitDuLieu} className="form">
                    {loginMessage && <p className="message">{loginMessage}</p>}
                    <h1>Đăng nhập</h1>
                    <input
                        className='input_register'
                        type="text"
                        placeholder="Nhập email"
                        ref={userNameRef}
                        required
                    />
                    <div className="input-container">
                        <input
                            className='input_register'
                            type={showPasswordLogin ? "text" : "password"}
                            name="Password"
                            placeholder="Nhập mật khẩu"
                            ref={pwRef}
                            required
                        />

                        <span
                            className="icon"
                            onClick={() => setShowPasswordLogin(!showPasswordLogin)}
                        >
                            {showPasswordLogin ? <i class="bi bi-eye"></i> : <i class="bi bi-eye-slash"></i>}
                        </span>
                    </div>
                    <Link to='/forgot-password'>Quên mật khẩu?</Link>
                    <button className='button_register' type="submit">Đăng nhập</button>
                </form>
            </div>
            <div className="overlay-container">
                <div className="overlay">
                    <div className="overlay-panel overlay-left">
                        <h1>Chào bạn!</h1>
                        <p>Vui lòng đăng ký tài khoản để mua hàng</p>
                        <button className="ghost button_register" onClick={handleSignInClick}>
                            Đăng nhập
                        </button>
                    </div>
                    <div className="overlay-panel overlay-right">
                        <h1>Chào bạn!</h1>
                        <p>Chào mừng bạn đã quay trở lại với chúng tôi</p>
                        <button className="ghost button_register" onClick={handleSignUpClick}>
                            Đăng ký
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterLogin;
