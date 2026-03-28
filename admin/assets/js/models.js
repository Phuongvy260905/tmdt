let models = [
  { id: 1, model_name: "iPhone 15 Pro", brand: "Apple", cpu: "A17 Pro", screen: "6.1 OLED", os: "iOS", deleted_at: null },
  { id: 2, model_name: "Galaxy S24", brand: "Samsung", cpu: "Snapdragon 8 Gen 3", screen: "6.2 AMOLED", os: "Android", deleted_at: null }
];

let editingModelId = null;

function renderModels() {
  const table = document.getElementById("modelTable");
  if (!table) return;

  table.innerHTML = models.map(model => `
    <tr class="border-b border-slate-100">
      <td class="py-3">${model.id}</td>
      <td class="py-3 font-medium">${model.model_name}</td>
      <td class="py-3">${model.brand}</td>
      <td class="py-3">${model.cpu}</td>
      <td class="py-3">${model.screen}</td>
      <td class="py-3">${model.os}</td>
      <td class="py-3">
        <span class="${model.deleted_at ? "text-rose-500" : "text-emerald-600"} font-medium">
          ${model.deleted_at ? "Hidden" : "Visible"}
        </span>
      </td>
      <td class="py-3 flex gap-2">
        <button onclick="editModel(${model.id})" class="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200">Edit</button>
        <button onclick="toggleModelDelete(${model.id})" class="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-500">
          ${model.deleted_at ? "Restore" : "Soft Delete"}
        </button>
      </td>
    </tr>
  `).join("");
}

function openModelForm() {
  editingModelId = null;
  document.getElementById("modelFormTitle").textContent = "Add Model";
  document.getElementById("modelName").value = "";
  document.getElementById("modelBrand").value = "";
  document.getElementById("modelCpu").value = "";
  document.getElementById("modelScreen").value = "";
  document.getElementById("modelOs").value = "";
  document.getElementById("modelFormBox").classList.remove("hidden");
}

function closeModelForm() {
  document.getElementById("modelFormBox").classList.add("hidden");
}

function saveModel() {
  const modelName = document.getElementById("modelName").value.trim();
  const brand = document.getElementById("modelBrand").value.trim();
  const cpu = document.getElementById("modelCpu").value.trim();
  const screen = document.getElementById("modelScreen").value.trim();
  const os = document.getElementById("modelOs").value.trim();

  if (!modelName || !brand) {
    alert("Vui lòng nhập đủ tên model và hãng");
    return;
  }

  if (editingModelId) {
    const model = models.find(m => m.id === editingModelId);
    if (!model) return;
    model.model_name = modelName;
    model.brand = brand;
    model.cpu = cpu;
    model.screen = screen;
    model.os = os;
  } else {
    models.push({
      id: models.length ? Math.max(...models.map(m => m.id)) + 1 : 1,
      model_name: modelName,
      brand,
      cpu,
      screen,
      os,
      deleted_at: null
    });
  }

  closeModelForm();
  renderModels();
}

function editModel(id) {
  const model = models.find(m => m.id === id);
  if (!model) return;

  editingModelId = id;
  document.getElementById("modelFormTitle").textContent = "Edit Model";
  document.getElementById("modelName").value = model.model_name;
  document.getElementById("modelBrand").value = model.brand;
  document.getElementById("modelCpu").value = model.cpu;
  document.getElementById("modelScreen").value = model.screen;
  document.getElementById("modelOs").value = model.os;
  document.getElementById("modelFormBox").classList.remove("hidden");
}

function toggleModelDelete(id) {
  const model = models.find(m => m.id === id);
  if (!model) return;
  model.deleted_at = model.deleted_at ? null : new Date().toISOString();
  renderModels();
}

window.renderModels = renderModels;
window.openModelForm = openModelForm;
window.closeModelForm = closeModelForm;
window.saveModel = saveModel;
window.editModel = editModel;
window.toggleModelDelete = toggleModelDelete;