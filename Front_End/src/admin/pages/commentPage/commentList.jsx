import React, { useState, useEffect, Fragment } from 'react';
import '../../styles/pages/commentList.css';
const Comments = ({ searchResults }) => {
    const [comments, setComments] = useState([]);
    const token = localStorage.getItem('token')
    const [error, setError] = useState('');
    useEffect(() => {
        if (!searchResults || searchResults.length === 0) {
            const fetchComments = async () => {
                try {
                    const response = await fetch('http://localhost:3000/admin/reviews', {
                        method: 'GET',
                        headers: {
                            "Content-Type": "application/json",
                            'Authorization': 'Bearer ' + token
                        }
                    });
                    const data = await response.json();
                    setComments(data);
                } catch (err) {
                    setError('Lỗi khi lấy dữ liệu bình luận');
                }
            };
            fetchComments();
        }
    }, [searchResults]);
    const handleVisibilityToggle = async (id, currentStatus) => {
        const newStatus = currentStatus === 1 ? 0 : 1;
        try {
            const response = await fetch(`http://localhost:3000/admin/reviews/${id}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({ Show_Hidden: newStatus })
            });
            const data = await response.json();
            alert(data.message);
            // Cập nhật lại trạng thái hiển thị trong danh sách
            setComments(comments?.map(comment => comment.Review_ID === id ? { ...comment, Show_Hidden: newStatus } : comment));
        } catch (err) {
            setError('Lỗi khi cập nhật trạng thái hiển thị');
        }
    };
    const displayComents = searchResults && searchResults.length > 0 ? searchResults : comments;

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="box-productlist">
            <div className="headertop-admin">
                <div className="header_admin">
                    <h2>DANH SÁCH BÌNH LUẬN</h2>
                </div>
            </div>
            <div className="grid-container-comment">
                <div className="grid-header">ID</div>
                <div className="grid-header">Người dùng</div>
                <div className="grid-header">Tên sản phẩm</div>
                <div className="grid-header">Bình luận</div>
                <div className="grid-header">Ẩn/ Hiện</div>
                {displayComents?.map(comment => (
                    <Fragment key={comment.Review_ID}>

                        <div className="grid-item grid-item-element">{comment.Review_ID}</div>
                        <div className="grid-item grid-item-element">{comment.User_Name}</div>
                        <div className="grid-item grid-item-element">{comment.Product_Name}</div>

                        <div className="grid-item grid-item-element">{comment.Comment}</div>
                        <div className="grid-item grid-item-element show-hidden">{comment.Show_Hidden === 1 ? 'Hiển thị' : 'Ẩn'}/
                            <button onClick={() => handleVisibilityToggle(comment.Review_ID, comment.Show_Hidden)}>
                                {comment.Show_Hidden === 1 ? 'Ẩn' : 'Hiển thị'}
                            </button>

                        </div>
                    </Fragment>
                ))}
            </div>
        </div>
    );
};

export default Comments;
