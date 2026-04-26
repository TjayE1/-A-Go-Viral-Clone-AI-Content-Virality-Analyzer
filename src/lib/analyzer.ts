import type {
  CompetitorComparison,
  Niche,
  Platform,
  ScoreItem,
  UploadInput,
  ViralityReport
} from "../types";

const benchmarkByNiche: Record<Niche, { name: string; score: number; views: number }> = {
  Fitness: { name: "Coach clips in your niche", score: 79, views: 320000 },
  Beauty: { name: "Makeup GRWM competitors", score: 82, views: 410000 },
  Business: { name: "Creator-economy explainers", score: 74, views: 210000 },
  Comedy: { name: "Sketch reels benchmark", score: 77, views: 355000 },
  Gaming: { name: "Gameplay reaction accounts", score: 80, views: 430000 },
  Education: { name: "Bite-size tutorial pages", score: 76, views: 250000 }
};

const hashtagLibrary: Record<Niche, string[]> = {
  Fitness: ["#GymTok", "#WorkoutSplit", "#FitnessTips", "#FormCheck", "#ProgressNotPerfection"],
  Beauty: ["#GRWM", "#MakeupHack", "#SkincareRoutine", "#BeautyFinds", "#NoFilterLook"],
  Business: ["#CreatorEconomy", "#SideHustle", "#StartupAdvice", "#MarketingTips", "#BusinessTok"],
  Comedy: ["#Relatable", "#SketchComedy", "#POV", "#FunnyReels", "#InternetHumor"],
  Gaming: ["#GamingClips", "#StreamerMoment", "#RankedGrind", "#GameTok", "#ProTips"],
  Education: ["#LearnOnTikTok", "#StudyHack", "#ExplainedSimply", "#EduCreator", "#QuickLesson"]
};

const audioLibrary: Record<Niche, string[]> = {
  Fitness: ["Pulse Sprint (142 BPM)", "Unstoppable Drop", "Iron Mind Voiceover Bed"],
  Beauty: ["Soft Glow Loop", "Trend Beat 2026", "Morning Routine Pop"],
  Business: ["Hustle Minimal Beat", "Clean Productive Lofi", "Bold Corporate Build"],
  Comedy: ["Perfect Pause Drum", "Unexpected Twist Cue", "Meme Stinger Pack"],
  Gaming: ["Clutch Moment Rise", "Boss Fight Remix", "8-Bit Hyperpop Loop"],
  Education: ["Calm Focus Underscore", "Explainer Pulse", "Light Discovery Theme"]
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function countWords(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function scoreHook(caption: string, fileName: string): ScoreItem {
  let score = 52;
  const cleaned = caption.trim();
  const firstLine = cleaned.split("\n")[0] ?? "";
  const hookWords = /(secret|nobody tells you|mistake|before|after|stop|warning|proof|how I)/i;
  const numbers = /\d/;
  const punctuation = /[!?]/;

  if (hookWords.test(firstLine)) score += 15;
  if (numbers.test(firstLine)) score += 6;
  if (punctuation.test(firstLine)) score += 4;
  if (countWords(firstLine) >= 5 && countWords(firstLine) <= 13) score += 8;
  if (/(final|draft|new|viral|challenge)/i.test(fileName)) score += 4;

  if (!cleaned) score -= 16;
  if (countWords(firstLine) > 18) score -= 6;

  score = clamp(score, 25, 99);

  return {
    label: "Hook Strength",
    score,
    insight: score > 75
      ? "The first line creates immediate curiosity and clear payoff."
      : "The opening could trigger stronger pattern interruption.",
    action: "Use a 5-12 word opener that promises a concrete outcome in 3 seconds."
  };
}

function scorePacing(durationSeconds?: number): ScoreItem {
  let score = 58;

  if (durationSeconds === undefined) {
    score = 61;
  } else if (durationSeconds >= 8 && durationSeconds <= 32) {
    score = 84;
  } else if (durationSeconds > 32 && durationSeconds <= 45) {
    score = 70;
  } else if (durationSeconds > 45) {
    score = 54;
  } else if (durationSeconds < 8) {
    score = 63;
  }

  return {
    label: "Pacing",
    score,
    insight:
      durationSeconds === undefined
        ? "Duration metadata is missing, so pacing confidence is lower."
        : `Current runtime is ${durationSeconds.toFixed(1)}s.`,
    action: "Aim for 8-32 seconds with visual shifts every 1.5-2 seconds."
  };
}

function scoreThumbnail(file: File, caption: string): ScoreItem {
  let score = 55;
  if (file.type.startsWith("image/")) score += 10;
  if (file.size < 8_000_000) score += 6;
  if (/(you|your|this|stop|best|worst|vs)/i.test(caption)) score += 7;
  if (countWords(caption) < 8) score -= 5;

  score = clamp(score, 28, 94);

  return {
    label: "Thumbnail / Cover",
    score,
    insight:
      score > 76
        ? "Your visual setup can stop scroll effectively for cold traffic."
        : "The visual promise can be sharper and more specific.",
    action: "Add bold on-screen text with one emotion word + one outcome word."
  };
}

function scoreCaption(caption: string, platform: Platform): ScoreItem {
  const words = countWords(caption);
  let score = 50;

  if (words >= 12 && words <= 45) score += 20;
  if (/#\w+/.test(caption)) score += 8;
  if (/(save|comment|share|follow|dm)/i.test(caption)) score += 10;
  if (platform === "TikTok") score += 3;
  if (words > 65) score -= 12;
  if (!caption.trim()) score -= 18;

  score = clamp(score, 20, 96);

  return {
    label: "Caption Optimization",
    score,
    insight:
      score > 74
        ? "Caption has clear context and a conversion-oriented CTA."
        : "Caption can improve clarity, keywords, and call-to-action.",
    action: "Format: hook sentence + value sentence + direct CTA + 3-5 niche hashtags."
  };
}

function scoreTrendFit(niche: Niche): ScoreItem {
  const base = benchmarkByNiche[niche].score;
  const score = clamp(Math.round(base - 4 + Math.random() * 10), 50, 90);

  return {
    label: "Trend Fit",
    score,
    insight: "Niche momentum and content framing are moderately aligned with current trends.",
    action: "Use one trending sound and one contrarian angle in the first sentence."
  };
}

function scoreCompetitiveness(totalPreComp: number, niche: Niche): ScoreItem {
  const benchmark = benchmarkByNiche[niche].score;
  const score = clamp(Math.round(70 + (totalPreComp - benchmark) * 0.8), 30, 95);

  return {
    label: "Competitive Edge",
    score,
    insight:
      score >= 75
        ? "You are positioned above the niche median if execution quality is strong."
        : "You are close to benchmark, but differentiation needs to be clearer.",
    action: "Add one unique claim, one proof element, and one controversial micro-opinion."
  };
}

function buildCaptionSuggestions(caption: string): string[] {
  const suggestions: string[] = [];
  const words = countWords(caption);

  if (words < 12) suggestions.push("Expand caption with a specific promise and one sentence of proof.");
  if (!/(save|share|comment|follow|dm)/i.test(caption)) {
    suggestions.push("Add a direct CTA: 'Comment VIRAL for my exact posting framework.'");
  }
  if (!/#\w+/.test(caption)) suggestions.push("Add 3-5 targeted hashtags that match the niche and format.");
  if (!/(today|2026|this week|right now|now)/i.test(caption)) {
    suggestions.push("Include urgency language to increase immediate engagement.");
  }
  suggestions.push("Split long lines into 2-3 short punchy lines for better mobile readability.");

  return suggestions.slice(0, 5);
}

function buildHookTimeline(totalScore: number): string[] {
  if (totalScore >= 80) {
    return [
      "0.0s-0.8s: Open with a high-contrast visual and bold claim overlay.",
      "0.8s-2.0s: Reveal proof (result, screenshot, or transformation).",
      "2.0s-3.0s: Bridge into value with a fast verbal promise."
    ];
  }

  return [
    "0.0s-1.0s: Replace intro fluff with an immediate pain-point statement.",
    "1.0s-2.2s: Show the end result first, then explain how.",
    "2.2s-3.0s: Add a curiosity gap sentence: 'Wait for step 2, it changes everything.'"
  ];
}

function buildCompetitorComparison(niche: Niche, totalScore: number): CompetitorComparison {
  const benchmark = benchmarkByNiche[niche];
  const projectedViews = Math.round((benchmark.views * totalScore) / benchmark.score);
  const gap = totalScore - benchmark.score;

  return {
    benchmarkName: benchmark.name,
    benchmarkScore: benchmark.score,
    yourProjectedViews: projectedViews.toLocaleString(),
    benchmarkViews: benchmark.views.toLocaleString(),
    gapSummary:
      gap >= 0
        ? `You are projected ${gap} points above benchmark. Focus on consistency to realize this upside.`
        : `You are ${Math.abs(gap)} points below benchmark. Tighten your hook and CTA to close the gap.`
  };
}

function buildTopReason(bestItem: ScoreItem): string {
  return `${bestItem.label} is your strongest lever right now (${bestItem.score}/100): ${bestItem.insight}`;
}

function buildBiggestFix(weakestItem: ScoreItem): string {
  return `Your biggest upside is ${weakestItem.label} (${weakestItem.score}/100). ${weakestItem.action}`;
}

export function analyzeContent(input: UploadInput): ViralityReport {
  const hook = scoreHook(input.caption, input.file.name);
  const pacing = scorePacing(input.durationSeconds);
  const thumbnail = scoreThumbnail(input.file, input.caption);
  const caption = scoreCaption(input.caption, input.platform);
  const trendFit = scoreTrendFit(input.niche);

  const interimAvg = Math.round(
    (hook.score + pacing.score + thumbnail.score + caption.score + trendFit.score) / 5
  );
  const competitiveness = scoreCompetitiveness(interimAvg, input.niche);

  const scoreBreakdown: ScoreItem[] = [
    hook,
    pacing,
    thumbnail,
    caption,
    trendFit,
    competitiveness
  ];

  const totalScore = clamp(
    Math.round(scoreBreakdown.reduce((sum, item) => sum + item.score, 0) / scoreBreakdown.length),
    0,
    100
  );

  const confidence: "Low" | "Medium" | "High" =
    input.durationSeconds === undefined ? "Medium" : totalScore >= 75 ? "High" : "Medium";

  const captionSuggestions = buildCaptionSuggestions(input.caption);
  const hookTimeline = buildHookTimeline(totalScore);
  const competitor = buildCompetitorComparison(input.niche, totalScore);
  const strongestDimension = scoreBreakdown.reduce((best, item) =>
    item.score > best.score ? item : best
  );
  const weakestDimension = scoreBreakdown.reduce((worst, item) =>
    item.score < worst.score ? item : worst
  );

  return {
    totalScore,
    confidence,
    scoreBreakdown,
    hookSummary:
      totalScore >= 78
        ? "Strong opening mechanics with clear payoff potential in the first 3 seconds."
        : "Your concept has potential, but the first 3 seconds need stronger contrast and clearer stakes.",
    topReason: buildTopReason(strongestDimension),
    biggestFix: buildBiggestFix(weakestDimension),
    hookTimeline,
    captionSuggestions,
    competitor,
    trendingAudio: audioLibrary[input.niche],
    trendingHashtags: hashtagLibrary[input.niche],
    executionChecklist: [
      "Film a tighter first shot with visual motion in the first 0.5 seconds.",
      "Overlay a 4-7 word hook text before 1 second.",
      "Cut dead space to keep average shot length under 2 seconds.",
      "Pin a CTA comment to increase follow-up engagement.",
      "A/B test two captions and compare 30-minute retention stats."
    ]
  };
}