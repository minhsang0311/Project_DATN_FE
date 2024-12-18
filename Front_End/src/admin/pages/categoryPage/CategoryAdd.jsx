import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { toast, Toaster } from 'react-hot-toast'; // Import toast
import '../../styles/pages/CategoryAdd.css'

const CategoryAdd = () => {
    const navigate = useNavigate()
    const token = localStorage.getItem('token')
    const [category, setCategory] = useState({ Category_Name: '', Show_Hidden: false });
    const Submit = (evt) => {
        evt.preventDefault();
        if (!category.Category_Name.trim()) {
            alert("Vui lòng nhập tên danh mục!"); // Hiển thị thông báo
            return; // Dừng xử lý nếu không hợp lệ
        }
    
        let data = {
            Category_Name: category.Category_Name,
            Show_Hidden: category.Show_Hidden
        };
        let url = `http://localhost:3000/admin/categoryAdd`;
        let opt = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(data) 
        };
        
        fetch(url, opt)
            .then(res => res.json())
            .then(data => {
                if (data.err) {
                    alert(data.thongbao); 
                } else {
                    setCategory({ Category_Name: '', Show_Hidden: false });
                    navigate('/admin/category'); 
                }
            })
            .catch(error => {
                alert("Đã có lỗi thêm danh mục", error);
            });
    }

    return (
        
        <div className="form-container-productadd">
            <div className="form-header-addproduct">
                            <Toaster position="top-right" reverseOrder={false} /> {/* Thêm Toaster */}
                
                <h2>THÊM DANH MỤC</h2>
            </div>
            <form className="productadd-form" onSubmit={Submit}>
                <div className="input-category-add">
                  
                        <div className="form-group">
                            <label htmlFor="category-name">Tên danh mục</label>
                            <input
                                type="text"
                                id="category-name"
                                placeholder="Nhập tên danh mục..."
                                value={category.Category_Name}
                                onChange={e =>
                                    setCategory({ ...category, Category_Name: e.target.value })
                                }
                            />
                        </div>
                        <div className="form-group">
                            <label>Ẩn / Hiện</label>
                            <div className="radio-group">
                                <label>
                                    <input
                                        type="radio"
                                        name="visibility"
                                        value={false}
                                        checked={category.Show_Hidden === false}
                                        onChange={() => 
                                            setCategory({ ...category, Show_Hidden: false })
                                        }
                                    /> Ẩn
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="visibility"
                                        value={true}
                                        checked={category.Show_Hidden === true}
                                        onChange={() => 
                                            setCategory({ ...category, Show_Hidden: true })
                                        }
                                    /> Hiện
                                </label>
                            </div>
                    </div>
                </div>
                <button type="submit" className="submit-btn">THÊM DANH MỤC</button>
            </form>
        </div>
    );
}
export default CategoryAdd;
