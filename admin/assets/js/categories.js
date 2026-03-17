
let categories = [
  { id: 1, name: "Điện thoại", parent_id: null, sort_order: 1, is_active: true },
  { id: 2, name: "Phụ kiện", parent_id: null, sort_order: 2, is_active: true },
  { id: 3, name: "Ốp lưng", parent_id: 2, sort_order: 1, is_active: true },
  { id: 4, name: "Sạc", parent_id: 2, sort_order: 2, is_active: false }
];

let editingCategoryId = null;

function getCategoryNameById(id) {
  const category = categories.find(c => c.id === id);
  return category ? category.name : "-";
}

function renderCategoryParentOptions() {
  const select = document.getElementById("categoryParent");
  if (!select) return;

  select.innerHTML = `<option value="">Không có danh mục cha</option>` +
    categories.map(c => `<option value="${c.id}">${c.name}</option>`).join("");
}

function renderCategories() {
  const table = document.getElementById("categoryTable");
  if (!table) return;

  table.innerHTML = categories
    .sort((a, b) => a.sort_order - b.sort_order)
    .map(category => `
      <tr class="border-b border-slate-100">
        <td class="py-3">${category.id}</td>
        <td class="py-3 font-medium text-slate-800">${category.name}</td>
        <td class="py-3">${category.parent_id ? getCategoryNameById(category.parent_id) : "-"}</td>
        <td class="py-3">${category.sort_order}</td>
        <td class="py-3">
          <span class="${category.is_active ? "text-emerald-600" : "text-rose-500"} font-medium">
            ${category.is_active ? "Active" : "Inactive"}
          </span>
        </td>
        <td class="py-3 flex gap-2">
          <button onclick="editCategory(${category.id})" class="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200">
            Edit
          </button>
          <button onclick="toggleCategoryStatus(${category.id})" class="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-500 text-slate-900">
            ${category.is_active ? "Hide" : "Show"}
          </button>
          <button onclick="deleteCategory(${category.id})" class="px-3 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white">
            Delete
          </button>
        </td>
      </tr>
    `)
    .join("");

  renderCategoryParentOptions();
}

function openCategoryForm() {
  editingCategoryId = null;
  document.getElementById("categoryFormTitle").textContent = "Add Category";
  document.getElementById("categoryName").value = "";
  document.getElementById("categoryParent").value = "";
  document.getElementById("categorySortOrder").value = "";
  document.getElementById("categoryStatus").value = "true";
  document.getElementById("categoryFormBox").classList.remove("hidden");
}

function closeCategoryForm() {
  document.getElementById("categoryFormBox").classList.add("hidden");
}

function saveCategory() {
  const name = document.getElementById("categoryName").value.trim();
  const parentIdValue = document.getElementById("categoryParent").value;
  const sortOrder = Number(document.getElementById("categorySortOrder").value || 0);
  const isActive = document.getElementById("categoryStatus").value === "true";

  if (!name) {
    alert("Vui lòng nhập tên danh mục");
    return;
  }

  if (editingCategoryId) {
    const category = categories.find(c => c.id === editingCategoryId);
    if (!category) return;
    category.name = name;
    category.parent_id = parentIdValue ? Number(parentIdValue) : null;
    category.sort_order = sortOrder;
    category.is_active = isActive;
  } else {
    categories.push({
      id: categories.length ? Math.max(...categories.map(c => c.id)) + 1 : 1,
      name,
      parent_id: parentIdValue ? Number(parentIdValue) : null,
      sort_order: sortOrder,
      is_active: isActive
    });
  }

  closeCategoryForm();
  renderCategories();
}

function editCategory(id) {
  const category = categories.find(c => c.id === id);
  if (!category) return;

  editingCategoryId = id;
  document.getElementById("categoryFormTitle").textContent = "Edit Category";
  document.getElementById("categoryName").value = category.name;
  document.getElementById("categoryParent").value = category.parent_id ?? "";
  document.getElementById("categorySortOrder").value = category.sort_order;
  document.getElementById("categoryStatus").value = String(category.is_active);
  document.getElementById("categoryFormBox").classList.remove("hidden");
}

function toggleCategoryStatus(id) {
  const category = categories.find(c => c.id === id);
  if (!category) return;
  category.is_active = !category.is_active;
  renderCategories();
}

function deleteCategory(id) {
  categories = categories.filter(c => c.id !== id);
  renderCategories();
}

window.renderCategories = renderCategories;
window.openCategoryForm = openCategoryForm;
window.closeCategoryForm = closeCategoryForm;
window.saveCategory = saveCategory;
window.editCategory = editCategory;
window.toggleCategoryStatus = toggleCategoryStatus;
window.deleteCategory = deleteCategory;