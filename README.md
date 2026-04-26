# Go Viral Clone - AI Content Virality Analyzer

This project is a challenge-ready clone inspired by **Go Viral: AI Creator Assistant**.

## What it does

- Upload video or image content.
- Generate a virality score (0-100) with category-level breakdown.
- Analyze hook quality for the first 3 seconds.
- Suggest caption optimization edits.
- Compare against niche competitors.
- Recommend trending audio and hashtags.

## Run locally

```bash
npm install
npm run dev
```

Build production bundle:

```bash
npm run build
```

## Demo checklist for judging

1. **Screenshots**
   - Upload flow
   - Analysis dashboard
   - Hook timeline + trend recommendations
2. **Loom walkthrough**
   - Upload test creative
   - Analyze and explain actionable edits
   - Show niche/platform switch and score impact
3. **AI logs**
   - Save prompt/iteration notes in your dev workflow
4. **Code quality**
   - See `src/lib/analyzer.ts` for scoring logic
5. **Reflection**
   - Add a short section on trade-offs and next improvements

## Tech

- React + TypeScript + Vite
- Local heuristic "AI" scoring engine (extensible to real model API)