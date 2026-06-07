import type { TaskFormData, Priority, Category } from '../types/task';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

function getApiKey(): string {
  const key = import.meta.env.VITE_DEEPSEEK_API_KEY;
  if (!key || key === 'sk-your-api-key-here') {
    throw new Error('请先在 .env 文件中配置 VITE_DEEPSEEK_API_KEY');
  }
  return key;
}

function getModel(): string {
  return import.meta.env.VITE_DEEPSEEK_MODEL || 'deepseek-chat';
}

const SYSTEM_PROMPT = `你是一个任务拆解助手。用户会给你一个任务描述，请将其拆解为 3~7 个具体的子任务。

你必须严格以 JSON 数组格式返回，每个元素包含以下字段：
- title (string): 子任务标题，简洁明确，不超过30个字
- description (string): 简要说明，不超过50个字
- priority ("high" | "medium" | "low"): 优先级
- category ("工作" | "个人" | "学习" | "生活" | "健康" | "其他"): 分类

示例输入："筹备下周的团建活动"
示例输出：
[
  { "title": "确定活动场地", "description": "联系并预定合适的团建场地", "priority": "high", "category": "工作" },
  { "title": "制定活动预算", "description": "列出各项费用并申请审批", "priority": "high", "category": "工作" },
  { "title": "发送活动通知", "description": "邮件或群聊通知全员活动时间地点", "priority": "medium", "category": "工作" },
  { "title": "准备活动物资", "description": "采购零食饮料和游戏道具", "priority": "medium", "category": "生活" },
  { "title": "整理活动反馈", "description": "活动后收集大家的反馈建议", "priority": "low", "category": "工作" }
]

要求：
1. 子任务之间要有逻辑先后顺序
2. priority 要合理：必须先做的标 high，可后做的标 low
3. category 根据任务性质判断
4. 只返回 JSON 数组，不要其他内容`;

/**
 * 调用 DeepSeek API 拆解任务
 */
export async function decomposeTask(description: string): Promise<TaskFormData[]> {
  const apiKey = getApiKey();
  const model = getModel();

  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: description },
      ],
      temperature: 0.7,
      max_tokens: 2048,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    if (response.status === 401) {
      throw new Error('API Key 无效，请检查 .env 中的 VITE_DEEPSEEK_API_KEY');
    }
    if (response.status === 429) {
      throw new Error('API 请求过于频繁，请稍后再试');
    }
    throw new Error(`API 请求失败 (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('AI 未返回有效内容，请重试');
  }

  // 解析 JSON —— 尝试提取 markdown 代码块中的内容
  let jsonStr = content.trim();

  // 去掉可能的 markdown 代码块标记
  const codeBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    jsonStr = codeBlockMatch[1].trim();
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonStr);
  } catch {
    throw new Error(`AI 返回的内容无法解析，请重试。原始内容: ${content.slice(0, 200)}`);
  }

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error('AI 未返回有效的子任务列表');
  }

  // 验证并规范化每个子任务
  const validPriorities: Priority[] = ['high', 'medium', 'low'];
  const validCategories: Category[] = ['工作', '个人', '学习', '生活', '健康', '其他'];

  const tasks: TaskFormData[] = parsed.map((item: Record<string, unknown>, index: number) => {
    const title = String(item.title || '').trim();
    if (!title) {
      throw new Error(`第 ${index + 1} 个子任务缺少标题`);
    }

    const description = String(item.description || '').trim();
    let priority: Priority = 'medium';
    if (validPriorities.includes(item.priority as Priority)) {
      priority = item.priority as Priority;
    }
    let category: Category = '其他';
    if (validCategories.includes(item.category as Category)) {
      category = item.category as Category;
    }

    return {
      title: title.slice(0, 200),
      description: description.slice(0, 500),
      dueDate: '',
      priority,
      category,
    };
  });

  return tasks;
}
