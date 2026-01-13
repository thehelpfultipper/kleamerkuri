-- RPC for matching portfolio content
CREATE OR REPLACE FUNCTION match_portfolio_content(
  query_embedding VECTOR(768), -- Dimensions for Gemini text-embedding-004
  match_threshold FLOAT,
  match_count INT
)
RETURNS TABLE (
  id INT,
  slug_id TEXT,
  content TEXT,
  content_type VARCHAR,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    pc.id,
    pc.slug_id,
    pc.content,
    pc.content_type,
    pc.metadata,
    1 - (pc.embedding <=> query_embedding) AS similarity
  FROM portfolio_content pc
  WHERE 1 - (pc.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;
