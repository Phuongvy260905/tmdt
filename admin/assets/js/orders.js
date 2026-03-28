/**
 * assets/js/orders.js
 */
const OrdersModule = {
  // 1. Cấu hình Endpoint
  API_ENDPOINT: "https://your-api-database.com/api/orders",

  // Biến lưu trữ dữ liệu gốc để phục vụ chức năng lọc (Filter)
  allOrders: [],

  // 2. Hàm lấy dữ liệu
  async fetchOrdersFromDB() {
    try {
      // Giả lập dữ liệu từ Database (Đã thêm trường name và productImage)
      const mockData = [
        {
          id: "ORD-9921",
          name: "iPhone 16 Pro Max",
          customer: "Nguyễn Văn A",
          date: "2026-03-15",
          total: "35.500.000",
          status: "pending",
          statusText: "Chờ xử lý",
          productImage: "https://picsum.photos/id/160/50/50",
        },
        {
          id: "ORD-9922",
          name: "iPhone 14 Pro",
          customer: "Trần Thị B",
          date: "2026-03-14",
          total: "12.200.000",
          status: "shipping",
          statusText: "Đang giao",
          productImage: "https://picsum.photos/id/1/50/50",
        },
        {
          id: "ORD-9923",
          name: "iPhone 13",
          customer: "Lê Văn C",
          date: "2026-03-13",
          total: "7.800.000",
          status: "completed",
          statusText: "Đã xong",
          productImage: "https://picsum.photos/id/2/50/50",
        },
      ];

      // Lưu vào biến local để Filter không cần gọi lại API
      this.allOrders = mockData;
      return mockData;
    } catch (error) {
      console.error("Lỗi gọi API đơn hàng:", error);
      return [];
    }
  },

  async loadOrders(data = null) {
    const tbody = document.getElementById("order-table-body");

    // NẾU CHƯA CÓ TBODY (HTML chưa load xong), ĐỢI 50ms RỒI GỌI LẠI
    if (!tbody) {
      setTimeout(() => this.loadOrders(data), 50);
      return;
    }

    const loader = document.getElementById("order-loading");
    tbody.innerHTML = "";
    if (loader) loader.classList.remove("hidden");

    let orders = data;
    if (!orders) {
      orders = await this.fetchOrdersFromDB();
    }

    if (loader) loader.classList.add("hidden");

    if (orders.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center py-10 text-slate-400 italic">Không tìm thấy đơn hàng nào.</td></tr>`;
      return;
    }

    // Sử dụng map và join để tối ưu hiệu năng thay vì += trong loop
    const htmlRows = orders
      .map((order) => {
        const statusClass = this.getStatusStyle(order.status);
        return `
            <tr class="text-sm hover:bg-slate-50 transition-colors border-b border-slate-100">
                <td class="px-6 py-4 font-mono font-bold text-blue-600">${order.id}</td>
                <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                        <img src="${order.productImage}" class="w-10 h-10 rounded-lg object-cover border border-slate-100" alt="tech">
                        <div>
                            <p class="font-bold text-slate-800">${order.name}</p>
                            <p class="text-[10px] text-slate-400">Khách: ${order.customer}</p>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 text-slate-500 text-xs">${order.date}</td>
                <td class="px-6 py-4 font-bold text-slate-900">${order.total}đ</td>
                <td class="px-6 py-4">
                    <span class="px-3 py-1 rounded-full text-[10px] font-bold ${statusClass}">
                        ${order.statusText}
                    </span>
                </td>
                <td class="px-6 py-4 text-right">
                    <button class="text-slate-400 hover:text-blue-600 p-2 transition"><i data-lucide="eye" class="w-4 h-4"></i></button>
                </td>
            </tr>
        `;
      })
      .join("");

    tbody.innerHTML = htmlRows;
    if (window.lucide) lucide.createIcons();
  },

  // 4. Helper: Trả về màu sắc cho từng trạng thái
  getStatusStyle(status) {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-600";
      case "shipping":
        return "bg-blue-100 text-blue-600";
      case "completed":
        return "bg-emerald-100 text-emerald-600";
      default:
        return "bg-slate-100 text-slate-600";
    }
  },

  // 5. Chức năng lọc trạng thái
  filterOrders() {
    const filterValue = document.getElementById("order-filter").value;
    if (filterValue === "all") {
      this.loadOrders(this.allOrders);
    } else {
      const filtered = this.allOrders.filter(
        (order) => order.status === filterValue,
      );
      this.loadOrders(filtered);
    }
  },

  // 6. Làm mới dữ liệu
  refresh() {
    const filterEl = document.getElementById("order-filter");
    if (filterEl) filterEl.value = "all";
    this.loadOrders();
  },
};

// Đưa ra Global Scope
window.OrdersModule = OrdersModule;
