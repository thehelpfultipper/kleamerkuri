-- Enable pgvector (for semantic search)
CREATE EXTENSION IF NOT EXISTS vector;

-- Drop tables if reinitializing
DROP TABLE IF EXISTS portfolio_content;
DROP TABLE IF EXISTS chat_sessions;
DROP TABLE IF EXISTS chat_cache;

CREATE TABLE IF NOT EXISTS portfolio_content (
  id SERIAL PRIMARY KEY,
  slug_id TEXT UNIQUE,
  content TEXT,
  content_type VARCHAR,
  embedding VECTOR(768),
  hash TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data JSONB
);

CREATE TABLE IF NOT EXISTS chat_cache (
  id SERIAL PRIMARY KEY,
  query_hash TEXT UNIQUE NOT NULL,
  query TEXT NOT NULL,
  response TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster similarity search
CREATE INDEX ON portfolio_content USING ivfflat (embedding vector_cosine_ops);
