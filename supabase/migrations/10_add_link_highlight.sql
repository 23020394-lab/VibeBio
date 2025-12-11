-- Add is_highlighted column to links table
ALTER TABLE links ADD COLUMN IF NOT EXISTS is_highlighted BOOLEAN DEFAULT FALSE;

-- Index for performance (optional but good practice)
CREATE INDEX IF NOT EXISTS idx_links_is_highlighted ON links(is_highlighted);
