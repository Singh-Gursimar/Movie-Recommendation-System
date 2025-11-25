// API Configuration for Movie Recommendation System
// This now uses the backend proxy instead of calling OMDb directly

const CONFIG = {
    // Use the backend API endpoint (will be your deployed URL or localhost)
    API_BASE_URL: window.location.origin, // Automatically uses current domain
    
    // Set to true to use the local movies.json as fallback when API fails
    USE_LOCAL_FALLBACK: true,
    
    // Cache settings
    CACHE_DURATION: 3600000, // 1 hour in milliseconds
};

// Check if API is available
async function isApiKeyConfigured() {
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/api/health`);
        return response.ok;
    } catch (error) {
        console.warn('Backend API not available, using local database');
        return false;
    }
}

// Instructions for setup (will be shown in console if backend is not available)
function showApiKeyInstructions() {
    console.log('%c📝 Backend Setup Instructions', 'color: #e50914; font-size: 16px; font-weight: bold;');
    console.log('%c1. Make sure you have Node.js installed', 'color: #fff;');
    console.log('%c2. Run: npm install', 'color: #fff;');
    console.log('%c3. Add your API key to .env file', 'color: #fff;');
    console.log('%c4. Run: npm start', 'color: #fff;');
    console.log('%c\n🔄 Using local movie database as fallback...', 'color: #ffd700;');
}
