let reviews = [
  { id: 1, user: "Nguyễn Văn A", product: "iPhone 16 Pro Max", rating: 5, content: "Máy đẹp, pin tốt", is_visible: true },
  { id: 2, user: "Trần Thị B", product: "iPhone 14 Pro", rating: 3, content: "Tạm ổn", is_visible: true },
  { id: 3, user: "Lê Văn C", product: "iPhone 13 Pro", rating: 1, content: "Bình luận vi phạm", is_visible: false }
];

function renderReviews() {
  const table = document.getElementById("reviewTable");
  if (!table) return;

  table.innerHTML = reviews.map(review => `
    <tr class="border-b border-slate-100">
      <td class="py-3">${review.id}</td>
      <td class="py-3">${review.user}</td>
      <td class="py-3">${review.product}</td>
      <td class="py-3">${"★".repeat(review.rating)}</td>
      <td class="py-3">${review.content}</td>
      <td class="py-3">
        <span class="${review.is_visible ? "text-emerald-600" : "text-rose-500"} font-medium">
          ${review.is_visible ? "Visible" : "Hidden"}
        </span>
      </td>
      <td class="py-3">
        <button onclick="toggleReviewVisibility(${review.id})"
          class="px-3 py-1.5 rounded-lg ${review.is_visible ? "bg-amber-400 hover:bg-amber-500" : "bg-emerald-500 hover:bg-emerald-600 text-white"}">
          ${review.is_visible ? "Hide" : "Show"}
        </button>
      </td>
    </tr>
  `).join("");
}

function toggleReviewVisibility(id) {
  const review = reviews.find(r => r.id === id);
  if (!review) return;
  review.is_visible = !review.is_visible;
  renderReviews();
}

window.renderReviews = renderReviews;
window.toggleReviewVisibility = toggleReviewVisibility;