
// import { listsp } from "./data";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "./cartSlice";
import '../styles/components/Home.css';
import toast, { Toaster } from "react-hot-toast";

function SpMoi() {
    const [listsp, ganListSP] = useState([]);
    const [sp] = useState(null);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [likedProducts, setLikedProducts] = useState([]);

    const [showToast, setShowToast] = useState(false);
    useEffect(() => {
        fetch(`${process.env.REACT_APP_HOST_URL}user/productNew`)
            .then(res => res.json())
            .then(data => ganListSP(data));

        // Fetch danh sách yêu thích của người dùng
        const fetchWishlist = async () => {
            const userId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).id : null;
            if (userId) {
                const response = await fetch(`${process.env.REACT_APP_HOST_URL}user/wishlist/${userId}`);
                const data = await response.json();
                setLikedProducts(data.map(item => item.Product_ID)); // Lưu ID sản phẩm đã yêu thích
            }
        };

        fetchWishlist();
    }, []);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(value);
    };

    const handleAddToCart = (sp) => {
        const cartItem = {
            id: sp?.Product_ID,
            image: sp?.Image,
            name: sp?.Product_Name,
            price: sp?.Price,
            quantity: 1, // Đảm bảo số lượng là 1 khi thêm vào
        };

        // Lấy giỏ hàng hiện tại từ localStorage
        const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = currentCart.find(item => item.id === cartItem.id);

        // Nếu sản phẩm đã có trong giỏ hàng, tăng số lượng
        if (existingItem) {
            existingItem.quantity += 1;
            toast.success('Đã tăng số lượng sản phẩm trong giỏ hàng!');
        } else {
            currentCart.push(cartItem); // Thêm sản phẩm mới vào giỏ
            toast.success('Đã thêm sản phẩm vào giỏ hàng!');
        }


        // Lưu giỏ hàng vào localStorage
        localStorage.setItem('cart', JSON.stringify(currentCart));

        // Dispatch hành động thêm sản phẩm vào Redux
        dispatch(addToCart(cartItem));
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
        }, 3000); // Hiện thông báo trong 3 giây
    };
    const handleWishlistToggle = async (product) => {
        const userId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).id : null;
        const userRole = JSON.parse(localStorage.getItem('user'))
        if (!userId) {
            alert('Bạn cần đăng nhập để quản lý danh sách yêu thích!');
            navigate('/register_login')
            return;
        }
        if (userRole.role !== 0) {
            alert('Tài khoản không thể thêm sản phẩm yêu thích!');
            navigate('/register_login')
            return;
        }

        try {
            const isLiked = likedProducts.includes(product.Product_ID);
            const url = `${process.env.REACT_APP_HOST_URL}user/wishlist`;
            const method = isLiked ? 'DELETE' : 'POST';
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    productId: product.Product_ID
                }),
            });
            const data = await response.json();

            if (response.ok) {
                // Cập nhật trạng thái yêu thích
                if (isLiked) {
                    setLikedProducts(prev => prev.filter(id => id !== product.Product_ID));
                } else {
                    setLikedProducts(prev => [...prev, product.Product_ID]);
                }
                toast.success(data.message)

                // alert(data.message);
            } else {
                alert("bạn chưa đăng nhập");
                // navigate('/register_login')
            }
        } catch (error) {
            console.log("Lỗi khi thêm/xóa sản phẩm khỏi yêu thích:", error);
        }
    };

    const isProductInWishlist = (productId) => {
        return likedProducts.includes(productId);
    };

    return (
        <div className="spbanchay">
            <div className="left-image">
                <Toaster position="top-right" reverseOrder={false} /> {/* Thêm Toaster */}
                <img src="/assets/img/banner20.jpg" alt="img1" />
                <img src="/assets/img/banner20.1.jpg" alt="img2" />
            </div>
            <div className="right-products">
                <div className="header1">
                    <p>SẢN PHẨM MỚI</p>

                </div>
                <div className="box-sp">

                    {listsp.slice(0, 8).map((sp, i) => (

                        <div className="product" key={i}>
                            {sp.Promotion > 0 && (
                                <div className="discount-label">
                                    -{sp.Promotion}%
                                </div>
                            )}
                            <div className="img-wrapper">
                                <img src={sp.Image} alt={sp.Product_Name} />
                            </div>

                            <Link to={"/productDetail/" + sp.Product_ID}>{sp.Product_Name}</Link>
                            <div className="price_giohang">
                                <div className="price">
                                    {sp.Promotion > 0 ? (
                                        <>
                                            <p className="old-price">{formatCurrency(sp.Price)}</p>
                                            <p className="new-price">{formatCurrency(sp.Price - (sp.Promotion * sp.Price) / 100)}</p>
                                        </>
                                    ) : (
                                        <p className="new-price">{formatCurrency(sp.Price)}</p>
                                    )}
                                </div>
                                <button onClick={() => handleAddToCart(sp)} className="add-to-cart">Giỏ hàng</button>
                            </div>
                            <div
                                className={`heart-icon ${isProductInWishlist(sp.Product_ID) ? 'liked' : ''}`}
                                onClick={() => handleWishlistToggle(sp)}
                                style={{
                                    position: "absolute",
                                    top: "10px",
                                    right: "10px",
                                    cursor: "pointer"
                                }}
                            >
                                <i
                                    className={`fa${isProductInWishlist(sp.Product_ID) ? 's' : 'r'} fa-heart`}
                                    style={{ fontSize: "24px", color: isProductInWishlist(sp.Product_ID) ? "red" : "#ccc" }}
                                ></i>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SpMoi;

