import { Link } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import "../../styles/pages/voucherList.css";

const VouchersList = ({ searchResults }) => {
    const token = localStorage.getItem('token');
    const url = `http://localhost:3000/admin`;
    const [vouchers, setVouchers] = useState([]);

    // Fetch danh sách voucher
    useEffect(() => {
        if (!searchResults || searchResults.length === 0) {
            fetch(`${url}/vouchers`, {
                method: 'GET',
                headers: {
                    "Content-type": "application/json",
                    'Authorization': 'Bearer ' + token
                }
            })
                .then(res => res.json())
                .then(data => setVouchers(data))
                .catch(error => console.error('Error fetching voucher list:', error));
        }
    }, [token, searchResults]);

    // Hàm xóa voucher
    const lockVoucher = (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn khóa voucher này không?')) return;

        fetch(`${url}/vouchers/${id}/lock`, {
            method: 'PATCH',
            headers: {
                "Content-type": "application/json",
                'Authorization': 'Bearer ' + token,
            },
        })
            .then(res => {
                const contentType = res.headers.get("content-type");
                if (!res.ok) {
                    return res.text().then(text => {
                        throw new Error(`Lỗi: ${res.status} ${res.statusText}\n${text}`);
                    });
                }
                if (contentType && contentType.includes("application/json")) {
                    return res.json();
                } else {
                    throw new Error("Phản hồi không phải là JSON hợp lệ.");
                }
            })
            .then(data => {
                if (data.message.includes("không tồn tại")) {
                    alert(data.message);
                } else {
                    alert("Voucher đã được khóa thành công!");
                    setVouchers(prev =>
                        prev.map(voucher =>
                            voucher.Voucher_ID === id ? { ...voucher, Locked: 1 } : voucher
                        )
                    );
                }
            })
            .catch(error => console.error("Error locking voucher:", error));
    };
    const displayVouchers = searchResults && searchResults.length > 0 ? searchResults : vouchers;


    return (
        <div className="box-voucherList">
            <div className="headertop-admin-voucher">
                <div className="header_admin_voucher">
                    <h2>DANH SÁCH VOUCHER</h2>
                    <button className="button_admin_voucher">
                        <Link to="/admin/voucherAdd">THÊM VOUCHER</Link>
                    </button>
                </div>
            </div>
            <div className="grid-container-voucher">
                <div className="grid-header-voucher">STT</div>
                <div className="grid-header-voucher">Mã Voucher</div>
                <div className="grid-header-voucher">% Giảm Giá</div>
                <div className="grid-header-voucher">Thời Hạn</div>
                <div className="grid-header-voucher">Trạng thái</div>
                <div className="grid-header-voucher">Thao tác</div>
                {displayVouchers.map((voucher, index) => (
                    <Fragment key={voucher.Voucher_ID}>
                        <div className="grid-item-voucher">{index + 1}</div>
                        <div className="grid-item-voucher">{voucher.Code}</div>
                        <div className="grid-item-voucher">{voucher.Discount}%</div>
                        <div className="grid-item-voucher">{voucher.Expiration_Date}</div>
                        <div className="grid-item-voucher">{voucher.Locked ? "Đã khóa" : "Hoạt động"}</div>
                        <div className="grid-item-voucher grid-item-button">
                            <Link
                                to={`/admin/voucherUpdate/${voucher.Voucher_ID}`}
                            // className={`edit-btn ${voucher.Locked ? "disabled" : ""}`}
                            // style={{ pointerEvents: voucher.Locked ? "none" : "auto" }}
                            >
                                ✏️
                            </Link>
                            <button
                                onClick={() => lockVoucher(voucher.Voucher_ID)}
                                className={`delete-btn ${voucher.Locked ? "disabled" : ""}`}
                                disabled={voucher.Locked}
                            >
                                🗑️
                            </button>
                        </div>
                    </Fragment>
                ))}

            </div>
        </div>
    );
};

export default VouchersList;
