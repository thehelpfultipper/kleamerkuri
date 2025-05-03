-- Enable pgvector (for semantic search)
CREATE EXTENSION IF NOT EXISTS vector;

-- Drop tables if reinitializing
DROP TABLE IF EXISTS portfolio_content;
DROP TABLE IF EXISTS chat_sessions;
DROP TABLE IF EXISTS chat_cache;

CREATE TABLE portfolio_content (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  content_type VARCHAR(50) NOT NULL, -- 'experience', 'skills', 'projects', etc.
  embedding VECTOR(384), -- Dimension depends on your embedding model
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data JSONB
);

CREATE TABLE chat_cache (
  id SERIAL PRIMARY KEY,
  query_hash TEXT UNIQUE NOT NULL,
  query TEXT NOT NULL,
  response TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster similarity search
CREATE INDEX ON portfolio_content USING ivfflat (embedding vector_cosine_ops);
