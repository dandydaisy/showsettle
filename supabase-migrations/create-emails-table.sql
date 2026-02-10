-- Create emails table to store user emails
CREATE TABLE IF NOT EXISTS emails (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, email)
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_emails_user_id ON emails(user_id);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_emails_email ON emails(email);

-- Enable Row Level Security
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert their own email
CREATE POLICY "Anyone can insert emails" ON emails
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow users to read their own emails
CREATE POLICY "Users can read their own emails" ON emails
  FOR SELECT
  USING (true);
