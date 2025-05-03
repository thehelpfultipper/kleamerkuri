-- RPC for matching portfolio content
CREATE OR REPLACE FUNCTION match_portfolio_content(
  query_embedding VECTOR(384),
  match_threshold FLOAT,
  match_count INT
)
RETURNS TABLE (
  id INT,
  content TEXT,
  content_type VARCHAR,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    portfolio_content.id,
    portfolio_content.content,
    portfolio_content.content_type,
    1 - (portfolio_content.embedding <=> query_embedding) AS similarity
  FROM portfolio_content
  WHERE 1 - (portfolio_content.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;
