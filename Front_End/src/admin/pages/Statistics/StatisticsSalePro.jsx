import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

// Đăng ký các thành phần của Chart.js
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const StatisticsSalePro = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [salesData, setSalesData] = useState([]); // To store the product sales data
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  // Tính toán ngày đầu và cuối của tháng trước khi component được render
  useEffect(() => {
    const now = new Date();
    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const formatDate = (date) => {
      return date.toLocaleDateString('en-CA');
    };

    const start = formatDate(firstDayLastMonth);
    const end = formatDate(lastDayLastMonth);

    console.log("Start Date: ", start);  // Kiểm tra giá trị startDate
    console.log("End Date: ", end);  // Kiểm tra giá trị endDate

    setStartDate(start);
    setEndDate(end);
    handleFetchData();
  }, []);

  // Tự động gọi API khi `startDate` và `endDate` được thiết lập
  useEffect(() => {
    if (startDate && endDate) {
      handleFetchData();
    }
  }, [startDate, endDate]);

  const handleFetchData = () => {
    setLoading(true);
    fetch(`http://localhost:3000/admin/stats-statisticsSalePro?startDate=${startDate}&endDate=${endDate}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        if (startDate > endDate) {
          alert("Ngày bắt đầu và ngày kết thúc không hợp lệ");
          return;
        }

        // Kiểm tra xem dữ liệu trả về có phải là mảng không
        if (Array.isArray(data)) {
          setSalesData(data);

          const totalQuantitySold = data.reduce((acc, item) => acc + item.totalQuantity, 0);
          setChartData({
            labels: ["Tổng số sản phẩm bán được"], // Only one label
            datasets: [
              {
                label: "Tổng số sản phẩm bán được",
                data: [totalQuantitySold], // Single value for the total sales
                backgroundColor: "rgba(75, 192, 192, 0.5)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
              },
            ],
          });
        }
      })
      .catch((err) => {
        console.log("Lỗi khi lấy dữ liệu thống kê.", err);
        setError("Lỗi khi lấy dữ liệu thống kê.");
      })
      .finally(() => setLoading(false));
    setError("");
  };


  return (
    <div className="revenue-statistics">
      <h2>THỐNG KÊ TỔNG SỐ SẢN PHẨM ĐÃ BÁN</h2>
      <div className="filter-section">
        <label>
          Ngày bắt đầu:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label>
          Ngày kết thúc:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
        <button onClick={handleFetchData} disabled={loading}>
          {loading ? "Đang tải..." : "Thống kê"}
        </button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="table-section">
        {salesData.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Tên sản phẩm</th>
                <th>Số lượng bán</th>
              </tr>
            </thead>
            <tbody>
              {salesData?.map((item, index) => (
                <tr key={index}>
                  <td>{item.productName}</td>
                  <td>{item.totalQuantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="chart-section">
        {chartData ? (
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: "top" },
                tooltip: {
                  callbacks: {
                    label: (context) => `${context.raw.toLocaleString()} sản phẩm`,
                  },
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: (value) => `${value.toLocaleString()} sp`,
                  },
                },
              },
            }}
          />
        ) : (
          <p>Chọn ngày để hiển thị biểu đồ.</p>
        )}
      </div>
    </div>
  );
};

export default StatisticsSalePro;
