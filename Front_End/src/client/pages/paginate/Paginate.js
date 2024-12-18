import { useState,useEffect } from "react";

function usePagination(listSP, pageSize) {
    const [currentPage, setCurrentPage] = useState(0);
    useEffect(() => {
        // Đặt lại trang về trang đầu tiên nếu danh sách sản phẩm thay đổi
        setCurrentPage(0);
    }, [listSP]);
    const offset = currentPage * pageSize;
    const spTrong1Trang = listSP.slice(offset, offset + pageSize);
    const tongSoTrang = Math.ceil(listSP.length / pageSize);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return { spTrong1Trang, tongSoTrang, currentPage, handlePageChange };
}

export default usePagination;
