function formatDateLabel(rawDate) {
  const parsed = new Date(rawDate);
  if (Number.isNaN(parsed.getTime())) {
    return rawDate || "待更新";
  }
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(parsed);
}

function findModel() {
  const params = new URLSearchParams(window.location.search);
  const modelId = params.get("id");
  const vendorId = params.get("vendor");
  const models = window.AGIptrModels || [];

  if (modelId) {
    return models.find((item) => item.id === modelId);
  }

  if (!vendorId) {
    return null;
  }

  const vendorModels = models
    .filter((item) => item.vendorId === vendorId)
    .sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());

  return vendorModels[0] || null;
}

function vendorNameById(vendorId) {
  const vendor = (window.AGIptrVendors || []).find((item) => item.id === vendorId);
  return vendor ? vendor.name : "未知厂商";
}

function detailItem(label, value) {
  return `
    <article class="detail-item">
      <span class="detail-item-label">${label}</span>
      <p class="detail-item-value">${value}</p>
    </article>
  `;
}

function renderModelDetail(model) {
  const root = document.getElementById("model-detail");
  if (!root) return;

  if (!model) {
    root.innerHTML = `<p class="empty-state">未找到模型信息，请从首页重新进入。</p>`;
    return;
  }

  const architectureClass = model.architecture.toLowerCase().includes("moe") ? "moe" : "dense";
  const architectureView = `<span class="chip ${architectureClass}">${model.architecture}</span>`;

  root.innerHTML = `
    <h1 class="detail-title">${model.name}</h1>
    <p class="detail-id">编号 ID：${model.id}</p>
    <div class="detail-grid">
      ${detailItem("厂商", vendorNameById(model.vendorId))}
      ${detailItem("参数规模", model.params)}
      ${detailItem("架构类型", architectureView)}
      ${detailItem("上下文长度", model.contextWindow)}
      ${detailItem("发布日期", formatDateLabel(model.releaseDate))}
      ${detailItem("简介", model.summary)}
    </div>
  `;
}

renderModelDetail(findModel());
