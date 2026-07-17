export type TrailStatus = "Completed" | "Current" | "Next";

export type TrailStage = {
  id: string;
  index: string;
  title: string;
  summary: string;
  status: TrailStatus;
  outcome: string;
  updatedAt: string;
  href?: string;
};

// Manually distilled from the private ResearchVault roadmap. The site never reads the vault at runtime.
export const researchTrail: TrailStage[] = [
  {
    id: "foundations",
    index: "A",
    title: "Environment, Python & Math Foundations",
    summary: "恢复 Python、NumPy、调试和 Git 能力，补齐线代、微积分、概率与梯度下降的最小直觉。",
    status: "Current",
    outcome: "当前公开目标：NumPy 线性回归、MSE、loss 曲线与一次最小调试记录。",
    updatedAt: "2026-07-16",
  },
  {
    id: "machine-learning",
    index: "B",
    title: "Machine Learning Review",
    summary: "重新建立数据划分、baseline、loss、metric 与 generalization 之间的关系。",
    status: "Next",
    outcome: "计划产出：一个带 EDA、split、baseline 和 evaluation 的小型分类实验。",
    updatedAt: "2026-07-16",
    href: "/notes/evaluation-protocols",
  },
  {
    id: "deep-learning",
    index: "C",
    title: "Deep Learning & PyTorch",
    summary: "理解训练循环每一行的作用，并完成 Dataset、模型、优化器、checkpoint 与曲线诊断。",
    status: "Next",
    outcome: "计划产出：MNIST/Fashion-MNIST MLP 与完整 train/eval loop。",
    updatedAt: "2026-07-16",
    href: "/experiments/cifar10-cnn-baseline",
  },
  {
    id: "computer-vision",
    index: "D",
    title: "Computer Vision Foundations",
    summary: "从 image tensor、convolution 与 CNN 建立分类、检测、分割等基础任务地图。",
    status: "Next",
    outcome: "计划产出：CIFAR-10 小型 CNN 与单变量数据增强对照。",
    updatedAt: "2026-07-16",
    href: "/experiments/image-augmentation-ablation",
  },
  {
    id: "paper-reproduction",
    index: "E",
    title: "Paper Reading & Learning Reproduction",
    summary: "完成阶段 C/D 后，再从教程、综述、ResNet 与 U-Net 进入学习型复现。",
    status: "Next",
    outcome: "当前仅保留论文锚点，不把精读或原论文完整复现作为近期主线。",
    updatedAt: "2026-07-16",
  },
];