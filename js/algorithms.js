// Jaccard Similarity Algorithm
// Measures similarity between two sets based on their intersection and union
function jaccardSimilarity(str1, str2) {
    const set1 = new Set(str1.toLowerCase().split(/\s+/));
    const set2 = new Set(str2.toLowerCase().split(/\s+/));
    
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    if (union.size === 0) return 0;
    return intersection.size / union.size;
}

// Cosine Similarity Algorithm
// Measures similarity between two vectors based on the cosine of the angle between them
function cosineSimilarity(str1, str2) {
    const words1 = str1.toLowerCase().split(/\s+/);
    const words2 = str2.toLowerCase().split(/\s+/);
    
    // Create a unified vocabulary
    const vocabulary = [...new Set([...words1, ...words2])];
    
    // Create frequency vectors
    const vector1 = vocabulary.map(word => words1.filter(w => w === word).length);
    const vector2 = vocabulary.map(word => words2.filter(w => w === word).length);
    
    // Calculate dot product
    const dotProduct = vector1.reduce((sum, val, i) => sum + val * vector2[i], 0);
    
    // Calculate magnitudes
    const magnitude1 = Math.sqrt(vector1.reduce((sum, val) => sum + val * val, 0));
    const magnitude2 = Math.sqrt(vector2.reduce((sum, val) => sum + val * val, 0));
    
    if (magnitude1 === 0 || magnitude2 === 0) return 0;
    return dotProduct / (magnitude1 * magnitude2);
}

// Levenshtein Distance Algorithm
// Measures the minimum number of single-character edits needed to change one string into another
function levenshteinDistance(str1, str2) {
    const s1 = str1.toLowerCase();
    const s2 = str2.toLowerCase();
    const len1 = s1.length;
    const len2 = s2.length;
    
    // Create a 2D array for dynamic programming
    const dp = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(0));
    
    // Initialize first row and column
    for (let i = 0; i <= len1; i++) dp[i][0] = i;
    for (let j = 0; j <= len2; j++) dp[0][j] = j;
    
    // Fill the dp table
    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            if (s1[i - 1] === s2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
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

// Convert Levenshtein distance to similarity score (0-1)
function levenshteinSimilarity(str1, str2) {
    const distance = levenshteinDistance(str1, str2);
    const maxLength = Math.max(str1.length, str2.length);
    if (maxLength === 0) return 1;
    return 1 - (distance / maxLength);
}

// Calculate genre similarity between two movies
function genreSimilarity(genres1, genres2) {
    if (!genres1 || !genres2 || genres1.length === 0 || genres2.length === 0) return 0;
    
    const set1 = new Set(genres1.map(g => g.toLowerCase()));
    const set2 = new Set(genres2.map(g => g.toLowerCase()));
    
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    if (union.size === 0) return 0;
    return intersection.size / union.size;
}

// Calculate rating similarity (normalized)
function ratingSimilarity(rating1, rating2) {
    // Normalize the difference to 0-1 scale
    // Maximum difference is 10 (if one is 0 and other is 10)
    const difference = Math.abs(rating1 - rating2);
    return 1 - (difference / 10);
}

// Combined similarity score using all three algorithms with optimized weights
function combinedSimilarity(str1, str2) {
    const jaccard = jaccardSimilarity(str1, str2);
    const cosine = cosineSimilarity(str1, str2);
    const levenshtein = levenshteinSimilarity(str1, str2);
    
    // Optimized weights based on algorithm performance:
    // - Cosine (50%): Best for semantic similarity and word frequency
    // - Jaccard (30%): Good for unique word overlap
    // - Levenshtein (20%): Good for typos but less important for recommendations
    return (cosine * 0.5) + (jaccard * 0.3) + (levenshtein * 0.2);
}

// Calculate similarity between a movie and query based on multiple attributes
function calculateMovieSimilarity(movie, query, algorithm = 'combined', referenceMovie = null) {
    // Combine relevant movie attributes for comparison
    const movieText = `${movie.title} ${movie.description} ${movie.genre.join(' ')}`;
    
    let textSimilarity = 0;
    
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
    
    // If we have a reference movie, factor in genre and rating similarity
    if (referenceMovie) {
        const genreScore = genreSimilarity(movie.genre, referenceMovie.genre);
        const ratingScore = ratingSimilarity(movie.rating, referenceMovie.rating);
        
        // Weighted combination:
        // 50% text similarity (description + title)
        // 30% genre similarity
        // 20% rating similarity
        return (textSimilarity * 0.5) + (genreScore * 0.3) + (ratingScore * 0.2);
    }
    
    return textSimilarity;
}

// Find the closest matching movie by title
function findClosestMatch(movies, searchTerm) {
    let bestMatch = null;
    let highestSimilarity = 0;
    
    movies.forEach(movie => {
        const similarity = levenshteinSimilarity(movie.title, searchTerm);
        if (similarity > highestSimilarity) {
            highestSimilarity = similarity;
            bestMatch = movie;
        }
    });
    
    return { movie: bestMatch, similarity: highestSimilarity };
}

// Get movie recommendations based on a selected movie
function getRecommendations(movies, selectedMovie, algorithm = 'combined', topN = 6) {
    // Create a reference text from the selected movie
    const referenceText = `${selectedMovie.description} ${selectedMovie.genre.join(' ')}`;
    
    // Calculate similarities for all other movies
    const recommendations = movies
        .filter(movie => movie.id !== selectedMovie.id) // Exclude the selected movie
        .map(movie => ({
            ...movie,
            similarityScore: calculateMovieSimilarity(movie, referenceText, algorithm, selectedMovie)
        }))
        .sort((a, b) => b.similarityScore - a.similarityScore) // Sort by similarity (descending)
        .slice(0, topN); // Get top N recommendations
    
    return recommendations;
}
