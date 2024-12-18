import React, { useState } from 'react';
import axios from 'axios';
import '../styles/components/forgotPassword.css'
import toast, { Toaster } from 'react-hot-toast';
const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [message_success, setMessage_success] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault();
        axios.post(`${process.env.REACT_APP_HOST_URL}user/forgot-password`, { email })
            .then(response => {
                console.log(response)
               
                toast.success(response.data.message_success)
            })
            .catch(error => {
               toast.error(error.response.data.message);
            });
    };

    return (
        <div className='forgot_password'>
            
            <Toaster position="top-right" reverseOrder={false} /> {/* Thêm Toaster */}

            <h2>Quên mật khẩu</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Nhập email của bạn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Gửi yêu cầu</button>
            </form>
        </div>
    );
};

export default ForgotPassword;
