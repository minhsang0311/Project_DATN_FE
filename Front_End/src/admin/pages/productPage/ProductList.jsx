import { Link } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import "../../styles/pages/productList.css";

const ProductList = ({ searchResults }) => {
    const token = localStorage.getItem('token');
    const url = `http://localhost:3000/admin`;
    const [productList, setProductList] = useState([]);

    useEffect(() => {
        if (!searchResults || searchResults.length === 0) {
            // Fetch toàn bộ danh sách sản phẩm khi không có kết quả tìm kiếm
            fetch(`${url}/productList`, {
                method: 'GET',
                headers: { "Content-type": "application/json", 'Authorization': 'Bearer ' + token }
            })
                .then(res => res.json())
                .then(data => setProductList(data))
                .catch(error => console.error('Error fetching product list:', error));
        }
    }, [token, searchResults]);

    const deleteProduct = (id) => {
        if (!window.confirm('Bạn có muốn xóa sản phẩm không?')) return;

        fetch(`${url}/productDelete/${id}`, {
            method: 'DELETE',
            headers: {
                "Content-type": "application/json",
                'Authorization': 'Bearer ' + token
            }
        })
            .then(res => {
                if (!res.ok) {
                    return res.json().then(err => { alert(err.message); });
                } else {
                    alert("Đã xóa sản phẩm");
                    setProductList(prev => prev?.filter(product => product.Product_ID !== id));
                }
            });
    };

    // Hiển thị searchResults nếu có, nếu không sẽ hiển thị toàn bộ productList
    const displayProducts = searchResults && searchResults.length > 0 ? searchResults : productList;

    return (
        <div className="box-productlist">
            <div className="headertop-admin">
                <div className="header_admin">
                    <h2>DANH SÁCH SẢN PHẨM</h2>
                    <button className="button_admin">
                        <Link to="/admin/product-add">THÊM SẢN PHẨM</Link>
                    </button>
                </div>
            </div>
            <div className="grid-container">
                <div className="grid-header">STT</div>
                <div className="grid-header">Tên sản phẩm</div>
                <div className="grid-header">Hình ảnh</div>
                <div className="grid-header">Giá</div>
                <div className="grid-header">Mô tả</div>
                <div className="grid-header">Lượt xem</div>
                <div className="grid-header">Ẩn_Hiện</div>
                <div className="grid-header">Thao tác</div>
                {displayProducts?.map((product, index) => (
                    <Fragment key={product.Product_ID}>
                        <div className="grid-item grid-item-element">{product.Product_ID}</div>
                        <div className="grid-item grid-item-element">{product.Product_Name}</div>
                        <div className="grid-item grid-item-element">
                            <img src={product.Image} alt={product.Product_Name} className="product-img" />
                        </div>
                        <div className="grid-item grid-item-element">{Number(product.Price).toLocaleString("vi")} VNĐ</div>
                        <div className="grid-item">
                            {product.Description.split('\n')?.map((desc, index) => (
                                <div className="description" key={index}>{desc.replace('-', '')}</div>
                            ))}
                        </div>
                        <div className="grid-item grid-item-element">{product.Views}</div>
                        <div className="grid-item grid-item-element">{product.Show_Hidden === 1 ? "Hiện" : "Ẩn"}</div>
                        <div className="grid-item grid-item-button">
                            <Link to={`/admin/productUpdate/${product.Product_ID}`} className="edit-btn">✏️</Link>
                            <button className="delete-btn" onClick={() => deleteProduct(product.Product_ID)}>🗑️</button>
                        </div>
                    </Fragment>
                ))}
            </div>
        </div>
    );
};

export default ProductList;
