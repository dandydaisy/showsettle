-- Create table to track features being built
CREATE TABLE IF NOT EXISTS features_in_progress (
  id BIGSERIAL PRIMARY KEY,
  feature_id BIGINT NOT NULL REFERENCES feature_requests(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'queued', -- queued, building, completed, cancelled
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  build_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(feature_id)
);

-- Create index on feature_id
CREATE INDEX IF NOT EXISTS idx_features_in_progress_feature_id ON features_in_progress(feature_id);

-- Create index on status
CREATE INDEX IF NOT EXISTS idx_features_in_progress_status ON features_in_progress(status);

-- Enable Row Level Security
ALTER TABLE features_in_progress ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read
CREATE POLICY "Anyone can read features in progress" ON features_in_progress
  FOR SELECT
  USING (true);

-- Allow anyone to insert (we'll handle auth in app)
CREATE POLICY "Anyone can insert features in progress" ON features_in_progress
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to update
CREATE POLICY "Anyone can update features in progress" ON features_in_progress
  FOR UPDATE
  USING (true)
  WITH CHECK (true);
