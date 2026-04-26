import { useEffect, useMemo, useState } from "react";
import { analyzeContent } from "./lib/analyzer";
import type { Niche, Platform, UploadInput, ViralityReport } from "./types";

const platforms: Platform[] = ["TikTok", "Instagram Reels", "YouTube Shorts"];
const niches: Niche[] = ["Fitness", "Beauty", "Business", "Comedy", "Gaming", "Education"];

const demoInput: UploadInput = {
  file: new File(["demo"], "viral-demo-cover.png", { type: "image/png" }),
  caption: "Stop scrolling: this 3-step content edit doubled saves in 24 hours #CreatorEconomy",
  platform: "TikTok",
  niche: "Business",
  durationSeconds: 18
};

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [caption, setCaption] = useState<string>(demoInput.caption);
  const [platform, setPlatform] = useState<Platform>("TikTok");
  const [niche, setNiche] = useState<Niche>("Business");
  const [durationSeconds, setDurationSeconds] = useState<number | undefined>(18);
  const [report, setReport] = useState<ViralityReport | null>(() => analyzeContent(demoInput));
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const loadDemo = () => {
    setFile(demoInput.file);
    setCaption(demoInput.caption);
    setPlatform(demoInput.platform);
    setNiche(demoInput.niche);
    setDurationSeconds(demoInput.durationSeconds);
    setReport(analyzeContent(demoInput));
  };

  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      setDurationSeconds(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const scoreRing = useMemo(() => {
    const score = report?.totalScore ?? 0;
    const clamped = Math.max(0, Math.min(100, score));
    return {
      background: `conic-gradient(#e85d04 ${clamped * 3.6}deg, rgba(255,255,255,0.15) 0deg)`
    };
  }, [report]);

  async function handleAnalyze(): Promise<void> {
    if (!file) return;

    setIsAnalyzing(true);
    await new Promise((resolve) => setTimeout(resolve, 700));

    const payload: UploadInput = {
      file,
      caption,
      platform,
      niche,
      durationSeconds
    };

    const nextReport = analyzeContent(payload);
    setReport(nextReport);
    setIsAnalyzing(false);
  }

  return (
    <div className="page-shell">
      <header className="hero">
        <p className="eyebrow">GO VIRAL CLONE</p>
        <h1>AI Content Virality Analyzer</h1>
        <p>
          Upload your video or image, get a virality score, and receive concrete edits for hook,
          pacing, caption, and trend fit.
        </p>
        <div className="hero-actions">
          <button className="secondary-button" type="button" onClick={loadDemo}>
            Load example
          </button>
          <span className="hero-note">Example output is shown below so the app is visible immediately.</span>
        </div>
      </header>

      <main className="grid">
        <section className="panel upload-panel">
          <h2>1) Upload Content</h2>
          <label className="file-drop" htmlFor="file-upload">
            <input
              id="file-upload"
              type="file"
              accept="video/*,image/*"
              onChange={(event) => {
                const selected = event.target.files?.[0] ?? null;
                setFile(selected);
                setReport(null);
              }}
            />
            <span>{file ? file.name : "Drop video/image or click to browse"}</span>
          </label>

          <div className="two-col">
            <label>
              Platform
              <select value={platform} onChange={(event) => setPlatform(event.target.value as Platform)}>
                {platforms.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Niche
              <select value={niche} onChange={(event) => setNiche(event.target.value as Niche)}>
                {niches.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label>
            Caption
            <textarea
              placeholder="Paste your current caption here..."
              value={caption}
              onChange={(event) => setCaption(event.target.value)}
              rows={5}
            />
          </label>

          <button disabled={!file || isAnalyzing} onClick={handleAnalyze}>
            {isAnalyzing ? "Analyzing with AI..." : "Analyze Viral Potential"}
          </button>
        </section>

        <section className="panel preview-panel">
          <h2>2) Creative Preview</h2>
          {!previewUrl && <p className="placeholder">Upload a file to preview your creative.</p>}

          {previewUrl && file?.type.startsWith("image/") && (
            <img className="preview-media" src={previewUrl} alt="Uploaded creative" />
          )}

          {previewUrl && file?.type.startsWith("video/") && (
            <video
              className="preview-media"
              src={previewUrl}
              controls
              onLoadedMetadata={(event) => {
                setDurationSeconds(event.currentTarget.duration);
              }}
            />
          )}

          <div className="hint-box">
            <p>Hook analysis uses your opening caption line, video duration, and niche benchmark data.</p>
          </div>
        </section>
      </main>

      <section className="panel results-panel">
        <h2>3) AI Virality Results</h2>
        {!report && <p className="placeholder">Run analysis to see your score breakdown and tactical edits.</p>}

        {report && (
          <>
            <div className="result-top">
              <div className="score-ring" style={scoreRing}>
                <div>
                  <strong>{report.totalScore}</strong>
                  <span>/100</span>
                </div>
              </div>

              <div>
                <h3>{report.hookSummary}</h3>
                <p>
                  Confidence: <strong>{report.confidence}</strong>
                </p>
                <p>
                  Top 1 reason: <strong>{report.topReason}</strong>
                </p>
                <p>
                  Biggest fix: <strong>{report.biggestFix}</strong>
                </p>
              </div>
            </div>

            <div className="score-grid">
              {report.scoreBreakdown.map((item) => (
                <article key={item.label} className="score-card">
                  <header>
                    <h4>{item.label}</h4>
                    <span>{item.score}</span>
                  </header>
                  <p>{item.insight}</p>
                  <p className="action">Action: {item.action}</p>
                </article>
              ))}
            </div>

            <div className="deep-grid">
              <article className="detail-card">
                <h4>First 3s Hook Timeline</h4>
                <ul>
                  {report.hookTimeline.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ul>
              </article>

              <article className="detail-card">
                <h4>Caption Optimization Suggestions</h4>
                <ul>
                  {report.captionSuggestions.map((tip) => (
                    <li key={tip}>{tip}</li>
                  ))}
                </ul>
              </article>

              <article className="detail-card">
                <h4>Competitor Comparison</h4>
                <p>
                  Benchmark: <strong>{report.competitor.benchmarkName}</strong>
                </p>
                <p>
                  Your projected views: <strong>{report.competitor.yourProjectedViews}</strong>
                </p>
                <p>
                  Benchmark views: <strong>{report.competitor.benchmarkViews}</strong>
                </p>
                <p>{report.competitor.gapSummary}</p>
              </article>

              <article className="detail-card">
                <h4>Trending Audio + Hashtags</h4>
                <p>Audio</p>
                <div className="chip-row">
                  {report.trendingAudio.map((item) => (
                    <span key={item} className="chip chip-audio">
                      {item}
                    </span>
                  ))}
                </div>
                <p>Hashtags</p>
                <div className="chip-row">
                  {report.trendingHashtags.map((item) => (
                    <span key={item} className="chip chip-tag">
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            </div>

            <article className="detail-card checklist">
              <h4>Execution Checklist</h4>
              <ul>
                {report.executionChecklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </>
        )}
      </section>
    </div>
  );
}

export default App;