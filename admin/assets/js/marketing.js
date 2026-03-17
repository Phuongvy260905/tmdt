// Giữ nguyên hàm email nếu đang hoạt động tốt
async function handleGenerateEmail() {
    const name = document.getElementById('email-product-name').value.trim();
    const target = document.getElementById('email-target').value;
    const resDiv = document.getElementById('email-result');

    if (!name) return alert("Nhập tên sản phẩm!");

    resDiv.classList.remove('hidden');
    resDiv.innerHTML = `<div class="flex items-center gap-2 text-slate-500">
        <span class="ai-loading"></span> Đang soạn email marketing...
    </div>`;

    const prompt = `Viết một email marketing chuyên nghiệp, cá nhân hóa, bằng tiếng Việt, giới thiệu sản phẩm ${name} dành cho nhóm khách hàng ${target || "chung"}. 
    Nội dung cần: 
    - Tiêu đề hấp dẫn
    - Lời chào thân thiện
    - Nhấn mạnh 3-4 tính năng nổi bật và lợi ích thực tế
    - Ưu đãi đặc biệt (giảm giá, quà tặng, đặt trước)
    - Lời kêu gọi hành động mạnh mẽ (CTA)
    - Chữ ký chuyên nghiệp (từ cửa hàng TechAdmin)`;

    const result = await callGemini(prompt);
    resDiv.innerHTML = `<div class="whitespace-pre-wrap">${result.replace(/\n/g, '<br>')}</div>`;
}

// Hàm mới: Tạo chiến lược marketing
async function handleGenerateMarketingStrategy() {
    const product = document.getElementById('strategy-product-name').value.trim();
    const target = document.getElementById('strategy-target').value;
    const resDiv = document.getElementById('strategy-result');

    if (!product) return alert("Nhập tên sản phẩm để tạo chiến lược!");

    resDiv.classList.remove('hidden');
    resDiv.innerHTML = `<div class="flex items-center gap-2 text-slate-500">
        <span class="ai-loading"></span> Đang xây dựng chiến lược marketing toàn diện...
    </div>`;

    const prompt = `Bạn là chuyên gia marketing công nghệ số 1 Việt Nam. 
    Dựa trên sản phẩm: "${product}"
    ${target ? `Nhắm đến nhóm khách hàng: ${target}` : ''}

    Hãy đưa ra chiến lược marketing CHI TIẾT, THỰC TẾ, khả thi cho cửa hàng bán lẻ công nghệ tại Việt Nam năm 2026. Cấu trúc rõ ràng:

    1. Phân tích nhanh sản phẩm (điểm mạnh, đối tượng phù hợp, giá trị cốt lõi)
    2. Mục tiêu marketing (SMART: cụ thể, đo lường được)
    3. Chiến lược đa kênh (Online + Offline): 
       - Facebook/Instagram/TikTok Ads
       - Shopee/Lazada/Tiki
       - YouTube/Review
       - Sự kiện offline nếu phù hợp
    4. Nội dung & thông điệp chính (3-5 ý tưởng post/clip/email)
    5. Ngân sách gợi ý & phân bổ (ví dụ: 60% online ads, 20% KOL...)
    6. Kế hoạch đo lường & KPI (doanh số, traffic, conversion, ROAS)
    7. Timeline triển khai (ngắn hạn 7-30 ngày, trung hạn 1-3 tháng)

    Viết bằng tiếng Việt, dùng dấu đầu dòng, bảng nếu cần, giọng chuyên nghiệp, thực tế, dài 800-1200 từ.`;

    const result = await callGemini(prompt, "Bạn phải đưa ra chiến lược rất chi tiết, có số liệu gợi ý, khả thi với cửa hàng nhỏ-lớn tại Việt Nam.");
    
    resDiv.innerHTML = result.replace(/\n/g, '<br>').replace(/###/g, '<h3 class="font-bold text-lg mt-4 mb-2">');
}