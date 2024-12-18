import React, { useState, useEffect } from 'react';
import '../styles/components/Comments.css';
import toast, { Toaster } from "react-hot-toast";

const Comments = ({ productId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [rating, setRating] = useState(5);
    const [userId, setUserId] = useState(null);
    const [username, setUsername] = useState('');
    const [canComment, setCanComment] = useState(false); // Kiểm tra quyền bình luận

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setUserId(user.id);
            setUsername(user.username);
        } else {
            toast.error("Bạn cần đăng nhập để bình luận.");
        }
    }, []);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_HOST_URL}user/reviews/${productId}`
                );
                if (response.ok) {
                    const data = await response.json();
                    setComments(data);
                } else {
                    const errorData = await response.json();
                    // toast.error(errorData.message || 'Không có bình luận cho sản phẩm này.');
                }
            } catch (error) {
                console.error('Lỗi khi lấy bình luận:', error);
                toast.error('Không thể tải bình luận.');
            }
        };

        fetchComments();
    }, [productId]);

    // Kiểm tra xem người dùng đã mua sản phẩm chưa
    useEffect(() => {
        const checkIfCanComment = async () => {
            if (!userId) return;  // Nếu không có userId, không kiểm tra quyền bình luận

            try {
                const response = await fetch(`http://localhost:3000/user/orders/canComment/${userId}/${productId}`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                    }
                });

                const data = await response.json();
                setCanComment(data.canComment);  // Nếu canComment = true, người dùng có thể bình luận
            } catch (error) {
                console.error('Lỗi khi kiểm tra quyền bình luận:', error);
                toast.error('Không thể kiểm tra quyền bình luận.');
            }
        };

        checkIfCanComment();
    }, [userId, productId]);

    const handleAddComment = async (e) => {
        e.preventDefault();

        if (!newComment.trim()) {
            toast.error('Vui lòng nhập nội dung bình luận.');
            return;
        }

        const newCommentData = {
            User_ID: userId,
            Product_ID: productId,
            Ratting: rating,
            Comment: newComment,
            User_Name: username,
            Show_Hidden: 1,
        };

        try {
            const response = await fetch(`${process.env.REACT_APP_HOST_URL}user/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newCommentData),
            });

            const data = await response.json();
            if (response.ok) {
                setNewComment('');
                setComments((prev) => [...prev, { ...newCommentData, Review_ID: data.reviewId }]);
                toast.success(data.message || 'Thêm bình luận thành công!');
            } else {
                toast.error(data.message || 'Không thể thêm bình luận.');
            }
        } catch (error) {
            console.error('Lỗi khi thêm bình luận:', error);
            toast.error('Không thể gửi bình luận.');
        }
    };

    const renderStars = (ratting) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span key={i} className={i <= ratting ? 'star filled' : 'star'}>
                    ★
                </span>
            );
        }
        return stars;
    };

    return (
        <div className="comments-section">
            <Toaster position="top-right" reverseOrder={false} />
            <h3>Bình luận</h3>

            <ul>
                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <li key={comment.Review_ID} className="comment-item">
                            <img
                                src="https://i.pinimg.com/736x/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg"
                                alt={comment.User_Name}
                                className="user-avatar"
                            />
                            <div className="comment-content">
                                <strong>{comment.User_Name}</strong>
                                <div className="stars">{renderStars(comment.Ratting)}</div>
                                <p>{comment.Comment}</p>
                            </div>
                        </li>
                    ))
                ) : (
                    <li><p>Chưa có bình luận nào cho sản phẩm này.</p></li>
                )}
            </ul>

            {/* Hiển thị form bình luận chỉ nếu người dùng đã mua sản phẩm */}
            {canComment ? (
                <form onSubmit={handleAddComment}>
                    <textarea
                        placeholder="Nội dung bình luận"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        required
                    />
                    <label>
                        Đánh giá:
                        <select
                            value={rating}
                            onChange={(e) => setRating(parseInt(e.target.value))}
                        >
                            <option value={5}>5 sao</option>
                            <option value={4}>4 sao</option>
                            <option value={3}>3 sao</option>
                            <option value={2}>2 sao</option>
                            <option value={1}>1 sao</option>
                        </select>
                    </label>
                    <button className='postcomment' type="submit">Gửi bình luận</button>
                </form>
            ) : (
                <p>Bạn cần mua sản phẩm này trước khi có thể bình luận.</p>
            )}
        </div>
    );
};

export default Comments;
