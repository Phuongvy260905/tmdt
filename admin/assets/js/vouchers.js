const VoucherModule = (function() {
    let vouchers = [
        { id: 1, code: "WELCOME2026", type: "fixed", value: 50000, min_order: 200000, max_discount: 50000, usage_limit: 100, used_count: 45, expiry: "2026-12-31", is_active: true },
        { id: 2, code: "TECHPHONG", type: "percentage", value: 10, min_order: 1000000, max_discount: 200000, usage_limit: 50, used_count: 50, expiry: "2026-05-01", is_active: false }
    ];

    function render() {
        
        const tbody = document.getElementById('voucher-table-body');

        if (!tbody) {
            setTimeout(render, 100);
            return;
        }

        tbody.innerHTML = vouchers.map(v => `
            <tr class="hover:bg-slate-50 transition">
                <td class="px-6 py-4"><span class="font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">${v.code}</span></td>
                <td class="px-6 py-4">${v.type === 'percentage' ? v.value + '%' : v.value.toLocaleString() + 'đ'}</td>
                <td class="px-6 py-4 text-slate-500 text-xs">Từ ${v.min_order.toLocaleString()}đ</td>
                <td class="px-6 py-4">
                    <div class="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden max-w-[100px]">
                        <div class="bg-blue-500 h-full" style="width: ${(v.used_count/v.usage_limit)*100}%"></div>
                    </div>
                    <span class="text-[10px] font-bold text-slate-400">${v.used_count}/${v.usage_limit}</span>
                </td>
                <td class="px-6 py-4">
                    <button onclick="VoucherModule.toggleStatus(${v.id})" class="relative inline-flex items-center cursor-pointer">
                        <div class="w-10 h-5 ${v.is_active ? 'bg-emerald-500' : 'bg-slate-300'} rounded-full transition-colors relative">
                            <div class="absolute top-1 left-1 bg-white w-3 h-3 rounded-full transition-transform ${v.is_active ? 'translate-x-5' : ''}"></div>
                        </div>
                    </button>
                </td>
                <td class="px-6 py-4 text-right">
                    <button onclick="VoucherModule.deleteVoucher(${v.id})" class="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                </td>
            </tr>
        `).join('');

        document.getElementById('active-vouchers-count').innerText = vouchers.filter(v => v.is_active).length;
        document.getElementById('total-usages').innerText = vouchers.reduce((sum, v) => sum + v.used_count, 0);
        if (window.lucide) lucide.createIcons();
    }

    function openModal() {
        document.getElementById('voucher-form').reset();
        document.getElementById('voucher-modal').classList.remove('hidden');
    }

    function closeModal() {
        document.getElementById('voucher-modal').classList.add('hidden');
    }

    function toggleStatus(id) {
        const v = vouchers.find(i => i.id === id);
        if (v) v.is_active = !v.is_active;
        render();
    }

    function deleteVoucher(id) {
        if(confirm("Xoá voucher này?")) {
            vouchers = vouchers.filter(v => v.id !== id);
            render();
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        const newV = {
            id: Date.now(),
            code: document.getElementById('v-code').value.toUpperCase(),
            type: document.getElementById('v-type').value,
            value: Number(document.getElementById('v-value').value),
            min_order: Number(document.getElementById('v-min').value),
            max_discount: Number(document.getElementById('v-max').value) || 0,
            usage_limit: Number(document.getElementById('v-limit').value),
            used_count: 0,
            expiry: document.getElementById('v-expiry').value,
            is_active: true
        };
        vouchers.unshift(newV);
        closeModal();
        render();
    }

    return { render, openModal, closeModal, toggleStatus, deleteVoucher, handleSubmit };
})();