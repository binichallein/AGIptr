# AGIptr

AGIptr 是一个用于展示「每日更新最新型大模型」的静态网站 Demo，包含：

- 首页：大号艺术字 Logo + 5×5 厂商 Logo 矩阵 + Hover 上浮与名称提示
- 厂家详情页（先支持 Qwen）：按 2022-2026 年展示模型时间线，含名称、编号、参数量、Dense/MoE，并排除量化与 Flash 版本
- 厂商收录策略：保留有代表性模型的海外厂商，并完整收录主流中国大模型厂商
- Logo 来源：优先使用各厂商官网官方 SVG/PNG，并本地化到 `assets/logos/`

## 本地运行

在项目目录启动任意静态服务器即可，例如：

```bash
python3 -m http.server 8080
```

然后访问：`http://localhost:8080/index.html`
