# 🎬 Movie Recommendation System

A sophisticated Movie Recommendation System that uses advanced similarity algorithms to suggest movies based on user preferences. Built with HTML, CSS, JavaScript, and Node.js backend, this system implements **Jaccard Similarity**, **Cosine Similarity**, and **Levenshtein Distance** algorithms to provide accurate movie recommendations.

**Now with secure Node.js backend and OMDb API integration for thousands of movies!** 🎥

![Movie Recommendation System](https://img.shields.io/badge/Status-Active-success)
![License](https://img.shields.io/badge/License-MIT-blue)
![HTML](https://img.shields.io/badge/HTML-5-orange)
![CSS](https://img.shields.io/badge/CSS-3-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow)
![Node.js](https://img.shields.io/badge/Node.js-14+-green)

## ✨ Features

- 🔍 **Smart Movie Search** - Find movies with fuzzy matching using Levenshtein distance
- 🌐 **OMDb API Integration** - Search from thousands of real movies with IMDb ratings
- � **Secure Backend** - Node.js/Express server keeps your API key safe
- �🖼️ **Movie Posters** - Visual display with movie posters from OMDb
- 🎯 **Multiple Recommendation Algorithms**:
  - Jaccard Similarity - Set-based comparison
  - Cosine Similarity - Vector-based similarity measurement
  - Levenshtein Distance - Edit distance calculation
  - Combined Algorithm - Weighted combination of all three methods
- 📊 **Similarity Scoring** - See how closely each recommendation matches your selected movie
- 🎨 **Modern UI** - Netflix-inspired dark theme with responsive design
- ⚡ **Fast Performance** - Client-side processing with intelligent caching
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- 💾 **Hybrid Mode** - Works with or without API (fallback to local database)
- � **Deploy Anywhere** - Easy deployment to Vercel, Render, or any Node.js host

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- A modern web browser
- OMDb API key (free) - [Get it here](http://www.omdbapi.com/apikey.aspx)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Singh-Gursimar/Movie-Recommendation-System.git
   cd Movie-Recommendation-System
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   API_KEY=your_omdb_api_key_here
   PORT=3000
   ```

4. **Setup Kaggle movie database** (Optional - for larger dataset)
   
   **If CSV is already in the repo:**
   ```bash
   npm run process-kaggle
   ```
   
   **If you need to download it:**
   - Download from: https://www.kaggle.com/datasets/rajugc/imdb-movies-dataset-based-on-genre
   - Place CSV in `data/` folder
   - Run: `npm run process-kaggle`

5. **Start the server**
   ```bash
   npm start
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:3000`

## 🔑 Getting Your OMDb API Key

1. Visit: http://www.omdbapi.com/apikey.aspx
2. Select **FREE** tier (1,000 daily requests)
3. Enter your email and verify
4. Copy the API key from your email
5. Add it to your `.env` file

## 🌐 Deployment

### Deploy to Vercel (Recommended - Free & Easy)

1. **Install Vercel CLI** (optional)
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Add Environment Variable**
   - Go to your Vercel project settings
   - Add `API_KEY` with your OMDb API key
   - Redeploy

**Or use Vercel's GitHub integration:**
1. Push your code to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Add `API_KEY` environment variable
4. Deploy!

### Deploy to Render (Alternative)

1. Create account at [render.com](https://render.com)
2. Create a new "Web Service"
3. Connect your GitHub repository
4. Set Build Command: `npm install`
5. Set Start Command: `npm start`
6. Add environment variable: `API_KEY`
7. Deploy!

## 📖 Usage

### Searching for Movies:
1. **Enter any movie title** - "Inception", "Titanic", "Avatar", etc.
2. **View detailed info** - See movie poster, rating, director, runtime, actors
3. **Get recommendations** - Based on similarity algorithms

### Using Different Algorithms:
1. **Select an algorithm** from the dropdown (Jaccard, Cosine, Levenshtein, Combined)
2. **Recommendations update automatically**
3. **Compare results** across different algorithms

### Exploring Recommendations:
1. **Search for a Movie**
   - Type a movie title in the search box
   - Click "Search" or press Enter
   - The system will find the closest match using fuzzy search

2. **Select Recommendation Algorithm**
   - Choose from Jaccard, Cosine, Levenshtein, or Combined
   - Recommendations update automatically when you change algorithms

3. **View Recommendations**
   - See top 6 similar movies with similarity scores
   - Click on any recommended movie to explore more recommendations

Algorithms Explained

Jaccard Similarity
Measures similarity between two sets based on their intersection and union.
```
J(A, B) = |A ∩ B| / |A ∪ B|
```
Best for : Comparing movies with distinct genre or keyword sets.

Cosine Similarity
Measures the cosine of the angle between two vectors in multi-dimensional space.
```
cos(θ) = (A · B) / (||A|| × ||B||)
```
**Best for**: Comparing movies based on description word frequency.

### Levenshtein Distance
Measures the minimum number of single-character edits needed to change one string into another.
```
Converted to similarity: 1 - (distance / max_length)
```
**Best for**: Finding movies with similar titles or exact text matching.

### Combined Algorithm
Weighted average of all three algorithms:
```
Combined = 0.3 × Jaccard + 0.4 × Cosine + 0.3 × Levenshtein
```
**Best for**: Overall best recommendations using multiple factors.

## 📁 Project Structure

```
Movie-Recommendation-System/
├── server.js              # Node.js/Express backend server
├── package.json           # Node.js dependencies
├── vercel.json           # Vercel deployment configuration
├── .env                  # Environment variables (not committed)
├── .env.example          # Example environment file
├── .gitignore            # Git ignore rules
├── index.html            # Main HTML file
├── css/
│   └── style.css        # Styling and layout
├── js/
│   ├── config.js        # Frontend API configuration
│   ├── algorithms.js    # Similarity algorithm implementations
│   └── app.js          # Main application logic
├── data/
│   ├── movies.json          # Movie database (from Kaggle or default)
│   └── KAGGLE_SETUP.md      # Kaggle dataset setup guide
├── scripts/
│   ├── download-kaggle-data.js   # Auto-download Kaggle dataset
│   ├── download-simple.js        # Simple curl-based downloader
│   └── process-kaggle-data.js    # Convert CSV to JSON
├── server.js                 # Node.js/Express backend
├── package.json             # Dependencies and scripts
└── README.md                # Documentation
```

## 🎬 Movie Database

### OMDb API (Backend Integration):
- **Access to 1000s of movies** from the OMDb database
- Real-time IMDb ratings and information
- Movie posters and detailed metadata
- Director, actors, runtime, awards, and more
- **Secure**: API key protected on backend

### Kaggle Dataset (Recommended for Local Database):
- **IMDB Movies Dataset Based on Genre** from Kaggle
- Thousands of movies with comprehensive metadata
- Ratings, genres, descriptions, years, and more
- Automatic download and processing with `npm run download-kaggle`
- Dataset URL: https://www.kaggle.com/datasets/rajugc/imdb-movies-dataset-based-on-genre

### Default Database (Fallback):
The system includes 30 popular movies with:
- Title
- Year of release
- IMDb rating
- Genres
- Detailed descriptions

**Note:** With the backend API + Kaggle dataset, you have both online (OMDb) and offline (Kaggle) movie access!

## 📥 Kaggle Dataset Setup

### If CSV is Included in Repo:

Simply run:
```bash
npm run process-kaggle
```

This will convert the CSV to `movies.json` and you're done! ✅

### If You Need to Download the CSV:

**Option 1: Manual Download (Easiest)**

1. Visit: https://www.kaggle.com/datasets/rajugc/imdb-movies-dataset-based-on-genre
2. Click "Download" (requires free Kaggle account)
3. Extract and place CSV in `data/` folder
4. Run: `npm run process-kaggle`

**Option 2: Using curl**

```bash
# Download
curl -L -o data/imdb-movies-dataset.zip \
  https://www.kaggle.com/api/v1/datasets/download/rajugc/imdb-movies-dataset-based-on-genre

# Extract (Windows PowerShell)
Expand-Archive -Path data/imdb-movies-dataset.zip -DestinationPath data/ -Force

# Or extract (Mac/Linux)
unzip data/imdb-movies-dataset.zip -d data/

# Process
npm run process-kaggle
```

**Option 3: Using npm script**

```bash
npm run download-kaggle  # Downloads automatically
npm run process-kaggle   # Converts to JSON
```

See `data/README.md` for more details.

## 🛠️ Customization

### Backend Configuration

Edit `.env` file:

```env
API_KEY=your_omdb_api_key
PORT=3000
```

### Frontend Configuration

The frontend automatically detects the backend URL. For custom setups, edit `js/config.js`:

```javascript
const CONFIG = {
    API_BASE_URL: window.location.origin, // Or set custom URL
    USE_LOCAL_FALLBACK: true,
    CACHE_DURATION: 3600000,
};
```

### Adding More Movies to Local Database

Edit `data/movies.json` and add new movie objects:

```json
{
    "id": 31,
    "title": "Your Movie Title",
    "year": 2023,
    "rating": 8.5,
    "genre": ["Action", "Drama"],
    "description": "Movie description here..."
}
```

Adjusting Algorithm Weights

In `js/algorithms.js`, modify the `combinedSimilarity` function:

```javascript
function combinedSimilarity(str1, str2) {
    const jaccard = jaccardSimilarity(str1, str2);
    const cosine = cosineSimilarity(str1, str2);
    const levenshtein = levenshteinSimilarity(str1, str2);
    
    // Adjust weights here (must sum to 1.0)
    return (jaccard * 0.3 + cosine * 0.4 + levenshtein * 0.3);
}
```

Changing Number of Recommendations

In `js/app.js`, modify the `displayRecommendations` function:

```javascript
const recommendations = getRecommendations(moviesData, selectedMovie, algorithm, 6);
// Change 6 to your desired number
```

## 🔧 Technologies Used

- **Frontend**:
  - HTML5 - Structure and semantics
  - CSS3 - Styling, animations, and responsive design
  - JavaScript (ES6) - Logic and algorithms
  
- **Backend**:
  - Node.js - Server runtime
  - Express.js - Web framework
  - node-fetch - API requests
  - dotenv - Environment variables
  - CORS - Cross-origin resource sharing

- **APIs & Data**:
  - OMDb API - External movie database
  - JSON - Local data storage

- **Deployment**:
  - Vercel / Render compatible
  - Docker ready (optional)

## 📊 Performance

- ⚡ **Fast backend** - Express.js handles requests efficiently
- 🚀 **Client-side algorithms** - Recommendations calculated instantly
- 💾 **Intelligent caching** - Reduces API calls and improves speed
- 📦 **Lightweight** - Minimal dependencies
- 🔒 **Secure** - API key never exposed to client

## ❓ FAQ

**Q: Do I need Node.js to run this?**  
A: Yes, for the full experience with OMDb API. The backend protects your API key.

**Q: Can I still use it without Node.js?**  
A: Yes! The local database (30 movies) works without the backend, but you won't get OMDb movies.

**Q: How do I deploy to Vercel/Render?**  
A: See the [Deployment](#-deployment) section above. It's very simple!

**Q: Is my API key safe?**  
A: Yes! Your API key is stored in `.env` on the backend and never sent to the client.

**Q: Can I use this on GitHub Pages?**  
A: GitHub Pages only hosts static files. You need to deploy the Node.js backend to Vercel/Render, but can host the frontend on GitHub Pages separately.

**Q: How many requests can I make?**  
A: OMDb free tier: 1,000 requests/day. Perfect for personal projects!

**Q: Can I add more movies to the local database?**  
A: Absolutely! Edit `data/movies.json` to add more movies.

## 🙏 Acknowledgments

- Movie data from [OMDb API](http://www.omdbapi.com/)
- Local database inspired by IMDb ratings
- UI design inspired by Netflix
- Algorithm implementations based on standard computer science principles
