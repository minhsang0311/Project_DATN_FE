import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import '../../styles/pages/CategoryUpdate.css';

function CategoryUpdate() {
    const [category, setCategory] = useState({});
    const token = localStorage.getItem('token')
    const { id } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        const opt = {
            method: "get",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        };
        fetch(`http://localhost:3000/admin/categoryDetail/${id}`, opt)
            .then(res => res.json())
            .then(data => setCategory(data))
            .catch(error => console.error("Lỗi khi lấy dữ liệu:", error));
    }, [id]);

    const submitData = (evt) => {
        evt.preventDefault();
        const opt = {
            method: "put",
            body: JSON.stringify(category),
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + token
            }
        };

        fetch(`http://localhost:3000/admin/categoryUpdate/${id}`, opt)
            .then(res => res.json())
            .then(data => {
                console.log("Kết quả =", data);
                navigate("/admin/category");
            })
            .catch(error => console.error("Lỗi khi cập nhật:", error));
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCategory(prevCategory => ({
            ...prevCategory,
            [name]: value
        }));
    };
    return (
        <div className="form-container-productadd">
            <div className="form-header-update">
                <h2>SỬA DANH MỤC</h2>
            </div>
            <form className="productadd-form" onSubmit={submitData}>
                    <div className="form-group">
                        <label htmlFor="category-name">Tên danh mục</label>
                        <input
                            type="text"
                            id="category-name"
                            placeholder="Nhập tên sản phẩm ..."
                            value={category.Category_Name || ''}
                            onChange={handleInputChange}
                            name="Category_Name"
                        />
                    </div>
                    <div className="input-field">
                        <label>Ẩn/Hiện</label>
                        <div className="radio-options">
                            <label>
                                <input
                                    type="radio"
                                    name="Show_Hidden"
                                    value="0"
                                    checked={category.Show_Hidden === 0}
                                    onChange={() => setCategory({ ...category, Show_Hidden: 0 })}
                                /> Ẩn
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="Show_Hidden"
                                    value="1"
                                    checked={category.Show_Hidden === 1}
                                    onChange={() => setCategory({ ...category, Show_Hidden: 1 })}
                                /> Hiện
                            </label>
                        </div>
                    </div>
                <div className="button-group m-3 d-flex">
                    <button type="submit" className="submit-btn">CẬP NHẬT</button>
                </div>
            </form>
        </div>
    );
}

export default CategoryUpdate;
