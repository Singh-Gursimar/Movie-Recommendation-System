/**
 * Movie Recommendation Algorithms
 * CS 2420 - Data Structures Project
 * 
 * These are the three main algorithms I learned about for comparing similarity.
 * Each one has its own strengths and weaknesses!
 */

// Common English stopwords to filter out - these don't add much meaning
const STOPWORDS = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
    'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
    'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that',
    'these', 'those', 'it', 'its', 'his', 'her', 'their', 'our'
]);

// Cache preprocessed text to avoid reprocessing
const preprocessCache = new Map();

// Helper to preprocess text: lowercase, remove stopwords, split into meaningful words
function preprocessText(text) {
    if (preprocessCache.has(text)) {
        return preprocessCache.get(text);
    }
    
    const result = text.toLowerCase()
        .split(/\s+/)
        .filter(word => word.length > 2 && !STOPWORDS.has(word) && /^[a-z]+$/.test(word));
    
    // Cache the result (limit cache size to prevent memory issues)
    if (preprocessCache.size < 1000) {
        preprocessCache.set(text, result);
    }
    
    return result;
}

// Jaccard Similarity Algorithm
// This one compares sets - basically looks at unique words and sees how many overlap
// Formula: intersection / union
function jaccardSimilarity(str1, str2) {
    // Preprocess: remove stopwords and get meaningful words only
    const set1 = new Set(preprocessText(str1));
    const set2 = new Set(preprocessText(str2));
    
    // Early return if either set is empty
    if (set1.size === 0 || set2.size === 0) return 0;
    
    // More efficient: count intersection, calculate union size without creating set
    let intersectionCount = 0;
    for (const item of set1) {
        if (set2.has(item)) intersectionCount++;
    }
    
    // Union size = size1 + size2 - intersection
    const unionSize = set1.size + set2.size - intersectionCount;
    
    return unionSize === 0 ? 0 : intersectionCount / unionSize;
}

// Cosine Similarity Algorithm
// This one uses vector math - creates frequency vectors and finds the angle between them
// Took me a while to understand this one, had to review linear algebra!
function cosineSimilarity(str1, str2) {
    // Preprocess: remove stopwords and get meaningful words only
    const words1 = preprocessText(str1);
    const words2 = preprocessText(str2);
    
    // Early return if either is empty
    if (words1.length === 0 || words2.length === 0) return 0;
    
    // Build frequency maps (much faster than repeated filtering)
    const freq1 = new Map();
    const freq2 = new Map();
    
    for (const word of words1) {
        freq1.set(word, (freq1.get(word) || 0) + 1);
    }
    for (const word of words2) {
        freq2.set(word, (freq2.get(word) || 0) + 1);
    }
    
    // Calculate dot product and magnitudes in one pass
    let dotProduct = 0;
    let magnitude1 = 0;
    let magnitude2 = 0;
    
    // Get all unique words
    const allWords = new Set([...freq1.keys(), ...freq2.keys()]);
    
    for (const word of allWords) {
        const count1 = freq1.get(word) || 0;
        const count2 = freq2.get(word) || 0;
        
        dotProduct += count1 * count2;
        magnitude1 += count1 * count1;
        magnitude2 += count2 * count2;
    }
    
    magnitude1 = Math.sqrt(magnitude1);
    magnitude2 = Math.sqrt(magnitude2);
    
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
    
    // Early termination: if strings are very different in length, skip expensive calculation
    const lengthDiff = Math.abs(len1 - len2);
    if (lengthDiff > Math.max(len1, len2) * 0.5) {
        return Math.max(len1, len2);  // Return max length as worst case
    }
    
    // Optimize memory: only need two rows instead of full matrix
    let prevRow = Array(len2 + 1).fill(0);
    let currRow = Array(len2 + 1).fill(0);
    
    // Initialize first row
    for (let j = 0; j <= len2; j++) prevRow[j] = j;
    
    // Fill the matrix using bottom-up approach with space optimization
    for (let i = 1; i <= len1; i++) {
        currRow[0] = i;
        
        for (let j = 1; j <= len2; j++) {
            if (s1[i - 1] === s2[j - 1]) {
                // Characters match, no edit needed
                currRow[j] = prevRow[j - 1];
            } else {
                // Take minimum of three operations
                currRow[j] = Math.min(
                    prevRow[j] + 1,        // deletion
                    currRow[j - 1] + 1,    // insertion
                    prevRow[j - 1] + 1     // substitution
                );
            }
        }
        
        // Swap rows
        [prevRow, currRow] = [currRow, prevRow];
    }
    
    return prevRow[len2];
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
    // 60% Cosine (best for semantic similarity), 30% Jaccard (word overlap), 10% Levenshtein (character-level)
    return (cosine * 0.6) + (jaccard * 0.3) + (levenshtein * 0.1);
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
// Useful for handling typos and partial matches!
function findClosestMatch(movies, searchTerm) {
    let bestMatch = null;
    let highestSimilarity = 0;
    
    const searchLower = searchTerm.toLowerCase().trim();
    
    // Check each movie title with multiple strategies
    movies.forEach(movie => {
        const titleLower = movie.title.toLowerCase();
        let similarity = 0;
        
        // Strategy 1: Exact match (case-insensitive) = 100%
        if (titleLower === searchLower) {
            similarity = 1.0;
        }
        // Strategy 2: One contains the other = high score
        else if (titleLower.includes(searchLower)) {
            // Full substring match, score based on how much of title it covers
            similarity = 0.85 + (searchLower.length / titleLower.length) * 0.15;
        }
        else if (searchLower.includes(titleLower)) {
            similarity = 0.80;
        }
        // Strategy 3: Word overlap (handles "Star Wars" vs "Wars Star")
        else {
            const searchWords = new Set(searchLower.split(/\s+/).filter(w => w.length > 2));
            const titleWords = new Set(titleLower.split(/\s+/).filter(w => w.length > 2));
            
            if (searchWords.size > 0 && titleWords.size > 0) {
                // Count matching words
                let matchingWords = 0;
                for (const word of searchWords) {
                    if (titleWords.has(word)) matchingWords++;
                }
                
                // Jaccard-like score for word overlap
                const wordOverlap = matchingWords / Math.max(searchWords.size, titleWords.size);
                
                // Also check Levenshtein for typos
                const levenshtein = levenshteinSimilarity(movie.title, searchTerm);
                
                // Combine: 70% word overlap (better for partial matches), 30% fuzzy (better for typos)
                similarity = (wordOverlap * 0.7) + (levenshtein * 0.3);
            } else {
                // Fallback to pure Levenshtein for single-word searches
                similarity = levenshteinSimilarity(movie.title, searchTerm);
            }
        }
        
        if (similarity > highestSimilarity) {
            highestSimilarity = similarity;
            bestMatch = movie;
        }
    });
    
    return { movie: bestMatch, similarity: highestSimilarity };
}

// Enhanced search that checks both title and content
// Returns movies sorted by relevance with title matches prioritized
function searchMovies(movies, searchTerm, maxResults = 10) {
    const searchLower = searchTerm.toLowerCase().trim();
    
    return movies.map(movie => {
        const titleLower = movie.title.toLowerCase();
        let titleScore = 0;
        let contentScore = 0;
        
        // Title matching (same logic as findClosestMatch)
        if (titleLower === searchLower) {
            titleScore = 1.0;
        } else if (titleLower.includes(searchLower)) {
            titleScore = 0.85 + (searchLower.length / titleLower.length) * 0.15;
        } else if (searchLower.includes(titleLower)) {
            titleScore = 0.80;
        } else {
            const searchWords = new Set(searchLower.split(/\s+/).filter(w => w.length > 2));
            const titleWords = new Set(titleLower.split(/\s+/).filter(w => w.length > 2));
            
            if (searchWords.size > 0 && titleWords.size > 0) {
                let matchingWords = 0;
                for (const word of searchWords) {
                    if (titleWords.has(word)) matchingWords++;
                }
                const wordOverlap = matchingWords / Math.max(searchWords.size, titleWords.size);
                const levenshtein = levenshteinSimilarity(movie.title, searchTerm);
                titleScore = (wordOverlap * 0.7) + (levenshtein * 0.3);
            } else {
                titleScore = levenshteinSimilarity(movie.title, searchTerm);
            }
        }
        
        // Content matching (description + genres)
        const contentText = `${movie.description} ${movie.genre.join(' ')}`;
        contentScore = combinedSimilarity(contentText, searchTerm);
        
        // Weighted combination: Title is 80% important for initial search, content 20%
        const overallScore = (titleScore * 0.80) + (contentScore * 0.20);
        
        return {
            ...movie,
            searchScore: overallScore,
            titleScore: titleScore,
            contentScore: contentScore
        };
    })
    .filter(m => m.searchScore > 0.1)  // Filter out very poor matches
    .sort((a, b) => b.searchScore - a.searchScore)
    .slice(0, maxResults);
}

// Main recommendation function - this is what gets called when you select a movie
function getRecommendations(movies, selectedMovie, algorithm = 'combined', topN = 6) {
    // Build a reference string from the selected movie (cached via preprocessing)
    const referenceText = `${selectedMovie.description} ${selectedMovie.genre.join(' ')}`;
    
    // Pre-extract title words once for franchise matching
    // Filter out common words but keep important franchise names
    const refTitleWords = selectedMovie.title.toLowerCase()
        .split(/[\s:]+/)  // Split on spaces and colons
        .filter(w => {
            // Keep words that are 3+ chars and not numbers/articles
            return w.length >= 3 && 
                   !/^[0-9]+$/.test(w) && 
                   !['the', 'and', 'part', 'vol', 'volume'].includes(w);
        });
    const refTitleSet = new Set(refTitleWords);
    
    // First, filter to only movies that share at least one genre
    const sameGenreMovies = movies.filter(movie => {
        if (movie.id === selectedMovie.id) return false;  // Don't recommend the same movie!
        // Check if any genres overlap
        return movie.genre.some(g => selectedMovie.genre.includes(g));
    });
    
    // If we have enough same-genre movies, only use those
    // Otherwise fall back to all movies (but same-genre will still score higher)
    const candidateMovies = sameGenreMovies.length >= topN * 2 ? sameGenreMovies : 
        movies.filter(movie => movie.id !== selectedMovie.id);
    
    // Calculate similarity for all candidate movies and sort them
    const recommendations = candidateMovies
        .map(movie => {
            // Calculate base similarity
            const baseScore = calculateMovieSimilarity(movie, referenceText, algorithm, selectedMovie);
            
            // Franchise/sequel detection bonus
            let franchiseBonus = 0;
            if (refTitleWords.length > 0) {
                const movieTitleLower = movie.title.toLowerCase();
                let matchingWords = 0;
                
                for (const word of refTitleWords) {
                    if (movieTitleLower.includes(word)) {
                        matchingWords++;
                    }
                }
                
                // Calculate franchise bonus (0 to 0.25)
                // Higher bonus if multiple words match (sequels/franchises)
                if (matchingWords > 0) {
                    const matchRatio = matchingWords / refTitleWords.length;
                    franchiseBonus = matchRatio * 0.25;  // Up to 25% bonus
                }
            }
            
            return {
                ...movie,
                similarityScore: baseScore + franchiseBonus
            };
        })
        .sort((a, b) => b.similarityScore - a.similarityScore)  // Highest similarity first
        .slice(0, topN);  // Get top N recommendations
    
    return recommendations;
}
