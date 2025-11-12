/**
 * Movie Recommendation System - Main Application
 * CS 2420 Data Structures Project
 * 
 * This handles all the frontend logic - searching, displaying results, etc.
 * Also connects to the backend to keep the API key secure!
 */

// Global variables
let moviesData = [];  // Array to store all our movies
let selectedMovie = null;  // The movie user selected
let movieCache = new Map();  // Cache API results so we don't make duplicate requests
let useOmdbApi = false;  // Whether we can use the OMDb API

// Get references to HTML elements
const movieInput = document.getElementById('movieInput');
const searchBtn = document.getElementById('searchBtn');
const selectedMovieDiv = document.getElementById('selectedMovie');
const movieListDiv = document.getElementById('movieList');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorMessage = document.getElementById('errorMessage');
const recommendationsSection = document.getElementById('recommendations');

// Load movie data when page loads
window.addEventListener('DOMContentLoaded', async () => {
    await loadMovieData();
    await checkApiConfiguration();
});

// Check if backend API is configured
async function checkApiConfiguration() {
    useOmdbApi = await isApiKeyConfigured();
    if (!useOmdbApi) {
        showApiKeyInstructions();
    } else {
        console.log('%c✅ Backend API configured successfully!', 'color: #00ff00; font-size: 14px; font-weight: bold;');
        console.log('%c🎬 You can now search any movie from OMDb database', 'color: #fff;');
    }
}

// Load movie data from JSON file (as fallback)
async function loadMovieData() {
    try {
        console.log('📊 Loading movie database...');
        const response = await fetch('data/movies.json');
        if (!response.ok) {
            throw new Error('Failed to load movie data');
        }
        moviesData = await response.json();
        console.log(`✅ Loaded ${moviesData.length} movies`);
        hideError();
    } catch (error) {
        if (!useOmdbApi) {
            showError('Failed to load movie database. Please check if movies.json exists.');
        }
        console.error('Error loading movie data:', error);
    }
}

// Fetch movie data from backend API (which proxies OMDb)
async function fetchFromOMDb(title, year = null) {
    // Check cache first
    const cacheKey = year ? `${title}-${year}` : title;
    if (movieCache.has(cacheKey)) {
        const cached = movieCache.get(cacheKey);
        if (Date.now() - cached.timestamp < CONFIG.CACHE_DURATION) {
            return cached.data;
        }
    }

    try {
        let url = `${CONFIG.API_BASE_URL}/api/movie?title=${encodeURIComponent(title)}`;
        if (year) {
            url += `&year=${year}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (data.Response === 'True') {
            // Transform OMDb data to our format
            const transformedMovie = {
                id: data.imdbID,
                title: data.Title,
                year: parseInt(data.Year),
                rating: parseFloat(data.imdbRating) || 0,
                genre: data.Genre ? data.Genre.split(', ') : [],
                description: data.Plot || 'No description available.',
                poster: data.Poster !== 'N/A' ? data.Poster : null,
                director: data.Director,
                actors: data.Actors,
                runtime: data.Runtime,
                awards: data.Awards
            };

            // Cache the result
            movieCache.set(cacheKey, {
                data: transformedMovie,
                timestamp: Date.now()
            });

            return transformedMovie;
        } else {
            return null;
        }
    } catch (error) {
        console.error('OMDb API error:', error);
        return null;
    }
}

// Search for movies using backend API (which proxies OMDb)
async function searchOMDb(query) {
    try {
        const url = `${CONFIG.API_BASE_URL}/api/search?query=${encodeURIComponent(query)}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.Response === 'True' && data.Search) {
            // Fetch detailed info for each movie (limit to first 10)
            const detailPromises = data.Search.slice(0, 10).map(movie => 
                fetchFromOMDb(movie.Title, movie.Year)
            );
            const movies = await Promise.all(detailPromises);
            return movies.filter(m => m !== null);
        }
        return [];
    } catch (error) {
        console.error('OMDb search error:', error);
        return [];
    }
}

// Event Listeners
searchBtn.addEventListener('click', handleSearch);
movieInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

// Handle search functionality
async function handleSearch() {
    const searchTerm = movieInput.value.trim();
    
    if (!searchTerm) {
        showError('Please enter a movie title');
        return;
    }
    
    hideError();
    showLoading(true);
    
    try {
        let movie = null;
        
        // Try OMDb API first if configured
        if (useOmdbApi) {
            movie = await fetchFromOMDb(searchTerm);
            
            // If exact match not found, try search
            if (!movie) {
                const searchResults = await searchOMDb(searchTerm);
                if (searchResults.length > 0) {
                    movie = searchResults[0]; // Take the first result
                }
            }
        }
        
        // Fallback to local database if OMDb fails or not configured
        if (!movie && moviesData.length > 0) {
            const { movie: localMovie, similarity } = findClosestMatch(moviesData, searchTerm);
            if (localMovie && similarity > 0.3) {
                movie = localMovie;
            }
        }
        
        if (movie) {
            selectedMovie = movie;
            displaySelectedMovie(movie);
            await displayRecommendations();
        } else {
            showError(`No match found for "${searchTerm}". Please try another title.`);
            selectedMovieDiv.innerHTML = '';
            movieListDiv.innerHTML = '';
        }
    } catch (error) {
        console.error('Search error:', error);
        showError('An error occurred during search. Please try again.');
    } finally {
        showLoading(false);
    }
}

// Display the selected movie
function displaySelectedMovie(movie) {
    const genreTags = movie.genre.slice(0, 4).map(g => 
        `<span class="genre-tag">${g}</span>`
    ).join('');
    
    const additionalInfo = movie.director ? `
        <div class="info-item">
            <span class="info-label">Director</span>
            <span class="info-value">${movie.director}</span>
        </div>
    ` : '';
    
    const runtimeInfo = movie.runtime ? `
        <div class="info-item">
            <span class="info-label">Runtime</span>
            <span class="info-value">${movie.runtime}</span>
        </div>
    ` : '';
    
    selectedMovieDiv.innerHTML = `
        <h2>🎯 ${movie.title}</h2>
        <div class="movie-info">
            <div class="info-item">
                <span class="info-label">Year</span>
                <span class="info-value">${movie.year}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Rating</span>
                <span class="info-value rating">⭐ ${movie.rating.toFixed(1)}/10</span>
            </div>
            <div class="info-item">
                <span class="info-label">Genre</span>
                <span class="info-value">${genreTags}</span>
            </div>
            ${runtimeInfo}
            ${additionalInfo}
        </div>
        <div class="description">
            ${movie.description}
        </div>
    `;
}

// Display recommendations
async function displayRecommendations() {
    if (!selectedMovie) return;
    
    // Always use combined algorithm for best results
    const algorithm = 'combined';
    
    // For OMDb movies, we need to build a recommendation set from local database
    // or fetch similar movies
    let recommendationSource = moviesData.length > 0 ? moviesData : [];
    
    // If using OMDb and no local database, try to fetch popular movies in same genre
    if (useOmdbApi && recommendationSource.length === 0 && selectedMovie.genre.length > 0) {
        // Fallback: Show message that recommendations need local database
        movieListDiv.innerHTML = `
            <div class="no-recommendations">
                <p>📊 Recommendations work best with a local movie database.</p>
                <p>The system uses your selected movie's characteristics to find similar titles.</p>
                <p>💡 Local database contains ${moviesData.length} movies for comparison.</p>
            </div>
        `;
        recommendationsSection.style.display = 'block';
        return;
    }
    
    const recommendations = getRecommendations(recommendationSource, selectedMovie, algorithm, 6);
    
    if (recommendations.length === 0) {
        movieListDiv.innerHTML = '<p>No recommendations found in the current database.</p>';
        return;
    }
    
    movieListDiv.innerHTML = recommendations.map(movie => {
        const genreTags = movie.genre.slice(0, 3).map(g => 
            `<span class="genre-tag">${g}</span>`
        ).join('');
        
        return `
            <div class="movie-card" onclick="selectMovieById('${movie.id}')">
                <div class="card-content">
                    <div class="similarity-score">
                        ${(movie.similarityScore * 100).toFixed(0)}% Match
                    </div>
                    <h3>${movie.title}</h3>
                    <div class="movie-meta">
                        <span class="year">${movie.year}</span>
                        <span class="rating">${movie.rating.toFixed(1)}</span>
                    </div>
                    <div class="genre">
                        ${genreTags}
                    </div>
                    <div class="description">
                        ${truncateText(movie.description, 180)}
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    recommendationsSection.style.display = 'block';
}

// Select a movie from recommendations
async function selectMovieById(movieId) {
    showLoading(true);
    let movie = moviesData.find(m => m.id === movieId || m.id == movieId);
    
    // If not in local database and using OMDb, try to fetch it
    if (!movie && useOmdbApi) {
        // Try to find in cache first
        for (let [key, value] of movieCache) {
            if (value.data.id === movieId) {
                movie = value.data;
                break;
            }
        }
    }
    
    if (movie) {
        selectedMovie = movie;
        movieInput.value = movie.title;
        displaySelectedMovie(movie);
        await displayRecommendations();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    showLoading(false);
}

// Utility function to truncate text
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Show/hide loading spinner
function showLoading(show) {
    loadingSpinner.style.display = show ? 'block' : 'none';
}

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

// Hide error message
function hideError() {
    errorMessage.style.display = 'none';
}
