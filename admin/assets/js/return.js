// 1. DỮ LIỆU GIẢ LẬP
let mockReturns = [
    { id: 'RET-8821', price: "23,123,213đ", customer: 'Nguyễn Văn A', product: 'RTX 4060 Ti 8GB', reason: 'Lỗi kỹ thuật', status: 'pending' },
    { id: 'RET-8790', price: "213,213đ", customer: 'Trần Thị B', product: 'Bàn phím cơ AKKO 3068', reason: 'Giao sai màu', status: 'shipping' },
    { id: 'RET-9902', price: "23,436đ", customer: 'Phạm Minh C', product: 'Màn hình Dell UltraSharp', reason: 'Hở sáng nặng', status: 'completed' },
    { id: 'RET-1102', price: "45,645,654đ", customer: 'Lê Thu D', product: 'Chuột Logitech G Pro', reason: 'Click đúp', status: 'rejected' }
];

const STATUS_MAP = {
    pending: { label: 'Chờ kiểm định', color: 'text-amber-600', dot: 'bg-amber-500 animate-pulse' },
    shipping: { label: 'Đang gửi hàng', color: 'text-blue-600', dot: 'bg-blue-500' },
    completed: { label: 'Đã hoàn tất', color: 'text-emerald-600', dot: 'bg-emerald-500' },
    rejected: { label: 'Từ chối', color: 'text-rose-600', dot: 'bg-rose-500' }
};

// 2. GIẢ LẬP API
const ReturnAPI = {
    async getAll() {
        return new Promise(resolve => setTimeout(() => resolve([...mockReturns]), 300));
    },
    async updateStatus(id, newStatus) {
        return new Promise(resolve => setTimeout(() => {
            mockReturns = mockReturns.map(item => item.id === id ? {...item, status: newStatus} : item);
            resolve({ success: true });
        }, 300));
    }
};

// 3. XỬ LÝ HIỂN THỊ
async function renderUI() {
    const allData = await ReturnAPI.getAll();
    const tbody = document.getElementById('return-table-body');
    const search = document.getElementById('search-input').value.toLowerCase();
    const statusF = document.getElementById('status-filter').value;

    const filtered = allData.filter(item => {
        const matchText = item.customer.toLowerCase().includes(search) || item.id.toLowerCase().includes(search);
        const matchStatus = statusF === 'all' || item.status === statusF;
        return matchText && matchStatus;
    });

    // Cập nhật thẻ thống kê
    document.getElementById('count-pending').innerText = allData.filter(i => i.status === 'pending').length + ' đơn';
    document.getElementById('count-completed').innerText = allData.filter(i => i.status === 'completed').length + ' đơn';
    document.getElementById('count-rejected').innerText = allData.filter(i => i.status === 'rejected').length + ' đơn';

    tbody.innerHTML = filtered.map(item => {
        const s = STATUS_MAP[item.status];
        return `
            <tr class="hover:bg-slate-50 transition border-b">
                <td class="px-6 py-4">
                    <div onclick="openModal('${item.id}')" class="font-bold text-blue-600 cursor-pointer hover:underline">#${item.id}</div>
                    <div class="text-xs text-slate-500">${item.customer}</div>
                </td>
                <td class="px-6 py-4 font-medium text-slate-700">${item.price}</td>
                <td class="px-6 py-4 text-slate-600">${item.product}</td>
                <td class="px-6 py-4"><span class="px-2 py-1 bg-slate-100 rounded text-xs text-slate-600">${item.reason}</span></td>
                <td class="px-6 py-4">
                    <span class="flex items-center gap-1.5 ${s.color} font-medium">
                        <span class="w-2 h-2 ${s.dot} rounded-full"></span> ${s.label}
                    </span>
                </td>
                <td class="px-6 py-4 text-right">
                    <button onclick="openModal('${item.id}')" class="text-slate-400 hover:text-blue-600"><i data-lucide="eye" class="w-4 h-4"></i></button>
                </td>
            </tr>`;
    }).join('');
    if (window.lucide) lucide.createIcons();
}

// 4. XỬ LÝ MODAL & NGHIỆP VỤ
function openModal(id) {
    const item = mockReturns.find(r => r.id === id);
    if(!item) return;

    document.getElementById('modal-title').innerText = `Chi tiết yêu cầu #${item.id}`;
    document.getElementById('modal-customer').innerText = item.customer;
    document.getElementById('modal-price').innerText = item.price;
    document.getElementById('modal-product').innerText = item.product;
    document.getElementById('modal-reason').innerText = item.reason;

    const footer = document.getElementById('modal-footer');
    if (item.status === 'pending') {
        footer.innerHTML = `
            <button onclick="changeStatus('${item.id}', 'rejected')" class="px-6 py-2 rounded-xl text-rose-600 border border-rose-200 hover:bg-rose-50 font-bold">Từ chối</button>
            <button onclick="changeStatus('${item.id}', 'completed')" class="px-6 py-2 rounded-xl text-white bg-blue-600 hover:bg-blue-700 font-bold shadow-lg">Duyệt & Hoàn tiền</button>
        `;
    } else {
        footer.innerHTML = `<p class="text-slate-400 italic text-sm">Yêu cầu này đã được xử lý (Trạng thái: ${STATUS_MAP[item.status].label})</p>`;
    }

    document.getElementById('return-modal').classList.remove('hidden');
    if (window.lucide) lucide.createIcons();
}

function closeModal() { document.getElementById('return-modal').classList.add('hidden'); }

async function changeStatus(id, newStatus) {
    const item = mockReturns.find(r => r.id === id);
    const confirmMsg = `Xác nhận: ${STATUS_MAP[newStatus].label} đơn hàng ${id}?`;
    
    if (confirm(confirmMsg)) {
        if (newStatus === 'completed') {
            // Nghiệp vụ thực tế
            await simulateInventory(item.product, "+1");
            await simulateRefund(item.customer, item.price);
        }
        await ReturnAPI.updateStatus(id, newStatus);
        alert("Xử lý nghiệp vụ thành công!");
        closeModal();
        renderUI();
    }
}

// Giả lập hệ thống Warehouse & Finance
function simulateInventory(p, qty) { console.log(`[KHO]: Đã nhập lại ${p} (Số lượng ${qty})`); return Promise.resolve(); }
function simulateRefund(c, amt) { console.log(`[TIỀN]: Đã hoàn ${amt} cho khách ${c}`); return Promise.resolve(); }

function handleFilterChange() { renderUI(); }

document.addEventListener('DOMContentLoaded', renderUI);