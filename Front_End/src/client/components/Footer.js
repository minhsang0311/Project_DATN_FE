import React from "react"
import '../styles/components/Footer.css'
import { Link } from "react-router-dom";
function Footer() {
    return (
        <div className="hrr">
            <hr></hr>
            <footer className="footer">
                <div className="footer-column">
                    <h3>Địa chỉ</h3>
                    <a href="https://maps.app.goo.gl/ZKQKoo4aRyfL1fTLA" target="_blank" rel="noopener noreferrer">
                    <p> - Chi nhánh 1 : Phần mềm Quang Trung, Phường Tân Chánh Hiệp, Quận 12, Thành phố Hồ Chí Minh</p></a>
                    <a href="https://maps.app.goo.gl/XMcPUTjY257nZjWS6" target="_blank" rel="noopener noreferrer">
                    <p> - Chi nhánh 2 : 54 Đông An, Tân Đông Hiệp, Dĩ An, Bình Dương</p></a>
                </div>
                <div className="footer-column">
                    <h3>Đại lý – Hỗ trợ</h3>
                    <p> Danh sách các đại lý</p>
                    <p> Hướng dẫn mua hàng</p>
                    <p> Hướng dẫn mua trả góp</p>
                    <Link to="/contact">
                    <p> Hỗ trợ khách hàng</p></Link>
                </div>
                <div className="footer-column">
                    <h3>Chính sách</h3>
                    <p> Quy định, chính sách</p>
                    <p> Chính sách bảo hành – đổi trả</p>
                    <p> Giao hàng và lắp đặt</p>
                    <p> Chính sách bảo mật thông tin cá nhân</p>
                    <p> Tin tức Khuyến mại</p>
                </div>
                <div className="footer-column">
                    <h3>Kết nối với chúng tôi</h3>
                    <p>Facebook: HomeNestVN</p>
                    <p>Instagram: @homenest</p>
                    <p>Email: HomeNest@gmail.com</p>
                    <p>ĐT: 0981.599.399</p>                    
                </div>
            </footer>
        </div>
        );
}
export default Footer;
