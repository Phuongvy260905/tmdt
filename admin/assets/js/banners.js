let banners = [
  {
    id: 1,
    title: "Sale iPhone 15 Pro Max",
    image_url: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1200&q=80",
    target_url: "#iphone-sale",
    position: "home-top",
    sort_order: 1,
    is_active: true
  },
  {
    id: 2,
    title: "Phụ kiện giảm giá đến 30%",
    image_url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80",
    target_url: "#accessories",
    position: "home-mid",
    sort_order: 2,
    is_active: false
  },
  {
    id: 3,
    title: "Flash Sale cuối tuần",
    image_url: "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=1200&q=80",
    target_url: "#weekend-sale",
    position: "popup",
    sort_order: 3,
    is_active: true
  }
];

let editingBannerId = null;

function getPositionLabel(position) {
  const map = {
    "home-top": "Đầu trang chủ",
    "home-mid": "Giữa trang chủ",
    "home-bottom": "Cuối trang chủ",
    "sidebar-right": "Sidebar phải",
    "popup": "Popup"
  };
  return map[position] || position;
}

function getPositionBadgeClass(position) {
  const map = {
    "home-top": "bg-blue-100 text-blue-700",
    "home-mid": "bg-violet-100 text-violet-700",
    "home-bottom": "bg-cyan-100 text-cyan-700",
    "sidebar-right": "bg-amber-100 text-amber-700",
    "popup": "bg-rose-100 text-rose-700"
  };
  return map[position] || "bg-slate-100 text-slate-700";
}

function renderBanners() {
  const grid = document.getElementById("bannerGrid");
  if (!grid) return;

  grid.innerHTML = banners
    .sort((a, b) => a.sort_order - b.sort_order)
    .map(banner => `
      <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
        <div class="relative h-44 bg-slate-100">
          <img
            src="${banner.image_url || 'https://via.placeholder.com/600x300?text=No+Image'}"
            alt="${banner.title}"
            class="w-full h-full object-cover"
          />
          <div class="absolute top-3 left-3">
            <span class="px-3 py-1 rounded-full text-xs font-semibold ${getPositionBadgeClass(banner.position)}">
              ${getPositionLabel(banner.position)}
            </span>
          </div>
          <div class="absolute top-3 right-3">
            <span class="px-3 py-1 rounded-full text-xs font-semibold ${
              banner.is_active ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
            }">
              ${banner.is_active ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        <div class="p-4">
          <div class="flex items-start justify-between gap-3">
            <div>
              <h3 class="text-lg font-semibold text-slate-800">${banner.title}</h3>
              <p class="text-sm text-slate-500 mt-1">Sort order: ${banner.sort_order}</p>
            </div>
            <span class="text-xs text-slate-400">#${banner.id}</span>
          </div>

          <div class="mt-4 space-y-2 text-sm">
            <div>
              <p class="text-slate-400">Target link</p>
              <p class="text-slate-600 truncate">${banner.target_url || "-"}</p>
            </div>
          </div>

          <div class="mt-5 flex flex-wrap gap-2">
            <button onclick="editBanner(${banner.id})"
              class="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700">
              Edit
            </button>

            <button onclick="toggleBannerStatus(${banner.id})"
              class="px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-900">
              ${banner.is_active ? "Hide" : "Show"}
            </button>

            <button onclick="deleteBanner(${banner.id})"
              class="px-3 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white">
              Delete
            </button>
          </div>
        </div>
      </div>
    `)
    .join("");

  if (window.lucide) lucide.createIcons();
}

function openBannerForm() {
  editingBannerId = null;

  document.getElementById("bannerFormTitle").textContent = "Add Banner";
  document.getElementById("bannerTitle").value = "";
  document.getElementById("bannerImage").value = "";
  document.getElementById("bannerTarget").value = "";
  document.getElementById("bannerPosition").value = "home-top";
  document.getElementById("bannerSort").value = "";
  document.getElementById("bannerActive").value = "true";

  document.getElementById("bannerFormBox").classList.remove("hidden");

  attachBannerUploadEvents();
  updateBannerPreview();
  if (window.lucide) lucide.createIcons();
}

function closeBannerForm() {
  const formBox = document.getElementById("bannerFormBox");
  if (formBox) formBox.classList.add("hidden");
}

function updateBannerPreview() {
  const imageInput = document.getElementById("bannerImage");
  const previewBox = document.getElementById("bannerPreviewBox");
  const previewImage = document.getElementById("bannerPreviewImage");

  if (!imageInput || !previewBox || !previewImage) return;

  const imageUrl = imageInput.value.trim();

  if (imageUrl) {
    previewBox.classList.remove("hidden");
    previewImage.src = imageUrl;
  } else {
    previewBox.classList.add("hidden");
    previewImage.src = "";
  }
}

function handleBannerFile(file) {
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Vui lòng chọn file ảnh hợp lệ.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (event) {
    document.getElementById("bannerImage").value = event.target.result;
    updateBannerPreview();
  };
  reader.readAsDataURL(file);
}

function attachBannerUploadEvents() {
  const dropzone = document.getElementById("bannerDropzone");
  const uploadInput = document.getElementById("bannerUpload");
  const imageInput = document.getElementById("bannerImage");

  if (!dropzone || !uploadInput || !imageInput) return;

  if (dropzone.dataset.bound === "true") return;

  dropzone.addEventListener("click", () => uploadInput.click());

  dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.classList.add("border-blue-500", "bg-blue-50");
  });

  dropzone.addEventListener("dragleave", () => {
    dropzone.classList.remove("border-blue-500", "bg-blue-50");
  });

  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("border-blue-500", "bg-blue-50");
    const file = e.dataTransfer.files[0];
    handleBannerFile(file);
  });

  uploadInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    handleBannerFile(file);
  });

  imageInput.addEventListener("input", updateBannerPreview);

  dropzone.dataset.bound = "true";
}

function saveBanner() {
  const title = document.getElementById("bannerTitle").value.trim();
  const image = document.getElementById("bannerImage").value.trim();
  const target = document.getElementById("bannerTarget").value.trim();
  const position = document.getElementById("bannerPosition").value;
  const sort = Number(document.getElementById("bannerSort").value || 0);
  const active = document.getElementById("bannerActive").value === "true";

  if (!title) {
    alert("Vui lòng nhập tiêu đề banner");
    return;
  }

  if (!image) {
    alert("Vui lòng chọn ảnh hoặc dán link ảnh");
    return;
  }

  if (editingBannerId !== null) {
    const banner = banners.find(b => b.id === editingBannerId);
    if (!banner) return;

    banner.title = title;
    banner.image_url = image;
    banner.target_url = target;
    banner.position = position;
    banner.sort_order = sort;
    banner.is_active = active;
  } else {
    banners.push({
      id: banners.length ? Math.max(...banners.map(b => b.id)) + 1 : 1,
      title,
      image_url: image,
      target_url: target,
      position,
      sort_order: sort,
      is_active: active
    });
  }

  closeBannerForm();
  renderBanners();
}

function editBanner(id) {
  const banner = banners.find(b => b.id === id);
  if (!banner) return;

  editingBannerId = id;

  document.getElementById("bannerFormTitle").textContent = "Edit Banner";
  document.getElementById("bannerTitle").value = banner.title;
  document.getElementById("bannerImage").value = banner.image_url;
  document.getElementById("bannerTarget").value = banner.target_url;
  document.getElementById("bannerPosition").value = banner.position;
  document.getElementById("bannerSort").value = banner.sort_order;
  document.getElementById("bannerActive").value = String(banner.is_active);

  document.getElementById("bannerFormBox").classList.remove("hidden");

  attachBannerUploadEvents();
  updateBannerPreview();
  if (window.lucide) lucide.createIcons();
}

function toggleBannerStatus(id) {
  const banner = banners.find(b => b.id === id);
  if (!banner) return;
  banner.is_active = !banner.is_active;
  renderBanners();
}

function deleteBanner(id) {
  banners = banners.filter(b => b.id !== id);
  renderBanners();
}

window.renderBanners = renderBanners;
window.openBannerForm = openBannerForm;
window.closeBannerForm = closeBannerForm;
window.saveBanner = saveBanner;
window.editBanner = editBanner;
window.toggleBannerStatus = toggleBannerStatus;
window.deleteBanner = deleteBanner;
window.updateBannerPreview = updateBannerPreview;