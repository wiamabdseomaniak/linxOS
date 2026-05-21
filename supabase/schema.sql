-- Email Verification OTP Table
-- Run this SQL in your Supabase SQL Editor to create the necessary table

CREATE TABLE IF NOT EXISTS email_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  attempts INTEGER DEFAULT 0,
  resend_attempts INTEGER DEFAULT 0,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_email_verifications_email 
ON email_verifications(email) 
WHERE used = FALSE;

CREATE INDEX IF NOT EXISTS idx_email_verifications_expires 
ON email_verifications(expires_at);

-- Clean up old entries periodically (optional - can be set up as a cron job)
-- This keeps the table size manageable by removing old entries
-- ALTER TABLE email_verifications SET (
--   storage.compress = 'zstd'
-- );

-- Disable RLS for email_verifications table (for development)
ALTER TABLE email_verifications DISABLE ROW LEVEL SECURITY;

-- Alternative: Allow all inserts (if RLS is enabled)
-- CREATE POLICY "Allow all inserts for email_verifications" ON email_verifications
--   FOR INSERT WITH CHECK (true);