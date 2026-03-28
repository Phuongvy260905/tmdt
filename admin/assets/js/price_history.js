const PriceHistoryModule = (function() {
    // Dữ liệu mẫu (Trong thực tế sẽ fetch từ API)
    let historyLogs = [
        {
            id: 101,
            date: "2026-03-20 14:30",
            product: "iPhone 15 Pro Max",
            variant: "Tự nhiên / 256GB",
            oldPrice: 32990000,
            newPrice: 31500000,
            author: "Admin Tech",
            reason: "Chương trình khuyến mãi cuối tuần",
            type: "decrease"
        },
        {
            id: 102,
            date: "2026-03-19 09:15",
            product: "MacBook Air M2",
            variant: "Midnight / 8GB / 256GB",
            oldPrice: 24500000,
            newPrice: 25500000,
            author: "Manager_Hoang",
            reason: "Điều chỉnh theo tỷ giá hối đoái",
            type: "increase"
        },
        {
            id: 103,
            date: "2026-03-18 17:00",
            product: "Bàn phím AKKO 3068",
            variant: "Silent Switch",
            oldPrice: 1550000,
            newPrice: 1350000,
            author: "Admin Tech",
            reason: "Xả kho tồn lâu ngày",
            type: "decrease"
        }
    ];

    function render() {
        const tbody = document.getElementById('price-history-table-body');
        if (!tbody) {
            setTimeout(render, 100);
            return;
        }

        const searchTerm = (document.getElementById('price-search')?.value || "").toLowerCase();

        const filtered = historyLogs.filter(log => 
            log.product.toLowerCase().includes(searchTerm) || 
            log.author.toLowerCase().includes(searchTerm)
        );

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="px-6 py-10 text-center text-slate-400 italic">Không có dữ liệu lịch sử giá.</td></tr>`;
            return;
        }

        tbody.innerHTML = filtered.map(log => {
            const diff = log.newPrice - log.oldPrice;
            const diffClass = log.type === 'increase' ? 'text-rose-500' : 'text-emerald-500';
            const icon = log.type === 'increase' ? 'trending-up' : 'trending-down';

            return `
                <tr class="hover:bg-slate-50/50 transition border-b border-slate-100">
                    <td class="px-6 py-4 text-slate-400 text-xs">${log.date}</td>
                    <td class="px-6 py-4">
                        <p class="font-bold text-slate-800">${log.product}</p>
                        <p class="text-[10px] text-slate-400">${log.variant}</p>
                    </td>
                    <td class="px-6 py-4 font-medium text-slate-500">${log.oldPrice.toLocaleString()}đ</td>
                    <td class="px-6 py-4">
                        <div class="flex items-center gap-2">
                            <span class="font-bold text-slate-900">${log.newPrice.toLocaleString()}đ</span>
                            <span class="flex items-center text-[10px] font-bold ${diffClass}">
                                <i data-lucide="${icon}" class="w-3 h-3 mr-0.5"></i>
                                ${Math.abs(diff).toLocaleString()}
                            </span>
                        </div>
                    </td>
                    <td class="px-6 py-4">
                        <div class="flex items-center gap-2">
                            <div class="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
                                ${log.author.charAt(0)}
                            </div>
                            <span class="font-medium">${log.author}</span>
                        </div>
                    </td>
                    <td class="px-6 py-4">
                        <span class="text-xs bg-slate-100 px-2 py-1 rounded-md text-slate-600" title="${log.reason}">
                            ${log.reason}
                        </span>
                    </td>
                </tr>
            `;
        }).join('');

        if (window.lucide) lucide.createIcons();
    }

    function refresh() {
        const searchInput = document.getElementById('price-search');
        if (searchInput) searchInput.value = "";
        render();
    }

    return { render, refresh };
})();