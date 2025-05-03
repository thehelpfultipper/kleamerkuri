-- --- TRIGGERS FOR TIMESTAMP AUTOMATION ---

-- Reusable trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_last_active_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_active = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for portfolio_content
CREATE TRIGGER trg_update_timestamp_portfolio
BEFORE UPDATE ON portfolio_content
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for chat_sessions
CREATE TRIGGER trg_update_timestamp_chat_sessions
BEFORE UPDATE ON chat_sessions
FOR EACH ROW EXECUTE FUNCTION update_last_active_column();
