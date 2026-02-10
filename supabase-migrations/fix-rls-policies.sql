-- Fix RLS policies to allow admin operations

-- Allow anyone to delete from feature_votes (needed for cascade)
DROP POLICY IF EXISTS "Anyone can delete feature votes" ON feature_votes;
CREATE POLICY "Anyone can delete feature votes" ON feature_votes
  FOR DELETE
  USING (true);

-- Allow anyone to delete features (we'll handle auth in the app)
DROP POLICY IF EXISTS "Anyone can delete features" ON feature_requests;
CREATE POLICY "Anyone can delete features" ON feature_requests
  FOR DELETE
  USING (true);

-- Allow anyone to update features (for admin vote editing)
DROP POLICY IF EXISTS "Anyone can update features" ON feature_requests;
CREATE POLICY "Anyone can update features" ON feature_requests
  FOR UPDATE
  USING (true)
  WITH CHECK (true);
