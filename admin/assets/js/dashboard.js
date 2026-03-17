// Hàm lấy số liệu thực tế từ dashboard
function getCurrentStats() {
  return {
    revenue:
      document.getElementById("stat-revenue")?.innerText.trim() ||
      "2.450.000.000đ",
    orders: document.getElementById("stat-orders")?.innerText.trim() || "1,248",
    customers:
      document.getElementById("stat-customers")?.innerText.trim() || "8,420",
    cancelRate:
      document.getElementById("stat-cancel-rate")?.innerText.trim() || "1.4%",
    category: "Laptop 45%, Điện thoại 25%, Phụ kiện & Âm thanh 30%", // sau này có thể làm động hơn
    month: "Tháng 3/2026", // bạn có thể thay đổi động nếu cần
  };
}
// --- DASHBOARD AI ANALYSIS ---

async function handleAnalyzeData() {
  const btn = document.getElementById("analyze-btn");
  const container = document.getElementById("ai-insights-container");
  const content = document.getElementById("ai-insights-content");

  btn.disabled = true;
  container.classList.remove("hidden");
  content.innerHTML = `<span class="ai-loading mr-2"></span> Đang lấy dữ liệu thực tế và phân tích chuyên sâu...`;

  const stats = getCurrentStats(); // ← Lấy số thực tế

  const prompt = `Bạn là chuyên gia phân tích kinh doanh công nghệ số 1 tại Việt Nam (15 năm kinh nghiệm).

DỮ LIỆU THỰC TẾ tháng hiện tại (${stats.month}):

• Doanh thu: ${stats.revenue}
• Số đơn hàng: ${stats.orders} đơn
• Số khách hàng: ${stats.customers} người
• Tỉ lệ hủy/bảo hành: ${stats.cancelRate}
• Cơ cấu doanh thu: ${stats.category}

Yêu cầu phân tích CHI TIẾT – CHUYÊN SÂU – THỰC TẾ (viết bằng tiếng Việt, giọng chuyên nghiệp, dài tối thiểu 900–1300 từ, dùng dấu đầu dòng, bảng biểu nếu cần):

1. Phân tích tình hình kinh doanh hiện tại (so sánh tăng/giảm so với tháng trước giả định, điểm mạnh/yếu nổi bật)
2. 5 nhận định sâu sắc nhất về xu hướng thị trường công nghệ Việt Nam tháng 3/2026
3. Phân tích hành vi khách hàng & phân khúc nào đang tăng trưởng mạnh nhất (dựa trên cơ cấu)
4. Rủi ro tiềm ẩn (bảo hành, tồn kho, cạnh tranh Shopee/Lazada/Tiki, biến động giá linh kiện)
5. Đề xuất CHIẾN LƯỢC CỤ THỂ:
   - 3 chiến lược ngắn hạn (7–15 ngày) + dự kiến tăng trưởng %
   - 2 chiến lược dài hạn (30–90 ngày) + dự kiến tăng trưởng %
6. Kết luận + KPI cụ thể cần đạt trong 30 ngày tới (doanh thu, đơn hàng, khách mới…)

Hãy phân tích dựa hoàn toàn trên dữ liệu thực tế tôi vừa cung cấp, không bịa thêm số liệu.`;

  const result = await callGemini(
    prompt,
    "Bạn phải luôn dùng đúng số liệu thực tế được cung cấp và phân tích rất sâu, có số liệu, có bảng so sánh.",
  );

  content.innerHTML = `
        <div class="prose prose-invert text-slate-200 text-sm leading-relaxed">
            ${result.replace(/\n/g, "<br>")}
        </div>`;

  btn.disabled = false;
  document.getElementById("tts-btn").classList.remove("hidden");
}
// --- INVENTORY FORECAST ---

async function handleInventoryForecast() {
  const container = document.getElementById("ai-insights-container");
  const content = document.getElementById("ai-insights-content");
  container.classList.remove("hidden");
  content.innerHTML = `<span class="ai-loading mr-2"></span> Đang dự báo chu kỳ nâng cấp thiết bị và nhu cầu linh kiện...`;

  const res = await callGemini(
    "Dựa trên tồn kho: RTX 4070 (3 cái - SẮP HẾT), MacBook M3 (5 cái - TRUNG BÌNH), iPhone 15 (12 cái). Hãy đưa ra lời khuyên nhập hàng dựa trên xu hướng ra mắt sản phẩm mới của Apple và NVIDIA.",
  );
  content.innerText = res;
}

