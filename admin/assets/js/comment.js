const CommentModule = (function() {
    // 1. Dữ liệu nội bộ
    let mockComments = [
        { id: 1, user: "Nguyễn Văn An", avatar: "AN", product: "RTX 4060 Ti", rating: 5, content: "Sản phẩm quá tuyệt vời, đóng gói kỹ.", date: "2026-03-15" },
        { id: 2, user: "Trần Thị Bích", avatar: "TB", product: "Bàn phím AKKO 3068", rating: 3, content: "Phím đẹp nhưng cảm giác gõ hơi lọc xọc.", date: "2026-03-16" },
        { id: 3, user: "Lê Minh Quân", avatar: "MQ", product: "Chuột Logitech G Pro", rating: 4, content: "Chuột nhẹ, sensor nhạy. Giá hơi cao.", date: "2026-03-17" },
        { id: 4, user: "Hoàng Yến", avatar: "HY", product: "Tai nghe Sony WH-1000", rating: 1, content: "Giao sai màu, rất thất vọng!", date: "2026-03-18" }
    ];

    // 2. Hàm Render bảng
    function render() {
        const tbody = document.getElementById('comment-table-body');
        if (!tbody) return; // Thoát nếu chưa có DOM

        const searchTerm = (document.getElementById('comment-search')?.value || "").toLowerCase();
        const ratingFilter = document.getElementById('rating-filter')?.value || "all";

        const filtered = mockComments.filter(item => {
            const matchesSearch = item.user.toLowerCase().includes(searchTerm) || 
                                  item.product.toLowerCase().includes(searchTerm) ||
                                  item.content.toLowerCase().includes(searchTerm);
            const matchesRating = ratingFilter === 'all' || item.rating.toString() === ratingFilter;
            return matchesSearch && matchesRating;
        });

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="px-6 py-10 text-center text-slate-400">Không tìm thấy bình luận nào</td></tr>`;
        } else {
            tbody.innerHTML = filtered.map(item => `
                <tr class="hover:bg-slate-50/50 transition border-b border-slate-100">
                    <td class="px-6 py-4 font-bold text-slate-800">${item.product}</td>
                    <td class="px-6 py-4">
                        <div class="flex items-center gap-2">
                            <div class="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-[10px] font-bold text-blue-600">${item.avatar}</div>
                            <span class="font-medium text-slate-700">${item.user}</span>
                        </div>
                    </td>
                    <td class="px-6 py-4">
                        <div class="flex text-amber-400">
                            ${Array(5).fill(0).map((_, i) => `
                                <i data-lucide="star" class="w-3 h-3 ${i < item.rating ? 'fill-current' : 'text-slate-200'}"></i>
                            `).join('')}
                        </div>
                    </td>
                    <td class="px-6 py-4 text-slate-600 max-w-[200px] truncate" title="${item.content}">${item.content}</td>
                    <td class="px-6 py-4 text-slate-400 text-xs">${item.date}</td>
                    <td class="px-6 py-4 text-right">
                        <button onclick="CommentModule.openModal(${item.id})" class="p-2 hover:bg-blue-50 rounded-lg transition text-blue-600">
                            <i data-lucide="message-square-text" class="w-4 h-4"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
        }

        if (window.lucide) window.lucide.createIcons();
    }

    // 3. Logic Modal
    function openModal(id) {
        const item = mockComments.find(c => c.id === id);
        if (!item) return;

        document.getElementById('modal-avatar').innerText = item.avatar;
        document.getElementById('modal-username').innerText = item.user;
        document.getElementById('modal-product-name').innerText = item.product;
        document.getElementById('modal-text').innerText = item.content;
        document.getElementById('modal-stars').innerHTML = Array(5).fill(0).map((_, i) => 
            `<i data-lucide="star" class="w-5 h-5 ${i < item.rating ? 'fill-current' : 'text-slate-200'}"></i>`
        ).join('');

        document.getElementById('comment-modal').classList.remove('hidden');
        if (window.lucide) window.lucide.createIcons();
    }

    function closeModal() {
        document.getElementById('comment-modal').classList.add('hidden');
    }

    function submitReply() {
        const text = document.getElementById('admin-reply-text').value;
        if (!text.trim()) return alert("Vui lòng nhập nội dung!");
        alert("Đã gửi phản hồi thành công!");
        closeModal();
        document.getElementById('admin-reply-text').value = "";
    }

    // Thêm hàm delete để không bị lỗi khi click
    function deleteComment() {
        if(confirm("Bạn có chắc chắn muốn ẩn bình luận này?")) {
            alert("Đã thực hiện!");
            closeModal();
        }
    }

    function init() {
        console.log("Comment Module Initializing...");
        render();
    }

    // Xuất các hàm ra ngoài
    return { init, render, openModal, closeModal, submitReply, deleteComment };
})();

// --- CƠ CHẾ TỰ KÍCH HOẠT MẠNH MẼ ---
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", CommentModule.init);
} else {
    // Nếu DOM đã xong rồi thì chạy luôn
    CommentModule.init();
}