# ResearchVault 公开研究路线同步规范

## 目标

将 ResearchVault 中**明确标记为可公开**的研究路线，同步为博客仓库的 `data/research-trail.ts`。博客页面据此展示当前阶段、完成进度、每阶段的最后更新日期和公开产出。

源知识库路径：

```text
C:\Users\29849\Documents\ResearchVault
```

目标博客仓库：

```text
D:\29849\personal-research-wiki
```

## 安全边界

同步 Agent **只能读取指定的公开路线源文件**，不得递归扫描、索引、上传或复制整个 Vault。

禁止同步以下内容：

- 私人日记、个人身份信息、联系方式、照片或位置信息。
- API key、令牌、账号、服务器地址、SSH 配置与任何密钥。
- 未脱敏工作记录、第三方私有材料、完整论文摘录或受版权限制内容。
- 尚未明确标记为公开的任务、笔记和附件。

同步前，Agent 必须输出将要写入博客的差异摘要。若源文件不存在、格式无效、出现未知字段或包含疑似敏感内容，必须停止，不得覆盖目标文件。

## 唯一数据源

在 Vault 中创建并维护下面这个文件：

```text
ResearchVault\public\research-trail.yaml
```

该文件是唯一允许被同步 Agent 读取的 Vault 文件。它不引用其他 Vault 文件，不使用 Obsidian 查询、嵌入或外部动态内容。

## 源文件格式

```yaml
version: 1
updatedAt: "2026-07-16"
stages:
  - id: foundations
    index: A
    title: "Environment, Python & Math Foundations"
    summary: "恢复 Python、NumPy、调试和 Git 能力，补齐线代、微积分、概率与梯度下降的最小直觉。"
    status: Current
    outcome: "当前公开目标：NumPy 线性回归、MSE、loss 曲线与一次最小调试记录。"
    updatedAt: "2026-07-16"
    href:

  - id: machine-learning
    index: B
    title: "Machine Learning Review"
    summary: "重新建立数据划分、baseline、loss、metric 与 generalization 之间的关系。"
    status: Next
    outcome: "计划产出：一个带 EDA、split、baseline 和 evaluation 的小型分类实验。"
    updatedAt: "2026-07-16"
    href: "/notes/evaluation-protocols"
```

字段规则：

| 字段 | 规则 |
| --- | --- |
| `version` | 固定为 `1`。未知版本必须停止。 |
| `updatedAt` | 路线文件的整体更新时间，格式 `YYYY-MM-DD`。 |
| `stages` | 非空数组，按页面展示顺序排列。 |
| `id` | 小写 kebab-case，整个数组内唯一。 |
| `index` | 阶段标记，如 `A`、`B`、`C`，整个数组内唯一。 |
| `title` | 可公开的阶段标题。 |
| `summary` | 可公开的阶段说明，不得含私人计划或敏感背景。 |
| `status` | 只能是 `Completed`、`Current` 或 `Next`。全表只能有一个 `Current`。 |
| `outcome` | 公开产出或下一步，不填写虚构结果。 |
| `updatedAt` | 本阶段最近一次状态或公开目标发生变化的日期，格式 `YYYY-MM-DD`。 |
| `href` | 可选。只能是博客站内路径，以 `/notes/`、`/experiments/`、`/algorithms/` 或 `/blog/` 开头。 |

## 同步行为

1. 读取 `ResearchVault\public\research-trail.yaml`。
2. 验证 YAML 与上述字段规则。
3. 额外检查文本中是否含密钥、邮箱、绝对本地路径、IP 地址或敏感关键字；发现可疑项时停止并提示人工复核。
4. 将 `stages` 完整生成到博客的 `data/research-trail.ts`，保持 TypeScript 类型定义。
5. 不修改文章 Markdown、项目数据、友链、站点配置或任何其他博客文件。
6. 运行：

   ```bash
   npm run lint
   npm run build
   ```

7. 两项均通过后，汇报：变更的阶段、状态变化、日期变化、生成文件和验证结果。
8. 除非用户明确授权，Agent 不执行 `git commit`、`git push` 或任何远程操作。

## 状态更新示例

完成基础阶段并进入机器学习复习时，只更新相关阶段：

```yaml
- id: foundations
  status: Completed
  updatedAt: "2026-08-01"

- id: machine-learning
  status: Current
  updatedAt: "2026-08-01"
```

博客页面会自动计算完成数量、当前阶段、下一阶段数量和进度条。`updatedAt` 会显示为“更新于 YYYY年M月D日”。

## 生成结果要求

目标文件 `data/research-trail.ts` 必须导出一个包含**全部阶段**的 `researchTrail` 数组。以下只是两个阶段的结构示例；后续阶段继续追加对象，不限于 A-E：

```ts
export const researchTrail: TrailStage[] = [
  {
    id: "foundations",
    index: "A",
    title: "...",
    summary: "...",
    status: "Completed",
    outcome: "...",
    updatedAt: "2026-08-01",
  },
  {
    id: "machine-learning",
    index: "B",
    title: "...",
    summary: "...",
    status: "Current",
    outcome: "...",
    updatedAt: "2026-08-01",
    href: "/notes/example",
  },
  // 后续阶段继续以相同结构追加。
];
```

阶段数量可以增减；`index` 可以继续使用 `C`、`D` 等标记，也可以按你的路线调整。同步时必须保留所有源文件中的阶段，不能只生成当前阶段或覆盖掉历史阶段。

不要在生成文件中加入 Vault 的真实路径、源文件全文、同步时间戳、私有标签或内部链接。