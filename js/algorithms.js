/**
 * Movie Recommendation Algorithms
 * CS 2420 - Data Structures Project
 * 
 * These are the three main algorithms I learned about for comparing similarity.
 * Each one has its own strengths and weaknesses!
 */

// Jaccard Similarity Algorithm
// This one compares sets - basically looks at unique words and sees how many overlap
// Formula: intersection / union
function jaccardSimilarity(str1, str2) {
    // Convert to lowercase and split into words
    const set1 = new Set(str1.toLowerCase().split(/\s+/));
    const set2 = new Set(str2.toLowerCase().split(/\s+/));
    
    // Find words that appear in both (intersection)
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    
    // Combine all unique words from both (union)
    const union = new Set([...set1, ...set2]);
    
    // Avoid division by zero
    if (union.size === 0) return 0;
    
    // Return the ratio
    return intersection.size / union.size;
}

// Cosine Similarity Algorithm
// This one uses vector math - creates frequency vectors and finds the angle between them
// Took me a while to understand this one, had to review linear algebra!
function cosineSimilarity(str1, str2) {
    // Split into words
    const words1 = str1.toLowerCase().split(/\s+/);
    const words2 = str2.toLowerCase().split(/\s+/);
    
    // Get all unique words from both strings
    const vocabulary = [...new Set([...words1, ...words2])];
    
    // Create frequency vectors - count how many times each word appears
    const vector1 = vocabulary.map(word => words1.filter(w => w === word).length);
    const vector2 = vocabulary.map(word => words2.filter(w => w === word).length);
    
    // Calculate dot product (sum of products)
    const dotProduct = vector1.reduce((sum, val, i) => sum + val * vector2[i], 0);
    
    // Calculate magnitudes (length of vectors)
    const magnitude1 = Math.sqrt(vector1.reduce((sum, val) => sum + val * val, 0));
    const magnitude2 = Math.sqrt(vector2.reduce((sum, val) => sum + val * val, 0));
    
    // Avoid division by zero
    if (magnitude1 === 0 || magnitude2 === 0) return 0;
    
    // Cosine = dot product / (magnitude1 * magnitude2)
    return dotProduct / (magnitude1 * magnitude2);
}

// Levenshtein Distance Algorithm
// Calculates minimum number of edits (insert, delete, replace) to change one string to another
// Using dynamic programming - learned this in class!
function levenshteinDistance(str1, str2) {
    const s1 = str1.toLowerCase();
    const s2 = str2.toLowerCase();
    const len1 = s1.length;
    const len2 = s2.length;
    
    // Create a 2D array (matrix) for dynamic programming
    // dp[i][j] = minimum edits to transform first i chars of s1 to first j chars of s2
    const dp = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(0));
    
    // Base cases: transforming from/to empty string
    for (let i = 0; i <= len1; i++) dp[i][0] = i;  // delete all chars
    for (let j = 0; j <= len2; j++) dp[0][j] = j;  // insert all chars
    
    // Fill the matrix using bottom-up approach
    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            if (s1[i - 1] === s2[j - 1]) {
                // Characters match, no edit needed
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                // Take minimum of three operations
                dp[i][j] = Math.min(
                    dp[i - 1][j] + 1,      // deletion
                    dp[i][j - 1] + 1,      // insertion
                    dp[i - 1][j - 1] + 1   // substitution
                );
            }
        }
    }
    
    return dp[len1][len2];
}

// Convert Levenshtein distance to similarity score (between 0 and 1)
// Distance is inverse of similarity, so we need to flip it
function levenshteinSimilarity(str1, str2) {
    const distance = levenshteinDistance(str1, str2);
    const maxLength = Math.max(str1.length, str2.length);
    if (maxLength === 0) return 1;  // both empty strings
    return 1 - (distance / maxLength);
}

// Helper function to compare movie genres
// Using Jaccard similarity for genre sets
function genreSimilarity(genres1, genres2) {
    if (!genres1 || !genres2 || genres1.length === 0 || genres2.length === 0) return 0;
    
    const set1 = new Set(genres1.map(g => g.toLowerCase()));
    const set2 = new Set(genres2.map(g => g.toLowerCase()));
    
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    if (union.size === 0) return 0;
    return intersection.size / union.size;
}

// Compare movie ratings (normalized to 0-1 scale)
function ratingSimilarity(rating1, rating2) {
    // Ratings are 0-10, so max difference is 10
    const difference = Math.abs(rating1 - rating2);
    return 1 - (difference / 10);
}

// Compare movie directors - exact match or not
function directorSimilarity(director1, director2) {
    if (!director1 || !director2) return 0;
    // Case-insensitive exact match
    return director1.toLowerCase() === director2.toLowerCase() ? 1 : 0;
}

// Combined Algorithm - My custom approach!
// After testing, I found these weights work best:
function combinedSimilarity(str1, str2) {
    const jaccard = jaccardSimilarity(str1, str2);
    const cosine = cosineSimilarity(str1, str2);
    const levenshtein = levenshteinSimilarity(str1, str2);
    
    // Weighted combination - Cosine is best for descriptions
    // 50% Cosine, 30% Jaccard, 20% Levenshtein
    return (cosine * 0.5) + (jaccard * 0.3) + (levenshtein * 0.2);
}

// Main function to calculate how similar a movie is to the search query
// This is where I combine everything together!
function calculateMovieSimilarity(movie, query, algorithm = 'combined', referenceMovie = null) {
    // Combine movie attributes into one string for comparison
    // Focus only on description and genre - title is excluded to avoid title bias
    const movieText = `${movie.description} ${movie.description} ${movie.genre.join(' ')}`;
    
    let textSimilarity = 0;
    
    // Use the selected algorithm
    switch(algorithm) {
        case 'jaccard':
            textSimilarity = jaccardSimilarity(movieText, query);
            break;
        case 'cosine':
            textSimilarity = cosineSimilarity(movieText, query);
            break;
        case 'levenshtein':
            textSimilarity = levenshteinSimilarity(movieText, query);
            break;
        case 'combined':
        default:
            textSimilarity = combinedSimilarity(movieText, query);
            break;
    }
    
    // If we're comparing to a specific movie (not just text search)
    // add genre and rating similarity too
    if (referenceMovie) {
        const genreScore = genreSimilarity(movie.genre, referenceMovie.genre);
        const ratingScore = ratingSimilarity(movie.rating, referenceMovie.rating);
        const directorScore = directorSimilarity(movie.director, referenceMovie.director);
        
        // Final score is weighted combination
        // 36.5% text (description), 25% genre, 35% rating, 3.5% director (1/10 of rating weight)
        return (textSimilarity * 0.365) + (genreScore * 0.25) + (ratingScore * 0.35) + (directorScore * 0.035);
    }
    
    return textSimilarity;
}

// Find the movie title that's closest to what the user typed
// Useful for handling typos!
function findClosestMatch(movies, searchTerm) {
    let bestMatch = null;
    let highestSimilarity = 0;
    
    // Check each movie title
    movies.forEach(movie => {
        const similarity = levenshteinSimilarity(movie.title, searchTerm);
        if (similarity > highestSimilarity) {
            highestSimilarity = similarity;
            bestMatch = movie;
        }
    });
    
    return { movie: bestMatch, similarity: highestSimilarity };
}

// Main recommendation function - this is what gets called when you select a movie
function getRecommendations(movies, selectedMovie, algorithm = 'combined', topN = 6) {
    // Build a reference string from the selected movie
    const referenceText = `${selectedMovie.description} ${selectedMovie.genre.join(' ')}`;
    
    // Calculate similarity for all movies and sort them
    const recommendations = movies
        .filter(movie => movie.id !== selectedMovie.id)  // Don't recommend the same movie!
        .map(movie => ({
            ...movie,
            similarityScore: calculateMovieSimilarity(movie, referenceText, algorithm, selectedMovie)
        }))
        .sort((a, b) => b.similarityScore - a.similarityScore)  // Highest similarity first
        .slice(0, topN);  // Get top N recommendations
    
    return recommendations;
}
