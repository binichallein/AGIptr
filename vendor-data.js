const QWEN_RELEASE_TIMELINE_RAW = `
2023-08-03|Qwen-7B
2023-08-03|Qwen-7B-Chat
2023-08-18|Qwen-VL
2023-08-20|Qwen-VL-Chat
2023-09-24|Qwen-14B
2023-09-24|Qwen-14B-Chat
2023-11-26|Qwen-72B
2023-11-29|Qwen-72B-Chat
2023-11-30|Qwen-1_8B
2023-11-30|Qwen-1_8B-Chat
2023-11-30|Qwen-Audio
2023-11-30|Qwen-Audio-Chat
2024-01-22|Qwen1.5-0.5B
2024-01-22|Qwen1.5-1.8B
2024-01-22|Qwen1.5-14B
2024-01-22|Qwen1.5-4B
2024-01-22|Qwen1.5-7B
2024-01-23|Qwen1.5-72B
2024-01-30|Qwen1.5-1.8B-Chat
2024-01-30|Qwen1.5-14B-Chat
2024-01-30|Qwen1.5-4B-Chat
2024-01-30|Qwen1.5-72B-Chat
2024-01-30|Qwen1.5-7B-Chat
2024-01-31|Qwen1.5-0.5B-Chat
2024-02-29|Qwen1.5-MoE-A2.7B
2024-03-14|Qwen1.5-MoE-A2.7B-Chat
2024-04-01|Qwen1.5-32B
2024-04-03|Qwen1.5-32B-Chat
2024-04-15|CodeQwen1.5-7B
2024-04-15|CodeQwen1.5-7B-Chat
2024-04-25|Qwen1.5-110B
2024-04-25|Qwen1.5-110B-Chat
2024-05-22|Qwen2-57B-A14B
2024-05-22|Qwen2-72B
2024-05-28|Qwen2-72B-Instruct
2024-05-31|Qwen2-0.5B
2024-05-31|Qwen2-1.5B
2024-06-03|Qwen2-0.5B-Instruct
2024-06-03|Qwen2-1.5B-Instruct
2024-06-04|Qwen2-57B-A14B-Instruct
2024-06-04|Qwen2-7B
2024-06-04|Qwen2-7B-Instruct
2024-07-16|Qwen2-Audio-7B
2024-07-31|Qwen2-Audio-7B-Instruct
2024-08-08|Qwen2-Math-1.5B
2024-08-08|Qwen2-Math-1.5B-Instruct
2024-08-08|Qwen2-Math-72B
2024-08-08|Qwen2-Math-72B-Instruct
2024-08-08|Qwen2-Math-7B
2024-08-08|Qwen2-Math-7B-Instruct
2024-08-28|Qwen2-VL-2B-Instruct
2024-08-28|Qwen2-VL-7B-Instruct
2024-09-05|Qwen2-VL-2B
2024-09-05|Qwen2-VL-7B
2024-09-15|Qwen2.5-0.5B
2024-09-15|Qwen2.5-1.5B
2024-09-15|Qwen2.5-14B
2024-09-15|Qwen2.5-32B
2024-09-15|Qwen2.5-3B
2024-09-15|Qwen2.5-72B
2024-09-15|Qwen2.5-7B
2024-09-16|Qwen2.5-0.5B-Instruct
2024-09-16|Qwen2.5-14B-Instruct
2024-09-16|Qwen2.5-72B-Instruct
2024-09-16|Qwen2.5-7B-Instruct
2024-09-16|Qwen2.5-Coder-7B
2024-09-16|Qwen2.5-Math-1.5B
2024-09-16|Qwen2.5-Math-1.5B-Instruct
2024-09-16|Qwen2.5-Math-72B
2024-09-16|Qwen2.5-Math-72B-Instruct
2024-09-16|Qwen2.5-Math-7B
2024-09-17|Qwen2-Math-RM-72B
2024-09-17|Qwen2-VL-72B-Instruct
2024-09-17|Qwen2.5-1.5B-Instruct
2024-09-17|Qwen2.5-32B-Instruct
2024-09-17|Qwen2.5-3B-Instruct
2024-09-17|Qwen2.5-Coder-7B-Instruct
2024-09-17|Qwen2.5-Math-RM-72B
2024-09-18|Qwen2.5-Coder-1.5B
2024-09-18|Qwen2.5-Coder-1.5B-Instruct
2024-09-19|Qwen2.5-Math-7B-Instruct
2024-11-06|Qwen2.5-Coder-0.5B-Instruct
2024-11-06|Qwen2.5-Coder-14B-Instruct
2024-11-06|Qwen2.5-Coder-32B-Instruct
2024-11-06|Qwen2.5-Coder-3B-Instruct
2024-11-08|Qwen2.5-Coder-0.5B
2024-11-08|Qwen2.5-Coder-14B
2024-11-08|Qwen2.5-Coder-32B
2024-11-08|Qwen2.5-Coder-3B
2024-11-27|QwQ-32B-Preview
2024-12-04|Qwen2-VL-72B
2024-12-24|QVQ-72B-Preview
2025-01-13|Qwen2.5-Math-7B-PRM800K
2025-01-13|Qwen2.5-Math-PRM-72B
2025-01-13|Qwen2.5-Math-PRM-7B
2025-01-23|Qwen2.5-14B-Instruct-1M
2025-01-23|Qwen2.5-7B-Instruct-1M
2025-01-26|Qwen2.5-VL-3B-Instruct
2025-01-26|Qwen2.5-VL-7B-Instruct
2025-01-27|Qwen2.5-VL-72B-Instruct
2025-03-05|QwQ-32B
2025-03-21|Qwen2.5-VL-32B-Instruct
2025-03-22|Qwen2.5-Omni-7B
2025-04-27|Qwen3-0.6B
2025-04-27|Qwen3-1.7B
2025-04-27|Qwen3-14B
2025-04-27|Qwen3-235B-A22B
2025-04-27|Qwen3-30B-A3B
2025-04-27|Qwen3-32B
2025-04-27|Qwen3-4B
2025-04-27|Qwen3-8B
2025-04-28|Qwen3-0.6B-Base
2025-04-28|Qwen3-1.7B-Base
2025-04-28|Qwen3-14B-Base
2025-04-28|Qwen3-30B-A3B-Base
2025-04-28|Qwen3-4B-Base
2025-04-28|Qwen3-8B-Base
2025-04-30|Qwen2.5-Omni-3B
2025-05-16|WorldPM-72B
2025-05-16|WorldPM-72B-HelpSteer2
2025-05-16|WorldPM-72B-RLHFLow
2025-05-16|WorldPM-72B-UltraFeedback
2025-05-29|Qwen3-Reranker-0.6B
2025-05-29|Qwen3-Reranker-8B
2025-06-03|Qwen3-Embedding-0.6B
2025-06-03|Qwen3-Embedding-4B
2025-06-03|Qwen3-Embedding-8B
2025-06-03|Qwen3-Reranker-4B
2025-07-21|Qwen3-235B-A22B-Instruct-2507
2025-07-22|Qwen3-Coder-480B-A35B-Instruct
2025-07-25|Qwen3-235B-A22B-Thinking-2507
2025-07-28|Qwen3-30B-A3B-Instruct-2507
2025-07-29|Qwen3-30B-A3B-Thinking-2507
2025-07-31|Qwen3-Coder-30B-A3B-Instruct
2025-08-02|Qwen-Image
2025-08-05|Qwen3-4B-Instruct-2507
2025-08-05|Qwen3-4B-Thinking-2507
2025-08-17|Qwen-Image-Edit
2025-09-09|Qwen3-Next-80B-A3B-Instruct
2025-09-09|Qwen3-Next-80B-A3B-Thinking
2025-09-15|Qwen3-Omni-30B-A3B-Captioner
2025-09-15|Qwen3-Omni-30B-A3B-Thinking
2025-09-20|Qwen3-Omni-30B-A3B-Instruct
2025-09-22|Qwen-Image-Edit-2509
2025-09-22|Qwen3-VL-235B-A22B-Instruct
2025-09-22|Qwen3-VL-235B-A22B-Thinking
2025-09-23|Qwen3Guard-Gen-0.6B
2025-09-23|Qwen3Guard-Gen-4B
2025-09-23|Qwen3Guard-Gen-8B
2025-09-23|Qwen3Guard-Stream-0.6B
2025-09-23|Qwen3Guard-Stream-4B
2025-09-23|Qwen3Guard-Stream-8B
2025-09-30|Qwen3-4B-SafeRL
2025-09-30|Qwen3-VL-30B-A3B-Instruct
2025-09-30|Qwen3-VL-30B-A3B-Thinking
2025-10-11|Qwen3-VL-4B-Instruct
2025-10-11|Qwen3-VL-4B-Thinking
2025-10-11|Qwen3-VL-8B-Instruct
2025-10-11|Qwen3-VL-8B-Thinking
2025-10-19|Qwen3-VL-2B-Instruct
2025-10-19|Qwen3-VL-2B-Thinking
2025-10-19|Qwen3-VL-32B-Instruct
2025-10-19|Qwen3-VL-32B-Thinking
2025-12-17|Qwen-Image-Edit-2511
2025-12-17|Qwen-Image-Layered
2025-12-30|Qwen-Image-2512
2026-01-07|Qwen3-VL-Embedding-2B
2026-01-07|Qwen3-VL-Embedding-8B
2026-01-07|Qwen3-VL-Reranker-2B
2026-01-07|Qwen3-VL-Reranker-8B
2026-01-21|Qwen3-TTS-12Hz-0.6B-Base
2026-01-21|Qwen3-TTS-12Hz-0.6B-CustomVoice
2026-01-21|Qwen3-TTS-12Hz-1.7B-Base
2026-01-21|Qwen3-TTS-12Hz-1.7B-CustomVoice
2026-01-21|Qwen3-TTS-12Hz-1.7B-VoiceDesign
2026-01-21|Qwen3-TTS-Tokenizer-12Hz
2026-01-28|Qwen3-ASR-0.6B
2026-01-28|Qwen3-ASR-1.7B
2026-01-28|Qwen3-ForcedAligner-0.6B
2026-01-30|Qwen3-Coder-Next
2026-02-01|Qwen3-Coder-Next-Base
2026-02-16|Qwen3.5-397B-A17B
2026-02-24|Qwen3.5-122B-A10B
2026-02-24|Qwen3.5-27B
2026-02-24|Qwen3.5-35B-A3B
2026-02-24|Qwen3.5-35B-A3B-Base
2026-02-26|Qwen3.5-9B-Base
2026-02-27|Qwen3.5-4B
2026-02-27|Qwen3.5-4B-Base
2026-02-27|Qwen3.5-9B
2026-02-28|Qwen3.5-0.8B
2026-02-28|Qwen3.5-0.8B-Base
2026-02-28|Qwen3.5-2B
2026-02-28|Qwen3.5-2B-Base
`.trim();

function inferQwenParamsAndArchitecture(modelName) {
  const normalizedName = modelName.replaceAll("_", ".");
  const moeMatch = normalizedName.match(/(\d+(?:\.\d+)?)B-A(\d+(?:\.\d+)?)B/i);
  if (moeMatch) {
    return {
      params: `${moeMatch[1]}B（${moeMatch[2]}B 激活）`,
      architecture: "MoE"
    };
  }

  const moeActiveMatch = normalizedName.match(/moe-a(\d+(?:\.\d+)?)b/i);
  if (moeActiveMatch) {
    return {
      params: `A${moeActiveMatch[1]}B（总参数未公开）`,
      architecture: "MoE"
    };
  }

  const denseMatch = normalizedName.match(/(\d+(?:\.\d+)?)B/i);
  if (denseMatch) {
    return {
      params: `${denseMatch[1]}B`,
      architecture: "Dense"
    };
  }

  return {
    params: "未公开",
    architecture: "未公开"
  };
}

function inferQwenType(modelName) {
  const lowerName = modelName.toLowerCase();
  if (lowerName.includes("embedding")) return "Embedding";
  if (lowerName.includes("reranker")) return "Reranker";
  if (lowerName.includes("guard") || lowerName.includes("saferl")) return "安全";
  if (lowerName.includes("coder") || lowerName.startsWith("codeqwen")) return "代码";
  if (lowerName.includes("math")) {
    if (lowerName.includes("prm") || lowerName.includes("-rm")) return "奖励/评测";
    return "数学";
  }
  if (
    lowerName.includes("worldpm")
    || lowerName.includes("helpsteer")
    || lowerName.includes("ultrafeedback")
    || lowerName.includes("rlhflow")
  ) {
    return "奖励/偏好";
  }
  if (lowerName.includes("image")) return "图像";
  if (lowerName.includes("vl") || lowerName.includes("qvq")) return "视觉/多模态";
  if (lowerName.includes("omni")) return "全模态";
  if (
    lowerName.includes("audio")
    || lowerName.includes("asr")
    || lowerName.includes("tts")
    || lowerName.includes("forcedaligner")
  ) {
    return "语音/音频";
  }
  if (lowerName.includes("qwq") || lowerName.includes("thinking")) return "推理";
  return "通用";
}

function inferQwenFamily(modelName) {
  const lowerName = modelName.toLowerCase();
  if (lowerName.startsWith("qwen3.5")) return "Qwen3.5";
  if (lowerName.startsWith("qwen3")) return "Qwen3";
  if (
    lowerName.startsWith("qwen2.5")
    || lowerName.startsWith("qwq")
    || lowerName.startsWith("qvq")
    || lowerName.startsWith("worldpm")
  ) {
    return "Qwen2.5";
  }
  if (lowerName.startsWith("qwen2")) return "Qwen2";
  if (lowerName.startsWith("qwen1.5") || lowerName.startsWith("codeqwen1.5")) return "Qwen1.5";
  if (lowerName.startsWith("qwen-") || lowerName.startsWith("qwen_")) return "Qwen1";
  return "Qwen3";
}

function isDerivedVariantModel(modelName) {
  const lowerName = modelName.toLowerCase();
  const derivedKeywords = [
    "-chat",
    "-instruct",
    "-base",
    "-thinking",
    "-preview",
    "-captioner",
    "customvoice",
    "voicedesign",
    "prm",
    "-rm",
    "helpsteer",
    "ultrafeedback",
    "rlhflow",
    "saferl",
    "-gen-",
    "-stream-",
    "-edit",
    "layered"
  ];
  return derivedKeywords.some((keyword) => lowerName.includes(keyword));
}

function inferQwenMlpStructure(architecture) {
  const lowerArchitecture = String(architecture || "").toLowerCase();
  if (lowerArchitecture.includes("moe")) return "MoE MLP";
  if (lowerArchitecture.includes("dense")) return "Dense MLP";
  return "未公开";
}

function inferQwenAttentionStructure(modelType) {
  if (modelType === "视觉/多模态" || modelType === "全模态" || modelType === "语音/音频" || modelType === "图像") {
    return "多模态注意力";
  }
  if (modelType === "Embedding" || modelType === "Reranker") {
    return "检索/交叉注意力";
  }
  return "文本自注意力";
}

function inferQwenParamTag(params) {
  if (!params || params === "未公开") return "未公开";
  const match = params.match(/(\d+(?:\.\d+)?)B/i);
  if (!match) return "未公开";
  const value = Number(match[1]);
  if (!Number.isFinite(value)) return "未公开";
  if (value < 1) return "<1B";
  if (value < 10) return "1B-10B";
  if (value < 50) return "10B-50B";
  if (value < 100) return "50B-100B";
  return "100B+";
}

function buildQwenAllModels(rawTimeline) {
  return rawTimeline
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [releaseDate, name] = line.split("|");
      const { params, architecture } = inferQwenParamsAndArchitecture(name);
      const type = inferQwenType(name);
      return {
        id: `Qwen/${name}`,
        name,
        releaseDate,
        params,
        architecture,
        type,
        mlpStructure: inferQwenMlpStructure(architecture),
        attentionStructure: inferQwenAttentionStructure(type),
        paramTag: inferQwenParamTag(params),
        family: inferQwenFamily(name),
        isDerived: isDerivedVariantModel(name),
        majorVersionKey: name.startsWith("Qwen3.5-") ? "Qwen3.5" : ""
      };
    });
}

function buildQwenCoreModels(allModels) {
  return allModels.filter((model) => !model.isDerived);
}

const QWEN_ALL_MODELS = buildQwenAllModels(QWEN_RELEASE_TIMELINE_RAW);

const QWEN_MAJOR_VERSION_DETAILS = {
  "Qwen3.5": {
    version: "Qwen3.5",
    title: "Qwen3.5 架构与技术细节",
    summary: "Qwen3.5 采用 Gated DeltaNet 与 Gated Attention 交替堆叠，并结合稀疏 MoE（A 系列）或 Dense FFN（Dense 系列）。",
    architectureDiagram: "./assets/diagrams/qwen3_5_architecture.svg",
    architectureCaption: "架构图（按 Transformer 论文风格重绘，结构参数依据 Qwen 官方模型卡 Hidden Layout）",
    blogUrl: "https://qwen.ai/blog?id=qwen3.5",
    docsUrl: "https://huggingface.co/Qwen/Qwen3.5-397B-A17B",
    sourceNote: "官方来源：Qwen Hugging Face 模型卡 + 官方博客入口（统计日期：2026-03-05）",
    metricsByModelId: {
      "Qwen/Qwen3.5-397B-A17B": {
        modelType: "Causal Language Model with Vision Encoder",
        parameters: "397B 总参数 / 17B 激活参数",
        layers: "60",
        hiddenLayout: "15 × (3 × (Gated DeltaNet → MoE) → 1 × (Gated Attention → MoE))",
        linearHeads: "V:64 / QK:16",
        attentionHeads: "Q:32 / KV:2",
        experts: "512（10 Routed + 1 Shared）",
        context: "262,144（可扩展至 1,010,000）"
      },
      "Qwen/Qwen3.5-122B-A10B": {
        modelType: "Causal Language Model with Vision Encoder",
        parameters: "122B 总参数 / 10B 激活参数",
        layers: "48",
        hiddenLayout: "12 × (3 × (Gated DeltaNet → MoE) → 1 × (Gated Attention → MoE))",
        linearHeads: "V:64 / QK:16",
        attentionHeads: "Q:32 / KV:2",
        experts: "256（8 Routed + 1 Shared）",
        context: "262,144（可扩展至 1,010,000）"
      },
      "Qwen/Qwen3.5-35B-A3B": {
        modelType: "Causal Language Model with Vision Encoder",
        parameters: "35B 总参数 / 3B 激活参数",
        layers: "40",
        hiddenLayout: "10 × (3 × (Gated DeltaNet → MoE) → 1 × (Gated Attention → MoE))",
        linearHeads: "V:32 / QK:16",
        attentionHeads: "Q:16 / KV:2",
        experts: "256（8 Routed + 1 Shared）",
        context: "262,144（可扩展至 1,010,000）"
      },
      "Qwen/Qwen3.5-27B": {
        modelType: "Causal Language Model with Vision Encoder",
        parameters: "27B（Dense）",
        layers: "64",
        hiddenLayout: "16 × (3 × (Gated DeltaNet → FFN) → 1 × (Gated Attention → FFN))",
        linearHeads: "V:48 / QK:16",
        attentionHeads: "Q:24 / KV:4",
        experts: "无（Dense FFN）",
        context: "262,144（可扩展至 1,010,000）"
      },
      "Qwen/Qwen3.5-9B": {
        modelType: "Causal Language Model with Vision Encoder",
        parameters: "9B（Dense）",
        layers: "32",
        hiddenLayout: "8 × (3 × (Gated DeltaNet → FFN) → 1 × (Gated Attention → FFN))",
        linearHeads: "V:32 / QK:16",
        attentionHeads: "Q:16 / KV:4",
        experts: "无（Dense FFN）",
        context: "262,144（可扩展至 1,010,000）"
      },
      "Qwen/Qwen3.5-4B": {
        modelType: "Causal Language Model with Vision Encoder",
        parameters: "4B（Dense）",
        layers: "32",
        hiddenLayout: "8 × (3 × (Gated DeltaNet → FFN) → 1 × (Gated Attention → FFN))",
        linearHeads: "V:32 / QK:16",
        attentionHeads: "Q:16 / KV:4",
        experts: "无（Dense FFN）",
        context: "262,144（可扩展至 1,010,000）"
      },
      "Qwen/Qwen3.5-2B": {
        modelType: "Causal Language Model with Vision Encoder",
        parameters: "2B（Dense）",
        layers: "24",
        hiddenLayout: "6 × (3 × (Gated DeltaNet → FFN) → 1 × (Gated Attention → FFN))",
        linearHeads: "V:16 / QK:16",
        attentionHeads: "Q:8 / KV:2",
        experts: "无（Dense FFN）",
        context: "262,144"
      },
      "Qwen/Qwen3.5-0.8B": {
        modelType: "Causal Language Model with Vision Encoder",
        parameters: "0.8B（Dense）",
        layers: "24",
        hiddenLayout: "6 × (3 × (Gated DeltaNet → FFN) → 1 × (Gated Attention → FFN))",
        linearHeads: "V:16 / QK:16",
        attentionHeads: "Q:8 / KV:2",
        experts: "无（Dense FFN）",
        context: "262,144"
      }
    }
  }
};

const STANDARD_YEARS = [2022, 2023, 2024, 2025, 2026];

const GENERIC_EXCLUDES = [
  "仅统计 2022-2026 主模型",
  "量化/蒸馏/Flash 版本",
  "衍生变体（Chat/Instruct/Base/Preview 等）"
];

const GENERIC_VENDOR_SOURCES = {
  openai: "OpenAI 官方发布记录（统计时间：2026-03-05）",
  anthropic: "Anthropic 官方发布记录（统计时间：2026-03-05）",
  "google-deepmind": "Google DeepMind 官方发布记录（统计时间：2026-03-05）",
  meta: "Meta AI 官方发布记录（统计时间：2026-03-05）",
  xai: "xAI 官方发布记录（统计时间：2026-03-05）",
  mistral: "Mistral AI 官方发布记录（统计时间：2026-03-05）",
  cohere: "Cohere 官方发布记录（统计时间：2026-03-05）",
  microsoft: "Microsoft AI 官方发布记录（统计时间：2026-03-05）",
  aws: "AWS 官方发布记录（统计时间：2026-03-05）",
  nvidia: "NVIDIA AI 官方发布记录（统计时间：2026-03-05）",
  baidu: "百度文心官方发布记录（统计时间：2026-03-05）",
  tencent: "腾讯混元官方发布记录（统计时间：2026-03-05）",
  bytedance: "字节豆包官方发布记录（统计时间：2026-03-05）",
  zhipu: "智谱官方发布记录（统计时间：2026-03-05）",
  moonshot: "月之暗面官方发布记录（统计时间：2026-03-05）",
  minimax: "MiniMax 官方发布记录（统计时间：2026-03-05）",
  deepseek: "DeepSeek 官方发布记录（统计时间：2026-03-05）",
  ai01: "01.AI 官方发布记录（统计时间：2026-03-05）",
  baichuan: "百川智能官方发布记录（统计时间：2026-03-05）",
  iflytek: "科大讯飞官方发布记录（统计时间：2026-03-05）",
  huawei: "华为盘古官方发布记录（统计时间：2026-03-05）",
  sensetime: "商汤日日新官方发布记录（统计时间：2026-03-05）",
  stepfun: "阶跃星辰官方发布记录（统计时间：2026-03-05）",
  modelbest: "面壁智能官方发布记录（统计时间：2026-03-05）"
};

const GENERIC_VENDOR_TIMELINES_RAW = {
  openai: `
2022-11-30|GPT-3.5|未公开|Dense|通用|GPT
2023-03-14|GPT-4|未公开|Dense|通用|GPT
2024-05-13|GPT-4o|未公开|Dense|全模态|GPT
2024-07-18|GPT-4o mini|未公开|Dense|通用|GPT
2025-04-14|GPT-4.1|未公开|Dense|通用|GPT
2025-04-16|o3|未公开|MoE|推理|o
2025-04-16|o4-mini|未公开|MoE|推理|o
`.trim(),
  anthropic: `
2023-03-14|Claude 1|未公开|Dense|通用|Claude
2023-07-11|Claude 2|未公开|Dense|通用|Claude
2024-03-04|Claude 3 Opus|未公开|Dense|通用|Claude 3
2024-06-20|Claude 3.5 Sonnet|未公开|Dense|通用|Claude 3.5
2024-10-22|Claude 3.5 Haiku|未公开|Dense|通用|Claude 3.5
2025-02-24|Claude 3.7 Sonnet|未公开|Dense|推理|Claude 3.7
`.trim(),
  "google-deepmind": `
2023-12-06|Gemini 1.0 Pro|未公开|MoE|多模态|Gemini 1.0
2024-02-15|Gemini 1.5 Pro|未公开|MoE|多模态|Gemini 1.5
2024-05-14|Gemini 1.5 Flash|未公开|MoE|多模态|Gemini 1.5
2024-12-11|Gemini 2.0 Flash|未公开|MoE|多模态|Gemini 2.0
2025-03-25|Gemini 2.5 Pro|未公开|MoE|多模态|Gemini 2.5
2025-08-14|Gemini 2.5 Flash|未公开|MoE|多模态|Gemini 2.5
`.trim(),
  meta: `
2023-07-18|Llama 2 70B|70B|Dense|通用|Llama 2
2024-04-18|Llama 3 70B|70B|Dense|通用|Llama 3
2024-07-23|Llama 3.1 405B|405B|Dense|通用|Llama 3.1
2024-12-06|Llama 3.3 70B|70B|Dense|通用|Llama 3.3
2025-04-05|Llama 4 Scout|未公开|MoE|多模态|Llama 4
`.trim(),
  xai: `
2023-11-04|Grok-1|未公开|Dense|通用|Grok
2024-03-29|Grok-1.5|未公开|Dense|通用|Grok
2024-08-13|Grok-2|未公开|MoE|通用|Grok
2025-02-17|Grok-3|未公开|MoE|推理|Grok
`.trim(),
  mistral: `
2023-09-27|Mistral 7B|7B|Dense|通用|Mistral
2023-12-11|Mixtral 8x7B|46.7B|MoE|通用|Mixtral
2024-02-26|Mistral Large|未公开|Dense|通用|Mistral Large
2024-07-24|Mistral Large 2|123B|Dense|通用|Mistral Large
2025-06-04|Mistral Medium 3|未公开|Dense|通用|Mistral Medium
`.trim(),
  cohere: `
2023-03-14|Command|未公开|Dense|通用|Command
2024-03-11|Command R|35B|Dense|通用|Command R
2024-04-04|Command R+|104B|Dense|通用|Command R
2025-03-13|Command A|未公开|Dense|通用|Command A
`.trim(),
  microsoft: `
2023-12-06|Phi-2|2.7B|Dense|通用|Phi
2024-04-23|Phi-3 Medium|14B|Dense|通用|Phi-3
2024-12-12|Phi-4|14B|Dense|通用|Phi-4
2025-02-26|Phi-4-multimodal|未公开|Dense|多模态|Phi-4
`.trim(),
  aws: `
2023-09-28|Amazon Titan Text G1|未公开|Dense|通用|Titan
2024-04-30|Titan Text Premier|未公开|Dense|通用|Titan
2024-12-03|Amazon Nova Pro|未公开|Dense|多模态|Nova
2024-12-03|Amazon Nova Lite|未公开|Dense|多模态|Nova
2025-01-10|Amazon Nova Micro|未公开|Dense|通用|Nova
`.trim(),
  nvidia: `
2024-06-18|Nemotron-4 340B|340B|Dense|通用|Nemotron
2024-10-15|Llama 3.1 Nemotron 70B|70B|MoE|通用|Nemotron
2025-01-08|Llama 3.3 Nemotron Super 49B|49B|MoE|推理|Nemotron
`.trim(),
  baidu: `
2023-03-16|文心一言|未公开|Dense|通用|ERNIE
2023-10-17|ERNIE 4.0|未公开|MoE|通用|ERNIE 4
2024-06-28|ERNIE 4.0 Turbo|未公开|MoE|通用|ERNIE 4
2025-03-16|ERNIE 4.5|未公开|MoE|通用|ERNIE 4.5
2025-06-30|ERNIE X1|未公开|MoE|推理|ERNIE X
`.trim(),
  tencent: `
2023-09-07|Hunyuan-Large|未公开|Dense|通用|混元
2024-05-30|Hunyuan-Pro|未公开|Dense|通用|混元
2024-11-05|Hunyuan-Large-2024|未公开|Dense|通用|混元
2025-02-27|Hunyuan-T1|未公开|Dense|推理|混元 T
`.trim(),
  bytedance: `
2023-08-16|豆包 1.0|未公开|Dense|通用|豆包
2024-05-15|豆包 Pro|未公开|MoE|通用|豆包 Pro
2024-09-24|豆包 Seed 1.5|未公开|MoE|通用|豆包 Seed
2025-05-16|豆包 Pro 32K|未公开|MoE|通用|豆包 Pro
`.trim(),
  zhipu: `
2023-06-13|ChatGLM2-6B|6B|Dense|通用|GLM
2023-10-27|GLM-4|未公开|MoE|通用|GLM-4
2024-06-05|GLM-4-Air|未公开|MoE|通用|GLM-4
2025-01-15|GLM-4-Plus|未公开|MoE|通用|GLM-4
`.trim(),
  moonshot: `
2023-10-09|Kimi Chat|未公开|Dense|通用|Kimi
2024-03-18|Kimi Long|未公开|Dense|通用|Kimi
2024-10-11|Kimi k1.5|未公开|MoE|推理|Kimi
2025-10-11|Kimi K2|未公开|MoE|推理|Kimi
`.trim(),
  minimax: `
2023-06-20|ABAB-5.5|未公开|Dense|通用|ABAB
2024-09-15|MiniMax-Text-01|456B（45.9B 激活）|MoE|通用|MiniMax Text
2025-01-15|MiniMax-Text-01|456B（45.9B 激活）|MoE|通用|MiniMax Text
2025-07-03|MiniMax-M1|未公开|MoE|通用|MiniMax M
`.trim(),
  deepseek: `
2023-11-02|DeepSeek-Coder|33B|Dense|代码|DeepSeek Coder
2024-05-07|DeepSeek-V2|236B（21B 激活）|MoE|通用|DeepSeek V2
2024-12-26|DeepSeek-V3|671B（37B 激活）|MoE|通用|DeepSeek V3
2025-01-20|DeepSeek-R1|671B（37B 激活）|MoE|推理|DeepSeek R
`.trim(),
  ai01: `
2023-11-05|Yi-34B|34B|Dense|通用|Yi
2024-05-13|Yi-1.5-34B|34B|Dense|通用|Yi 1.5
2024-10-16|Yi-Lightning|未公开|Dense|通用|Yi
2025-06-01|Yi-Large|未公开|Dense|通用|Yi
`.trim(),
  baichuan: `
2023-06-15|Baichuan-13B|13B|Dense|通用|Baichuan
2023-10-30|Baichuan2-53B|53B|Dense|通用|Baichuan2
2024-05-22|Baichuan3-Turbo|未公开|MoE|通用|Baichuan3
2024-11-20|Baichuan4-Turbo|未公开|MoE|通用|Baichuan4
`.trim(),
  iflytek: `
2023-05-06|讯飞星火 V1|未公开|Dense|通用|星火
2023-10-24|讯飞星火 V3|未公开|Dense|通用|星火
2024-10-24|讯飞星火 4.0 Turbo|未公开|Dense|通用|星火 4.0
2025-01-15|讯飞星火 Max|未公开|Dense|通用|星火 Max
`.trim(),
  huawei: `
2023-07-07|盘古大模型 3.0|未公开|Dense|通用|盘古
2024-06-21|盘古大模型 4.0|未公开|Dense|通用|盘古
2025-06-20|盘古大模型 5.0|未公开|Dense|通用|盘古
`.trim(),
  sensetime: `
2023-04-10|SenseNova 1.0|未公开|Dense|通用|SenseNova
2024-04-23|SenseNova 5.0|未公开|MoE|多模态|SenseNova 5
2025-04-10|SenseNova 5o|未公开|MoE|多模态|SenseNova 5
`.trim(),
  stepfun: `
2024-03-14|Step-1|未公开|Dense|通用|Step
2024-10-20|Step-1.5V|未公开|Dense|视觉/多模态|Step
2025-03-10|Step-2|未公开|Dense|推理|Step
`.trim(),
  modelbest: `
2023-02-28|MiniCPM-2B|2B|Dense|通用|MiniCPM
2024-05-16|MiniCPM-Llama3-V-2.5|8B|Dense|视觉/多模态|MiniCPM-V
2024-07-03|MiniCPM-V-2.6|8B|Dense|视觉/多模态|MiniCPM-V
2025-08-15|MiniCPM 4.0|8B|Dense|通用|MiniCPM
`.trim()
};

function inferGenericArchitecture(modelName, architectureHint) {
  if (architectureHint) return architectureHint;
  if (/(\d+(?:\.\d+)?)x(\d+(?:\.\d+)?)b/i.test(modelName)) return "MoE";
  if (/-a(\d+(?:\.\d+)?)b/i.test(modelName)) return "MoE";
  if (/moe|mixtral|nemotron|grok-3|r1/i.test(modelName)) return "MoE";
  return "Dense";
}

function inferGenericType(modelName, typeHint) {
  if (typeHint) return typeHint;
  const lowerName = modelName.toLowerCase();
  if (lowerName.includes("embedding")) return "Embedding";
  if (lowerName.includes("reranker")) return "Reranker";
  if (lowerName.includes("coder") || lowerName.includes("code")) return "代码";
  if (lowerName.includes("math")) return "数学";
  if (lowerName.includes("vision") || lowerName.includes("vl") || lowerName.includes("multimodal")) return "视觉/多模态";
  if (lowerName.includes("audio") || lowerName.includes("speech") || lowerName.includes("asr") || lowerName.includes("tts")) return "语音/音频";
  if (lowerName.includes("reason") || lowerName.includes("think") || lowerName.startsWith("o")) return "推理";
  return "通用";
}

function inferGenericFamily(modelName, familyHint) {
  if (familyHint) return familyHint;
  const plain = String(modelName || "").trim();
  const match = plain.match(/^([A-Za-z\u4e00-\u9fa5]+(?:[-\s]?\d+(?:\.\d+)?)?)/);
  if (!match) return "未分类";
  return match[1].replace(/\s+/g, " ").trim();
}

function inferGenericMlpStructure(architecture) {
  const lowerArchitecture = String(architecture || "").toLowerCase();
  if (lowerArchitecture.includes("moe")) return "MoE MLP";
  if (lowerArchitecture.includes("dense")) return "Dense MLP";
  return "未公开";
}

function inferGenericAttentionStructure(modelType) {
  if (modelType === "视觉/多模态" || modelType === "多模态" || modelType === "全模态" || modelType === "语音/音频" || modelType === "图像") {
    return "多模态注意力";
  }
  if (modelType === "Embedding" || modelType === "Reranker") {
    return "检索/交叉注意力";
  }
  return "文本自注意力";
}

function buildGenericModelsFromTimeline(vendorId, rawTimeline) {
  if (!rawTimeline) return [];
  return rawTimeline
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [releaseDate, name, paramsRaw, architectureRaw, typeRaw, familyRaw] = line.split("|").map((part) => part.trim());
      const architecture = inferGenericArchitecture(name, architectureRaw);
      const type = inferGenericType(name, typeRaw);
      const params = paramsRaw || inferQwenParamsAndArchitecture(name).params || "未公开";
      return {
        id: `${vendorId}/${name}`,
        name,
        releaseDate,
        params,
        architecture,
        type,
        family: inferGenericFamily(name, familyRaw),
        mlpStructure: inferGenericMlpStructure(architecture),
        attentionStructure: inferGenericAttentionStructure(type),
        paramTag: inferQwenParamTag(params),
        isDerived: isDerivedVariantModel(name),
        majorVersionKey: ""
      };
    });
}

function buildGenericModelsFromFallback(vendorId) {
  return (window.AGIptrModels || [])
    .filter((model) => model.vendorId === vendorId)
    .map((model) => {
      const architecture = model.architecture || "未公开";
      const type = inferGenericType(model.name, "通用");
      const params = model.params || "未公开";
      return {
        id: `${vendorId}/${model.name}`,
        name: model.name,
        releaseDate: model.releaseDate,
        params,
        architecture,
        type,
        family: inferGenericFamily(model.name),
        mlpStructure: inferGenericMlpStructure(architecture),
        attentionStructure: inferGenericAttentionStructure(type),
        paramTag: inferQwenParamTag(params),
        isDerived: isDerivedVariantModel(model.name),
        majorVersionKey: ""
      };
    });
}

function buildGenericVendorDetail(vendorMeta) {
  const rawTimeline = GENERIC_VENDOR_TIMELINES_RAW[vendorMeta.id] || "";
  const allModels = rawTimeline
    ? buildGenericModelsFromTimeline(vendorMeta.id, rawTimeline)
    : buildGenericModelsFromFallback(vendorMeta.id);
  const coreModels = allModels.filter((model) => !model.isDerived);
  return {
    id: vendorMeta.id,
    name: vendorMeta.name,
    logo: vendorMeta.logo,
    years: STANDARD_YEARS,
    source: GENERIC_VENDOR_SOURCES[vendorMeta.id] || `官方发布记录（统计时间：2026-03-05）`,
    excludes: [...GENERIC_EXCLUDES],
    models: coreModels,
    allModels,
    majorVersionDetails: {}
  };
}

function buildVendorDetailsMap() {
  const details = {};
  (window.AGIptrVendors || []).forEach((vendorMeta) => {
    if (vendorMeta.id === "alibaba") return;
    details[vendorMeta.id] = buildGenericVendorDetail(vendorMeta);
  });
  details.alibaba = {
    id: "alibaba",
    name: "Qwen（通义千问）",
    logo: "./assets/logos/alibaba.png",
    years: STANDARD_YEARS,
    source: "Hugging Face · Qwen 官方账号（统计时间：2026-03-05）",
    excludes: [
      "量化版本（AWQ / GPTQ / GGUF / Int4 / Int8 / FP8 / MLX / 4bit / 6bit / 8bit）",
      "Flash 版本",
      "衍生版本（Chat / Instruct / Base / Thinking 等）"
    ],
    models: buildQwenCoreModels(QWEN_ALL_MODELS),
    allModels: QWEN_ALL_MODELS,
    majorVersionDetails: QWEN_MAJOR_VERSION_DETAILS
  };
  return details;
}

const AGIptrVendorDetails = buildVendorDetailsMap();

window.AGIptrVendorDetails = AGIptrVendorDetails;
