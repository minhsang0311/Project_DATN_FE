import React, { Fragment, useEffect } from 'react';
import SpMoi from './SpMoi';
import SpMostView from './SpMostView';
import SpKhuyenMai from './SpKhuyenMai';
import DanhMuc_Home from './DanhMuc_Home';
import Banner from "./Banner";
import '../styles/components/Home.css'
import Footer from '../components/Footer';
import Header from '../components/Header';


function Home() {
    return (
        <Fragment>
            <Header />
            <div className="home">
                <Banner />
                <SpKhuyenMai />
                <DanhMuc_Home />
                <SpMoi />
                <SpMostView />
                <div className="gt_home">
                    <div className='img_gt'><img src="/assets/img/banner22.png" alt="" /></div>
                    <div className="box_gt_home">
                        <div className="item">
                            <img src="/assets/img/item1.png" alt="" />
                            <p className="tieude">Lựa chọn sản phẩm yêu thích</p>
                            <p>Khách hàng truy cập website để lựa chọn mẫu sản phẩm yêu thích. Sau đó thêm vào giỏ hàng để tiến hành đặt hàng. Hoặc khách hàng cũng có thể inbox trực tiếp qua zalo/messenger và gửi ảnh/mã sản phẩm cho chúng tôi</p>
                        </div>

                        <div className="item">
                            <img src="/assets/img/item2.jpg" alt="" />
                            <p className="tieude">Tư vấn sản phẩm theo yêu cầu.</p>
                            <p>Khi khách hàng đặt hàng thành công, sẽ có mail gửi về để xác nhận thông tin đặt hàng của khách hàng. Chúng tôi sẽ tiến hành liên hệ để xác nhận đơn hàng và thực hiện theo yêu cầu của khách hàng.</p>
                        </div>

                        <div className="item">
                            <img src="/assets/img/item3.png" alt="" />
                            <p className="tieude">Hoàn thiện sản phẩm, giao hàng và thanh toán.</p>
                            <p>Chúng tôi tiến hành hoàn thiện đơn hàng, gửi hình ảnh cho khách hàng sau khi hoàn thành. Khi khách hàng ưng ý với sản phẩm thì sẽ tiến hành giao hàng. Khách hàng thanh toán theo hình thức: chuyển khoản hoặc tiền mặt cho shipper khi nhận được sản phẩm.</p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </Fragment>
    );
}

export default Home;
