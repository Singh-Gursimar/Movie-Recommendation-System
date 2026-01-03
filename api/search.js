const fetch = require('node-fetch');

module.exports = async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    try {
        const { query } = req.query;
        
        if (!query) {
            return res.status(400).json({ error: 'Query parameter is required' });
        }

        const OMDB_API_KEY = process.env.API_KEY;
        if (!OMDB_API_KEY) {
            return res.status(500).json({ error: 'API key not configured' });
        }

        const OMDB_BASE_URL = 'https://www.omdbapi.com/';
        const url = `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(query)}&type=movie`;
        const response = await fetch(url);
        const data = await response.json();

        res.json(data);
    } catch (error) {
        console.error('Error searching movies:', error);
        res.status(500).json({ error: 'Failed to search movies' });
    }
};
