const fs = require('fs');
const path = require('path');

/**
 * Process Kaggle IMDB Dataset
 * This script converts Kaggle's IMDB Top 1000 Movies CSV to our JSON format
 * 
 * CSV file should be named: imdb_top_1000.csv
 * Place it in the data/ folder before running this script
 */

// Configuration
// This script will process all CSV files in the data/ folder and combine them
const DATA_DIR = path.join(__dirname, '../data');
const OUTPUT_FILE_PATH = path.join(__dirname, '../data/movies.json');

// Find all CSV files in the data directory
function findCSVFiles() {
    const files = fs.readdirSync(DATA_DIR);
    const csvFiles = files.filter(f => f.endsWith('.csv'));
    
    if (csvFiles.length === 0) {
        return [];
    }
    
    console.log(`📄 Found ${csvFiles.length} CSV file(s):`);
    csvFiles.forEach((f, i) => console.log(`   ${i + 1}. ${f}`));
    console.log('');
    
    return csvFiles.map(f => path.join(DATA_DIR, f));
}

// Parse CSV line by line (simple parser for CSV with potential commas in quotes)
function parseCSV(csvText) {
    const lines = csvText.split('\n');
    const headers = parseCSVLine(lines[0]);
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        const values = parseCSVLine(lines[i]);
        const row = {};
        
        headers.forEach((header, index) => {
            row[header] = values[index] || '';
        });
        
        data.push(row);
    }
    
    return data;
}

function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    
    result.push(current.trim());
    return result;
}

// Transform Kaggle data to our format
function transformMovie(movie, index, genreFromFile = null) {
    // Extract year from the year field
    const year = parseInt(movie.year || '2000');
    
    // Extract rating
    let rating = parseFloat(movie.rating || '0');
    
    // Extract genres (handle different formats)
    let genres = [];
    const genreField = movie.genre || '';
    if (genreField) {
        genres = genreField.split(',').map(g => g.trim()).filter(g => g);
    }
    // If no genres in data and we have genre from filename, use that
    if (genres.length === 0 && genreFromFile) {
        genres = [genreFromFile];
    }
    
    // Extract title - column is movie_name
    const title = (movie.movie_name || '').replace(/^["']|["']$/g, '').trim();
    
    // Extract description
    const description = (movie.description || 'No description available.').replace(/^["']|["']$/g, '').trim();
    
    // Skip if no title or rating is 0
    if (!title || rating === 0) {
        return null;
    }
    
    // Generate unique ID
    const id = `movie_${index + 1}`;
    
    return {
        id: id,
        title: title,
        year: year,
        rating: rating,
        genre: genres.slice(0, 3), // Limit to 3 genres for consistency
        description: description,
        // Additional fields from Kaggle
        director: movie.director || null,
        actors: movie.star || null,
        runtime: movie.runtime || null,
        certificate: movie.certificate || null
    };
}

// Main processing function
async function processKaggleData() {
    try {
        console.log('🎬 Processing Kaggle IMDB Movie Dataset...\n');
        
        // Find all CSV files
        const csvFiles = findCSVFiles();
        
        if (csvFiles.length === 0) {
            console.error('❌ Error: No CSV files found in data/ folder!');
            console.log('\n📝 Please download the dataset:');
            console.log('   Option 1: Run: npm run download-kaggle');
            console.log('   Option 2: Manual download:');
            console.log('     1. Visit: https://www.kaggle.com/datasets/rajugc/imdb-movies-dataset-based-on-genre');
            console.log('     2. Download the CSV files');
            console.log('     3. Place them in the data/ folder');
            console.log('     4. Run this script again\n');
            return;
        }
        
        let allMovies = [];
        const seenTitles = new Set(); // To avoid duplicates
        
        // Process each CSV file
        for (const csvFile of csvFiles) {
            const filename = path.basename(csvFile);
            const genreFromFilename = filename.replace('.csv', '').charAt(0).toUpperCase() + filename.replace('.csv', '').slice(1);
            
            console.log(`📖 Reading ${filename}...`);
            const csvContent = fs.readFileSync(csvFile, 'utf-8');
            
            // Parse CSV
            const rawData = parseCSV(csvContent);
            console.log(`   Found ${rawData.length} movies`);
            
            // Transform and add to collection
            rawData.forEach(movie => {
                const transformed = transformMovie(movie, allMovies.length, genreFromFilename);
                
                // Only add if transformation succeeded and we haven't seen this title before
                if (transformed && transformed.title && !seenTitles.has(transformed.title.toLowerCase())) {
                    seenTitles.add(transformed.title.toLowerCase());
                    allMovies.push(transformed);
                }
            });
        }
        
        console.log(`\n✅ Total unique movies processed: ${allMovies.length}\n`);
        
        // Filter out movies with rating 5.0 or below
        const filteredMovies = allMovies.filter(movie => movie.rating > 5.0);
        console.log(`🎯 Movies with rating > 5.0: ${filteredMovies.length}`);
        console.log(`❌ Removed ${allMovies.length - filteredMovies.length} movies with rating ≤ 5.0\n`);
        
        // Sort by rating (highest first)
        filteredMovies.sort((a, b) => b.rating - a.rating);
        
        // Use filtered movies
        const finalMovies = filteredMovies;
        
        console.log(`📊 Including ${finalMovies.length} movies in the database\n`);
        
        // Show sample
        console.log('📊 Sample movie:');
        console.log(JSON.stringify(finalMovies[0], null, 2));
        console.log('\n');
        
        // Save to JSON file
        console.log('💾 Saving to movies.json...');
        fs.writeFileSync(
            OUTPUT_FILE_PATH,
            JSON.stringify(finalMovies, null, 2),
            'utf-8'
        );
        
        console.log('✅ Successfully created movies.json!');
        console.log(`📁 Location: ${OUTPUT_FILE_PATH}`);
        console.log(`📊 Total movies: ${finalMovies.length}\n`);
        
        // Statistics
        const avgRating = (finalMovies.reduce((sum, m) => sum + m.rating, 0) / finalMovies.length).toFixed(2);
        const yearRange = {
            min: Math.min(...finalMovies.map(m => m.year)),
            max: Math.max(...finalMovies.map(m => m.year))
        };
        
        // Count genres
        const genreCounts = {};
        finalMovies.forEach(m => {
            m.genre.forEach(g => {
                genreCounts[g] = (genreCounts[g] || 0) + 1;
            });
        });
        
        console.log('📈 Dataset Statistics:');
        console.log(`   Average Rating: ${avgRating}/10`);
        console.log(`   Year Range: ${yearRange.min} - ${yearRange.max}`);
        console.log(`   Movies with descriptions: ${finalMovies.filter(m => m.description !== 'No description available.').length}`);
        console.log(`   Unique genres: ${Object.keys(genreCounts).length}`);
        console.log('\n✨ All done! Your movie database is ready to use.\n');
        
    } catch (error) {
        console.error('❌ Error processing data:', error.message);
        console.error(error.stack);
    }
}

// Run the script
processKaggleData();
