// assets/js/utils.js

const Utils = {
    // Hàm đóng/mở Modal
    toggleModal: function(id) {
        const modal = document.getElementById(id);
        if (modal) {
            // Tailwind sử dụng 'hidden' để ẩn và 'flex' để hiển thị (căn giữa modal)
            modal.classList.toggle('hidden');
            modal.classList.toggle('flex');
        } else {
            console.error("Không tìm thấy modal với ID:", id);
        }
    },

    // Hàm chuyển đổi Tab
    switchTab: function(id) {
        // Ẩn tất cả các nội dung tab
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
        // Bỏ active tất cả các nút sidebar
        document.querySelectorAll('.sidebar-item').forEach(b => b.classList.remove('active'));
        
        const targetTab = document.getElementById(`tab-${id}`);
        const targetBtn = document.getElementById(`btn-${id}`);
        
        if (targetTab) targetTab.classList.add('active');
        if (targetBtn) targetBtn.classList.add('active');
        
        // Vẽ lại icon sau khi chuyển tab
        if (window.lucide) {
            lucide.createIcons();
        }
    }
};

// Đưa đối tượng Utils ra Global Scope để gọi được từ onclick trong HTML
window.Utils = Utils;

// Để hỗ trợ cả cách gọi cũ (không có Utils.), bạn có thể gắn thêm:
window.toggleModal = Utils.toggleModal;
window.switchTab = Utils.switchTab;