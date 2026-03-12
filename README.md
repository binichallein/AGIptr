# AGIptr

AGIptr 是一个用于展示「每日更新最新型大模型」的静态网站 Demo，包含：

- 首页：大号艺术字 Logo + 5×5 厂商 Logo 矩阵 + Hover 上浮与名称提示
- 厂家详情页（现支持全部 25 家厂商）：按 2022-2026 年倒序展示非衍生模型时间线，支持按时间/类型/家族/参数/MLP/注意力结构筛选，并排除量化与 Flash 版本
- 模型详情页：点击厂家页中的主模型可进入，查看主模型参数与衍生版本列表；对 Qwen3.5 这类大版本额外展示官方来源的架构细节与架构图
- 厂商收录策略：保留有代表性模型的海外厂商，并完整收录主流中国大模型厂商
- Logo 来源：优先使用各厂商官网官方 SVG/PNG，并本地化到 `assets/logos/`
- 数据运行时来源：页面当前统一读取 `data/generated/site-data.js`

## 本地运行

在项目目录启动任意静态服务器即可，例如：

```bash
python3 -m http.server 8080
```

然后访问：`http://localhost:8080/index.html`

## 数据管线

当前网站运行时已经切到单一生成数据源：

- `data/canonical/site-data.json`：canonical truth source
- `data/generated/site-data.js`：前端运行时加载的唯一数据文件

从 legacy 数据重建 generated 文件：

```bash
node scripts/import-legacy-data.mjs
node scripts/generate-site-data.mjs
node scripts/verify-site-data.mjs
```

运行测试：

```bash
node --test tests/site-data.test.mjs
```

注意：

- `data/generated/*` 不要手工改
- 当前 canonical 数据仍然是 `legacy-import` 状态，尚未完成官方来源 URL 全量校准
