# 🎬 Movie Recommendation System

A movie recommendation web app using similarity algorithms.

## Features

- 🔍 Search movies with fuzzy matching
- 🎯 Multiple algorithms: Jaccard, Cosine, Levenshtein, Combined
- 🖼️ Movie posters (client-side generated, no API needed)
- 📊 Similarity scores for each recommendation
- ⚡ Fast client-side processing

## How It Works

Uses three similarity algorithms:
- **Jaccard**: Set-based comparison
- **Cosine**: Vector similarity  
- **Levenshtein**: Edit distance

Combined: `0.3×Jaccard + 0.4×Cosine + 0.3×Levenshtein`

## License

MIT
