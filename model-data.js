const AGIptrVendors = [
  { id: "openai", name: "OpenAI", logo: "./assets/logos/openai.svg", fallback: "OA" },
  { id: "anthropic", name: "Anthropic", logo: "./assets/logos/anthropic.svg", fallback: "AN" },
  { id: "google-gemini", name: "Google Gemini", logo: "./assets/logos/google-gemini.svg", fallback: "GG" },
  { id: "google-deepmind", name: "Google DeepMind", logo: "./assets/logos/google-deepmind.svg", fallback: "GD" },
  { id: "meta", name: "Meta", logo: "./assets/logos/meta.svg", fallback: "ME" },
  { id: "xai", name: "xAI", logo: "./assets/logos/xai.svg", fallback: "xA" },
  { id: "mistral", name: "Mistral AI", logo: "./assets/logos/mistral.svg", fallback: "MI" },
  { id: "huggingface", name: "Hugging Face", logo: "./assets/logos/huggingface.svg", fallback: "HF" },
  { id: "perplexity", name: "Perplexity", logo: "./assets/logos/perplexity.svg", fallback: "PX" },
  { id: "nvidia", name: "NVIDIA", logo: "./assets/logos/nvidia.svg", fallback: "NV" },
  { id: "alibaba", name: "阿里云", logo: "./assets/logos/alibaba.svg", fallback: "AL" },
  { id: "baidu", name: "百度", logo: "./assets/logos/baidu.svg", fallback: "BD" },
  { id: "minimax", name: "MiniMax", logo: "./assets/logos/minimax.svg", fallback: "MM" },
  { id: "databricks", name: "Databricks", logo: "./assets/logos/databricks.svg", fallback: "DB" },
  { id: "snowflake", name: "Snowflake", logo: "./assets/logos/snowflake.svg", fallback: "SF" },
  { id: "cloudflare", name: "Cloudflare", logo: "./assets/logos/cloudflare.svg", fallback: "CF" },
  { id: "intel", name: "Intel", logo: "./assets/logos/intel.svg", fallback: "IN" },
  { id: "apple", name: "Apple", logo: "./assets/logos/apple.svg", fallback: "AP" },
  { id: "samsung", name: "Samsung", logo: "./assets/logos/samsung.svg", fallback: "SS" },
  { id: "qualcomm", name: "Qualcomm", logo: "./assets/logos/qualcomm.svg", fallback: "QC" },
  { id: "amd", name: "AMD", logo: "./assets/logos/amd.svg", fallback: "AMD" },
  { id: "arm", name: "Arm", logo: "./assets/logos/arm.svg", fallback: "ARM" },
  { id: "bytedance", name: "字节跳动", logo: "./assets/logos/bytedance.svg", fallback: "BD" },
  { id: "xiaomi", name: "小米", logo: "./assets/logos/xiaomi.svg", fallback: "XM" },
  { id: "palantir", name: "Palantir", logo: "./assets/logos/palantir.svg", fallback: "PL" }
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
    vendorId: "google-gemini",
    params: "未公开",
    architecture: "MoE",
    contextWindow: "2,000,000 tokens",
    releaseDate: "2025-12-11",
    summary: "Google Gemini 系列高阶模型，支持复杂多模态任务。"
  },
  {
    id: "deepmind-gemini-2-5-pro",
    name: "Gemini 2.5 Pro (DeepMind)",
    vendorId: "google-deepmind",
    params: "未公开",
    architecture: "MoE",
    contextWindow: "2,000,000 tokens",
    releaseDate: "2025-12-11",
    summary: "Google DeepMind 方向下的前沿推理与研究模型。"
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
    id: "smollm2-1-7b-instruct",
    name: "SmolLM2 1.7B Instruct",
    vendorId: "huggingface",
    params: "1.7B",
    architecture: "Dense",
    contextWindow: "8,192 tokens",
    releaseDate: "2025-01-08",
    summary: "Hugging Face 开源小参数模型，便于端侧与快速部署。"
  },
  {
    id: "sonar-large",
    name: "Sonar Large",
    vendorId: "perplexity",
    params: "未公开",
    architecture: "Dense",
    contextWindow: "128,000 tokens",
    releaseDate: "2025-01-18",
    summary: "Perplexity 面向搜索增强场景的模型能力层。"
  },
  {
    id: "llama-nemotron-ultra",
    name: "Llama Nemotron Ultra",
    vendorId: "nvidia",
    params: "未公开",
    architecture: "MoE",
    contextWindow: "128,000 tokens",
    releaseDate: "2025-10-15",
    summary: "NVIDIA 面向企业代理与推理优化的模型方案。"
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
    id: "ernie-4-5-turbo",
    name: "ERNIE 4.5 Turbo",
    vendorId: "baidu",
    params: "未公开",
    architecture: "MoE",
    contextWindow: "128,000 tokens",
    releaseDate: "2025-03-16",
    summary: "百度文心升级版本，突出中文场景适配能力。"
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
    id: "dbrx-instruct",
    name: "DBRX Instruct",
    vendorId: "databricks",
    params: "132B（36B 激活）",
    architecture: "MoE",
    contextWindow: "32,000 tokens",
    releaseDate: "2024-03-27",
    summary: "Databricks 的开源 MoE 代表模型。"
  },
  {
    id: "snowflake-arctic-instruct",
    name: "Snowflake Arctic Instruct",
    vendorId: "snowflake",
    params: "480B（17B 激活）",
    architecture: "MoE",
    contextWindow: "8,192 tokens",
    releaseDate: "2024-04-24",
    summary: "Snowflake 面向企业推理与代码场景的模型。"
  },
  {
    id: "workers-ai-llama-3-1-8b",
    name: "Workers AI · Llama 3.1 8B",
    vendorId: "cloudflare",
    params: "8B",
    architecture: "Dense",
    contextWindow: "128,000 tokens",
    releaseDate: "2025-08-01",
    summary: "Cloudflare Workers AI 平台常用在线推理模型。"
  },
  {
    id: "neural-chat-7b-v3-1",
    name: "Neural Chat 7B v3.1",
    vendorId: "intel",
    params: "7B",
    architecture: "Dense",
    contextWindow: "8,192 tokens",
    releaseDate: "2024-09-10",
    summary: "Intel 优化的轻量对话模型方案。"
  },
  {
    id: "apple-foundation-model",
    name: "Apple Foundation Model",
    vendorId: "apple",
    params: "未公开",
    architecture: "Dense",
    contextWindow: "待更新",
    releaseDate: "2025-06-10",
    summary: "Apple Intelligence 所依赖的基础模型体系。"
  },
  {
    id: "samsung-gauss2",
    name: "Samsung Gauss2",
    vendorId: "samsung",
    params: "未公开",
    architecture: "Dense",
    contextWindow: "待更新",
    releaseDate: "2025-11-14",
    summary: "三星面向端侧与企业场景的 Gauss 系列模型。"
  },
  {
    id: "qualcomm-dragonwing-llm",
    name: "Dragonwing LLM",
    vendorId: "qualcomm",
    params: "待更新",
    architecture: "Dense",
    contextWindow: "待更新",
    releaseDate: "2025-07-01",
    summary: "Qualcomm 端侧 AI 生态中的大模型能力组件。"
  },
  {
    id: "amd-instella",
    name: "Instella",
    vendorId: "amd",
    params: "待更新",
    architecture: "Dense",
    contextWindow: "待更新",
    releaseDate: "2025-05-20",
    summary: "AMD AI 生态中用于推理部署的模型方向。"
  },
  {
    id: "arm-llm-reference",
    name: "Arm LLM Reference",
    vendorId: "arm",
    params: "待更新",
    architecture: "Dense",
    contextWindow: "待更新",
    releaseDate: "2025-05-12",
    summary: "Arm 面向端侧优化的模型参考方案。"
  },
  {
    id: "doubao-pro",
    name: "豆包 Pro",
    vendorId: "bytedance",
    params: "未公开",
    architecture: "MoE",
    contextWindow: "128,000 tokens",
    releaseDate: "2025-03-28",
    summary: "字节跳动豆包系列的高阶能力模型。"
  },
  {
    id: "mimo-2025",
    name: "MiMo",
    vendorId: "xiaomi",
    params: "未公开",
    architecture: "Dense",
    contextWindow: "待更新",
    releaseDate: "2025-06-28",
    summary: "小米大模型方向，服务端云协同与智能终端。"
  },
  {
    id: "palantir-aip-llm",
    name: "Palantir AIP LLM",
    vendorId: "palantir",
    params: "待更新",
    architecture: "Dense",
    contextWindow: "待更新",
    releaseDate: "2025-04-01",
    summary: "Palantir 在企业 AIP 平台中的模型接入能力。"
  }
];

window.AGIptrVendors = AGIptrVendors;
window.AGIptrModels = AGIptrModels;
