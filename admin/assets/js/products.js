/**
 * assets/js/products.js
 * Quản lý logic Kho hàng: Hiển thị, Thêm mới, Preview ảnh
 */

const InventoryModule = {
    // 1. Cấu hình Endpoint
    API_URL: "https://your-database-api.com/products",

    // 2. Dữ liệu mẫu (Đã cập nhật 5 sản phẩm)
    async fetchProductsFromDB() {
        try {
            return [
                {
                    id: 1,
                    name: "MacBook Pro M3 Max 14-inch",
                    category: "Laptop & PC",
                    price: "79.990.000",
                    stock: 5
                },
                {
                    id: 2,
                    name: "iPhone 15 Pro Max 256GB - Titanium",
                    category: "Điện thoại",
                    price: "29.450.000",
                    stock: 12
                },
                {
                    id: 3,
                    name: "Bàn phím cơ Custom Keychron Q1 Pro",
                    category: "Linh kiện",
                    price: "4.200.000",
                    stock: 2
                },
                {
                    id: 4,
                    name: "Tai nghe Sony WH-1000XM5",
                    category: "Âm thanh",
                    price: "6.990.000",
                    stock: 25
                },
                {
                    id: 5,
                    name: "Card màn hình ASUS ROG Strix RTX 4090",
                    category: "Linh kiện",
                    price: "56.500.000",
                    stock: 3
                }
            ];
        } catch (error) {
            console.error("Lỗi tải kho hàng:", error);
            return [];
        }
    },

    // 3. Render dữ liệu ra bảng giao diện
    async loadProducts() {
        const tbody = document.getElementById('product-table-body');
        const loader = document.getElementById('product-loading');
        
        if (!tbody) return;

        tbody.innerHTML = "";
        loader?.classList.remove('hidden');

        const products = await this.fetchProductsFromDB();
        loader?.classList.add('hidden');

        products.forEach(product => {
            // Logic đổi màu số lượng: dưới 5 đơn vị sẽ hiện màu đỏ cảnh báo
            const stockColor = product.stock <= 5 ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600';
            
            tbody.innerHTML += `
                <tr class="text-sm hover:bg-slate-50 transition-colors">
                    <td class="px-6 py-4 font-bold text-slate-800">${product.name}</td>
                    <td class="px-6 py-4 text-slate-500 text-xs">${product.category}</td>
                    <td class="px-6 py-4 font-bold text-blue-600">${product.price}đ</td>
                    <td class="px-6 py-4">
                        <span class="px-3 py-1 rounded-full text-[10px] font-bold ${stockColor}">
                            ${product.stock} đơn vị
                        </span>
                    </td>
                    <td class="px-6 py-4 text-right">
                        <div class="flex justify-end gap-2">
                            <button class="p-2 text-slate-400 hover:text-blue-600 transition" title="Sửa">
                                <i data-lucide="edit-3" class="w-4 h-4"></i>
                            </button>
                            <button onclick="InventoryModule.deleteProduct(${product.id})" class="p-2 text-slate-400 hover:text-rose-600 transition" title="Xóa">
                                <i data-lucide="trash-2" class="w-4 h-4"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });
        
        if (window.lucide) lucide.createIcons();
    },

    // 4. Xử lý Xem trước ảnh
    previewImage(event) {
        const file = event.target.files[0];
        const display = document.getElementById('image-preview-display');
        const placeholder = document.getElementById('image-preview-placeholder');

        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                display.src = e.target.result;
                display.classList.remove('hidden');
                placeholder.classList.add('hidden');
            };
            reader.readAsDataURL(file);
        }
    },

    // 5. Thêm sản phẩm mới
    async handleAddProduct(e) {
        e.preventDefault();
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        const formData = {
            name: document.getElementById('p-name').value,
            category: document.getElementById('p-category').value,
            price: document.getElementById('p-price').value,
            stock: document.getElementById('p-stock').value,
            image: document.getElementById('image-preview-display').src
        };

        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="ai-loading"></span> Đang lưu...`;

        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            alert("Thành công: " + formData.name + " đã được nhập kho!");
            
            e.target.reset();
            document.getElementById('image-preview-display').classList.add('hidden');
            document.getElementById('image-preview-placeholder').classList.remove('hidden');
            Utils.toggleModal('add-product-modal');
            
            InventoryModule.loadProducts();
        } catch (err) {
            alert("Lỗi: Không thể lưu sản phẩm.");
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    },

    // 6. Xử lý Xóa
    deleteProduct(id) {
        if(confirm("Bạn có chắc chắn muốn xóa thiết bị này khỏi kho?")) {
            // Ở đây bạn có thể thêm logic gọi API DELETE
            this.loadProducts(); 
        }
    }
};

/**
 * KHỞI TẠO
 */
document.addEventListener('DOMContentLoaded', () => {
    InventoryModule.loadProducts();
    const addProductForm = document.getElementById('add-product-form');
    if (addProductForm) {
        addProductForm.addEventListener('submit', InventoryModule.handleAddProduct);
    }
});

window.InventoryModule = InventoryModule;