# Reflection — ViralSpark AI

What was easy?

Scaffolding the app and building the UI was straightforward: Vite + React + TypeScript provided a fast feedback loop and predictable build output. Wiring file uploads, a preview, and a results dashboard delivered immediate visual payoff and made it easy to capture screenshots for the submission.

What was difficult?

Designing meaningful, actionable AI feedback without an LLM or frame-level video model required careful heuristics. The hardest parts were (a) avoiding repetitive generic advice, (b) deciding which signals to weigh (caption patterns, duration, thumbnail heuristics), and (c) keeping the output useful while remaining deterministic and explainable for judges.

What would you do differently?

If I had more time I'd integrate a real LLM and lightweight multimodal model to analyze frame-level motion and audio for the first 3 seconds. I would also add a data-backed benchmark dataset, A/B testing hooks, and persistent session history so creators could track improvements across versions.

What did you learn?

I learned that clarity and actionability matter more than a single score. Judges and creators need a quick signal (0–100) plus one clearly stated reason to act and the single biggest fix. Iterating prompts and adding `topReason` + `biggestFix` dramatically improved perceived usefulness. I also learned practical tradeoffs: heuristics make the tool reproducible and fast, while model-driven analysis would improve nuance at the cost of infrastructure complexity.

Next steps (short list)

- Connect `analyzeContent` to an LLM or multimodal inference endpoint for deeper explanations and rewrite suggestions.
- Add history/session tracking and A/B comparison tools for creators.
- Collect a small benchmark dataset and tune scoring weights against real performance metrics.

---

Files referenced in this submission:

- `src/lib/analyzer.ts` — scoring heuristics
- `src/App.tsx` — UI and flows
- `LOOM_SCRIPT.md` — suggested recording script
- `ai-logs.md` — AI development log with prompt history
