const AGIptrVendors = [
  { id: "openai", name: "OpenAI", logo: "./assets/logos/openai.png", fallback: "OA" },
  { id: "anthropic", name: "Anthropic", logo: "./assets/logos/anthropic.png", fallback: "AN" },
  { id: "google-deepmind", name: "Google DeepMind", logo: "./assets/logos/google-deepmind.svg", fallback: "GD" },
  { id: "meta", name: "Meta", logo: "./assets/logos/meta.png", fallback: "ME" },
  { id: "xai", name: "xAI", logo: "./assets/logos/xai.png", fallback: "xA" },
  { id: "mistral", name: "Mistral AI", logo: "./assets/logos/mistral.svg", fallback: "MI" },
  { id: "cohere", name: "Cohere", logo: "./assets/logos/cohere.svg", fallback: "CO" },
  { id: "microsoft", name: "Microsoft", logo: "./assets/logos/microsoft.png", fallback: "MS" },
  { id: "aws", name: "AWS", logo: "./assets/logos/aws.png", fallback: "AWS" },
  { id: "nvidia", name: "NVIDIA", logo: "./assets/logos/nvidia.svg", fallback: "NV" },
  { id: "alibaba", name: "阿里云", logo: "./assets/logos/alibaba.png", fallback: "AL" },
  { id: "baidu", name: "百度", logo: "./assets/logos/baidu.png", fallback: "BD" },
  { id: "tencent", name: "腾讯", logo: "./assets/logos/tencent.png", fallback: "TX" },
  { id: "bytedance", name: "字节跳动", logo: "./assets/logos/bytedance.png", fallback: "BD" },
  { id: "zhipu", name: "智谱 AI", logo: "./assets/logos/zhipu.png", fallback: "ZP" },
  { id: "moonshot", name: "月之暗面", logo: "./assets/logos/moonshot.png", fallback: "MS" },
  { id: "minimax", name: "MiniMax", logo: "./assets/logos/minimax.png", fallback: "MM" },
  { id: "deepseek", name: "DeepSeek", logo: "./assets/logos/deepseek.png", fallback: "DS" },
  { id: "ai01", name: "01.AI", logo: "./assets/logos/ai01.png", fallback: "01" },
  { id: "baichuan", name: "百川智能", logo: "./assets/logos/baichuan.png", fallback: "BC" },
  { id: "iflytek", name: "科大讯飞", logo: "./assets/logos/iflytek.png", fallback: "XF" },
  { id: "huawei", name: "华为", logo: "./assets/logos/huawei.png", fallback: "HW" },
  { id: "sensetime", name: "商汤科技", logo: "./assets/logos/sensetime.png", fallback: "ST" },
  { id: "stepfun", name: "阶跃星辰", logo: "./assets/logos/stepfun.png", fallback: "SF" },
  { id: "modelbest", name: "面壁智能", logo: "./assets/logos/modelbest.svg", fallback: "MB" }
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
    summary: "OpenAI 面向代码与复杂推理任务的旗舰模型。"
  },
  {
    id: "claude-3-7-sonnet",
    name: "Claude 3.7 Sonnet",
    vendorId: "anthropic",
    params: "未公开",
    architecture: "Dense",
    contextWindow: "200,000 tokens",
    releaseDate: "2025-02-24",
    summary: "Anthropic 的高性价比推理模型，兼顾速度与质量。"
  },
  {
    id: "gemini-2-5-pro",
    name: "Gemini 2.5 Pro",
    vendorId: "google-deepmind",
    params: "未公开",
    architecture: "MoE",
    contextWindow: "2,000,000 tokens",
    releaseDate: "2025-12-11",
    summary: "Google DeepMind 多模态旗舰模型。"
  },
  {
    id: "llama-3-3-70b",
    name: "Llama 3.3 70B",
    vendorId: "meta",
    params: "70B",
    architecture: "Dense",
    contextWindow: "128,000 tokens",
    releaseDate: "2024-12-06",
    summary: "Meta 面向开源生态的主力通用模型。"
  },
  {
    id: "grok-3",
    name: "Grok 3",
    vendorId: "xai",
    params: "未公开",
    architecture: "MoE",
    contextWindow: "131,072 tokens",
    releaseDate: "2025-02-17",
    summary: "xAI 新一代模型，强调推理与实时信息能力。"
  },
  {
    id: "mistral-large-2",
    name: "Mistral Large 2",
    vendorId: "mistral",
    params: "123B",
    architecture: "Dense",
    contextWindow: "128,000 tokens",
    releaseDate: "2024-07-24",
    summary: "Mistral AI 的通用旗舰模型。"
  },
  {
    id: "command-r-plus",
    name: "Command R+",
    vendorId: "cohere",
    params: "104B",
    architecture: "Dense",
    contextWindow: "128,000 tokens",
    releaseDate: "2024-04-04",
    summary: "Cohere 面向企业 RAG 与检索场景的模型。"
  },
  {
    id: "phi-4",
    name: "Phi-4",
    vendorId: "microsoft",
    params: "14B",
    architecture: "Dense",
    contextWindow: "16,000 tokens",
    releaseDate: "2024-12-12",
    summary: "Microsoft 的轻量高性能推理模型。"
  },
  {
    id: "amazon-nova-pro",
    name: "Amazon Nova Pro",
    vendorId: "aws",
    params: "未公开",
    architecture: "Dense",
    contextWindow: "128,000 tokens",
    releaseDate: "2024-12-03",
    summary: "AWS Nova 系列通用模型，覆盖多模态能力。"
  },
  {
    id: "llama-3-1-nemotron-70b",
    name: "Llama 3.1 Nemotron 70B",
    vendorId: "nvidia",
    params: "70B",
    architecture: "MoE",
    contextWindow: "128,000 tokens",
    releaseDate: "2024-10-15",
    summary: "NVIDIA 面向企业代理与推理优化的模型。"
  },
  {
    id: "qwen-2-5-max",
    name: "Qwen 2.5 Max",
    vendorId: "alibaba",
    params: "未公开",
    architecture: "MoE",
    contextWindow: "256,000 tokens",
    releaseDate: "2025-01-29",
    summary: "阿里云通义家族旗舰模型。"
  },
  {
    id: "ernie-4-5",
    name: "ERNIE 4.5",
    vendorId: "baidu",
    params: "未公开",
    architecture: "MoE",
    contextWindow: "128,000 tokens",
    releaseDate: "2025-03-16",
    summary: "百度文心大模型升级版本。"
  },
  {
    id: "hunyuan-t1",
    name: "Hunyuan-T1",
    vendorId: "tencent",
    params: "未公开",
    architecture: "Dense",
    contextWindow: "256,000 tokens",
    releaseDate: "2025-02-27",
    summary: "腾讯混元推理模型，面向通用生产场景。"
  },
  {
    id: "doubao-pro-32k",
    name: "豆包 Pro 32K",
    vendorId: "bytedance",
    params: "未公开",
    architecture: "MoE",
    contextWindow: "32,000 tokens",
    releaseDate: "2025-05-16",
    summary: "字节跳动豆包系列主力模型。"
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
    id: "kimi-k2",
    name: "Kimi K2",
    vendorId: "moonshot",
    params: "未公开",
    architecture: "MoE",
    contextWindow: "200,000 tokens",
    releaseDate: "2025-10-11",
    summary: "月之暗面 Kimi 系列高阶推理模型。"
  },
  {
    id: "minimax-text-01",
    name: "MiniMax-Text-01",
    vendorId: "minimax",
    params: "456B（45.9B 激活）",
    architecture: "MoE",
    contextWindow: "1,000,000 tokens",
    releaseDate: "2025-01-15",
    summary: "MiniMax 的超长上下文模型。"
  },
  {
    id: "deepseek-r1",
    name: "DeepSeek-R1",
    vendorId: "deepseek",
    params: "671B（37B 激活）",
    architecture: "MoE",
    contextWindow: "128,000 tokens",
    releaseDate: "2025-01-20",
    summary: "DeepSeek 的强化学习推理模型。"
  },
  {
    id: "yi-lightning",
    name: "Yi-Lightning",
    vendorId: "ai01",
    params: "未公开",
    architecture: "Dense",
    contextWindow: "128,000 tokens",
    releaseDate: "2024-10-16",
    summary: "01.AI 面向低延迟服务场景的轻量模型。"
  },
  {
    id: "baichuan4-turbo",
    name: "Baichuan4-Turbo",
    vendorId: "baichuan",
    params: "未公开",
    architecture: "MoE",
    contextWindow: "128,000 tokens",
    releaseDate: "2024-11-20",
    summary: "百川智能面向企业应用的通用模型。"
  },
  {
    id: "spark-max",
    name: "讯飞星火 Max",
    vendorId: "iflytek",
    params: "未公开",
    architecture: "Dense",
    contextWindow: "128,000 tokens",
    releaseDate: "2025-01-15",
    summary: "科大讯飞星火系列主力模型。"
  },
  {
    id: "pangu-5",
    name: "盘古大模型 5.0",
    vendorId: "huawei",
    params: "未公开",
    architecture: "Dense",
    contextWindow: "待更新",
    releaseDate: "2025-06-20",
    summary: "华为盘古系列大模型。"
  },
  {
    id: "sensenova-5o",
    name: "SenseNova 5o",
    vendorId: "sensetime",
    params: "未公开",
    architecture: "MoE",
    contextWindow: "128,000 tokens",
    releaseDate: "2025-04-10",
    summary: "商汤日日新多模态模型。"
  },
  {
    id: "step-2",
    name: "Step-2",
    vendorId: "stepfun",
    params: "未公开",
    architecture: "Dense",
    contextWindow: "128,000 tokens",
    releaseDate: "2025-03-10",
    summary: "阶跃星辰通用推理模型。"
  },
  {
    id: "minicpm-4",
    name: "MiniCPM 4.0",
    vendorId: "modelbest",
    params: "8B",
    architecture: "Dense",
    contextWindow: "128,000 tokens",
    releaseDate: "2025-08-15",
    summary: "面壁智能开源 MiniCPM 系列模型。"
  }
];

window.AGIptrVendors = AGIptrVendors;
window.AGIptrModels = AGIptrModels;
