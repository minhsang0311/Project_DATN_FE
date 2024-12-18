import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const StatisticsOrderStatus = () => {
  const [statusData, setStatusData] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const opt = {
      method: 'GET',
      headers: { "Content-type": "application/json", 'Authorization': 'Bearer ' + token }
    };

    axios.get('http://localhost:3000/admin/stats-orderStatus', opt)
      .then(response => setStatusData(response.data))
      .catch(error => console.error('Lỗi lấy dữ liệu thống kê trạng thái đơn hàng:', error));
  }, []);

  const statusLabels = statusData.map(item => `${item.Status_Name}`);
  const orderCounts = statusData.map(item => item.order_count);

  const pieChartData = {
    labels: statusLabels,
    datasets: [
      {
        label: 'Số lượng đơn hàng',
        data: orderCounts,
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const barChartData = {
    labels: statusLabels,
    datasets: [
      {
        label: 'Số lượng đơn hàng',
        data: orderCounts,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className='statistics-chillrend-header'>
      <h2>THỐNG KÊ TRẠNG THÁI ĐƠN HÀNG</h2>
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
        <div style={{ width: '45%', minHeight: '300px' }}>
          <h3>Biểu đồ tròn - Trạng thái đơn hàng</h3>
          <div className='pie_order'>
            <Pie data={pieChartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} style={{ width: '300px', height: 'auto' }} />
          </div>
        </div>

        <div style={{ width: '45%', minHeight: '300px' }}>
          <h3>Biểu đồ cột - Trạng thái đơn hàng</h3>
          <Bar data={barChartData} options={{ responsive: true, plugins: { legend: { position: 'top' } }, scales: { y: { beginAtZero: true } } }} />
        </div>
      </div>
    </div>
  );
};

export default StatisticsOrderStatus;
