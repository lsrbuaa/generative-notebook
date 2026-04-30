# Generative UI 技术调研报告

> 调研日期：2026-04-30

---

## 一、什么是 Generative UI

**Generative UI（生成式用户界面）** 是由 AI 实时动态生成的用户界面，根据用户需求和上下文定制体验。

### 核心转变

| 传统 UI | Generative UI |
|---------|--------------|
| 为所有用户设计统一界面 | 为每个用户动态生成个性化界面 |
| 设计离散的界面组件 | 定义结果和 AI 操作约束 |
| 固定布局和交互 | 根据上下文自适应调整 |

### 信息优先级分层

- **必须展示**（Must Show）：核心内容和关键操作
- **应当展示**（Should Show）：有价值的辅助信息
- **绝不展示**（Never Show）：无关或干扰信息

---

## 二、主要技术架构方案

### 方案一：Vercel AI SDK（streamUI）

**适用场景**：Next.js 应用、聊天式界面

**核心思想**：LLM 作为"动态路由器"，理解用户意图后选择渲染哪个组件

**关键 API**：

| API | 用途 |
|-----|------|
| `streamUI` | 调用模型，接收 React Server Components 作为响应 |
| `createStreamableUI` | 从服务端向客户端发送 UI |
| `useUIState` | 管理视觉表现状态 |
| `useAIState` | 管理与 AI 模型共享的上下文 |
| `createAI` | 包裹应用树，管理 UI 和 AI 状态 |

**工作流程**：
```
用户消息 → LLM理解意图 → 选择工具 → generate函数渲染组件 → 流式传输到客户端
```

**注意**：AI SDK RSC 仍为实验性质，生产环境推荐 AI SDK UI（通过 tool parts 状态机）

### 方案二：CopilotKit

**三种生成式 UI 模式**：

| 模式 | 协议 | 说明 |
|------|------|------|
| Static | AG-UI Protocol | 预定义组件渲染 |
| Declarative | A2UI | Agent 指定 UI 生成 |
| Open-Ended | MCP Apps | 动态灵活的 UI 渲染 |

**核心特性**：
- Shared State Pattern：Agent 和 UI 共享实时同步状态层
- 流式优先架构
- Human-in-the-loop 工作流
- 支持 React、Next.js、Vue

### 方案三：AG-UI Protocol（Agent-User Interaction Protocol）

**定位**：开放协议标准，基于事件的轻量级协议，连接 AI Agent 和用户应用

**三层协议栈**：

| 层级 | 协议 | 功能 |
|------|------|------|
| Agent ↔ User | AG-UI | 连接 Agent 到用户应用 |
| Agent ↔ Tools | MCP | 连接 Agent 到外部系统 |
| Agent ↔ Agent | A2A | Agent 间协调 |

**16 种核心事件类型**：流式聊天、多模态附件、生成式 UI 组件、共享类型化状态、人机交互中断、子 Agent 委派等

**生态集成**：LangGraph、CrewAI、Microsoft Agent Framework、Google ADK、AWS、Pydantic AI、LlamaIndex

### 方案四：tldraw Make-Real（视觉到代码）

用户手绘草图 → GPT-4V 分析 → 生成 HTML/CSS → 嵌入画布 → 迭代修改

### 方案五：v0（Vercel）

自然语言 → AI 规划 → 执行开发 → 生成可部署代码

---

## 三、当前笔记应用的 AI 集成现状

| 产品 | AI 方向 | 深度 |
|------|---------|------|
| Notion AI | Agent + AI Blocks + 自定义Agent + 企业搜索 | 内容层（非 UI 生成） |
| Reflect | GPT-4 + Whisper，语音转录/内容生成/摘要 | 内容管理辅助 |
| Craft | MCP 连接 Claude/ChatGPT 等外部 AI | 平台生态整合 |

**关键发现**：当前大多数笔记应用的 AI 功能集中在 **内容层面**（写作辅助、摘要、搜索），而非 **界面动态生成层面**。真正的 Generative UI 在笔记工具中仍处于早期探索阶段，这是一个巨大的差异化机会。

---

## 四、最佳实践

### 设计原则

1. **定义约束而非固定界面** — 设置 AI 可操作的边界和规则
2. **渐进式渲染** — 先展示加载状态，再流式传输最终内容
3. **工具即组件** — 每个 LLM 工具对应一个 React 组件
4. **状态双轨管理** — UI 状态和 AI 状态分离但同步

### 技术最佳实践

1. 使用 Zod Schema 定义工具输入，确保类型安全
2. 采用 async generator 模式实现中间态渲染
3. 使用 Server Actions 保持敏感逻辑在服务端
4. 遵循 AG-UI 协议确保跨框架互操作性

### 当前挑战

- **隐私**：个性化需要大量用户数据
- **一致性**：动态 UI 可能导致用户困惑
- **AI 固有问题**：偏见、幻觉可能影响界面准确性
- **硬件限制**：实时生成对计算资源要求高
