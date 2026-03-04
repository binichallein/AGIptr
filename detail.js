function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatDateLabel(rawDate) {
  const parsed = new Date(rawDate);
  if (Number.isNaN(parsed.getTime())) return rawDate || "待更新";
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(parsed);
}

function findVendorById(vendorId) {
  return (window.AGIptrVendors || []).find((item) => item.id === vendorId) || null;
}

function readRequestedVendorId() {
  const params = new URLSearchParams(window.location.search);
  const vendorId = params.get("vendor");
  if (vendorId) return vendorId;

  const modelId = params.get("id");
  if (!modelId) return "alibaba";
  const model = (window.AGIptrModels || []).find((item) => item.id === modelId);
  return model ? model.vendorId : "alibaba";
}

function architectureChip(model) {
  const architecture = model.architecture || "未公开";
  const lowerArchitecture = architecture.toLowerCase();
  let chipClass = "neutral";
  if (lowerArchitecture.includes("moe")) chipClass = "moe";
  if (lowerArchitecture.includes("dense")) chipClass = "dense";
  return `<span class="chip ${chipClass}">${escapeHtml(architecture)}</span>`;
}

function renderYearSection(year, models) {
  if (!models.length) {
    return `
      <section class="vendor-year-block">
        <h2 class="vendor-year-title">${year}</h2>
        <p class="vendor-year-empty">暂无公开发布模型</p>
      </section>
    `;
  }

  const rows = models.map((model) => `
    <tr>
      <td>${escapeHtml(formatDateLabel(model.releaseDate))}</td>
      <td>${escapeHtml(model.name)}</td>
      <td>${escapeHtml(model.id)}</td>
      <td>${escapeHtml(model.params || "未公开")}</td>
      <td>${architectureChip(model)}</td>
      <td>${escapeHtml(model.type || "通用")}</td>
    </tr>
  `).join("");

  return `
    <section class="vendor-year-block">
      <h2 class="vendor-year-title">${year} · ${models.length} 个模型</h2>
      <div class="vendor-table-wrap">
        <table class="vendor-table">
          <thead>
            <tr>
              <th>发布日期</th>
              <th>模型名称</th>
              <th>编号 ID</th>
              <th>参数量</th>
              <th>架构</th>
              <th>类型</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </section>
  `;
}

function renderUnsupportedVendor(vendorId) {
  const root = document.getElementById("model-detail");
  if (!root) return;
  const vendor = findVendorById(vendorId);
  const vendorName = vendor ? vendor.name : vendorId;
  root.innerHTML = `<p class="empty-state">${escapeHtml(vendorName)} 详情页待完善，当前先支持 Qwen 厂家详情（vendor=alibaba）。</p>`;
}

function renderVendorDetail(vendorId, vendorDetail) {
  const root = document.getElementById("model-detail");
  if (!root) return;

  const vendorMeta = findVendorById(vendorId);
  const headerName = vendorDetail.name || (vendorMeta ? vendorMeta.name : vendorId);
  const headerLogo = vendorDetail.logo || (vendorMeta ? vendorMeta.logo : "");
  const years = Array.isArray(vendorDetail.years) && vendorDetail.years.length
    ? vendorDetail.years
    : [2022, 2023, 2024, 2025, 2026];

  const validModels = (vendorDetail.models || []).filter((model) => {
    const parsedYear = Number(model.releaseDate?.slice(0, 4));
    return Number.isInteger(parsedYear) && parsedYear >= 2022 && parsedYear <= 2026;
  });

  const modelsByYear = new Map(years.map((year) => [year, []]));
  validModels.forEach((model) => {
    const year = Number(model.releaseDate.slice(0, 4));
    if (!modelsByYear.has(year)) return;
    modelsByYear.get(year).push(model);
  });

  years.forEach((year) => {
    modelsByYear.get(year).sort((a, b) => {
      const dateDiff = new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
      if (dateDiff !== 0) return dateDiff;
      return a.name.localeCompare(b.name, "zh-CN");
    });
  });

  const totalModels = years.reduce((sum, year) => sum + modelsByYear.get(year).length, 0);
  const excludes = (vendorDetail.excludes || []).map((item) => escapeHtml(item)).join("；");

  root.innerHTML = `
    <header class="vendor-detail-header">
      <img class="vendor-detail-logo" src="${escapeHtml(headerLogo)}" alt="${escapeHtml(headerName)} logo" />
      <div class="vendor-detail-copy">
        <h1 class="detail-title">${escapeHtml(headerName)} 厂家详情</h1>
        <p class="detail-id">统计区间：2022 - 2026 · 当前收录 ${totalModels} 个模型</p>
        <p class="vendor-detail-tip">已排除：${excludes || "无"}</p>
        <p class="vendor-detail-source">数据来源：${escapeHtml(vendorDetail.source || "待补充")}</p>
      </div>
    </header>
    <div class="vendor-timeline">
      ${years.map((year) => renderYearSection(year, modelsByYear.get(year))).join("")}
    </div>
  `;
}

function renderDetailPage() {
  const vendorId = readRequestedVendorId();
  const vendorDetails = window.AGIptrVendorDetails || {};
  const vendorDetail = vendorDetails[vendorId];
  if (!vendorDetail) {
    renderUnsupportedVendor(vendorId);
    return;
  }
  renderVendorDetail(vendorId, vendorDetail);
}

renderDetailPage();
