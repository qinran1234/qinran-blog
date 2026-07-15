---
title: "CIFAR-10 CNN Baseline"
description: "用一条最小训练链路检查数据、模型、评估与复现记录是否完整。"
date: "2026-07-12"
tags:
  - PyTorch
  - Computer Vision
  - Baseline
status: "In progress"
draft: false
cover: "/covers/cifar-baseline.svg"
---

> Demo content：本文只演示实验记录结构，不代表真实训练经历或可引用的实验结论。

## 研究问题

一条刻意保持简单的 CNN 训练链路，能否作为后续数据增强与优化策略对比的稳定参照？这里关注的是流程完整性，而不是追求指标。

## 设置

- 数据：CIFAR-10 的演示配置说明，不包含本地数据文件。
- 划分：训练集、验证集与测试集的角色分离。
- 环境：Python、PyTorch；依赖版本应在真实复现时锁定。
- 随机性：真实运行时需要记录随机种子与确定性设置。

## 方法

模型使用少量卷积模块、池化层和线性分类头。训练循环将数据加载、前向传播、损失计算、反向传播与评估拆开，便于定位问题。

```python
def train_step(model, batch, optimizer, criterion):
    inputs, targets = batch
    optimizer.zero_grad(set_to_none=True)
    logits = model(inputs)
    loss = criterion(logits, targets)
    loss.backward()
    optimizer.step()
    return loss.detach()
```

## 结果

**Demo content。** 当前页面不提供任何训练准确率或测试指标。正式记录只有在脚本、环境和输出均可复核后才会替换此占位说明。

![基线实验的演示信号图](/covers/cifar-baseline.svg)

## 复现信息

真实实验发布前将补齐：依赖锁文件、数据版本、配置文件、运行命令、随机种子、硬件说明与原始日志摘要。

## 下一步

先验证基线在重复运行中的稳定性，再引入单一变量的数据增强消融，避免同时改变多项设置。
