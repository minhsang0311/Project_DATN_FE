import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/Cuahang.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Product from './Product';
import ReactPaginate from 'react-paginate';
import usePagination from "./paginate/Paginate";

function Cuahang() {
    const [listsp, setListSP] = useState([]);
    const [filteredSP, setFilteredSP] = useState([]);
    const [brands, setBrands] = useState([]);
    const [brand, setBrand] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [sortOrder, setSortOrder] = useState("");

    const pageSize = 9;
    const { spTrong1Trang, tongSoTrang, currentPage, handlePageChange } = usePagination(filteredSP, pageSize);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_HOST_URL}user/productList`)
            .then(res => res.json())
            .then(data => {
                setListSP(data);
                setFilteredSP(data);
            });
    }, []);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_HOST_URL}user/brands`)
            .then(res => res.json())
            .then(data => setBrands(data));
    }, []);

    // Trigger filter on any change
    useEffect(() => {
        handleFilter();
    }, [brand, minPrice, maxPrice, sortOrder]);

    const handleFilter = () => {
        let url = `${process.env.REACT_APP_HOST_URL}user/filteredProducts?`;
        if (minPrice) url += `minPrice=${minPrice.replace(/,/g, '')}&`;
        if (maxPrice) url += `maxPrice=${maxPrice.replace(/,/g, '')}&`;
        if (sortOrder) url += `sortOrder=${sortOrder}&`;
        if (brand) url += `brand=${brand}&`;

        fetch(url)
            .then(res => res.json())
            .then(data => {
                setFilteredSP(data);
            });
    };

    // Format number with commas
    const formatPrice = (value) => {
        return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    return (
        <Fragment>
            <Header />
            <div className="cuahang">
                <div className='thanh-dieu-huong'>
                    <Link to="/"><h3>Trang chủ</h3></Link> /
                    <Link to="/cuahang"><h3>Cửa hàng</h3></Link>
                </div>
                <div className='noidung'>
                    <div className="left_box">
                        <h4>Lọc giá</h4>
                        <button onClick={() => setSortOrder('highToLow')} className={sortOrder === 'highToLow' ? 'active' : ''}>Giá giảm dần</button>
                        <button onClick={() => setSortOrder('lowToHigh')} className={sortOrder === 'lowToHigh' ? 'active' : ''}>Giá tăng dần</button>

                        <div className="price-range">
                            <input
                                type="text"
                                placeholder="Giá tối thiểu"
                                value={minPrice}
                                onChange={(e) => setMinPrice(formatPrice(e.target.value))}
                                step="50000"
                            />
                            <input
                                type="text"
                                placeholder="Giá tối đa"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(formatPrice(e.target.value))}
                                step="50000"
                            />
                        </div>
                        <h4>Thương hiệu</h4>
                        <select onChange={(e) => setBrand(e.target.value)} value={brand}>
                            <option value="">Chọn hãng</option>
                            {brands?.map((brand) => (
                                <option key={brand.Brand_ID} value={brand.Brand_ID}>
                                    {brand.Brand_Name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="right-products">
                        <div className="box-sp">
                            {spTrong1Trang?.map((sp, index) => (
                                <Product key={index} product={sp} />
                            ))}
                        </div>
                        {tongSoTrang > 1 && (
                            <ReactPaginate
                                pageCount={tongSoTrang}
                                forcePage={currentPage}
                                onPageChange={(event) => handlePageChange(event.selected)}
                                containerClassName="pagination"
                                activeClassName="active"
                            />
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </Fragment>
    );
}

export default Cuahang;
