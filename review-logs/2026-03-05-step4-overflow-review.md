# Step 4 Review（年份卡片溢出修复）

## Reviewer Prompt（Code Review 专家）
请审查厂家详情页时间卡中的表格区域是否已修复“超出白色背景方框”的问题，重点检查：
1. 年份卡片容器是否对内部内容进行边界约束；
2. 表格滚动容器是否在小屏和窄宽度下仍保持在卡片内部；
3. 长模型名/长编号是否会导致横向撑破布局；
4. 样式修改是否影响其它详情模块。

## Scope
- `styles.css`

## Findings
- `vendor-year-block` 新增 `overflow: hidden`，卡片边界得到明确约束。
- `vendor-table-wrap` 新增 `width/max-width` 与圆角边框，横向滚动区域被包裹在卡片内。
- `vendor-table` 调整为 `width: max(1240px, 100%)`，与滚动容器配合避免外溢。
- 对“模型名称/编号”列增加换行与断词规则，降低长字符串撑破风险。
- 该改动仅作用于厂家时间卡表格相关选择器，未触及模型详情卡片主样式。

## Decision
PASS
