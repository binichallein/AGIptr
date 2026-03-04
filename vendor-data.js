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
    architectureCaption: "架构示意图（依据 Qwen 官方模型卡中的 Hidden Layout 与结构参数整理）",
    blogUrl: "https://qwen.ai/blog?id=qwen3.5",
    docsUrl: "https://huggingface.co/Qwen/Qwen3.5-397B-A17B",
    sourceNote: "官方来源：Qwen Hugging Face 模型卡 + 官方博客入口（统计日期：2026-03-04）",
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

const AGIptrVendorDetails = {
  alibaba: {
    id: "alibaba",
    name: "Qwen（通义千问）",
    logo: "./assets/logos/alibaba.png",
    years: [2022, 2023, 2024, 2025, 2026],
    source: "Hugging Face · Qwen 官方账号（统计时间：2026-03-04）",
    excludes: [
      "量化版本（AWQ / GPTQ / GGUF / Int4 / Int8 / FP8 / MLX / 4bit / 6bit / 8bit）",
      "Flash 版本",
      "衍生版本（Chat / Instruct / Base / Thinking 等）"
    ],
    models: buildQwenCoreModels(QWEN_ALL_MODELS),
    allModels: QWEN_ALL_MODELS,
    majorVersionDetails: QWEN_MAJOR_VERSION_DETAILS
  }
};

window.AGIptrVendorDetails = AGIptrVendorDetails;
