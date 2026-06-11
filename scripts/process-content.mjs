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

async function runSync() {
    const dataDir = path.join(process.cwd(), 'src/data');

    function getAllFiles(dirPath, arrayOfFiles = []) {
        const files = fs.readdirSync(dirPath);
        files.forEach(file => {
            const fullPath = path.join(dirPath, file);
            if (fs.statSync(fullPath).isDirectory()) {
                arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
            } else if (file.endsWith('.json')) {
                arrayOfFiles.push(fullPath);
            }
        });
        return arrayOfFiles;
    }

    const allFiles = getAllFiles(dataDir);
    const projectDateMap = buildProjectDateMap();

    for (const filePath of allFiles) {
        const fileName = path.basename(filePath);
        const rawData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        console.log(`\n--- Processing ${fileName} ---`);
        const chunks = createChunks(rawData, fileName, projectDateMap);

        for (const chunk of chunks) {
            const hash = generateHash(chunk.text, EMBED_MODEL);

            const { data: existing } = await supabase
                .from('portfolio_content')
                .select('hash')
                .eq('slug_id', chunk.slug)
                .maybeSingle();

            if (existing?.hash === hash) {
                console.log(`⏩ Skipping ${chunk.slug} (Match)`);
                continue;
            }

            embeddingQueue.push({ ...chunk, hash });
            if (embeddingQueue.length >= BATCH_LIMIT) await flushQueue();
        }
    }

    await flushQueue();
    console.log('\n✨ All systems go. Data sync complete.');
}

runSync().catch(console.error);
