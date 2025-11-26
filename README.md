# 🎬 Movie Recommendation System

A movie recommendation web app using similarity algorithms. Built for CS 2420 Data Structures.

## Features

- 🔍 Search movies with fuzzy matching
- 🎯 Multiple algorithms: Jaccard, Cosine, Levenshtein, Combined
- 🖼️ Movie posters (client-side generated, no API needed)
- 📊 Similarity scores for each recommendation
- ⚡ Fast client-side processing

## Quick Start

```bash
npm install
npm start
```

Open http://localhost:3000

### Optional: OMDb API

To get real movie posters, add `API_KEY` environment variable in Vercel settings with your OMDb API key.

Get free key: http://www.omdbapi.com/apikey.aspx

## How It Works

Uses three similarity algorithms:
- **Jaccard**: Set-based comparison
- **Cosine**: Vector similarity  
- **Levenshtein**: Edit distance

Combined: `0.3×Jaccard + 0.4×Cosine + 0.3×Levenshtein`

## License

MIT
