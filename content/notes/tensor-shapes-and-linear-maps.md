---
title: "从张量形状理解线性映射"
description: "用 shape bookkeeping 连接向量空间、批处理维度与神经网络层。"
date: "2026-07-10"
tags:
  - Linear Algebra
  - PyTorch
  - Concepts
status: "Public note"
draft: false
cover: "/covers/tensor-shapes.svg"
---

> Demo note：用于展示公开概念笔记的结构，内容不来自私人 Vault。

## 为什么先看形状

很多张量错误并不是计算本身复杂，而是不同维度的语义没有被清楚写下。把每个轴解释成 batch、channel、height 或 feature，能让线性映射的输入输出关系更直观。

## 一个最小例子

设输入批次为 $X \in \mathbb{R}^{B \times D}$，线性层权重为 $W \in \mathbb{R}^{O \times D}$。实现通常计算：

```python
output = input @ weight.T + bias
# [B, D] @ [D, O] -> [B, O]
```

这里 `B` 只负责并行承载样本，不参与每个样本内部的线性映射。

## 检查清单

- 每个轴代表什么？
- 哪些轴被保留，哪些轴被约简？
- 广播发生在哪里？
- reshape 是否改变了样本之间的边界？

## 后续连接

同样的记账方式可以扩展到卷积层、注意力矩阵与损失函数。下一步是把这些形状约束写进小型测试。
