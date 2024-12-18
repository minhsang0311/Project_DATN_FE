import '../styles/components/About.css';
import Footer from '../components/Footer';
import Header from '../components/Header';
import React, { Fragment } from 'react';


const About = () => {
    return (
        <Fragment>
            <Header/>
                <div id="About">
                    <img src="assets/img/banner5.jpg" alt="Banner giới thiệu" />

                    <div className="ve-chung-toi">
                        <h2>Về chúng tôi</h2>
                        <p>
                            Chào mừng đến với thế giới đồ gia dụng hiện đại và tiện nghi! Tại <span><b><i>HomeNest</i></b></span>, 
                            chúng tôi tự hào là nhà cung cấp hàng đầu các sản phẩm gia dụng chất lượng cao, 
                            mang đến sự tiện nghi và phong cách cho mọi gia đình.
                        </p>
                    </div>

                    <div className="text-box">
                        <div className="text-item">
                            <h1>Sứ Mệnh Của Chúng Tôi</h1>
                            <p>Chúng tôi luôn nỗ lực mang đến cho khách hàng những sản phẩm đồ gia dụng tiên tiến nhất, giúp tối ưu hóa thời gian và công sức trong sinh hoạt hàng ngày. Sứ mệnh của chúng tôi là trở thành người bạn đồng hành đáng tin cậy trong mỗi gia đình.</p>
                        </div>
                        <div className="text-item">
                            <h1>Cam Kết Chất Lượng</h1>
                            <p>Chất lượng luôn là ưu tiên hàng đầu của chúng tôi. Mỗi sản phẩm đều được kiểm tra kỹ lưỡng trước khi đến tay khách hàng, đảm bảo tính năng và độ bền vượt trội.</p>
                        </div>
                        <div className="text-item">
                            <h1>Dịch Vụ Khách Hàng</h1>
                            <p>Chúng tôi không chỉ cung cấp sản phẩm mà còn hỗ trợ dịch vụ hậu mãi tận tình. Đội ngũ chăm sóc khách hàng của chúng tôi luôn sẵn sàng lắng nghe và giải quyết mọi thắc mắc của bạn một cách nhanh chóng và hiệu quả.</p>
                        </div>
                    </div>

                    <div className="product-box">
                        <div className="trai">
                            <h1>Sản phẩm của chúng tôi</h1>
                            <ul>
                                <li>Nồi các loại</li>
                                <li>Bếp điện</li>
                                <li>Lò vi sóng</li>
                                <li>Máy hút bụi</li>
                                <li>Máy xay sinh tố</li>
                                <li>Dao</li>
                            </ul>
                        </div>
                        <div className="phai1">
                            {Array.from({ length: 15 }, (_, i) => (
                                <img key={i} src={`assets/img/sp${i + 1}.jpg`} alt={`Sản phẩm ${i + 1}`} />
                            ))}
                        </div>
                    </div>

                    <div className="video">
                        <div className='tieu_de'>
                            <div className='hk'></div>
                            <h1>Khám Phá Bộ Sưu Tập Đồ Gia Dụng 2024</h1>
                        </div>
                        <div class="box_video">
                                <iframe 
                                    width="360" 
                                    height="270" 
                                    src="https://www.youtube.com/embed/Ai6mulEtiSs" 
                                    title="TVC, video quảng cáo đồ gia dụng | by Cáo Multimedia" 
                                    frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                    referrerpolicy="strict-origin-when-cross-origin" 
                                    allowfullscreen>
                                </iframe>    
                                <iframe 
                                    width="360" 
                                    height="270" 
                                    src="https://www.youtube.com/embed/TNB-kOd5PYA" 
                                    title="NHẬP KHẨU ĐỒ GIA DỤNG NHÀ BẾP MÀ BỎ QUA VIDEO NÀY THÌ QUÁ PHÍ!!! (PHẦN 1)" 
                                    frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    referrerpolicy="strict-origin-when-cross-origin" 
                                    allowfullscreen>
                                </iframe>  
                                <iframe 
                                    width="360" 
                                    height="270" 
                                    src="https://www.youtube.com/embed/wIYjKHmAKEk" 
                                    title="NHẬP KHẨU ĐỒ GIA DỤNG NHÀ BẾP MÀ BỎ QUA VIDEO NÀY THÌ QUÁ PHÍ!!! (PHẦN 1)" 
                                    frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    referrerpolicy="strict-origin-when-cross-origin" 
                                    allowfullscreen>
                                </iframe>  
                        </div>
                    </div>

                    
                </div>
            <Footer/>
        </Fragment>
    );
};

export default About;
