# 🎬 Movie Recommendation System# 🎬 Movie Recommendation System



## CS 2420 - Data Structures Project | Fall 2024A sophisticated Movie Recommendation System that uses advanced similarity algorithms to suggest movies based on user preferences. Built with HTML, CSS, JavaScript, and Node.js backend, this system implements **Jaccard Similarity**, **Cosine Similarity**, and **Levenshtein Distance** algorithms to provide accurate movie recommendations.



A movie recommendation system I built for my Data Structures class that uses similarity algorithms to suggest movies. This was my first time working with algorithms like this and building a full-stack web app!**Now with secure Node.js backend and OMDb API integration for thousands of movies!** 🎥



## What It Does![Movie Recommendation System](https://img.shields.io/badge/Status-Active-success)

![License](https://img.shields.io/badge/License-MIT-blue)

Type in a movie you like, and it'll recommend similar ones based on:![HTML](https://img.shields.io/badge/HTML-5-orange)

- What the movie is about (description)![CSS](https://img.shields.io/badge/CSS-3-blue)

- The genres![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow)

- The ratings![Node.js](https://img.shields.io/badge/Node.js-14+-green)



I'm using three different algorithms (Jaccard, Cosine, and Levenshtein) and combining them to get better results. Pretty cool how they all work together!## ✨ Features



## Technologies Used- 🔍 **Smart Movie Search** - Find movies with fuzzy matching using Levenshtein distance

- 🌐 **OMDb API Integration** - Search from thousands of real movies with IMDb ratings

- **Frontend**: HTML, CSS, JavaScript- � **Secure Backend** - Node.js/Express server keeps your API key safe

- **Backend**: Node.js with Express- �🖼️ **Movie Posters** - Visual display with movie posters from OMDb

- **API**: OMDb API (for movie data)- 🎯 **Multiple Recommendation Algorithms**:

- **Database**: JSON file with 84,000+ movies from Kaggle  - Jaccard Similarity - Set-based comparison

  - Cosine Similarity - Vector-based similarity measurement

## How to Run This  - Levenshtein Distance - Edit distance calculation

  - Combined Algorithm - Weighted combination of all three methods

### You'll Need:- 📊 **Similarity Scoring** - See how closely each recommendation matches your selected movie

- Node.js installed on your computer- 🎨 **Modern UI** - Netflix-inspired dark theme with responsive design

- An OMDb API key (it's free! get it at http://www.omdbapi.com/apikey.aspx)- ⚡ **Fast Performance** - Client-side processing with intelligent caching

- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices

### Steps:- 💾 **Hybrid Mode** - Works with or without API (fallback to local database)

- � **Deploy Anywhere** - Easy deployment to Vercel, Render, or any Node.js host

1. Clone this repo

```bash## 🚀 Quick Start

git clone https://github.com/Singh-Gursimar/Movie-Recommendation-System.git

cd Movie-Recommendation-System### Prerequisites

```

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)

2. Install the packages- A modern web browser

```bash- OMDb API key (free) - [Get it here](http://www.omdbapi.com/apikey.aspx)

npm install

```### Local Development



3. Create a `.env` file and add your API key1. **Clone the repository**

```   ```bash

API_KEY=your_api_key_here   git clone https://github.com/Singh-Gursimar/Movie-Recommendation-System.git

PORT=3000   cd Movie-Recommendation-System

```   ```



4. Start the server2. **Install dependencies**

```bash   ```bash

npm start   npm install

```   ```



5. Go to `http://localhost:3000` in your browser3. **Set up environment variables**

   

That's it!   Create a `.env` file in the root directory:

   ```env

## How It Works   API_KEY=your_omdb_api_key_here

   PORT=3000

### The Algorithms (This was the fun part!)   ```



**Jaccard Similarity** - Compares sets of words4. **Setup Kaggle movie database** (Optional - for larger dataset)

- Looks at unique words in movie descriptions   

- Calculates intersection over union   **If CSV is already in the repo:**

- Good for finding movies with similar keywords   ```bash

   npm run process-kaggle

**Cosine Similarity** - Uses vector math   ```

- Creates word frequency vectors   

- Calculates the angle between them   **If you need to download it:**

- Better for semantic similarity   - Download from: https://www.kaggle.com/datasets/rajugc/imdb-movies-dataset-based-on-genre

   - Place CSV in `data/` folder

**Levenshtein Distance** - Edit distance   - Run: `npm run process-kaggle`

- Counts minimum character changes needed

- Useful for fuzzy matching titles5. **Start the server**

- Helps with typos   ```bash

   npm start

**Combined Algorithm** - My custom weighted approach   ```

- 50% Cosine (best for content)

- 30% Jaccard (good for keywords)6. **Open your browser**

- 20% Levenshtein (helps with titles)   

- Then I add genre matching (30%) and rating similarity (20%)   Navigate to `http://localhost:3000`



### Why I Made These Choices## 🔑 Getting Your OMDb API Key



I tested all three algorithms separately and found that Cosine worked best for descriptions, so I gave it the highest weight. Jaccard was good for catching specific genre keywords, and Levenshtein helped when users misspelled movie titles.1. Visit: http://www.omdbapi.com/apikey.aspx

2. Select **FREE** tier (1,000 daily requests)

## Project Structure3. Enter your email and verify

4. Copy the API key from your email

```5. Add it to your `.env` file

Movie-Recommendation-System/

├── index.html              # Main page## 🌐 Deployment

├── css/

│   └── style.css          # Styling (went for a modern dark theme)### Deploy to Vercel (Recommended - Free & Easy)

├── js/

│   ├── algorithms.js      # All the similarity algorithms1. **Install Vercel CLI** (optional)

│   ├── app.js            # Frontend logic   ```bash

│   └── config.js         # API config   npm i -g vercel

├── data/   ```

│   └── movies.json       # 84k movies (filtered to rating > 5.0)

├── server.js             # Express backend (keeps API key safe)2. **Deploy**

├── package.json          # Dependencies   ```bash

└── .env                  # Your API key (don't commit this!)   vercel

```   ```



## Challenges I Faced3. **Add Environment Variable**

   - Go to your Vercel project settings

1. **First Time With Algorithms** - Understanding how Cosine Similarity works took me a while. Had to review linear algebra concepts from CS 2810.   - Add `API_KEY` with your OMDb API key

   - Redeploy

2. **API Key Security** - Initially had the key in frontend code (oops!), learned about environment variables and backend proxying.

**Or use Vercel's GitHub integration:**

3. **Performance** - With 84k movies, recommendations were slow at first. Fixed it by optimizing the algorithm and only calculating when needed.1. Push your code to GitHub

2. Import project on [vercel.com](https://vercel.com)

4. **Dataset Cleanup** - The Kaggle data had movies with no descriptions ("Add a Plot") that I had to filter out.3. Add `API_KEY` environment variable

4. Deploy!

## What I Learned

### Deploy to Render (Alternative)

- How similarity algorithms actually work (not just theory anymore!)

- Building a Node.js backend with Express1. Create account at [render.com](https://render.com)

- Working with APIs securely2. Create a new "Web Service"

- Managing large datasets in JSON3. Connect your GitHub repository

- Git for version control4. Set Build Command: `npm install`

- CSS Grid and Flexbox for responsive design5. Set Start Command: `npm start`

6. Add environment variable: `API_KEY`

## Future Improvements7. Deploy!



Some ideas I want to add:## 📖 Usage

- [ ] User accounts to save favorite movies

- [ ] More sophisticated NLP for descriptions### Searching for Movies:

- [ ] Collaborative filtering (if I can figure it out)1. **Enter any movie title** - "Inception", "Titanic", "Avatar", etc.

- [ ] Add movie trailers2. **View detailed info** - See movie poster, rating, director, runtime, actors

- [ ] Better mobile experience3. **Get recommendations** - Based on similarity algorithms



## Dataset Info### Using Different Algorithms:

1. **Select an algorithm** from the dropdown (Jaccard, Cosine, Levenshtein, Combined)

Using the IMDB Movies Dataset from Kaggle:2. **Recommendations update automatically**

- Started with 127k movies across 16 genres3. **Compare results** across different algorithms

- Filtered to 84k movies (removed rating ≤ 5.0 and missing descriptions)

- Each movie has: title, year, rating, genres, description, director, runtime### Exploring Recommendations:

1. **Search for a Movie**

## API Credits   - Type a movie title in the search box

   - Click "Search" or press Enter

- **OMDb API** for movie posters and additional data   - The system will find the closest match using fuzzy search

- **Kaggle** for the IMDB dataset

2. **Select Recommendation Algorithm**

## License   - Choose from Jaccard, Cosine, Levenshtein, or Combined

   - Recommendations update automatically when you change algorithms

MIT License - feel free to use this for your own projects!

3. **View Recommendations**

## Contact   - See top 6 similar movies with similarity scores

   - Click on any recommended movie to explore more recommendations

If you have questions or find bugs, open an issue or reach out!

Algorithms Explained

---

Jaccard Similarity

*Built as a learning project for CS 2420 Data Structures*Measures similarity between two sets based on their intersection and union.

*Fall 2024*```

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
