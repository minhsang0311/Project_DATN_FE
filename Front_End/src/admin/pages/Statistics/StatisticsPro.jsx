import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

const StatisticsPro = () => {
    const token = localStorage.getItem('token');
    const [categoryData, setCategoryData] = useState([]);
    const [branData, setBrandData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let opt = {
            method: 'get',
            headers: { 'Content-type': 'application/json', 'Authorization': 'Bearer ' + token }
        }
        fetch('http://localhost:3000/admin/stats-procate', opt)
            .then(res => res.json())
            .then(data => {
                setCategoryData(data);
                setLoading(false);
            })
            .catch(error => {
                setError('Lỗi lấy dữ liệu biểu đồ sản phẩm trong danh mục');
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        let opt = {
            method: 'get',
            headers: { 'Content-type': 'application/json', 'Authorization': 'Bearer ' + token }
        }
        fetch('http://localhost:3000/admin/stats-probrand', opt)
            .then(res => res.json())
            .then(data => {
                setBrandData(data);
                setLoading(false);
            })
            .catch(error => {
                setError('Lỗi lấy dữ liệu biểu đồ sản phẩm theo hãng');
                setLoading(false);
            });
    }, []);

    const totalProducts = categoryData.reduce((acc, category) => acc + category.totalProCate, 0);
    const totalCategories = categoryData.length;
    const totalBrand = branData.length;

    // Dữ liệu cho biểu đồ tròn (ProCate)
    const pieData = categoryData.length > 0 ? {
        labels: categoryData?.map(item => item.Category_Name),
        datasets: [
            {
                data: categoryData?.map(item => item.totalProCate),
                backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
                hoverBackgroundColor: ['#38A2EB', '#FF6384', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
            },
        ],
    } : null;

    // Dữ liệu cho biểu đồ tròn (ProBrand)
    const pieProBrand = branData.length > 0 ? {
        labels: branData?.map(item => item.Brand_Name),
        datasets: [
            {
                data: branData?.map(item => item.totalProBrand),
                backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
                hoverBackgroundColor: ['#38A2EB', '#FF6384', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
            },
        ],
    } : null;

    if (loading) return <p>Đang tải dữ liệu...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className='statistics-chillrend-header_product'>
            <h2>THỐNG KÊ SẢN PHẨM</h2>
            <div className='statistics'>
                <div className='left'>
                    <table className="vertical-table">
                        <tbody>
                            <tr>
                                <th>Tổng sản phẩm</th>
                                <td>{totalProducts}</td>
                            </tr>
                            <tr>
                                <th>Tổng danh mục</th>
                                <td>{totalCategories}</td>
                            </tr>
                            <tr>
                                <th>Tổng số hãng</th>
                                <td>{totalBrand}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className='center'>
                    <div>
                        <h2>Sản phẩm theo danh mục</h2>
                        {pieData ? <Pie data={pieData} /> : <p>Không có dữ liệu danh mục</p>}
                    </div>
                </div>
                <div className='right'>
                    <div>
                        <h2>Sản phẩm theo hãng</h2>
                        {pieProBrand ? <Pie data={pieProBrand} /> : <p>Không có dữ liệu hãng</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatisticsPro;
