let revenueChartInstance, categoryChartInstance;

function initCharts() {
    const revCtx = document.getElementById('revenueChart')?.getContext('2d');
    if (!revCtx) return; // tránh lỗi nếu canvas chưa có

    revenueChartInstance = new Chart(revCtx, {
        type: 'line',
        data: {
            labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul'],
            datasets: [{
                label: 'Doanh thu Tech',
                data: [800, 1100, 950, 1400, 1200, 1800, 1650],
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, grid: { borderDash: [5, 5] } },
                x: { grid: { display: false } }
            }
        }
    });

    const catCtx = document.getElementById('categoryChart')?.getContext('2d');
    if (!catCtx) return;

    categoryChartInstance = new Chart(catCtx, {
        type: 'doughnut',
        data: {
            labels: ['Laptop','Mobile','Audio','Parts'],
            datasets: [{
                data: [45, 25, 20, 10],
                backgroundColor: ['#2563eb', '#818cf8', '#fbbf24', '#f472b6'],
                borderWidth: 0,
                hoverOffset: 15
            }]
        },
        options: {
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } } },
            cutout: '75%'
        }
    });
}