export type Platform = "TikTok" | "Instagram Reels" | "YouTube Shorts";

export type Niche =
  | "Fitness"
  | "Beauty"
  | "Business"
  | "Comedy"
  | "Gaming"
  | "Education";

export interface UploadInput {
  file: File;
  caption: string;
  platform: Platform;
  niche: Niche;
  durationSeconds?: number;
}

export interface ScoreItem {
  label: string;
  score: number;
  insight: string;
  action: string;
}

export interface CompetitorComparison {
  benchmarkName: string;
  benchmarkScore: number;
  yourProjectedViews: string;
  benchmarkViews: string;
  gapSummary: string;
}

export interface ViralityReport {
  totalScore: number;
  confidence: "Low" | "Medium" | "High";
  scoreBreakdown: ScoreItem[];
  hookSummary: string;
  topReason: string;
  biggestFix: string;
  hookTimeline: string[];
  captionSuggestions: string[];
  competitor: CompetitorComparison;
  trendingAudio: string[];
  trendingHashtags: string[];
  executionChecklist: string[];
}