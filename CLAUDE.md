# CLAUDE.md

本文件为 Claude Code（claude.ai/code）在此仓库中工作时提供指导。

## 命令

```bash
npm run dev       # 启动开发服务器（默认 http://localhost:5173）
npm run build     # TypeScript 类型检查 + Vite 生产构建 → dist/
npm run preview   # 本地预览生产构建
```

## 架构

一个纯客户端 React 19 + TypeScript 5 + Vite 6 待办事项应用。无后端、无路由 — 所有内容运行在单页面中，使用 localStorage 持久化。

### 状态管理：Context + useReducer

`src/context/TaskContext.tsx` 是唯一的数据源。它包含：

- **`TaskState`**：`{ tasks, filter, category, search, initialized }`
- **`TaskAction`**：可辨识联合类型（`INIT_TASKS`、`ADD_TASK`、`BATCH_ADD_TASKS`、`TOGGLE_TASK`、`UPDATE_TASK`、`DELETE_TASK`、`CLEAR_DONE`、`IMPORT_TASKS`、`SET_FILTER`、`SET_CATEGORY`、`SET_SEARCH`）

`TaskProvider` 在挂载时通过 `INIT_TASKS` 从 localStorage 加载任务，然后在 `initialized` 变为 true 后，每次变更自动保存。演示数据生成已移除 — 应用启动时为空。

### 组件树

```
App
└── TaskProvider (Context)
    └── Notebook（布局容器 + toast 状态 + 编辑弹窗状态）
        ├── Header（标题 + DateStamp）
        ├── StatsBar（总计/已完成数量 + ProgressRing）
        ├── Toolbar（搜索输入框、状态筛选按钮、分类下拉框）
        ├── AddTaskForm（表单 + AI 拆解按钮）
        ├── TaskList（筛选/排序/分组后渲染）
        │   └── TaskGroup[]（按日期分组：逾期/今天/本周/以后/已完成）
        │       └── TaskCard[]（HandCheckbox + 正文 + 编辑/删除操作）
        ├── FooterActions（导出 JSON、导入 JSON、清除已完成）
        ├── EditModal（由 Notebook 通过 `editingTask` 状态控制）
        └── Toast（由 Notebook 中的 `useToast` hook 控制）
```

所有组件逻辑位于 `.tsx` 文件中；样式位于同目录下的 `.css` 文件中，引用 `src/index.css` 中的 CSS 自定义属性。

### 关键模式

- **状态存放在 Context 中** — 组件直接读取 `state` 并调用 `dispatch()`。prop 传递不超过一层。
- **Toast 是一个 hook** — `src/hooks/useToast.ts` 中的 `useToast()` 管理消息和可见性，通过 `setTimeout` 自动消失。Notebook 拥有该 hook 并将 `showToast` 作为回调向下传递。
- **编辑弹窗状态** — Notebook 持有 `editingTask: Task | null`；设为某个任务即打开弹窗，设为 null 即关闭。
- **删除动画** — `TaskCard` 设置本地 `removing` 状态，添加 CSS `cardOut` 动画类，350ms 后派发 `DELETE_TASK`。
- **任务分组** — `TaskList` 按日期组将筛选后的任务分组（`逾期 → 今天 → 本周 → 以后 → 已完成`），每组内按优先级再按创建时间排序。

### AI 任务拆解（`src/utils/deepseek.ts`）

调用 DeepSeek API（兼容 OpenAI 接口）将自然语言任务描述拆解为 3–7 个子任务。需要 `.env` 文件中配置 `VITE_DEEPSEEK_API_KEY` 和 `VITE_DEEPSEEK_MODEL`。`AddTaskForm` 中的"🤖 AI 拆解"按钮触发该流程：调用 `decomposeTask()`，成功时派发 `BATCH_ADD_TASKS`，失败时显示 toast 提示。API Key 嵌入在客户端请求中 — 对于个人工具可以接受，但不适用于生产环境。

### 主题

`src/index.css` 中的 CSS 自定义属性定义了视觉主题（当前为暗色武侠/动漫风格）。修改 `:root` 变量即可同步到所有组件。

每次回复我都再最前面加上一句喵~
