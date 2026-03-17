let settingsData = {
  hotline: "9999 9999",
  logo: "https://example.com/logo.png",
  email: "support@techshop.vn",
  address: "Chung cư Đông Hải, Quận 12, TP.HCM",
  google_map: `<iframe src="https://www.google.com/maps?q=Chung%20c%C6%B0%20%C4%90%C3%B4ng%20H%E1%BA%A3i%20Qu%E1%BA%ADn%2012%20TP.HCM&output=embed" width="100%" height="300" style="border:0;"></iframe>`
};
function renderSettings() {
  const hotline = document.getElementById("settingHotline");
  if (!hotline) return;

  document.getElementById("settingHotline").value = settingsData.hotline;
  document.getElementById("settingLogo").value = settingsData.logo;
  document.getElementById("settingEmail").value = settingsData.email;
  document.getElementById("settingAddress").value = settingsData.address;
  document.getElementById("settingMap").value = settingsData.google_map;
  document.getElementById("mapPreview").innerHTML = settingsData.google_map;
  document.getElementById("settingAddress").addEventListener("input", updateMapPreview);
}

function saveSettings() {}
  settingsData.google_map = `<iframe 
    src="https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed" 
    width="100%" height="300" style="border:0;">
  </iframe>`;

  renderSettings();
  alert("Đã lưu settings");
function updateMapPreview() {
  const address = document.getElementById("settingAddress").value.trim();

  if (!address) return;

  const encoded = encodeURIComponent(address);

  const iframe = `<iframe 
    src="https://www.google.com/maps?q=${encoded}&output=embed" 
    width="100%" height="300" style="border:0;">
  </iframe>`;

  document.getElementById("mapPreview").innerHTML = iframe;
}

window.renderSettings = renderSettings;
window.saveSettings = saveSettings;