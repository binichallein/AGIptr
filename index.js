function formatDate(date) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
}

function pickLatestModels(models) {
  const latest = new Map();
  models.forEach((model) => {
    const current = latest.get(model.vendorId);
    if (!current) {
      latest.set(model.vendorId, model);
      return;
    }
    const nextDate = new Date(model.releaseDate).getTime();
    const currentDate = new Date(current.releaseDate).getTime();
    if (!Number.isNaN(nextDate) && !Number.isNaN(currentDate) && nextDate > currentDate) {
      latest.set(model.vendorId, model);
    }
  });
  return latest;
}

function createVendorCard(vendor, latestModel) {
  const card = document.createElement("a");
  card.className = "vendor-card";
  card.href = latestModel ? `./model.html?id=${encodeURIComponent(latestModel.id)}` : `./model.html?vendor=${encodeURIComponent(vendor.id)}`;
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

  const latestModels = pickLatestModels(window.AGIptrModels || []);
  (window.AGIptrVendors || []).forEach((vendor) => {
    const card = createVendorCard(vendor, latestModels.get(vendor.id));
    grid.appendChild(card);
  });
}

function renderTodayDate() {
  const dateNode = document.getElementById("today-date");
  if (dateNode) {
    dateNode.textContent = formatDate(new Date());
  }
}

renderTodayDate();
renderVendorGrid();
