function formatDate(date) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
}

function readSiteData() {
  return window.AGIptrSiteData || {
    metadata: {},
    vendors: [],
    latestPrimaryModels: {}
  };
}

function createVendorCard(vendor, latestModel) {
  const card = document.createElement("a");
  card.className = "vendor-card";
  card.href = `./model.html?vendor=${encodeURIComponent(vendor.id)}`;
  card.setAttribute("aria-label", `${vendor.name} ${latestModel ? `· ${latestModel.name}` : ""}`);

  const logo = document.createElement("img");
  logo.className = "vendor-logo";
  logo.src = vendor.logo;
  logo.alt = `${vendor.name} logo`;

  const fallback = document.createElement("span");
  fallback.className = "vendor-initial";
  fallback.textContent = vendor.fallback;

  const name = document.createElement("span");
  name.className = "vendor-name";
  name.textContent = latestModel ? `${vendor.name} · ${latestModel.name}` : vendor.name;

  logo.addEventListener("error", () => {
    card.classList.add("logo-fallback");
  });

  card.appendChild(logo);
  card.appendChild(fallback);
  card.appendChild(name);
  return card;
}

function renderVendorGrid() {
  const grid = document.getElementById("vendor-grid");
  if (!grid) return;

  const siteData = readSiteData();
  (siteData.vendors || []).forEach((vendor) => {
    const card = createVendorCard(vendor, siteData.latestPrimaryModels?.[vendor.id] || null);
    grid.appendChild(card);
  });
}

function renderTodayDate() {
  const dateNode = document.getElementById("today-date");
  if (dateNode) {
    const generatedAt = readSiteData().metadata?.generatedAt;
    dateNode.textContent = generatedAt ? formatDate(new Date(generatedAt)) : "待生成";
  }
}

renderTodayDate();
renderVendorGrid();
