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

function readRequestedModelId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("model") || params.get("id");
}

function architectureChip(model) {
  const architecture = model.architecture || "未公开";
  const lowerArchitecture = architecture.toLowerCase();
  let chipClass = "neutral";
  if (lowerArchitecture.includes("moe")) chipClass = "moe";
  if (lowerArchitecture.includes("dense")) chipClass = "dense";
  return `<span class="chip ${chipClass}">${escapeHtml(architecture)}</span>`;
}

function createSelectOptions(select, values, allLabel) {
  const options = [
    `<option value="all">${escapeHtml(allLabel)}</option>`,
    ...values.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`)
  ];
  select.innerHTML = options.join("");
}

function updateBackLink(vendorId, isModelDetail) {
  const backLink = document.querySelector(".back-link");
  if (!backLink) return;
  if (isModelDetail) {
    backLink.href = `./model.html?vendor=${encodeURIComponent(vendorId)}`;
    backLink.textContent = "← 返回厂家详情";
    return;
  }
  backLink.href = "./index.html";
  backLink.textContent = "← 返回首页";
}

const ARCHITECTURE_LIGHTBOX_ID = "architecture-lightbox";

function closeArchitectureLightbox() {
  const lightbox = document.getElementById(ARCHITECTURE_LIGHTBOX_ID);
  if (!lightbox) return;
  lightbox.classList.remove("is-open");
  document.body.classList.remove("lightbox-open");
}

function ensureArchitectureLightbox() {
  const existing = document.getElementById(ARCHITECTURE_LIGHTBOX_ID);
  if (existing) return existing;

  const lightbox = document.createElement("div");
  lightbox.id = ARCHITECTURE_LIGHTBOX_ID;
  lightbox.className = "architecture-lightbox";
  lightbox.innerHTML = `
    <div class="architecture-lightbox-backdrop" data-lightbox-close="true"></div>
    <figure class="architecture-lightbox-panel" role="dialog" aria-modal="true" aria-label="模型架构图放大预览">
      <button class="architecture-lightbox-close" type="button" aria-label="关闭预览">×</button>
      <img class="architecture-lightbox-image" alt="" />
      <figcaption class="architecture-lightbox-caption"></figcaption>
    </figure>
  `;
  document.body.appendChild(lightbox);

  const closeButton = lightbox.querySelector(".architecture-lightbox-close");
  if (closeButton) {
    closeButton.addEventListener("click", closeArchitectureLightbox);
  }
  lightbox.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.dataset.lightboxClose === "true") {
      closeArchitectureLightbox();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeArchitectureLightbox();
    }
  });

  return lightbox;
}

function openArchitectureLightbox(image, alt, caption) {
  if (!image) return;
  const lightbox = ensureArchitectureLightbox();
  const imageNode = lightbox.querySelector(".architecture-lightbox-image");
  const captionNode = lightbox.querySelector(".architecture-lightbox-caption");
  if (!(imageNode instanceof HTMLImageElement) || !(captionNode instanceof HTMLElement)) return;

  imageNode.src = image;
  imageNode.alt = alt || "模型架构图";
  captionNode.textContent = caption || "";
  lightbox.classList.add("is-open");
  document.body.classList.add("lightbox-open");
}

function bindArchitectureZoom(container) {
  if (!(container instanceof HTMLElement)) return;
  const triggers = container.querySelectorAll(".major-version-zoom-trigger");
  triggers.forEach((trigger) => {
    if (!(trigger instanceof HTMLButtonElement)) return;
    if (trigger.dataset.zoomBound === "true") return;
    trigger.dataset.zoomBound = "true";
    trigger.addEventListener("click", () => {
      openArchitectureLightbox(
        trigger.dataset.zoomImage || "",
        trigger.dataset.zoomAlt || "",
        trigger.dataset.zoomCaption || ""
      );
    });
  });
}

function renderYearSection(year, models, vendorId) {
  if (!models.length) {
    return `
      <section class="vendor-year-block">
        <h2 class="vendor-year-title">${year}</h2>
        <p class="vendor-year-empty">暂无公开发布模型</p>
      </section>
    `;
  }

  const rows = models
    .map((model) => `
      <tr>
        <td>${escapeHtml(formatDateLabel(model.releaseDate))}</td>
        <td><a class="model-link" href="./model.html?vendor=${encodeURIComponent(vendorId)}&model=${encodeURIComponent(model.id)}">${escapeHtml(model.name)}</a></td>
        <td>${escapeHtml(model.id)}</td>
        <td>${escapeHtml(model.params || "未公开")}</td>
        <td>${architectureChip(model)}</td>
        <td>${escapeHtml(model.type || "通用")}</td>
        <td>${escapeHtml(model.mlpStructure || "未公开")}</td>
        <td>${escapeHtml(model.attentionStructure || "未公开")}</td>
      </tr>
    `)
    .join("");

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
              <th>模型类型</th>
              <th>MLP 结构</th>
              <th>注意力结构</th>
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
  updateBackLink(vendorId, false);
  const vendor = findVendorById(vendorId);
  const vendorName = vendor ? vendor.name : vendorId;
  root.innerHTML = `<p class="empty-state">${escapeHtml(vendorName)} 详情页待完善，当前先支持 Qwen 厂家详情（vendor=alibaba）。</p>`;
}

function findModelInVendor(vendorDetail, modelId) {
  const allModels = vendorDetail.allModels || vendorDetail.models || [];
  return allModels.find((item) => item.id === modelId) || null;
}

function findBaseModelForTarget(targetModel, vendorDetail) {
  const coreModels = vendorDetail.models || [];
  if (!targetModel) return null;
  if (!targetModel.isDerived) return targetModel;

  const candidates = coreModels.filter((model) => targetModel.name.startsWith(`${model.name}-`) || targetModel.name === model.name);
  if (!candidates.length) return targetModel;
  candidates.sort((a, b) => b.name.length - a.name.length);
  return candidates[0];
}

function findDerivedModels(baseModel, vendorDetail) {
  if (!baseModel) return [];
  const allModels = vendorDetail.allModels || [];
  return allModels
    .filter((model) => model.id !== baseModel.id && model.name.startsWith(`${baseModel.name}-`))
    .sort((a, b) => {
      const dateDiff = new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
      if (dateDiff !== 0) return dateDiff;
      return b.name.localeCompare(a.name, "zh-CN");
    });
}

function majorVersionPayload(baseModel, vendorDetail) {
  const majorKey = baseModel?.majorVersionKey;
  if (!majorKey) return null;
  const detail = vendorDetail?.majorVersionDetails?.[majorKey];
  if (!detail) return null;

  const metricsMap = detail.metricsByModelId || {};
  const metrics = metricsMap[baseModel.id] || null;
  return {
    detail,
    metrics
  };
}

function renderMajorVersionSection(baseModel, vendorDetail) {
  const payload = majorVersionPayload(baseModel, vendorDetail);
  if (!payload) return "";

  const { detail, metrics } = payload;
  const hfUrl = `https://huggingface.co/${baseModel.id}`;
  const metricItems = metrics
    ? [
        ["模型类型", metrics.modelType],
        ["参数规模", metrics.parameters],
        ["层数", metrics.layers],
        ["Hidden Layout", metrics.hiddenLayout],
        ["线性注意力头", metrics.linearHeads],
        ["注意力头", metrics.attentionHeads],
        ["专家配置", metrics.experts],
        ["上下文长度", metrics.context]
      ]
        .filter(([, value]) => value)
        .map(([label, value]) => `
          <article class="major-metric-item">
            <span class="major-metric-label">${escapeHtml(label)}</span>
            <p class="major-metric-value">${escapeHtml(value)}</p>
          </article>
        `)
        .join("")
    : `<p class="vendor-year-empty">当前模型暂无额外结构参数。</p>`;

  return `
    <section class="major-version-panel">
      <h2 class="vendor-year-title">${escapeHtml(detail.title || `${detail.version} 大版本信息`)}</h2>
      <p class="major-version-summary">${escapeHtml(detail.summary || "")}</p>
      <div class="major-version-layout">
        <figure class="major-version-figure">
          <button
            class="major-version-zoom-trigger"
            type="button"
            data-zoom-image="${escapeHtml(detail.architectureDiagram || "")}"
            data-zoom-alt="${escapeHtml(detail.version || "模型")} 架构图"
            data-zoom-caption="${escapeHtml(detail.architectureCaption || "")}"
          >
            <img src="${escapeHtml(detail.architectureDiagram || "")}" alt="${escapeHtml(detail.version || "模型")} 架构图" />
            <span class="major-version-zoom-hint">点击放大</span>
          </button>
          <figcaption>${escapeHtml(detail.architectureCaption || "")}</figcaption>
        </figure>
        <div class="major-version-metrics">
          ${metricItems}
        </div>
      </div>
      <div class="major-version-links">
        <a class="major-link" href="${escapeHtml(detail.blogUrl || "#")}" target="_blank" rel="noreferrer noopener">官方博客</a>
        <a class="major-link" href="${escapeHtml(hfUrl)}" target="_blank" rel="noreferrer noopener">当前模型卡</a>
        <a class="major-link" href="${escapeHtml(detail.docsUrl || hfUrl)}" target="_blank" rel="noreferrer noopener">大版本文档</a>
      </div>
      <p class="major-version-source">${escapeHtml(detail.sourceNote || "")}</p>
    </section>
  `;
}

function renderModelDetail(vendorId, vendorDetail, modelId) {
  const root = document.getElementById("model-detail");
  if (!root) return;

  updateBackLink(vendorId, true);
  const targetModel = findModelInVendor(vendorDetail, modelId);
  if (!targetModel) {
    root.innerHTML = `<p class="empty-state">未找到该模型，请返回厂家详情重新选择。</p>`;
    return;
  }

  const baseModel = findBaseModelForTarget(targetModel, vendorDetail);
  const derivedModels = findDerivedModels(baseModel, vendorDetail);
  const selectedIsDerived = targetModel.id !== baseModel.id;

  const derivedRows = derivedModels
    .map((model) => `
      <tr class="${model.id === targetModel.id ? "is-current" : ""}">
        <td>${escapeHtml(formatDateLabel(model.releaseDate))}</td>
        <td><a class="model-link" href="./model.html?vendor=${encodeURIComponent(vendorId)}&model=${encodeURIComponent(model.id)}">${escapeHtml(model.name)}</a></td>
        <td>${escapeHtml(model.id)}</td>
        <td>${escapeHtml(model.params || "未公开")}</td>
        <td>${architectureChip(model)}</td>
      </tr>
    `)
    .join("");

  const majorVersionSection = renderMajorVersionSection(baseModel, vendorDetail);

  root.innerHTML = `
    <section class="model-detail-panel">
      <h1 class="detail-title">${escapeHtml(baseModel.name)} 模型详情</h1>
      <p class="detail-id">当前查看：${escapeHtml(targetModel.name)}${selectedIsDerived ? "（衍生版本）" : "（主模型）"}</p>
      <div class="model-detail-grid">
        <article class="model-detail-item">
          <span class="model-detail-label">模型编号 ID</span>
          <p class="model-detail-value">${escapeHtml(baseModel.id)}</p>
        </article>
        <article class="model-detail-item">
          <span class="model-detail-label">发布日期</span>
          <p class="model-detail-value">${escapeHtml(formatDateLabel(baseModel.releaseDate))}</p>
        </article>
        <article class="model-detail-item">
          <span class="model-detail-label">模型参数</span>
          <p class="model-detail-value">${escapeHtml(baseModel.params || "未公开")}</p>
        </article>
        <article class="model-detail-item">
          <span class="model-detail-label">模型类型</span>
          <p class="model-detail-value">${escapeHtml(baseModel.type || "通用")}</p>
        </article>
        <article class="model-detail-item">
          <span class="model-detail-label">MLP 结构</span>
          <p class="model-detail-value">${escapeHtml(baseModel.mlpStructure || "未公开")}</p>
        </article>
        <article class="model-detail-item">
          <span class="model-detail-label">注意力结构</span>
          <p class="model-detail-value">${escapeHtml(baseModel.attentionStructure || "未公开")}</p>
        </article>
      </div>
    </section>
    ${majorVersionSection}
    <section class="model-derived-panel">
      <h2 class="vendor-year-title">衍生模型版本 · ${derivedModels.length} 个</h2>
      ${derivedModels.length
        ? `
          <div class="vendor-table-wrap">
            <table class="vendor-table">
              <thead>
                <tr>
                  <th>发布日期</th>
                  <th>模型名称</th>
                  <th>编号 ID</th>
                  <th>参数量</th>
                  <th>架构</th>
                </tr>
              </thead>
              <tbody>${derivedRows}</tbody>
            </table>
          </div>
        `
        : '<p class="vendor-year-empty">暂无衍生模型版本。</p>'}
    </section>
  `;
  bindArchitectureZoom(root);
}

function renderVendorDetail(vendorId, vendorDetail) {
  const root = document.getElementById("model-detail");
  if (!root) return;
  updateBackLink(vendorId, false);

  const vendorMeta = findVendorById(vendorId);
  const headerName = vendorDetail.name || (vendorMeta ? vendorMeta.name : vendorId);
  const headerLogo = vendorDetail.logo || (vendorMeta ? vendorMeta.logo : "");
  const years = Array.isArray(vendorDetail.years) && vendorDetail.years.length
    ? [...vendorDetail.years]
    : [2022, 2023, 2024, 2025, 2026];
  const yearsDesc = [...years].sort((a, b) => b - a);

  const models = (vendorDetail.models || [])
    .filter((model) => {
      const parsedYear = Number(model.releaseDate?.slice(0, 4));
      return Number.isInteger(parsedYear) && parsedYear >= 2022 && parsedYear <= 2026;
    })
    .sort((a, b) => {
      const dateDiff = new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
      if (dateDiff !== 0) return dateDiff;
      return b.name.localeCompare(a.name, "zh-CN");
    });

  const totalModels = models.length;
  const excludes = (vendorDetail.excludes || []).map((item) => escapeHtml(item)).join("；");

  root.innerHTML = `
    <header class="vendor-detail-header">
      <img class="vendor-detail-logo" src="${escapeHtml(headerLogo)}" alt="${escapeHtml(headerName)} logo" />
      <div class="vendor-detail-copy">
        <h1 class="detail-title">${escapeHtml(headerName)} 厂家详情</h1>
        <p class="detail-id">统计区间：2022 - 2026 · 当前收录 ${totalModels} 个非衍生模型</p>
        <p class="vendor-detail-tip">已排除：${excludes || "无"}</p>
        <p class="vendor-detail-source">数据来源：${escapeHtml(vendorDetail.source || "待补充")}</p>
      </div>
    </header>
    <section class="vendor-filter-panel">
      <div class="vendor-filter-item">
        <label for="filter-year">时间</label>
        <select id="filter-year"></select>
      </div>
      <div class="vendor-filter-item">
        <label for="filter-type">模型类型</label>
        <select id="filter-type"></select>
      </div>
      <div class="vendor-filter-item">
        <label for="filter-param">模型参数</label>
        <select id="filter-param"></select>
      </div>
      <div class="vendor-filter-item">
        <label for="filter-mlp">MLP 结构</label>
        <select id="filter-mlp"></select>
      </div>
      <div class="vendor-filter-item">
        <label for="filter-attention">注意力结构</label>
        <select id="filter-attention"></select>
      </div>
      <button class="vendor-filter-reset" id="filter-reset" type="button">重置筛选</button>
    </section>
    <p class="vendor-filter-summary" id="vendor-filter-summary"></p>
    <div class="vendor-timeline" id="vendor-timeline"></div>
  `;

  const yearSelect = document.getElementById("filter-year");
  const typeSelect = document.getElementById("filter-type");
  const paramSelect = document.getElementById("filter-param");
  const mlpSelect = document.getElementById("filter-mlp");
  const attentionSelect = document.getElementById("filter-attention");
  const resetButton = document.getElementById("filter-reset");
  const timelineNode = document.getElementById("vendor-timeline");
  const summaryNode = document.getElementById("vendor-filter-summary");

  if (
    !yearSelect
    || !typeSelect
    || !paramSelect
    || !mlpSelect
    || !attentionSelect
    || !resetButton
    || !timelineNode
    || !summaryNode
  ) {
    return;
  }

  createSelectOptions(yearSelect, yearsDesc.map(String), "全部时间");

  const typeOptions = [...new Set(models.map((model) => model.type || "通用"))].sort((a, b) => a.localeCompare(b, "zh-CN"));
  createSelectOptions(typeSelect, typeOptions, "全部类型");

  const paramPriority = ["<1B", "1B-10B", "10B-50B", "50B-100B", "100B+", "未公开"];
  const paramOptions = [...new Set(models.map((model) => model.paramTag || "未公开"))]
    .sort((left, right) => paramPriority.indexOf(left) - paramPriority.indexOf(right));
  createSelectOptions(paramSelect, paramOptions, "全部参数");

  const mlpOptions = [...new Set(models.map((model) => model.mlpStructure || "未公开"))].sort((a, b) => a.localeCompare(b, "zh-CN"));
  createSelectOptions(mlpSelect, mlpOptions, "全部 MLP 结构");

  const attentionOptions = [...new Set(models.map((model) => model.attentionStructure || "未公开"))].sort((a, b) => a.localeCompare(b, "zh-CN"));
  createSelectOptions(attentionSelect, attentionOptions, "全部注意力结构");

  function applyFilters() {
    const selectedYear = yearSelect.value;
    const selectedType = typeSelect.value;
    const selectedParam = paramSelect.value;
    const selectedMlp = mlpSelect.value;
    const selectedAttention = attentionSelect.value;

    const filteredModels = models.filter((model) => {
      const year = model.releaseDate.slice(0, 4);
      if (selectedYear !== "all" && year !== selectedYear) return false;
      if (selectedType !== "all" && (model.type || "通用") !== selectedType) return false;
      if (selectedParam !== "all" && (model.paramTag || "未公开") !== selectedParam) return false;
      if (selectedMlp !== "all" && (model.mlpStructure || "未公开") !== selectedMlp) return false;
      if (selectedAttention !== "all" && (model.attentionStructure || "未公开") !== selectedAttention) return false;
      return true;
    });

    const targetYears = selectedYear === "all" ? yearsDesc : [Number(selectedYear)];
    const modelMap = new Map(targetYears.map((year) => [year, []]));
    filteredModels.forEach((model) => {
      const year = Number(model.releaseDate.slice(0, 4));
      if (!modelMap.has(year)) return;
      modelMap.get(year).push(model);
    });

    targetYears.forEach((year) => {
      modelMap.get(year).sort((a, b) => {
        const dateDiff = new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
        if (dateDiff !== 0) return dateDiff;
        return b.name.localeCompare(a.name, "zh-CN");
      });
    });

    summaryNode.textContent = `筛选结果：${filteredModels.length} / ${totalModels} 个模型`;
    timelineNode.innerHTML = targetYears.map((year) => renderYearSection(year, modelMap.get(year), vendorId)).join("");
  }

  [yearSelect, typeSelect, paramSelect, mlpSelect, attentionSelect].forEach((selectNode) => {
    selectNode.addEventListener("change", applyFilters);
  });

  resetButton.addEventListener("click", () => {
    yearSelect.value = "all";
    typeSelect.value = "all";
    paramSelect.value = "all";
    mlpSelect.value = "all";
    attentionSelect.value = "all";
    applyFilters();
  });

  applyFilters();
}

function renderDetailPage() {
  const vendorId = readRequestedVendorId();
  const modelId = readRequestedModelId();
  const vendorDetails = window.AGIptrVendorDetails || {};
  const vendorDetail = vendorDetails[vendorId];
  if (!vendorDetail) {
    renderUnsupportedVendor(vendorId);
    return;
  }
  if (modelId) {
    renderModelDetail(vendorId, vendorDetail, modelId);
    return;
  }
  renderVendorDetail(vendorId, vendorDetail);
}

renderDetailPage();
