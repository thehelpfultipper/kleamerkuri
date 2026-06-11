import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as env from 'dotenv';

const envPath = process.env.NODE_ENV === 'development' ? 'supabase/.env.local' : 'supabase/.env';
env.config({ path: envPath });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

const BATCH_LIMIT = 5;
const embeddingQueue = [];

const generateHash = (text, model) => crypto.createHash('md5').update(text + model).digest('hex');
const EMBED_MODEL = "gemini-embedding-001";

const FILE_CONTENT_TYPES = {
    'profile.json': ['profile'],
    'resume.json': ['resume'],
    'products.json': ['product'],
    'posts.json': ['post'],
    'projects.json': ['project'],
};

function parseArgs() {
    const args = process.argv.slice(2);
    let fileFilter = null;
    let noPrune = false;

    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--file' && args[i + 1]) {
            fileFilter = args[++i];
        } else if (args[i].startsWith('--file=')) {
            fileFilter = args[i].slice('--file='.length);
        } else if (args[i] === '--no-prune') {
            noPrune = true;
        } else if (args[i] === '--help' || args[i] === '-h') {
            console.log(`Usage: node scripts/process-content.mjs [options]

Options:
  --file <name>   Sync only one JSON file (e.g. resume.json or resume)
  --no-prune      Skip deleting stale rows from the database
  -h, --help      Show this help message

Via npm (file/no-prune are passed as npm config and read automatically):
  npm run local:sync-content --file=resume.json
  npm run sync-content --file=resume.json --no-prune

Or set SYNC_FILE when running the script directly:
  SYNC_FILE=resume.json npm run sync-content`);
            process.exit(0);
        }
    }

    if (!fileFilter) {
        fileFilter = process.env.SYNC_FILE || process.env.npm_config_file || null;
    }

    if (!noPrune) {
        noPrune = process.env.npm_config_no_prune === 'true';
    }

    return { fileFilter, noPrune };
}

function normalizeTitle(title) {
    return title.toLowerCase().split('–')[0].trim().replace(/[^a-z0-9]/g, '');
}

function buildProjectDateMap() {
    const projectsPath = path.join(process.cwd(), 'src/data/projects/projects.json');
    if (!fs.existsSync(projectsPath)) return new Map();

    const projects = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));
    const map = new Map();

    if (Array.isArray(projects)) {
        projects.forEach((project) => {
            if (project.meta?.date) {
                map.set(normalizeTitle(project.title), project.meta.date);
            }
        });
    }

    return map;
}

function getAllJsonFiles(dirPath, arrayOfFiles = []) {
    const files = fs.readdirSync(dirPath);
    files.forEach(file => {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            getAllJsonFiles(fullPath, arrayOfFiles);
        } else if (file.endsWith('.json')) {
            arrayOfFiles.push(fullPath);
        }
    });
    return arrayOfFiles;
}

function resolveFileFilter(filter, allFiles) {
    const normalized = filter.endsWith('.json') ? filter : `${filter}.json`;
    const match = allFiles.find(
        (filePath) => path.basename(filePath) === normalized || filePath.endsWith(normalized)
    );

    if (!match) {
        console.error(`❌ File not found: ${filter}`);
        process.exit(1);
    }

    return match;
}

function createChunks(data, fileName, projectDateMap = new Map()) {
    const chunks = [];
    const source = fileName.replace('.json', '');

    // 1. PROFILE (Exhaustive)
    if (source === 'profile' && data.profile) {
        const p = data.profile;
        const name = p.name;

        // Header Info (Fixed the previous blind spot)
        chunks.push({
            slug: 'profile-header',
            text: `${name} is a ${p.title} currently employed at ${p.employer}. Her pronouns are ${p.pronouns}.`,
            meta: { type: 'profile', section: 'header' }
        });

        // Contact Info
        chunks.push({
            slug: 'profile-contact',
            text: `Contact information for ${name}: Email: ${p.contact.email}, Phone: ${p.contact.phone}. Blog: ${p.blog.name} (${p.blog.url}).`,
            meta: { type: 'profile', section: 'contact', title: 'Contact', external: p.blog.url }
        });

        // Story, Subtitle & Lead
        chunks.push({
            slug: 'profile-bio',
            text: `Professional bio for ${name}: ${p.story}${p.subtitle ? ` Tagline: ${p.subtitle}` : ''} Current focus: ${p.lead}`,
            meta: { type: 'profile', section: 'bio' }
        });

        // Facts
        if (Array.isArray(p.facts)) {
            p.facts.forEach((fact, i) => {
                chunks.push({
                    slug: `profile-fact-${i}`,
                    text: `Interesting fact about ${name}: ${fact}`,
                    meta: { type: 'profile', section: 'fact' }
                });
            });
        }

        // About Paragraphs
        if (Array.isArray(p.about)) {
            p.about.forEach((para, i) => {
                chunks.push({
                    slug: `profile-about-${i}`,
                    text: `Background info on ${name}: ${para}`,
                    meta: { type: 'profile', section: 'about' }
                });
            });
        }
    }

    // 2. RESUME (Exhaustive)
    else if (source === 'resume' && data.resume) {
        const r = data.resume;

        // Summary
        chunks.push({
            slug: 'resume-summary',
            text: `Klea Merkuri's Professional Summary: ${r.summary}`,
            meta: {
                type: 'resume',
                section: 'summary',
                title: 'Resume',
                external: 'https://thehelpfultipper.com/kleamerkuri/klea-merkuri-software-engineer-resume.pdf'
            }
        });

        // Skills
        if (r.skills && Array.isArray(r.skills)) {
            r.skills.forEach(skillGroup => {
                chunks.push({
                    slug: `resume-skill-${skillGroup.category}`,
                    text: `Klea Merkuri has expertise in ${skillGroup.category}: ${skillGroup.items.join(', ')}.`,
                    meta: { type: 'resume', section: 'skills', category: skillGroup.category }
                });
            });
        }

        // Education
        if (r.education) {
            const { school, degree, honors } = r.education;
            chunks.push({
                slug: 'resume-education',
                text: `Klea Merkuri earned a ${degree} from ${school}${honors ? ` (${honors})` : ''}.`,
                meta: { type: 'resume', section: 'education' }
            });
        }

        // Experience
        if (Array.isArray(r.experience)) {
            r.experience.forEach((job, jobIdx) => {
                // Job Header (Captures dates/location)
                chunks.push({
                    slug: `resume-job-${jobIdx}`,
                    text: `Klea Merkuri served as ${job.title} at ${job.company} in ${job.location} from ${job.dates}.`,
                    meta: { type: 'resume', section: 'experience-header', company: job.company }
                });

                // Job Bullets
                if (Array.isArray(job.desc)) {
                    job.desc.forEach((bullet, bulletIdx) => {
                        chunks.push({
                            slug: `resume-exp-${job.company}-${bulletIdx}`,
                            text: `During her time (${job.dates}) as ${job.title} at ${job.company}, Klea Merkuri: ${bullet}`,
                            meta: { type: 'resume', section: 'experience-detail', company: job.company }
                        });
                    });
                }
            });
        }
    }

    // 3. PRODUCTS (Exhaustive)
    else if (source === 'products' && data.products) {
        if (Array.isArray(data.products)) {
            data.products.forEach(item => {
                const date = projectDateMap.get(normalizeTitle(item.title));
                const datePrefix = date ? `Completion date: ${date}. ` : '';

                chunks.push({
                    slug: `product-${item.title}`,
                    text: `${datePrefix}Product developed by Klea: ${item.title}. Description: ${item.description}. Demo Link: ${item.links.demo}. Blog Link: ${item.links.blog || 'N/A'}. Featured: ${item.featured}.`,
                    meta: {
                        type: 'product',
                        title: item.title,
                        ...(date && { date }),
                        demo: item.links.demo || null,
                        blog: item.links.blog || null
                    }
                });
            });
        }
    }

    // 4. POSTS (Exhaustive)
    else if (source === 'posts' && data.posts) {
        if (Array.isArray(data.posts)) {
            data.posts.forEach(item => {
                chunks.push({
                    slug: `post-${item.title}`,
                    text: `Blog post by Klea Merkuri (The Helpful Tipper): "${item.title}". Published: ${item.date}. Link: ${item.link}. Featured: ${item.featured}.`,
                    meta: {
                        type: 'post',
                        title: item.title,
                        external: item.link
                    }
                });
            });
        }
    }

    // 5. PROJECTS (Exhaustive)
    else if (source === 'projects' || Array.isArray(data)) {
        const items = Array.isArray(data) ? data : data.projects;
        if (Array.isArray(items)) {
            items.forEach(item => {
                chunks.push({
                    slug: `project-${item.title}`,
                    text: `Completion date: ${item.meta.date}. Portfolio Project: ${item.title}. Description: ${item.description}. Tech Stack: ${item.meta.stack.join(', ')}. Category: ${item.meta.category.join(', ')}. Demo: ${item.links.demo}. Blog: ${item.links.blog || 'N/A'}.`,
                    meta: {
                        type: 'project',
                        title: item.title,
                        date: item.meta.date,
                        demo: item.links.demo || null,
                        blog: item.links.blog || null
                    }
                });
            });
        }
    }

    return chunks.map(c => ({
        ...c,
        slug: c.slug.toLowerCase().replace(/[^a-z0-9]/g, '-')
    }));
}

async function loadExistingRows() {
    const rows = new Map();
    const pageSize = 1000;
    let from = 0;

    while (true) {
        const { data, error } = await supabase
            .from('portfolio_content')
            .select('slug_id, hash, content_type, metadata')
            .range(from, from + pageSize - 1);

        if (error) throw error;
        if (!data?.length) break;

        data.forEach((row) => rows.set(row.slug_id, row));

        if (data.length < pageSize) break;
        from += pageSize;
    }

    return rows;
}

async function updateMetadataOnly(chunk, hash) {
    const { error } = await supabase
        .from('portfolio_content')
        .update({
            content: chunk.text,
            content_type: chunk.meta.type,
            hash,
            metadata: chunk.meta,
            updated_at: new Date().toISOString()
        })
        .eq('slug_id', chunk.slug);

    if (error) console.error(`❌ Error updating metadata for ${chunk.slug}:`, error.message);
    else console.log(`📝 Updated metadata: ${chunk.slug}`);
}

async function flushQueue() {
    if (embeddingQueue.length === 0) return;

    const batch = embeddingQueue.splice(0, BATCH_LIMIT);
    const texts = batch.map(b => b.text);

    try {
        console.log(`Vectorizing ${batch.length} items with Gemini (${EMBED_MODEL})...`);
        const model = genAI.getGenerativeModel({ model: EMBED_MODEL });

        const result = await model.batchEmbedContents({
            requests: texts.map(t => ({
                content: { parts: [{ text: t }] },
                outputDimensionality: 768,
            }))
        });

        const embeddings = result.embeddings;

        for (let i = 0; i < batch.length; i++) {
            const item = batch[i];
            const vectorValues = embeddings[i].values;

            const { error } = await supabase
                .from('portfolio_content')
                .upsert({
                    slug_id: item.slug,
                    content: item.text,
                    content_type: item.meta.type,
                    embedding: vectorValues,
                    hash: item.hash,
                    metadata: item.meta,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'slug_id' });

            if (error) console.error(`❌ Error upserting ${item.slug}:`, error.message);
            else console.log(`✅ Synced: ${item.slug}`);
        }
    } catch (err) {
        console.error("Batch error processing Gemini embeddings:", err);
    }
}

async function pruneStaleContent(currentSlugsByType, options) {
    if (options.noPrune) {
        console.log('\n⏭️  Skipping stale row cleanup (--no-prune)');
        return;
    }

    const contentTypesToPrune = options.fileFilter
        ? FILE_CONTENT_TYPES[path.basename(options.fileFilter)] || []
        : null;

    if (options.fileFilter && contentTypesToPrune.length === 0) {
        console.warn(`\n⚠️  No content-type mapping for ${options.fileFilter}; skipping prune.`);
        return;
    }

    let query = supabase.from('portfolio_content').select('slug_id, content_type');
    if (contentTypesToPrune) {
        query = query.in('content_type', contentTypesToPrune);
    }

    const { data: existingRows, error } = await query;
    if (error) {
        console.error('❌ Error loading rows for prune:', error.message);
        return;
    }

    const staleSlugs = [];

    for (const row of existingRows || []) {
        const activeSlugs = contentTypesToPrune
            ? currentSlugsByType.get(row.content_type) || new Set()
            : currentSlugsByType.get('__all__') || new Set();

        if (!activeSlugs.has(row.slug_id)) {
            staleSlugs.push(row.slug_id);
        }
    }

    if (staleSlugs.length === 0) {
        console.log('\n🧹 No stale rows to remove.');
        return;
    }

    const { error: deleteError } = await supabase
        .from('portfolio_content')
        .delete()
        .in('slug_id', staleSlugs);

    if (deleteError) {
        console.error('❌ Error deleting stale rows:', deleteError.message);
        return;
    }

    console.log(`\n🧹 Removed ${staleSlugs.length} stale row(s):`);
    staleSlugs.forEach((slug) => console.log(`   - ${slug}`));
}

async function runSync() {
    const options = parseArgs();
    const dataDir = path.join(process.cwd(), 'src/data');
    const allFiles = getAllJsonFiles(dataDir);
    const filesToProcess = options.fileFilter
        ? [resolveFileFilter(options.fileFilter, allFiles)]
        : allFiles;

    const projectDateMap = buildProjectDateMap();
    const existingRows = await loadExistingRows();
    const currentSlugsByType = new Map();
    const allCurrentSlugs = new Set();

    console.log(`\nLoaded ${existingRows.size} existing row(s) from portfolio_content.`);

    if (options.fileFilter) {
        console.log(`Scoped sync: ${path.relative(process.cwd(), filesToProcess[0])}`);
    }

    for (const filePath of filesToProcess) {
        const fileName = path.basename(filePath);
        const rawData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        console.log(`\n--- Processing ${fileName} ---`);
        const chunks = createChunks(rawData, fileName, projectDateMap);

        for (const chunk of chunks) {
            const hash = generateHash(chunk.text, EMBED_MODEL);
            const slugSet = currentSlugsByType.get(chunk.meta.type) || new Set();
            slugSet.add(chunk.slug);
            currentSlugsByType.set(chunk.meta.type, slugSet);
            allCurrentSlugs.add(chunk.slug);

            const existing = existingRows.get(chunk.slug);

            if (existing?.hash === hash) {
                const metadataChanged = JSON.stringify(existing.metadata) !== JSON.stringify(chunk.meta);
                if (metadataChanged) {
                    await updateMetadataOnly(chunk, hash);
                } else {
                    console.log(`⏩ Skipping ${chunk.slug} (Match)`);
                }
                continue;
            }

            embeddingQueue.push({ ...chunk, hash });
            if (embeddingQueue.length >= BATCH_LIMIT) await flushQueue();
        }
    }

    await flushQueue();

    currentSlugsByType.set('__all__', allCurrentSlugs);
    await pruneStaleContent(currentSlugsByType, {
        noPrune: options.noPrune,
        fileFilter: options.fileFilter ? path.basename(filesToProcess[0]) : null,
    });

    console.log('\n✨ All systems go. Data sync complete.');
}

runSync().catch(console.error);
