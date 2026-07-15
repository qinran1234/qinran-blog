---
title: "评估协议比单个指标更重要"
description: "整理数据划分、模型选择和最终报告之间容易混淆的边界。"
date: "2026-07-05"
tags:
  - Evaluation
  - Machine Learning
  - Reproducibility
status: "Public note"
draft: false
cover: "/covers/evaluation-protocols.svg"
---

> Demo note：这是一篇匿名示例笔记，不声称完成了特定论文或项目的评估。

## 三种集合的职责

训练集用于拟合参数，验证集用于选择配置，测试集用于在决策结束后估计最终表现。关键不是名称，而是信息有没有从最终评估反向泄漏到模型选择。

## 指标之外

一个可解释的评估记录还需要说明：数据版本、划分方式、重复次数、随机性、模型选择规则，以及失败样本如何被观察。

> 当测试结果持续参与调参时，测试集实际上已经承担了验证集的角色。

## 最小记录模板

```text
dataset_version:
split_strategy:
selection_metric:
repeat_count:
final_checkpoint_rule:
known_limitations:
```

## 实践提醒

先写评估协议，再运行实验。这样更容易区分原先的问题与看到结果后追加的解释。
