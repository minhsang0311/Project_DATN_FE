import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../../styles/pages/productUpdate.css";

const ProductUpdate = () => {
    const token = localStorage.getItem('token');
    let { id } = useParams();
    let url = `http://localhost:3000/admin`;
    const [productUpdate, setProductUpdate] = useState([]);
    const [image, setImage] = useState(null);
    const [imageFile, setImageFile] = useState(null); // lưu hình ảnh cũ khi không thay đổi hình ảnh cũ
    const [categories, setCategories] = useState([]); // Danh sách danh mục
    const [brands, setBrands] = useState([]); // Danh sách hãng
    const [additionalImages, setAdditionalImages] = useState([]); //lưu ảnh bổ sung
    const [newAdditionalImages, setNewAdditionalImages] = useState([]);
    const [reloadImages, setReloadImages] = useState(false);

    useEffect(() => {
        // Lấy chi tiết sản phẩm
        fetch(`${url}/productList/${id}`, {
            method: 'GET',
            headers: { "Content-type": "application/json", 'Authorization': 'Bearer ' + token }
        })
            .then(res => res.json())
            .then(data => {
                setProductUpdate(data);
                if (data.Image) {
                    setImage(data.Image);
                }
            })
            .catch(error => {
                console.log("Đã có lỗi lấy chi tiết sản phẩm", error);
                alert("Đã có lỗi lấy chi tiết sản phẩm", error);
            });

        // Lấy danh sách danh mục
        fetch(`${url}/category`, {
            method: 'GET',
            headers: { "Content-type": "application/json", 'Authorization': 'Bearer ' + token }
        })
            .then(res => res.json())
            .then(data => {
                setCategories(data);
            })
            .catch(error => {
                console.log("Đã có lỗi lấy danh sách danh mục", error);
                alert("Đã có lỗi lấy danh sách danh mục", error);
            });

        // Lấy danh sách hãng
        fetch(`${url}/brand`, {
            method: 'GET',
            headers: { "Content-type": "application/json", 'Authorization': 'Bearer ' + token }
        })
            .then(res => res.json())
            .then(data => {
                setBrands(data);
            })
            .catch(error => {
                console.log("Đã có lỗi lấy danh sách hãng", error);
                alert("Đã có lỗi lấy danh sách hãng", error);
            });
        fetch(`${url}/productImageDetail/${id}`, {
            method: 'GET',
            headers: { "Content-type": "application/json", 'Authorization': 'Bearer ' + token }
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setAdditionalImages(data);
                    setReloadImages(false);
                }
            })
            .catch(error => {
                console.log("Đã có lỗi lấy ảnh bổ sung", error);
                alert("Đã có lỗi lấy ảnh bổ sung", error);
            });
    }, [id, token, reloadImages]);
    const handleDeleteAdditionalImage = (imageId) => {
        const confirmed = window.confirm("Bạn có chắc chắn muốn xóa ảnh này?");
        if (!confirmed) return;

        // Xóa ảnh bổ sung trên server
        fetch(`${url}/productDeleteImg/${imageId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.message === "Xóa thành công") {
                    alert("Xóa ảnh bổ sung thành công!");
                    // Remove the deleted image from the state directly
                    setAdditionalImages(prevImages => prevImages.filter(img => img.Image_ID !== imageId));
                } else {
                    alert("Xóa ảnh không thành công. Vui lòng thử lại.");
                }
            })
            .catch((error) => {
                console.error("Lỗi khi xóa ảnh bổ sung:", error);
                alert("Đã có lỗi khi xóa ảnh bổ sung.");
            });
    };

    // Handle delete for newly added images (no server-side action needed)
    const handleDeleteNewImage = (index) => {
        const updatedImages = [...newAdditionalImages];
        updatedImages.splice(index, 1);
        setNewAdditionalImages(updatedImages); // Directly remove the image from the newAdditionalImages array
    };



    // Hàm submit khi lưu sản phẩm
    const Submit = (evt) => {
        evt.preventDefault();
        const formData = new FormData();
        formData.append('Product_Name', productUpdate.Product_Name);
        formData.append('Price', productUpdate.Price);
        formData.append('Promotion', productUpdate.Promotion);
        formData.append('Category_ID', productUpdate.Category_ID);
        formData.append('Brand_ID', productUpdate.Brand_ID);

        // Nếu có ảnh chính mới, thêm vào formData
        if (imageFile) {
            formData.append('Image', imageFile);
        } else {
            formData.append('Image', productUpdate.Image); // Giữ ảnh cũ nếu không thay đổi
        }

        formData.append('Views', productUpdate.Views);
        formData.append('Description', productUpdate.Description);
        formData.append('Show_Hidden', productUpdate.Show_Hidden);

        // Thêm các hình ảnh bổ sung mới vào formData
        newAdditionalImages.forEach((file) => {
            formData.append("additionalImages", file);
        });

        fetch(`http://localhost:3000/admin/productUpdate/${id}`, {
            method: "PUT",
            body: formData,
            headers: { 'Authorization': 'Bearer ' + token },
        })
            .then(res => res.json())
            .then(data => {
                console.log("data", data);
                window.location.href = '/admin/products';
            })
            .catch(error => {
                console.log("Đã có lỗi sửa sản phẩm", error);
                alert("Đã có lỗi sửa sản phẩm", error);
            });
    };

    function uploadFile(event) {
        const file = event.target.files[0];
        setImage(URL.createObjectURL(file)); // Hiển thị ảnh mới trên giao diện
        setImageFile(file); // Lưu tệp để gửi lên server
    }


    return (
        <div className="form-container-productadd">
            <div className="form-header-update">
                <h2>TRANG SỬA SẢN PHẨM</h2>
            </div>
            <form action="#" className="productadd-form">
                <div className="input-productadd">
                    <div className="form-group-left">
                        <div className="form-group">
                            <label htmlFor="product-image">Hình sản phẩm</label>
                            <input
                                type="file"
                                id="product-image"
                                onChange={uploadFile}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="product-additional-images">Ảnh bổ sung</label>
                            <input
                                type="file"
                                id="product-additional-images"
                                multiple
                                onChange={(e) => {
                                    const files = Array.from(e.target.files);
                                    setNewAdditionalImages(prevImages => [...prevImages, ...files]);
                                }}
                            />

                            <div className="additional-images">
                                {/* Hiển thị ảnh cũ */}
                                {additionalImages.map((img, index) => (
                                    <div key={index} className="additional-image-item">
                                        <img src={img.Image_URL} alt={`Ảnh bổ sung ${index + 1}`} className="additional-image-preview" />
                                        <button
                                            className="delete-image-btn"
                                            onClick={() => handleDeleteAdditionalImage(img.Image_ID)}
                                        >
                                            x
                                        </button>
                                    </div>
                                ))}

                                {/* Hiển thị ảnh mới */}
                                {newAdditionalImages.map((file, index) => (
                                    <div key={`new-${index}`} className="additional-image-item">
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={`Ảnh mới ${index + 1}`}
                                            className="additional-image-preview"
                                        />
                                        <button
                                            className="delete-image-btn"
                                            onClick={() => handleDeleteNewImage(index)}
                                        >
                                            x
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="product-name">Tên sản phẩm</label>
                            <input
                                type="text"
                                id="product-name"
                                placeholder="Nhập tên sản phẩm ..."
                                value={productUpdate.Product_Name || ''}
                                onChange={e =>
                                    setProductUpdate({ ...productUpdate, Product_Name: e.target.value })
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="product-category">Chọn danh mục</label>
                            <select
                                id="product-category"
                                value={productUpdate.Category_ID || ''}
                                onChange={e =>
                                    setProductUpdate({ ...productUpdate, Category_ID: e.target.value })
                                }
                            >
                                <option value="">Chọn danh mục sản phẩm...</option>
                                {categories.map(category => (
                                    <option key={category.Category_ID} value={category.Category_ID}>
                                        {category.Category_Name}
                                    </option>
                                ))}
                            </select>
                        </div>

                    </div>
                    <div className="form-group-right">
                        <div className="form-group">
                            <label htmlFor="product-brand">Chọn hãng</label>
                            <select
                                id="product-brand"
                                value={productUpdate.Brand_ID || ''}
                                onChange={e =>
                                    setProductUpdate({ ...productUpdate, Brand_ID: e.target.value })
                                }
                            >
                                <option value="">Chọn hãng sản phẩm...</option>
                                {brands.map(brand => (
                                    <option key={brand.Brand_ID} value={brand.Brand_ID}>
                                        {brand.Brand_Name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="product-price">Giá sản phẩm</label>
                            <input
                                type="number"
                                id="product-price"
                                placeholder="Nhập giá sản phẩm ..."
                                value={productUpdate.Price || ''}
                                onChange={e =>
                                    setProductUpdate({ ...productUpdate, Price: e.target.value })
                                }
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="product-price">% giảm giá sản phẩm</label>
                            <input
                                type="number"
                                id="product-pricesale"
                                placeholder="Nhập giá sản phẩm ..."
                                value={productUpdate.Promotion || ''}
                                onChange={e =>
                                    setProductUpdate({ ...productUpdate, Promotion: e.target.value })
                                }
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="product-description">Mô tả sản phẩm</label>
                            <textarea
                                type="text"
                                id="product-description"
                                placeholder="Nhập mô tả sản phẩm ..."
                                value={productUpdate.Description || ''}
                                onChange={e => {
                                    setProductUpdate({ ...productUpdate, Description: e.target.value });
                                }}
                                style={{ height: '130px' }} 
                            ></textarea>
                        </div>
                        <div className="form-group">
                            <label htmlFor="product-category">Lượt xem</label>
                            <input
                                type="number"
                                id="product-view"
                                placeholder="Nhập số lượt xem ..."
                                value={productUpdate.Views || ''}
                                onChange={e =>
                                    setProductUpdate({ ...productUpdate, Views: e.target.value })
                                }
                            />
                        </div>
                        <div className="form-group">
                            <label>Ẩn/Hiện</label>
                            <div className="radio-group">
                                <label>
                                    <input
                                        type="radio"
                                        name="visibility"
                                        value="false"
                                        checked={productUpdate.Show_Hidden === 0}
                                        onChange={e =>
                                            setProductUpdate({ ...productUpdate, Show_Hidden: 0 })
                                        }
                                    /> Ẩn
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="visibility"
                                        value="true"
                                        checked={productUpdate.Show_Hidden === 1}
                                        onChange={e =>
                                            setProductUpdate({ ...productUpdate, Show_Hidden: 1 }) // Cập nhật thành hiện
                                        }
                                    /> Hiện
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <button type="submit" className="submit-btn" onClick={Submit}>CẬP NHẬT</button>
            </form>
        </div>
    );
};

export default ProductUpdate;