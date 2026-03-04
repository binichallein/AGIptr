# Step 3 Review（模型家族筛选）

## Reviewer Prompt（Code Review 专家）
请审查厂家详情页新增“模型家族”筛选是否满足：
1. 家族归类覆盖 Qwen1 / 1.5 / 2 / 2.5 / 3 / 3.5；
2. 筛选 UI、筛选逻辑、重置逻辑三者一致；
3. 归类字段与渲染字段不冲突，且不会破坏已有筛选；
4. 表格展示与筛选结果一致，排序仍保持原先规则；
5. 没有语法错误或明显回归风险。

## Scope
- `vendor-data.js`
- `detail.js`

## Findings
- 数据层：新增 `inferQwenFamily`，并在模型构建时注入 `family` 字段，已覆盖主要家族版本。
- 交互层：筛选面板新增 `filter-family`，并接入 `applyFilters` 与 `reset` 流程。
- 稳定性：已有时间/类型/参数/MLP/注意力筛选逻辑保留，新增条件与既有条件并列生效。
- 展示层：年份表格新增“模型家族”列，筛选后数据与展示字段一致。
- 验证：`node --check detail.js`、`node --check vendor-data.js` 通过。

## Decision
PASS
