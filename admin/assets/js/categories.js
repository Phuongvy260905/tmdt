let categories = [
  { id: 1, name: "Điện thoại", slug: "dien-thoai", parent_id: null, sort_order: 1, is_active: true },
  { id: 2, name: "Phụ kiện", slug: "phu-kien", parent_id: null, sort_order: 2, is_active: true },
  { id: 3, name: "Ốp lưng", slug: "op-lung", parent_id: 2, sort_order: 3, is_active: true },
  { id: 4, name: "Sạc nhanh", slug: "sac-nhanh", parent_id: 2, sort_order: 4, is_active: false }
];

let editingCategoryId = null;

function getCategoryNameById(id) {
  const category = categories.find(c => c.id === id);
  return category ? category.name : "Không có";
}

function getParentBadge(parentId) {
  if (!parentId) {
    return `<span class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">Danh mục gốc</span>`;
  }
  return `<span class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">${getCategoryNameById(parentId)}</span>`;
}

function getStatusBadge(isActive) {
  return isActive
    ? `<span class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">Active</span>`
    : `<span class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-rose-100 text-rose-700">Inactive</span>`;
}

function getCategoryIcon(parentId) {
  return parentId ? "tag" : "folder-tree";
}

function renderCategoryParentOptions() {
  const select = document.getElementById("categoryParent");
  if (!select) return;

  const currentId = editingCategoryId;

  select.innerHTML =
    `<option value="">Không có danh mục cha</option>` +
    categories
      .filter(category => category.id !== currentId)
      .map(category => `<option value="${category.id}">${category.name}</option>`)
      .join("");
}

function getFilteredCategories() {
  const search = document.getElementById("categorySearch")?.value?.trim().toLowerCase() || "";
  const filter = document.getElementById("categoryFilter")?.value || "all";

  return categories.filter(category => {
    const matchSearch =
      category.name.toLowerCase().includes(search) ||
      category.slug.toLowerCase().includes(search);

    let matchFilter = true;

    if (filter === "active") matchFilter = category.is_active;
    if (filter === "inactive") matchFilter = !category.is_active;
    if (filter === "root") matchFilter = category.parent_id === null;
    if (filter === "child") matchFilter = category.parent_id !== null;

    return matchSearch && matchFilter;
  });
}

function renderCategoriesList() {
  const grid = document.getElementById("categoryGrid");
  if (!grid) return;

  const filteredCategories = getFilteredCategories();

  if (filteredCategories.length === 0) {
    grid.innerHTML = `
      <div class="md:col-span-2 xl:col-span-3 border border-dashed border-slate-300 rounded-3xl bg-slate-50 p-10 text-center">
        <div class="flex flex-col items-center gap-3 text-slate-400">
          <i data-lucide="folder-search-2" class="w-10 h-10"></i>
          <p class="text-base font-medium">Không tìm thấy danh mục phù hợp</p>
        </div>
      </div>
    `;
    if (window.lucide) lucide.createIcons();
    return;
  }

  grid.innerHTML = filteredCategories
  .sort((a, b) => a.sort_order - b.sort_order)
  .map(category => `
    <div class="group bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
      <div class="flex items-start justify-between gap-3">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <i data-lucide="${getCategoryIcon(category.parent_id)}" class="w-5 h-5"></i>
          </div>

          <div>
            <h3 class="text-xl font-semibold text-slate-800 leading-tight">${category.name}</h3>
            <p class="text-sm text-slate-400 mt-1">Slug: ${category.slug}</p>
          </div>
        </div>

        <div class="text-xs font-medium text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
          #${category.id}
        </div>
      </div>

      <div class="mt-5 space-y-4">
        <div class="rounded-2xl bg-slate-50 border border-slate-100 p-4">
          <p class="text-xs uppercase tracking-wide text-slate-400 mb-2">Danh mục cha</p>
          ${getParentBadge(category.parent_id)}
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="rounded-2xl bg-slate-50 border border-slate-100 p-4">
            <p class="text-xs uppercase tracking-wide text-slate-400 mb-2">Sort order</p>
            <p class="text-xl font-semibold text-slate-800">${category.sort_order}</p>
          </div>

          <div class="rounded-2xl bg-slate-50 border border-slate-100 p-4">
            <p class="text-xs uppercase tracking-wide text-slate-400 mb-2">Trạng thái</p>
            ${getStatusBadge(category.is_active)}
          </div>
        </div>
      </div>

      <div class="mt-6 flex flex-wrap gap-2">
        <button
          onclick="editCategory(${category.id})"
          class="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-all"
        >
          Edit
        </button>

        <button
          onclick="toggleCategoryStatus(${category.id})"
          class="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-medium transition-all"
        >
          ${category.is_active ? "Hide" : "Show"}
        </button>

        <button
          onclick="deleteCategory(${category.id})"
          class="px-4 py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-medium transition-all"
        >
          Delete
        </button>
      </div>
    </div>
  `)
  .join("");

  renderCategoryParentOptions();
  if (window.lucide) lucide.createIcons();
}

function attachCategoryEvents() {
  const searchInput = document.getElementById("categorySearch");
  const filterSelect = document.getElementById("categoryFilter");

  if (searchInput && !searchInput.dataset.bound) {
    searchInput.addEventListener("input", renderCategoriesList);
    searchInput.dataset.bound = "true";
  }

  if (filterSelect && !filterSelect.dataset.bound) {
    filterSelect.addEventListener("change", renderCategoriesList);
    filterSelect.dataset.bound = "true";
  }
}

function openCategoryForm() {
  editingCategoryId = null;

  document.getElementById("categoryFormTitle").textContent = "Add Category";
  document.getElementById("categoryName").value = "";
  document.getElementById("categorySlug").value = "";
  document.getElementById("categoryParent").value = "";
  document.getElementById("categorySort").value = "";
  document.getElementById("categoryActive").value = "true";

  renderCategoryParentOptions();
  document.getElementById("categoryFormBox").classList.remove("hidden");
}

function closeCategoryForm() {
  const formBox = document.getElementById("categoryFormBox");
  if (formBox) formBox.classList.add("hidden");
}

function generateSlug(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function saveCategory() {
  const name = document.getElementById("categoryName").value.trim();
  let slug = document.getElementById("categorySlug").value.trim();
  const parentIdValue = document.getElementById("categoryParent").value;
  const sortOrder = Number(document.getElementById("categorySort").value || 0);
  const isActive = document.getElementById("categoryActive").value === "true";

  if (!name) {
    alert("Vui lòng nhập tên danh mục");
    return;
  }

  if (!slug) slug = generateSlug(name);

  const parentId = parentIdValue ? Number(parentIdValue) : null;

  if (editingCategoryId !== null) {
    const category = categories.find(c => c.id === editingCategoryId);
    if (!category) return;

    category.name = name;
    category.slug = slug;
    category.parent_id = parentId;
    category.sort_order = sortOrder;
    category.is_active = isActive;
  } else {
    categories.push({
      id: categories.length ? Math.max(...categories.map(c => c.id)) + 1 : 1,
      name,
      slug,
      parent_id: parentId,
      sort_order: sortOrder,
      is_active: isActive
    });
  }

  closeCategoryForm();
  renderCategoriesList();
}

function editCategory(id) {
  const category = categories.find(c => c.id === id);
  if (!category) return;

  editingCategoryId = id;

  document.getElementById("categoryFormTitle").textContent = "Edit Category";
  document.getElementById("categoryName").value = category.name;
  document.getElementById("categorySlug").value = category.slug;

  renderCategoryParentOptions();

  document.getElementById("categoryParent").value = category.parent_id ?? "";
  document.getElementById("categorySort").value = category.sort_order;
  document.getElementById("categoryActive").value = String(category.is_active);

  document.getElementById("categoryFormBox").classList.remove("hidden");
}

function toggleCategoryStatus(id) {
  const category = categories.find(c => c.id === id);
  if (!category) return;

  category.is_active = !category.is_active;
  renderCategoriesList();
}

function deleteCategory(id) {
  const hasChildren = categories.some(c => c.parent_id === id);

  if (hasChildren) {
    alert("Danh mục này đang có danh mục con. Hãy xoá hoặc chuyển danh mục con trước.");
    return;
  }

  categories = categories.filter(c => c.id !== id);
  renderCategoriesList();
}

window.renderCategories = function () {
  attachCategoryEvents();
  renderCategoriesList();
};

window.openCategoryForm = openCategoryForm;
window.closeCategoryForm = closeCategoryForm;
window.saveCategory = saveCategory;
window.editCategory = editCategory;
window.toggleCategoryStatus = toggleCategoryStatus;
window.deleteCategory = deleteCategory;