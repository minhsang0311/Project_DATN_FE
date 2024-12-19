import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import '../../styles/components/Search.css';

export default function Search() {
    const [productSearch, setProductSearch] = useState([]);
    const [error, setError] = useState(null);  // Thêm trạng thái để lưu lỗi
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const keyword = searchParams.get('q');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            if (keyword) {
                try {
                    const res = await fetch(`http://localhost:3000/search?q=${encodeURIComponent(keyword)}`);
                    if (!res.ok) {
                        throw new Error(`HTTP error! Status: ${res.status}`);
                    }
                    const data = await res.json();
                    setProductSearch(data.results || []);
                    setError(null);
                } catch (error) {
                    console.error('Lỗi tìm nạp dữ liệu sản phẩm:', error.message);
                    setError(`Lỗi tìm nạp dữ liệu sản phẩm: ${error.message}`);
                }
            }
        };

        fetchData();
    }, [keyword]);

    const handleAddToCart = (product) => {
        const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingProduct = savedCart?.find(item => item.Product_ID === product.Product_ID);

        if (existingProduct) {
            existingProduct.quantity = (existingProduct.quantity || 1) + 1;
        } else {
            savedCart.push({ ...product, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(savedCart));
        navigate('/cart');
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(value);
    };

    return (
        <div className="container mt-3">
            <div className="row">
                <div className="col-12">
                    <h3>Kết quả tìm kiếm cho từ khóa: <strong>{keyword}</strong></h3>
                    {error ? (  // Hiển thị lỗi nếu có
                        <p className="text-danger">{error}</p>
                    ) : (
                        <div className="product-list">
                            {productSearch.length > 0 ? (
                                productSearch?.map((sp) => (
                                    <div className="product" key={sp.Product_ID}>
                                        {sp.Promotion > 0 && (
                                            <div className="discount-labell">
                                                -{sp.Promotion}%
                                            </div>
                                        )}
                                        <div className="img-wrapper">
                                            <img src={sp.Image} alt={sp.Product_Name} />
                                        </div>
                                        <Link to={`/productDetail/${sp.Product_ID}`}>
                                            <h1>{sp.Product_Name}</h1>
                                        </Link>
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
                                        <button className="add-to-cart" onClick={() => handleAddToCart(sp)}>
                                            Thêm vào giỏ hàng
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="col-12">
                                    <p>Không tìm thấy sản phẩm nào.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
