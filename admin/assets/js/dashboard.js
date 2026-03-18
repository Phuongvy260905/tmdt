// 1. Hàm lấy số liệu thực tế từ dashboard
function getCurrentStats() {
    return {
        revenue: document.getElementById("stat-revenue")?.innerText.trim() || "2.450.000.000đ",
        orders: document.getElementById("stat-orders")?.innerText.trim() || "1,248",
        customers: document.getElementById("stat-customers")?.innerText.trim() || "8,420",
        cancelRate: document.getElementById("stat-cancel-rate")?.innerText.trim() || "1.4%",
        category: "Laptop 45%, Điện thoại 25%, Phụ kiện & Âm thanh 30%",
        month: "Tháng 3/2026",
    };
}

// --- HÀM TRỢ GIÚP TÍNH TOÁN NGHIỆP VỤ ---
const BusinessLogic = {
    // Chuyển chuỗi "2.450.000.000đ" thành số 2450000000
    parseMoney: (str) => Number(str.replace(/[^0-9]/g, "")),
    
    // Định dạng số thành tiền VND
    formatMoney: (num) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num)
};

async function callGemini(prompt, systemInstruction) {
    console.log("🤖 Tech-AI đang xử lý nghiệp vụ chuyên sâu...");
    
    // Lấy số liệu thực tế tại thời điểm gọi
    const stats = getCurrentStats();
    const revenueValue = BusinessLogic.parseMoney(stats.revenue);
    const orderCount = Number(stats.orders.replace(/[^0-9]/g, ""));
    const avgOrderValue = revenueValue / orderCount;

    // Giả lập Logic phân tích linh động theo doanh thu
    let businessInsight = "";
    if (revenueValue > 2000000000) {
        businessInsight = "Doanh thu vượt ngưỡng kỳ vọng. Trọng tâm nên chuyển từ 'Tìm kiếm khách hàng' sang 'Tối ưu hóa quy trình vận hành' để giữ biên lợi nhuận.";
    } else {
        businessInsight = "Doanh thu đang ở mức trung bình. Cần kích cầu bằng các chương trình Flash Sale cho nhóm ngành Phụ kiện để tăng dòng tiền nhanh.";
    }

    // Giả lập phân tích rủi ro dựa trên tỉ lệ bảo hành
    const cancelRateNum = parseFloat(stats.cancelRate);
    const riskLevel = cancelRateNum > 2.0 ? "CAO (Cần kiểm tra lại chất lượng nguồn hàng)" : "THẤP (Quy trình QC đang hoạt động tốt)";

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(`
### 📊 BÁO CÁO CHIẾN LƯỢC TECH-AI - ${stats.month.toUpperCase()}

**1. PHÂN TÍCH CHỈ SỐ SỨC KHỎE DOANH NGHIỆP:**
• **Giá trị đơn hàng trung bình (AOV):** ${BusinessLogic.formatMoney(avgOrderValue)}/đơn.
• **Hiệu suất doanh thu/khách hàng:** ~${BusinessLogic.formatMoney(revenueValue / stats.customers.replace(/[^0-9]/g, ""))} per user.
• **Tình trạng bảo hành:** ${stats.cancelRate} -> Mức độ rủi ro: **${riskLevel}**.

**2. NHẬN ĐỊNH NGHIỆP VỤ CHUYÊN SÂU:**
• **Về Cơ cấu:** ${stats.category}. Hiện tại Laptop đang gánh ${stats.revenue.split('.')[0]} tỷ đồng doanh thu. Tuy nhiên, biên lợi nhuận từ Phụ kiện thường cao hơn (30-40%), shop cần đẩy mạnh up-sell tại giỏ hàng.
• **Về Thị trường:** ${businessInsight}

**3. CHIẾN LƯỢC CỤ THỂ (DỰA TRÊN DỮ LIỆU THỰC TẾ):**
• **Ngắn hạn (7-15 ngày):** Triển khai chiến dịch "Combo Công Nghệ" kết hợp Laptop (45%) với Phụ kiện (30%) để tăng AOV thêm 15%.
• **Dài hạn (90 ngày):** Xây dựng hệ thống CRM dựa trên ${stats.customers} khách hàng hiện có để triển khai Remarketing, giảm chi phí quảng cáo mới (CAC).

**4. DỰ BÁO KPI THÁNG TỚI:**
• Mục tiêu doanh thu: **${BusinessLogic.formatMoney(revenueValue * 1.1)}** (+10%).
• Mục tiêu giảm tỉ lệ bảo hành xuống dưới: **1.2%**.

---
*Phân tích này được tạo ra dựa trên prompt nghiệp vụ: "${prompt.substring(0, 50)}..."*
            `);
        }, 2000);
    });
}

// 3. Xử lý Phân tích AI
async function handleAnalyzeData() {
    const btn = document.getElementById("analyze-btn");
    const container = document.getElementById("ai-insights-container");
    const content = document.getElementById("ai-insights-content");

    if (!btn || !container || !content) return;

    btn.disabled = true;
    container.classList.remove("hidden");
    content.innerHTML = `<div class="flex items-center"><span class="animate-spin border-2 border-blue-500 border-t-transparent rounded-full w-4 h-4 mr-2"></span> Đang phân tích chuyên sâu...</div>`;

    const stats = getCurrentStats();
    const prompt = `Phân tích dữ liệu tháng ${stats.month}: Doanh thu ${stats.revenue}, đơn hàng ${stats.orders}... (Yêu cầu phân tích 1000 chữ)`;

    try {
        const result = await callGemini(prompt, "Bạn là chuyên gia kinh doanh công nghệ.");
        // Hiển thị kết quả (Dùng regex thay \n bằng <br> để xuống dòng)
        content.innerHTML = `<div class="prose prose-invert text-slate-200 text-sm leading-relaxed">${result.replace(/\n/g, "<br>")}</div>`;
        
        // Hiện nút đọc văn bản nếu có
        const ttsBtn = document.getElementById("tts-btn");
        if(ttsBtn) ttsBtn.classList.remove("hidden");
    } catch (error) {
        content.innerText = "Lỗi xử lý AI: " + error.message;
    } finally {
        btn.disabled = false;
    }
}

async function handleInventoryForecast() {
    const btn = document.getElementById("forecast-btn");
    const container = document.getElementById("ai-insights-container");
    const content = document.getElementById("ai-insights-content");

    if (!container || !content) return;

    // Hiệu ứng Loading chuyên nghiệp
    btn.disabled = true;
    container.classList.remove("hidden");
    content.innerHTML = `
        <div class="flex items-center space-x-3 p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
            <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-400"></div>
            <span class="text-emerald-400 font-medium">Hệ thống đang quét kho và tính toán chu kỳ nâng cấp...</span>
        </div>`;

    try {
        const stats = getCurrentStats();
        // Giả lập logic dự báo dựa trên doanh thu
        const rev = BusinessLogic.parseMoney(stats.revenue);
        const forecastDate = new Date();
        forecastDate.setMonth(forecastDate.getMonth() + 1);

        // Tạo nội dung prompt chuyên sâu
        const prompt = `Dựa trên dữ liệu: 
        - Doanh thu hiện tại: ${stats.revenue}
        - Cơ cấu: ${stats.category}
        - Tỉ lệ lỗi: ${stats.cancelRate}
        Hãy dự báo nhu cầu linh kiện cho Tháng ${forecastDate.getMonth() + 1}/2026.`;

        // Gọi API (Giả lập phản hồi linh động)
        const res = await callGemini(prompt, "Chuyên gia tối ưu hóa chuỗi cung ứng (Supply Chain Expert).");

        // Render kết quả với Format đẹp (Bảng biểu + Badge)
        content.innerHTML = `
            <div class="space-y-4">
                <div class="flex items-center gap-2 text-emerald-400 font-bold text-lg mb-2">
                    <i data-lucide="trending-up" class="w-5 h-5"></i>
                    BÁO CÁO DỰ BÁO NHU CẦU LINH KIỆN & TỒN KHO
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div class="p-4 bg-slate-700/50 rounded-xl border border-slate-600">
                        <p class="text-xs text-slate-400 uppercase font-bold">Linh kiện cần nhập thêm</p>
                        <p class="text-lg font-bold text-emerald-400">SSD Gen4, RAM DDR5, RTX 40-Series</p>
                    </div>
                    <div class="p-4 bg-slate-700/50 rounded-xl border border-slate-600">
                        <p class="text-xs text-slate-400 uppercase font-bold">Rủi ro tồn kho</p>
                        <p class="text-lg font-bold text-amber-400">Màn hình văn phòng (Tốc độ bán chậm -20%)</p>
                    </div>
                </div>

                <div class="bg-slate-900/50 p-4 rounded-xl border border-slate-700 text-sm leading-relaxed">
                    ${res.replace(/\n/g, "<br>")}
                </div>

                <div class="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs text-blue-300">
                    💡 <strong>Gợi ý từ AI:</strong> Tháng tới có mùa tựu trường/làm việc mới, nhu cầu nâng cấp RAM cho Laptop (chiếm 45% doanh thu) sẽ tăng mạnh. Nên dự trữ thêm ít nhất 200 kit RAM 16GB.
                </div>
            </div>
        `;
        
        if (window.lucide) lucide.createIcons();
    } catch (error) {
        content.innerHTML = `<div class="text-rose-400 p-4">❌ Lỗi dự báo: ${error.message}</div>`;
    } finally {
        btn.disabled = false;
    }
}





window.handleAnalyzeData = handleAnalyzeData;
window.handleInventoryForecast = handleInventoryForecast;