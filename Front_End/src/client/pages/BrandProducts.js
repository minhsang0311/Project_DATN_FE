import React, { Fragment, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Product from './Product';
import ReactPaginate from 'react-paginate';
import usePagination from "./paginate/Paginate";


const brandImages = {
    '1': '/assets/img/banner_loai_bepdien.jpg', 
    '2': '/assets/img/banner_loai_mayxaysinhto.jpg',
    '3': '/assets/img/banner_loai_noi.jpg',
    '4': '/assets/img/banner_loai_dao.jpg',
    '5': '/assets/img/banner_loai_lovisong.jpg',
    '6': '/assets/img/banner_loai_mayhutbui.jpg',
  };
  
function BrandProducts() {
    const { Brand_ID } = useParams();
    const [listsp, setListSP] = useState([]);
    const [brandName, setBrandName] = useState([]);


    const pageSize = 6; // Số sản phẩm mỗi trang
    const { spTrong1Trang, tongSoTrang, currentPage, handlePageChange } = usePagination(listsp, pageSize);

    useEffect(() => {
        fetch(`http://localhost:3000/user/Products_brand/${Brand_ID}`)
          .then(res => res.json())
          .then(data => {
            setListSP(data);
          });
    
        fetch(`http://localhost:3000/user/brand/${Brand_ID}`) // API lấy thông tin danh mục
          .then(res => res.json())
          .then(brandData => {
            
            setBrandName(brandData.Brand_Name); // Cập nhật tên danh mục
          });
    }, [Brand_ID]);
    
    

    return (
        <Fragment>
            <Header />
            <div className="cuahang">
                <div className='thanh-dieu-huong'>
                    <Link to="/"><h3>Trang chủ</h3></Link> / 
                    <a href><h3>{brandName}</h3></a>
                </div>
                <div className="noidung">
                    <div className="left_box">
                       
                    </div>
                    <div className="right-products">
                        <div className="box-sp">
                            {spTrong1Trang.map((sp, index) => (
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

export default BrandProducts;
