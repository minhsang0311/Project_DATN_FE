import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import '../../styles/pages/CategoryList.css';

function CategoryList({ searchResults }) {
    const [categories, setCategories] = useState([]);
    const [displayCategories, setDisplayCategories] = useState([]); // Hiển thị danh sách

    const token = localStorage.getItem('token');

    const fetchOptions = {
        method: "GET",
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
    };

    // Hàm để lấy danh sách danh mục
    const fetchCategories = () => {
        fetch("http://localhost:3000/admin/category", fetchOptions)
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.error("Lỗi khi tải danh mục:", err));
    };

    // Hàm để xóa danh mục
    const deleteCategory = (id) => {
        if (!window.confirm('Bạn có muốn xóa loại không?')) return;

        fetch(`http://localhost:3000/admin/category/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json", 'Authorization': 'Bearer ' + token }
        })
            .then(res => res.json())
            .then(response => {
                if (response.thongbao.includes("Không thể xóa danh mục")) {
                    alert("Không thể xóa danh mục vì có sản phẩm trong danh mục này!");
                }
                fetchCategories(); // Tải lại danh sách danh mục sau khi xóa
            })
            .catch(err => console.error("Lỗi khi xóa danh mục:", err));
    };

    useEffect(() => {
        if (searchResults && searchResults.length > 0) {
            setDisplayCategories(searchResults); // Hiển thị kết quả tìm kiếm
        } else {
            fetchCategories();
        }
    }, [searchResults]);

    useEffect(() => {
        if (!searchResults || searchResults.length === 0) {
            setDisplayCategories(categories); // Hiển thị toàn bộ danh mục nếu không có kết quả tìm kiếm
        }
    }, [categories, searchResults]);

    return (
        <div className="box-categorylist">
            <div className="headertop-admin-category">
                <div className="header_admin_category">
                    <h2>DANH SÁCH DANH MỤC</h2>
                    <button className="button_admin_category">
                        <Link to="/admin/categoryAdd">THÊM DANH MỤC</Link>
                    </button>
                </div>
            </div>

            <div className="grid-container-category">
                <div className="grid-header-category">STT</div>
                <div className="grid-header-category">Tên sản phẩm</div>
                <div className="grid-header-category">Ẩn/Hiện</div>
                <div className="grid-header-category">Thao tác</div>
                {displayCategories?.map((category, index) => (
                    <React.Fragment key={category.Category_ID}>
                        <div className="grid-item-category">{index + 1}</div>
                        <div className="grid-item-category">{category.Category_Name}</div>
                        <div className="grid-item-category">{category.Show_Hidden === 1 ? "Hiện" : "Ẩn"}</div>
                        <div className="grid-item-category grid-item-button-category">
                            <Link to={`/admin/categoryUpdate/${category.Category_ID}`} className="edit-btn">✏️</Link>
                            <button className="delete-btn" onClick={() => deleteCategory(category.Category_ID)}>🗑️</button>
                        </div>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}

export default CategoryList;
