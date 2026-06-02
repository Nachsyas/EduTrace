-- Migration 02: Expand predictions table with AI metrics columns
-- Adds JSONB columns to the predictions table to support the 5 new AI analytics.

ALTER TABLE predictions
ADD COLUMN IF NOT EXISTS skill_profile JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS job_matching JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS salary_projection JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS startup_probability JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS learning_roadmap JSONB DEFAULT '[]'::jsonb;
