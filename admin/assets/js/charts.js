let revenueChartInstance = null;
let categoryChartInstance = null;

function initCharts() {
    // --- 1. BIỂU ĐỒ DOANH THU (LINE CHART) ---
    const revCanvas = document.getElementById('revenueChart');
    if (revCanvas) {
        const revCtx = revCanvas.getContext('2d');
        
        // Hủy biểu đồ cũ nếu đã tồn tại để tránh lỗi "Canvas is already in use"
        if (revenueChartInstance) {
            revenueChartInstance.destroy();
        }

        // Lấy số liệu thực tế từ Dashboard để mốc cuối cùng khớp 100%
        const currentRev = typeof BusinessLogic !== 'undefined' 
            ? BusinessLogic.parseMoney(document.getElementById("stat-revenue")?.innerText || "2450000000") 
            : 2450000000;

        revenueChartInstance = new Chart(revCtx, {
            type: 'line',
            data: {
                labels: ['T10/25', 'T11/25', 'T12/25', 'T1/26', 'T2/26', 'T3/26'],
                datasets: [{
                    label: 'Doanh thu Tech (VNĐ)',
                    // Giả lập dữ liệu tăng trưởng dần đến mốc hiện tại
                    data: [currentRev*0.6, currentRev*0.75, currentRev*0.7, currentRev*0.85, currentRev*0.9, currentRev],
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 3,
                    pointRadius: 4,
                    pointBackgroundColor: '#2563eb'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { 
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            // Format tiền tệ khi di chuột vào điểm dữ liệu
                            label: (context) => ' ' + new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(context.parsed.y)
                        }
                    }
                },
                scales: {
                    y: { 
                        beginAtZero: true, 
                        grid: { borderDash: [5, 5], color: '#e2e8f0' },
                        ticks: {
                            // Hiển thị dạng "1.5 tỷ" cho gọn
                            callback: (value) => (value / 1e9).toFixed(1) + ' tỷ'
                        }
                    },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    // --- 2. BIỂU ĐỒ TỈ TRỌNG (DOUGHNUT CHART) ---
    const catCanvas = document.getElementById('categoryChart');
    if (catCanvas) {
        const catCtx = catCanvas.getContext('2d');

        if (categoryChartInstance) {
            categoryChartInstance.destroy();
        }

        categoryChartInstance = new Chart(catCtx, {
            type: 'doughnut',
            data: {
                labels: ['Laptop', 'Mobile', 'Audio', 'Parts'],
                datasets: [{
                    data: [45, 25, 20, 10], // Khớp với stats: Laptop 45%, Mobile 25%...
                    backgroundColor: ['#2563eb', '#818cf8', '#fbbf24', '#f472b6'],
                    borderWidth: 4,
                    borderColor: '#ffffff',
                    hoverOffset: 15
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { 
                    legend: { 
                        position: 'bottom', 
                        labels: { 
                            usePointStyle: true, 
                            padding: 20,
                            font: { size: 12, weight: '600' }
                        } 
                    } 
                },
                cutout: '70%',
                // Hiệu ứng xoay khi load
                animation: { animateScale: true, animateRotate: true }
            }
        });
    }
}

// Gọi hàm khởi tạo khi trang đã sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
    if (typeof Chart !== 'undefined') {
        initCharts();
    }
});