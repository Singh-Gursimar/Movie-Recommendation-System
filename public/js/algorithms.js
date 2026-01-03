/**
 * Movie Recommendation Algorithms
 * CS 2420 - Data Structures Project
 * 
 * These are the three main algorithms I learned about for comparing similarity.
 * Each one has its own strengths and weaknesses!
 */

// Common stop words to filter out - these don't add meaning
const STOP_WORDS = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
    'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had',
    'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must',
    'it', 'its', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'we', 'they',
    'who', 'which', 'what', 'where', 'when', 'why', 'how', 'all', 'each', 'every',
    'both', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only',
    'own', 'same', 'so', 'than', 'too', 'very', 'just', 'also', 'now', 'here', 'there',
    'into', 'through', 'during', 'before', 'after', 'above', 'below', 'up', 'down',
    'out', 'off', 'over', 'under', 'again', 'then', 'once', 'can', 'about', 'their',
    'them', 'him', 'her', 'his', 'hers', 'your', 'our', 'my', 'me', 'us', 'being'
]);

// Text preprocessing - clean and normalize text for better comparison
function preprocessText(text) {
    if (!text) return [];
    
    return text
        .toLowerCase()
        // Remove punctuation and special characters
        .replace(/[^\w\s]/g, ' ')
        // Split into words
        .split(/\s+/)
        // Filter out empty strings, stop words, and very short words
        .filter(word => word.length > 2 && !STOP_WORDS.has(word));
}

// Simple stemming - reduce words to their root form
// This helps match "running" with "run", "action" with "actions", etc.
function simpleStem(word) {
    // Common suffixes to remove
    const suffixes = ['ing', 'ed', 'er', 'est', 'ly', 's', 'es', 'tion', 'ness', 'ment', 'able', 'ible'];
    
    for (const suffix of suffixes) {
        if (word.length > suffix.length + 2 && word.endsWith(suffix)) {
            return word.slice(0, -suffix.length);
        }
    }
    return word;
}

// Apply stemming to an array of words
function stemWords(words) {
    return words.map(simpleStem);
}

// Jaccard Similarity Algorithm
// This one compares sets - basically looks at unique words and sees how many overlap
// Formula: intersection / union
function jaccardSimilarity(str1, str2) {
    // Handle empty strings
    if (!str1 || !str2) return 0;
    
    // Preprocess and stem words
    const words1 = stemWords(preprocessText(str1));
    const words2 = stemWords(preprocessText(str2));
    
    const set1 = new Set(words1);
    const set2 = new Set(words2);
    
    // Find words that appear in both (intersection)
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    
    // Combine all unique words from both (union)
    const union = new Set([...set1, ...set2]);
    
    // Avoid division by zero
    if (union.size === 0) return 0;
    
    // Return the ratio
    return intersection.size / union.size;
}

// Cosine Similarity Algorithm with TF-IDF weighting
// This one uses vector math - creates frequency vectors and finds the angle between them
function cosineSimilarity(str1, str2) {
    // Handle empty strings
    if (!str1 || !str2) return 0;
    
    // Preprocess and stem words
    const words1 = stemWords(preprocessText(str1));
    const words2 = stemWords(preprocessText(str2));
    
    if (words1.length === 0 || words2.length === 0) return 0;
    
    // Get all unique words from both strings
    const vocabulary = [...new Set([...words1, ...words2])];
    
    // Create frequency maps for efficiency
    const freq1 = {};
    const freq2 = {};
    words1.forEach(w => freq1[w] = (freq1[w] || 0) + 1);
    words2.forEach(w => freq2[w] = (freq2[w] || 0) + 1);
    
    // Create frequency vectors using the maps
    const vector1 = vocabulary.map(word => freq1[word] || 0);
    const vector2 = vocabulary.map(word => freq2[word] || 0);
    
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
    // Handle null/undefined inputs
    if (!str1 && !str2) return 1;  // both empty/null
    if (!str1 || !str2) return 0;  // one is empty/null
    
    const distance = levenshteinDistance(str1, str2);
    const maxLength = Math.max(str1.length, str2.length);
    if (maxLength === 0) return 1;  // both empty strings
    return 1 - (distance / maxLength);
}

// Helper function to compare movie genres
// Using weighted Jaccard similarity for genre sets with genre importance
function genreSimilarity(genres1, genres2) {
    if (!genres1 || !genres2 || genres1.length === 0 || genres2.length === 0) return 0;
    
    const set1 = new Set(genres1.map(g => g.toLowerCase().trim()));
    const set2 = new Set(genres2.map(g => g.toLowerCase().trim()));
    
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    if (union.size === 0) return 0;
    
    // Basic Jaccard
    const jaccardScore = intersection.size / union.size;
    
    // Bonus for matching primary genre (first genre is usually most important)
    const primaryGenre1 = genres1[0]?.toLowerCase().trim();
    const primaryGenre2 = genres2[0]?.toLowerCase().trim();
    const primaryBonus = (primaryGenre1 && primaryGenre1 === primaryGenre2) ? 0.15 : 0;
    
    // Bonus for having multiple matches
    const matchBonus = intersection.size > 1 ? Math.min(0.1, (intersection.size - 1) * 0.05) : 0;
    
    return Math.min(1, jaccardScore + primaryBonus + matchBonus);
}

// Compare movie ratings with non-linear scaling
// Movies with similar high ratings are more alike than movies with similar low ratings
function ratingSimilarity(rating1, rating2) {
    if (rating1 == null || rating2 == null) return 0.5; // Neutral if missing
    
    const r1 = parseFloat(rating1) || 0;
    const r2 = parseFloat(rating2) || 0;
    
    // Difference-based similarity
    const difference = Math.abs(r1 - r2);
    const baseSimilarity = 1 - (difference / 10);
    
    // Apply non-linear scaling - penalize big differences more
    const scaledSimilarity = Math.pow(baseSimilarity, 1.5);
    
    // Bonus if both are highly rated (>7.5)
    const bothHighlyRated = (r1 >= 7.5 && r2 >= 7.5) ? 0.1 : 0;
    
    return Math.min(1, scaledSimilarity + bothHighlyRated);
}

// Compare movie directors - partial matching for collaborations
function directorSimilarity(director1, director2) {
    if (!director1 || !director2) return 0;
    
    const d1 = director1.toLowerCase().trim();
    const d2 = director2.toLowerCase().trim();
    
    // Exact match
    if (d1 === d2) return 1;
    
    // Check if one name contains the other (handles "John Smith" vs "John")
    if (d1.includes(d2) || d2.includes(d1)) return 0.7;
    
    // Check for last name match (common in film)
    const lastName1 = d1.split(' ').pop();
    const lastName2 = d2.split(' ').pop();
    if (lastName1.length > 2 && lastName1 === lastName2) return 0.5;
    
    return 0;
}

// NEW: Compare release years - movies from same era are more similar
function yearSimilarity(year1, year2) {
    if (!year1 || !year2) return 0.5; // Neutral if missing
    
    const y1 = parseInt(year1) || 2000;
    const y2 = parseInt(year2) || 2000;
    
    const difference = Math.abs(y1 - y2);
    
    // Same year = 1.0, within 2 years = 0.9, within 5 years = 0.7, etc.
    if (difference === 0) return 1;
    if (difference <= 2) return 0.9;
    if (difference <= 5) return 0.75;
    if (difference <= 10) return 0.5;
    if (difference <= 20) return 0.3;
    return 0.1;
}

// NEW: Compare actors - shared cast members indicate similarity
function actorSimilarity(actors1, actors2) {
    if (!actors1 || !actors2) return 0;
    
    // Parse actor strings into arrays
    const parseActors = (actorString) => {
        if (Array.isArray(actorString)) return actorString.map(a => a.toLowerCase().trim());
        if (typeof actorString === 'string') {
            return actorString.split(',').map(a => a.toLowerCase().trim()).filter(a => a.length > 0);
        }
        return [];
    };
    
    const set1 = new Set(parseActors(actors1));
    const set2 = new Set(parseActors(actors2));
    
    if (set1.size === 0 || set2.size === 0) return 0;
    
    // Count shared actors
    const sharedActors = [...set1].filter(a => set2.has(a)).length;
    
    // Weighted scoring - even one shared actor is meaningful
    if (sharedActors === 0) return 0;
    if (sharedActors === 1) return 0.4;
    if (sharedActors === 2) return 0.7;
    return Math.min(1, 0.7 + (sharedActors - 2) * 0.1);
}

// Combined Algorithm - Improved approach with text preprocessing
function combinedSimilarity(str1, str2) {
    const jaccard = jaccardSimilarity(str1, str2);
    const cosine = cosineSimilarity(str1, str2);
    const levenshtein = levenshteinSimilarity(str1, str2);
    
    // Weighted combination - Cosine works best for semantic similarity
    // 55% Cosine, 35% Jaccard, 10% Levenshtein (less weight on character-level)
    return (cosine * 0.55) + (jaccard * 0.35) + (levenshtein * 0.1);
}

// Extract meaningful keywords from text for better matching
function extractKeywords(text) {
    if (!text) return [];
    return stemWords(preprocessText(text));
}

// Main function to calculate how similar a movie is to the search query
// This is where I combine everything together!
function calculateMovieSimilarity(movie, query, algorithm = 'combined', referenceMovie = null) {
    // Build a weighted text representation of the movie
    // Description is most important, genre provides context
    const description = movie.description || '';
    const genres = Array.isArray(movie.genre) ? movie.genre.join(' ') : '';
    const title = movie.title || '';
    
    // Weight description more heavily by including it twice
    const movieText = `${description} ${description} ${genres} ${title}`;
    
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
    // add structured data similarity
    if (referenceMovie) {
        const genreScore = genreSimilarity(movie.genre, referenceMovie.genre);
        const ratingScore = ratingSimilarity(movie.rating, referenceMovie.rating);
        const directorScore = directorSimilarity(movie.director, referenceMovie.director);
        const yearScore = yearSimilarity(movie.year, referenceMovie.year);
        const actorScore = actorSimilarity(movie.actors, referenceMovie.actors);
        
        // Improved weighting based on what matters most for recommendations:
        // - Genre is most important (people want similar type of movie)
        // - Text similarity (description) captures thematic elements
        // - Year helps find movies from same era/style
        // - Rating ensures quality consistency
        // - Director and actors are bonus factors
        const weights = {
            genre: 0.30,        // Genre match is crucial
            text: 0.25,         // Description/theme similarity
            year: 0.15,         // Era matching
            rating: 0.15,       // Quality matching
            director: 0.08,     // Same director bonus
            actor: 0.07         // Shared cast bonus
        };
        
        const finalScore = 
            (genreScore * weights.genre) + 
            (textSimilarity * weights.text) + 
            (yearScore * weights.year) +
            (ratingScore * weights.rating) + 
            (directorScore * weights.director) +
            (actorScore * weights.actor);
        
        return finalScore;
    }
    
    return textSimilarity;
}

// Find the movie title that's closest to what the user typed
// Useful for handling typos!
function findClosestMatch(movies, searchTerm) {
    if (!movies || movies.length === 0 || !searchTerm) {
        return { movie: null, similarity: 0 };
    }
    
    const normalizedSearch = searchTerm.toLowerCase().trim();
    let bestMatch = null;
    let highestSimilarity = 0;
    
    // Check each movie title
    movies.forEach(movie => {
        const normalizedTitle = movie.title.toLowerCase().trim();
        
        // Check for exact match first
        if (normalizedTitle === normalizedSearch) {
            bestMatch = movie;
            highestSimilarity = 1;
            return;
        }
        
        // Check if search term is contained in title (substring match)
        if (normalizedTitle.includes(normalizedSearch)) {
            const containScore = 0.8 + (normalizedSearch.length / normalizedTitle.length) * 0.2;
            if (containScore > highestSimilarity) {
                highestSimilarity = containScore;
                bestMatch = movie;
            }
            return;
        }
        
        // Check if title starts with search term
        if (normalizedTitle.startsWith(normalizedSearch)) {
            const startScore = 0.85;
            if (startScore > highestSimilarity) {
                highestSimilarity = startScore;
                bestMatch = movie;
            }
            return;
        }
        
        // Levenshtein similarity for typo handling
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
    if (!movies || movies.length === 0 || !selectedMovie) {
        return [];
    }
    
    // Build a reference string from the selected movie
    const description = selectedMovie.description || '';
    const genres = Array.isArray(selectedMovie.genre) ? selectedMovie.genre.join(' ') : '';
    const referenceText = `${description} ${genres}`;
    
    // Calculate similarity for all movies and sort them
    const recommendations = movies
        .filter(movie => movie.id !== selectedMovie.id)  // Don't recommend the same movie!
        .map(movie => {
            const score = calculateMovieSimilarity(movie, referenceText, algorithm, selectedMovie);
            return {
                ...movie,
                similarityScore: score
            };
        })
        .filter(movie => movie.similarityScore > 0.1)  // Filter out very low matches
        .sort((a, b) => b.similarityScore - a.similarityScore)  // Highest similarity first
        .slice(0, topN);  // Get top N recommendations
    
    return recommendations;
}
