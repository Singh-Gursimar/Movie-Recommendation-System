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
    
    // Always fetch fresh poster from API if available, otherwise generate placeholder
    const posterSrc = useOmdbApi ? generatePosterDataUrl(movie.title, movie.year, 300, 450) : (movie.poster || generatePosterDataUrl(movie.title, movie.year, 300, 450));

    selectedMovieDiv.innerHTML = `
        <h2>🎯 ${movie.title}</h2>
        <div class="selected-movie-top">
            <img class="selected-poster" src="${posterSrc}" alt="${movie.title} poster">
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
        </div>
        <div class="description">
            ${movie.description}
        </div>
    `;

    // Always fetch poster from OMDb when API is configured
    if (useOmdbApi) {
        fetchFromOMDb(movie.title, movie.year).then(fetched => {
            if (fetched && fetched.poster) {
                const img = selectedMovieDiv.querySelector('.selected-poster');
                if (img) img.src = fetched.poster;
                selectedMovie.poster = fetched.poster;
            }
        }).catch(() => {});
    }
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
        // Always use placeholder initially if API is available, will be replaced by real poster
        const posterSrc = useOmdbApi ? generatePosterDataUrl(movie.title, movie.year, 300, 420) : (movie.poster || generatePosterDataUrl(movie.title, movie.year, 300, 420));

        return `
            <div class="movie-card" data-movie-id="${movie.id}" data-poster="${movie.poster ? posterSrc : ''}" onclick="selectMovieById('${movie.id}')">
                <div class="card-content">
                    <div class="similarity-score">
                        ${(movie.similarityScore * 100).toFixed(0)}% Match
                    </div>
                    <img class="poster" src="${posterSrc}" alt="${movie.title} poster">
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

    // If OMDb is configured, fetch fresh posters for all recommendations
    if (useOmdbApi) {
        const cards = movieListDiv.querySelectorAll('.movie-card');
        cards.forEach(async (card) => {
            const movieId = card.getAttribute('data-movie-id');
            let movie = moviesData.find(m => m.id === movieId || m.id == movieId);
            if (!movie) return;
            try {
                const fetched = await fetchFromOMDb(movie.title, movie.year);
                if (fetched && fetched.poster) {
                    const img = card.querySelector('img.poster');
                    if (img) img.src = fetched.poster;
                    card.setAttribute('data-poster', fetched.poster);
                    movie.poster = fetched.poster;
                }
            } catch (e) {
                // ignore poster fetch errors, keep generated poster
            }
        });
    }
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

// Generate a simple poster image client-side when no poster URL is available.
// Returns a data URL for an image with the movie title and year.
function generatePosterDataUrl(title = '', year = '', width = 300, height = 450) {
    try {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // Background gradient
        const g = ctx.createLinearGradient(0, 0, 0, height);
        g.addColorStop(0, '#0f172a');
        g.addColorStop(1, '#075985');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, width, height);

        // Title text
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        // Draw a subtle translucent overlay block for text
        ctx.fillStyle = 'rgba(0,0,0,0.25)';
        ctx.fillRect(12, height - 140, width - 24, 128);

        // Movie title (wrap)
        ctx.fillStyle = '#fff';
        const maxWidth = width - 36;
        const fontSize = Math.max(18, Math.floor(width / 16));
        ctx.font = `bold ${fontSize}px Poppins, Arial, sans-serif`;

        const words = title.split(' ');
        const lines = [];
        let line = '';
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && line !== '') {
                lines.push(line.trim());
                line = words[n] + ' ';
            } else {
                line = testLine;
            }
        }
        lines.push(line.trim());

        // Limit to 3 lines
        const displayLines = lines.slice(0, 3);
        const startY = height - 132 + 8;
        displayLines.forEach((l, i) => {
            ctx.fillText(l, width / 2, startY + i * (fontSize + 4));
        });

        // Year
        if (year) {
            ctx.font = `600 ${Math.max(12, Math.floor(width / 22))}px Poppins, Arial, sans-serif`;
            ctx.fillStyle = 'rgba(255,255,255,0.9)';
            ctx.fillText(year.toString(), width / 2, height - 24);
        }

        return canvas.toDataURL('image/png');
    } catch (e) {
        // Fallback to a placeholder URL if canvas isn't available
        return `https://via.placeholder.com/${width}x${height}?text=${encodeURIComponent(title)}`;
    }
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
