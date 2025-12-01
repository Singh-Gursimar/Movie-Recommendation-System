const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Disable caching for development
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
});

app.use(express.static('.', { 
    etag: false,
    lastModified: false,
    maxAge: 0
})); // Serve static files from root directory

// API Configuration
const OMDB_API_KEY = process.env.API_KEY;
const OMDB_BASE_URL = 'https://www.omdbapi.com/';

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Proxy endpoint to fetch movie by title
app.get('/api/movie', async (req, res) => {
    try {
        const { title, year } = req.query;
        
        if (!title) {
            return res.status(400).json({ error: 'Title parameter is required' });
        }

        if (!OMDB_API_KEY) {
            return res.status(500).json({ error: 'API key not configured' });
        }

        let url = `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(title)}&type=movie`;
        if (year) {
            url += `&y=${year}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        res.json(data);
    } catch (error) {
        console.error('Error fetching movie:', error);
        res.status(500).json({ error: 'Failed to fetch movie data' });
    }
});

// Proxy endpoint to search movies
app.get('/api/search', async (req, res) => {
    try {
        const { query } = req.query;
        
        if (!query) {
            return res.status(400).json({ error: 'Query parameter is required' });
        }

        if (!OMDB_API_KEY) {
            return res.status(500).json({ error: 'API key not configured' });
        }

        const url = `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(query)}&type=movie`;
        const response = await fetch(url);
        const data = await response.json();

        res.json(data);
    } catch (error) {
        console.error('Error searching movies:', error);
        res.status(500).json({ error: 'Failed to search movies' });
    }
});

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Start server (for local development only)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🎬 Movie Recommendation Server running on port ${PORT}`);
        console.log(`📍 Local: http://localhost:${PORT}`);
        console.log(`🔑 API Key configured: ${OMDB_API_KEY ? 'Yes ✅' : 'No ❌'}`);
    });
}

// Export for Vercel serverless deployment
module.exports = app;
