const fetch = require('node-fetch');

module.exports = async (req, res) => {
    try {
        const { title, year } = req.query;
        
        if (!title) {
            return res.status(400).json({ error: 'Title parameter is required' });
        }

        const OMDB_API_KEY = process.env.API_KEY;
        if (!OMDB_API_KEY) {
            return res.status(500).json({ error: 'API key not configured' });
        }

        const OMDB_BASE_URL = 'https://www.omdbapi.com/';
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
};
