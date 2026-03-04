const AGIptrVendors = [
  { id: "openai", name: "OpenAI", logo: "https://logo.clearbit.com/openai.com", fallback: "OA" },
  { id: "anthropic", name: "Anthropic", logo: "https://logo.clearbit.com/anthropic.com", fallback: "AN" },
  { id: "google-deepmind", name: "Google DeepMind", logo: "https://logo.clearbit.com/google.com", fallback: "GD" },
  { id: "meta", name: "Meta", logo: "https://logo.clearbit.com/meta.com", fallback: "ME" },
  { id: "xai", name: "xAI", logo: "https://logo.clearbit.com/x.ai", fallback: "xA" },
  { id: "alibaba", name: "阿里云", logo: "https://logo.clearbit.com/aliyun.com", fallback: "AL" },
  { id: "baidu", name: "百度", logo: "https://logo.clearbit.com/baidu.com", fallback: "BD" },
  { id: "tencent", name: "腾讯", logo: "https://logo.clearbit.com/tencent.com", fallback: "TX" },
  { id: "mistral", name: "Mistral AI", logo: "https://logo.clearbit.com/mistral.ai", fallback: "MI" },
  { id: "cohere", name: "Cohere", logo: "https://logo.clearbit.com/cohere.com", fallback: "CO" },
  { id: "moonshot", name: "Moonshot AI", logo: "https://logo.clearbit.com/moonshotai.com", fallback: "MS" },
  { id: "zhipu", name: "智谱 AI", logo: "https://logo.clearbit.com/zhipuai.cn", fallback: "ZP" },
  { id: "deepseek", name: "DeepSeek", logo: "https://logo.clearbit.com/deepseek.com", fallback: "DS" },
  { id: "minimax", name: "MiniMax", logo: "https://logo.clearbit.com/minimax.io", fallback: "MM" },
  { id: "ai01", name: "01.AI", logo: "https://logo.clearbit.com/01.ai", fallback: "01" }
];

const AGIptrModels = [
  {
    id: "gpt-4.1",
    name: "GPT-4.1",
    vendorId: "openai",
    params: "未公开",
    architecture: "Dense",
    contextWindow: "1,000,000 tokens",
    releaseDate: "2025-04-14",
    summary: "OpenAI 面向代码与通用推理的旗舰通用模型。"
  },
  {
    id: "claude-3-7-sonnet",
    name: "Claude 3.7 Sonnet",
    vendorId: "anthropic",
    params: "未公开",
    architecture: "Dense",
    contextWindow: "200,000 tokens",
    releaseDate: "2025-02-24",
    summary: "Anthropic 的混合推理模型，兼顾速度与复杂任务能力。"
  },
  {
    id: "gemini-2-5-pro",
    name: "Gemini 2.5 Pro",
    vendorId: "google-deepmind",
    params: "未公开",
    architecture: "MoE",
    contextWindow: "2,000,000 tokens",
    releaseDate: "2025-12-11",
    summary: "Google DeepMind 的多模态旗舰模型，覆盖代码与研究场景。"
  },
  {
    id: "llama-3-3-70b",
    name: "Llama 3.3 70B",
    vendorId: "meta",
    params: "70B",
    architecture: "Dense",
    contextWindow: "128,000 tokens",
    releaseDate: "2024-12-06",
    summary: "Meta 面向开源社区的高性能通用模型。"
  },
  {
    id: "grok-3",
    name: "Grok 3",
    vendorId: "xai",
    params: "未公开",
    architecture: "MoE",
    contextWindow: "131,072 tokens",
    releaseDate: "2025-02-17",
    summary: "xAI 的新一代模型，强调实时信息与复杂问题求解。"
  },
  {
    id: "qwen-2-5-max",
    name: "Qwen 2.5 Max",
    vendorId: "alibaba",
    params: "未公开",
    architecture: "MoE",
    contextWindow: "256,000 tokens",
    releaseDate: "2025-01-29",
    summary: "阿里云通义家族旗舰模型，覆盖企业与开发者场景。"
  },
  {
    id: "ernie-4-5-turbo",
    name: "ERNIE 4.5 Turbo",
    vendorId: "baidu",
    params: "未公开",
    architecture: "MoE",
    contextWindow: "128,000 tokens",
    releaseDate: "2025-03-16",
    summary: "百度文心升级版本，突出中文能力与行业适配。"
  },
  {
    id: "hunyuan-turbo-s",
    name: "Hunyuan Turbo S",
    vendorId: "tencent",
    params: "未公开",
    architecture: "Dense",
    contextWindow: "256,000 tokens",
    releaseDate: "2025-03-01",
    summary: "腾讯混元系列主力模型，面向高并发在线应用。"
  },
  {
    id: "mistral-large-2",
    name: "Mistral Large 2",
    vendorId: "mistral",
    params: "123B",
    architecture: "Dense",
    contextWindow: "128,000 tokens",
    releaseDate: "2024-07-24",
    summary: "Mistral 的通用旗舰模型，强调推理质量与可部署性。"
  },
  {
    id: "command-r-plus",
    name: "Command R+",
    vendorId: "cohere",
    params: "104B",
    architecture: "Dense",
    contextWindow: "128,000 tokens",
    releaseDate: "2024-04-04",
    summary: "Cohere 的企业 RAG 场景模型，擅长检索增强与工具调用。"
  },
  {
    id: "kimi-k1-5",
    name: "Kimi k1.5",
    vendorId: "moonshot",
    params: "未公开",
    architecture: "MoE",
    contextWindow: "200,000 tokens",
    releaseDate: "2025-01-20",
    summary: "Moonshot AI 的推理模型，强化长上下文和工具协作。"
  },
  {
    id: "glm-4-plus",
    name: "GLM-4-Plus",
    vendorId: "zhipu",
    params: "未公开",
    architecture: "MoE",
    contextWindow: "128,000 tokens",
    releaseDate: "2025-01-15",
    summary: "智谱新一代 GLM 模型，注重多任务泛化表现。"
  },
  {
    id: "deepseek-r1",
    name: "DeepSeek-R1",
    vendorId: "deepseek",
    params: "671B（37B 激活）",
    architecture: "MoE",
    contextWindow: "128,000 tokens",
    releaseDate: "2025-01-20",
    summary: "DeepSeek 的强化学习推理模型，擅长数学与代码任务。"
  },
  {
    id: "minimax-text-01",
    name: "MiniMax-Text-01",
    vendorId: "minimax",
    params: "456B（45.9B 激活）",
    architecture: "MoE",
    contextWindow: "1,000,000 tokens",
    releaseDate: "2025-01-15",
    summary: "MiniMax 的长上下文模型，适合复杂任务链路编排。"
  },
  {
    id: "yi-lightning",
    name: "Yi-Lightning",
    vendorId: "ai01",
    params: "未公开",
    architecture: "Dense",
    contextWindow: "128,000 tokens",
    releaseDate: "2024-10-16",
    summary: "01.AI 面向低延迟服务场景的轻量高性能模型。"
  }
];

window.AGIptrVendors = AGIptrVendors;
window.AGIptrModels = AGIptrModels;
