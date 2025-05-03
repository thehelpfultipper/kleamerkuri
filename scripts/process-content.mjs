import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from "@google/genai";
import * as env from 'dotenv';
env.config({
    path: 'supabase/.env',
});
// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Init Gemini
const geminiKey = process.env.GEMINI_KEY;
if (!geminiKey || geminiKey.length < 10) {
    throw new Error('Missing or invalid GEMINI_KEY. Please check your environment variable.');
}
const genAI = new GoogleGenAI({ apiKey: geminiKey });

// Constants
const BATCH_LIMIT = 5;
const MIN_LENGTH = 2;

const seenTexts = new Set();
const embeddingQueue = [];

// Check if a given content + content_type combo already exists in the DB
async function checkIfContentExists(content, content_type) {
    const { data, error } = await supabase
        .from('portfolio_content')
        .select('id')
        .eq('content', content)
        .eq('content_type', content_type)
        .maybeSingle();

    if (error) {
        console.error('Supabase check error:', error);
        return true;
    }

    return Boolean(data);
}

// Initialize the embedding model to process a batch of text inputs and return embeddings
async function initEmbeddingModel(batch) {
    const texts = batch.map(item => item.content);
    console.log(texts)
    try {
        const response = await genAI.models.embedContent({
            model: 'models/text-embedding-004',
            contents: texts
        });

        if (!response.embeddings || !Array.isArray(response.embeddings) || response.embeddings.length === 0) {
            throw new Error(`Invalid embedding format from Gemini ${JSON.stringify(response)}`);
        }
        return response.embeddings;

    } catch (error) {
        console.error('Error generating embedding:', error);
        throw error;
    }
}

// Process all JSON files in data directory
async function processPortfolioContent() {
    const dataDir = path.join(process.cwd(), 'src/data');
    // const generateEmbedding = await initEmbeddingModel();

    // Recursively find all JSON files
    function findJsonFiles(dir) {
        const files = fs.readdirSync(dir);
        return files.flatMap(file => {
            const fullPath = path.join(dir, file);
            return fs.statSync(fullPath).isDirectory() ? findJsonFiles(fullPath) : fullPath.endsWith('.json') ? [fullPath] : [];
        });
    }

    // Get all JSON files in the data directory
    const files = findJsonFiles(dataDir);

    // const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.json'));

    for (const file of files) {
        const contentType = path.basename(file, '.json');
        // const filePath = path.join(dataDir, file);

        // Read and parse JSON file
        const rawData = fs.readFileSync(file, 'utf8');
        const data = JSON.parse(rawData);

        console.log(`Processing ${contentType} data...`);

        // Process each section of the content
        await processDataRecursively(data, contentType);
    }

    console.log('Content processing complete!');
}

async function upsertPortfolioContent({
    content,
    contentType,
    contextKey,
    embedding,
    action = 'create', // or 'update' or 'delete'
}) {
    const content_type = `${contentType}:${contextKey}`;

    if (action === 'delete') {
        const { error } = await supabase
            .from('portfolio_content')
            .delete()
            .eq('content_type', content_type);

        if (error) console.error('Delete failed:', error);
        else console.log(`Deleted ${content_type} content`);
        return;
    }

    // Check if entry already exists
    const { data: existing, error: fetchError } = await supabase
        .from('portfolio_content')
        .select('id')
        .eq('content_type', content_type)
        .maybeSingle();

    if (fetchError) {
        console.error('Check failed:', fetchError);
        return;
    }

    if (existing && action === 'update') {
        // update existing
        const { error } = await supabase
            .from('portfolio_content')
            .update({ content, embedding })
            .eq('content_type', content_type);

        if (error) { console.error('Update failed:', error) } else {
            console.log(`Updated ${content_type} content`);
        }
    } else if (!existing && ['create', 'update'].includes(action)) {
        // insert new
        const { error } = await supabase
            .from('portfolio_content')
            .insert({ content, content_type, embedding });

        if (error) { console.error('Insert failed:', error) } else {
            console.log(`Stored ${content_type} content`);
        }
    }
}

// Recursively process data objects/arrays and extract text content
async function processDataRecursively(data, contentType, parentKey = '') {
    if (Array.isArray(data)) {
        // Process each item in array
        for (let i = 0; i < data.length; i++) {
            await processDataRecursively(
                data[i],
                contentType,
                parentKey ? `${parentKey}[${i}]` : `[${i}]`
            );
        }
    } else if (data !== null && typeof data === 'object') {
        // Process each property in object
        for (const [key, value] of Object.entries(data)) {
            await processDataRecursively(
                value,
                contentType,
                parentKey ? `${parentKey}.${key}` : key
            );
        }
    } else if (typeof data === 'string' && data.trim().length > 3) {
        // Create embedding for text content with reasonable length
        const content = data.trim();
        const contextKey = parentKey || 'general';

        // Skip short text content within certain keywords
        if (
            content.length < MIN_LENGTH &&
            !/^(ai|ml|ui|ux|js|go)$/i.test(content)
        ) return;

        // Skip if already seen
        if (seenTexts.has(content)) return;
        seenTexts.add(content);

        // Skip if already in DB
        const exists = await checkIfContentExists(content, `${contentType}:${contextKey}`);
        if (exists) {
            console.log(`${contentType}:${contextKey} content already exists`);
            return;
        };

        // Push to queue
        console.log(`Pushing ${contentType}:${contextKey} content to queue`);
        embeddingQueue.push({ content, content_type: contextKey });

        // Create embedding
        if (embeddingQueue.length >= BATCH_LIMIT) {
            const batch = embeddingQueue.splice(0, BATCH_LIMIT);
            const embeddings = await initEmbeddingModel(batch);
            for (let i = 0; i < batch.length; i++) {
                const { content } = batch[i];
                const embedding = embeddings[i].values;
                await upsertPortfolioContent({
                    content,
                    contentType,
                    contextKey,
                    embedding,
                });
            }
        }
    }
}

// Run the processor
processPortfolioContent().catch(console.error);
