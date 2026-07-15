---
title: "把一个视觉实验缩到足够小"
description: "当变量越来越多时，我开始反过来删东西，直到问题重新变得清楚。"
date: "2026-07-11"
tags:
  - Computer Vision
  - 实验手记
status: "Published"
draft: false
cover: "/covers/tiny-cv-experiment.svg"
---

> Demo post：本文描述的是演示性实验思路，不包含真实训练指标或研究成果。

## 先把问题变小

模型、数据增强、优化器和训练预算一起变化时，结果几乎无法解释。于是这次只保留一条非常小的基线，让每一次修改都能用一句话说明。

```python
experiment = {
    "model": "tiny-cnn",
    "change": "horizontal-flip-only",
    "budget": "demo-placeholder",
}
```

## 小实验需要更认真吗

需要。规模小不意味着记录可以含糊。恰恰因为实现简单，数据划分、随机性和评估方式更容易被逐项检查。

> 先让实验能够解释，再讨论它是否足够漂亮。

## 留给下一次的问题

我还需要补一份错误样本观察模板。单个汇总指标很安静，但错误样本通常更愿意说出发生了什么。
