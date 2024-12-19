
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router";
// import { useSelector } from 'react-redux';
import '../../styles/pages/productAdd.css'
const ProductAdd = () => {
    const token = localStorage.getItem('token')
    const [product, setProduct] = useState({});
    const [image, setImage] = useState(null);
    const [additionalImages, setAdditionalImages] = useState([]); // State cho ảnh con
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const navigate = useNavigate()
    useEffect(() => {
        fetch(`http://localhost:3000/admin/category`, {
            method: "get",
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
        })
            .then(res => res.json())
            .then(data => setCategories(data))
        fetch(`http://localhost:3000/admin/brand`, {
            method: "get",
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        })
            .then(res => res.json())
            .then(data => setBrands(data))
    }, [])
    const uploadFile = (event) => {
        setImage(event.target.files[0]);
    };
    const uploadAdditionalImages = (event) => {
        const files = Array.from(event.target.files);

        // Kiểm tra số lượng ảnh hiện có và số lượng ảnh được thêm vào
        if (additionalImages.length + files.length > 10) {
            alert("Bạn không thể thêm quá 10 ảnh bổ sung");
            return;
        }

        setAdditionalImages(prevImages => [
            ...prevImages,
            ...files?.map(file => ({
                file,
                preview: URL.createObjectURL(file)
            }))
        ]);
    };



    const Submit = (evt) => {
        evt.preventDefault();
        // Kiểm tra dữ liệu đầu vào
        if (!product.Product_Name || product.Product_Name.trim() === "") {
            alert("Tên sản phẩm không được để trống!");
            return;
        }
        if (!product.Price || isNaN(product.Price) || product.Price <= 0) {
            alert("Vui lòng nhập giá sản phẩm hợp lệ!");
            return;
        }
        if (!product.Category_ID) {
            alert("Vui lòng chọn danh mục sản phẩm!");
            return;
        }
        if (!product.Brand_ID) {
            alert("Vui lòng chọn hãng sản phẩm!");
            return;
        }
        if (!image) {
            alert("Vui lòng chọn hình ảnh chính cho sản phẩm!");
            return;
        }
        if (!product.Views) {
            alert("Vui lòng chọn số lượt xem cho sản phẩm!");
            return;
        }

        if (!product.Description) {
            alert("Vui lòng nhập mô tả cho sản phẩm!");
            return;
        }
        if (!product.Show_Hidden) {
            alert("Vui lòng ẩn hiện cho sản phẩm!");
            return;
        }

        const formData = new FormData();
        formData.append('Product_Name', product.Product_Name);
        formData.append('Price', product.Price);
        formData.append('Promotion', product.Promotion);
        formData.append('Category_ID', product.Category_ID);
        formData.append('Brand_ID', product.Brand_ID);
        formData.append('Image', image); // Ảnh chính
        formData.append('Views', product.Views);
        formData.append('Description', product.Description);
        formData.append('Show_Hidden', product.Show_Hidden);

        // Thêm danh sách ảnh nhỏ
        additionalImages.forEach((imgObj, index) => {
            console.log(`Thêm ảnh bổ sung ${index + 1}:`, imgObj.file.name);
            formData.append('additionalImages', imgObj.file);
        });

        fetch(`http://localhost:3000/admin/productAdd`, {
            method: 'POST',
            body: formData,
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                if (data.message) {
                    alert(data.message);
                    navigate('/admin/products')
                }
                setProduct({});
                setAdditionalImages([]);
            })
            .catch((error) => {
                console.error("Lỗi thêm sản phẩm:", error);
                alert("Có lỗi xảy ra, vui lòng thử lại.", error);
            });
    };


    return (
        <div className="form-container-productadd">
            <div className="form-header-addproduct">
                <h2>THÊM SẢN PHẨM</h2>
            </div>
            <form action="#" className="productadd-form">
                <div className="input-productadd">
                    <div className="form-group-left">
                        <div className="form-group">
                            <label htmlForfor="product-name">Tên sản phẩm</label>
                            <input
                                type="text"
                                id="product-name"
                                placeholder="Nhập tên sản phẩm ..."
                                value={product.Product_Name || ''}
                                onChange={e =>
                                    setProduct({ ...product, Product_Name: e.target.value })
                                }
                            />
                        </div>
                        <div className="form-group">
                            <label htmlForfor="product-price">Giá sản phẩm</label>
                            <input
                                type="number"
                                id="product-price"
                                placeholder="Nhập giá sản phẩm ..."
                                value={product.Price || ''}
                                onChange={e =>
                                    setProduct({ ...product, Price: e.target.value })
                                }
                            />
                        </div>
                        <div className="form-group">
                            <label htmlForfor="product-price">Giảm giá %</label>
                            <input
                                type="number"
                                id="product-price-sale"
                                placeholder="Nhập % giảm giá sản phẩm ..."
                                value={product.Promotion || ''}
                                onChange={e =>
                                    setProduct({ ...product, Promotion: e.target.value })
                                }
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="product-category">Chọn danh mục</label>
                            <select
                                id="product-category"
                                value={product.Category_ID || ''}
                                onChange={e =>
                                    setProduct({ ...product, Category_ID: e.target.value })
                                }
                            >
                                <option value="">Chọn danh mục sản phẩm ...</option>
                                {categories?.map(category => (
                                    <option key={category.Category_ID} value={category.Category_ID}>
                                        {category.Category_Name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="product-brand">Chọn hãng</label>
                            <select
                                id="product-brand"
                                value={product.Brand_ID || ''}
                                onChange={e =>
                                    setProduct({ ...product, Brand_ID: e.target.value })
                                }
                            >
                                <option value="">Chọn hãng sản phẩm ...</option>
                                {brands?.map(brand => (
                                    <option key={brand.Brand_ID} value={brand.Brand_ID}>
                                        {brand.Brand_Name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="form-group-right">
                        <div className="form-group">
                            <label htmlForfor="product-image">Hình sản phẩm</label>
                            <input
                                type="file"
                                id="product-image"
                                onChange={uploadFile}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="additional-images">Ảnh bổ sung</label>
                            <input
                                type="file"
                                id="additional-images"
                                multiple
                                onChange={uploadAdditionalImages}
                            />
                        </div>
                        <div className="image-preview-container">
                            {additionalImages?.map((imageObj, index) => (
                                <div key={index} className="image-preview-item">
                                    <img
                                        style={{ width: '50px', height: "50px" }}
                                        src={imageObj.preview}
                                        alt={`Preview ${index + 1}`}
                                        className="preview-image"
                                    />
                                    <button
                                        onClick={() => {
                                            const updatedImages = additionalImages?.filter((_, idx) => idx !== index);
                                            setAdditionalImages(updatedImages);
                                        }}
                                    >
                                        <i class="bi bi-x-circle"></i>
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="form-group">
                            <label htmlForfor="product-description">Mô tả sản phẩm</label>
                            <input
                                type="text"
                                id="product-description"
                                placeholder="Nhập mô tả sản phẩm ..."
                                value={product.Description || ''}
                                onChange={e => {
                                    setProduct({ ...product, Description: e.target.value })
                                }}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlForfor="product-category">Lượt xem</label>
                            <input
                                type="number"
                                id="product-view"
                                placeholder="Nhập số lượt xem ..."
                                value={product.Views || ''}
                                onChange={e =>
                                    setProduct({ ...product, Views: e.target.value })
                                } />
                        </div>
                        <div className="radio-group">
                            <label>Ẩn/Hiện</label>
                            <label>
                                <input
                                    type="radio"
                                    name="visibility"
                                    value={1} // Dùng 1 thay vì "true"
                                    onChange={e =>
                                        setProduct({ ...product, Show_Hidden: parseInt(e.target.value) })
                                    }
                                /> Hiện
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="visibility"
                                    value={0} // Dùng 0 thay vì "false"
                                    onChange={e =>
                                        setProduct({ ...product, Show_Hidden: parseInt(e.target.value) })
                                    }
                                /> Ẩn
                            </label>
                        </div>
                    </div>
                </div>
                <button type="submit" className="submit-btn" onClick={Submit}>THÊM</button>
            </form>
        </div>
    )
}
export default ProductAdd;