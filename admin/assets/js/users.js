const users = [
  { id: 1, name: "Admin", email: "admin@gmail.com", role: "Admin", is_active: true },
  { id: 2, name: "User A", email: "a@gmail.com", role: "Customer", is_active: true },
  { id: 3, name: "User B", email: "b@gmail.com", role: "Customer", is_active: false }
];

function renderUsers() {
  const table = document.getElementById("userTable");
  if (!table) return;

  table.innerHTML = users.map(user => `
    <tr class="border-b">
      <td>${user.id}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>
        <select onchange="changeRole(${user.id}, this.value)">
          <option ${user.role === "Admin" ? "selected" : ""}>Admin</option>
          <option ${user.role === "Customer" ? "selected" : ""}>Customer</option>
        </select>
      </td>
      <td>
        <span class="${user.is_active ? "text-green-500" : "text-red-500"}">
          ${user.is_active ? "Active" : "Locked"}
        </span>
      </td>
      <td>
        <button onclick="toggleUser(${user.id})" class="bg-yellow-400 px-2 py-1 rounded">
          ${user.is_active ? "Khóa" : "Mở"}
        </button>
      </td>
    </tr>
  `).join("");
}

function toggleUser(id) {
  const user = users.find(u => u.id === id);
  if (!user) return;
  user.is_active = !user.is_active;
  renderUsers();
}

function changeRole(id, role) {
  const user = users.find(u => u.id === id);
  if (!user) return;
  user.role = role;
  renderUsers();
}

window.renderUsers = renderUsers;
window.toggleUser = toggleUser;
window.changeRole = changeRole; 