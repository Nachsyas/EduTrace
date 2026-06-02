-- Migration 01: Supabase/PostgreSQL Database Initial Schema
-- Decouples raw student scores, attendance, token mints, and AI risk prediction records.

CREATE TABLE IF NOT EXISTS students (
    student_address VARCHAR(42) PRIMARY KEY, -- Ethereum Hex Address
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS report_cards (
    token_id BIGINT PRIMARY KEY,
    student_address VARCHAR(42) NOT NULL REFERENCES students(student_address) ON DELETE CASCADE,
    cid VARCHAR(100) NOT NULL, -- IPFS hash matching the tokenURI
    minted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS academic_records (
    id SERIAL PRIMARY KEY,
    student_address VARCHAR(42) NOT NULL REFERENCES students(student_address) ON DELETE CASCADE,
    subject VARCHAR(100) NOT NULL,
    score NUMERIC(5, 2) NOT NULL, -- Numeric grade value (e.g. 88.50)
    grade_level VARCHAR(20) NOT NULL, -- e.g. "Grade 10", "Grade 11"
    academic_year VARCHAR(20) NOT NULL, -- e.g. "2025/2026"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS attendance_records (
    id SERIAL PRIMARY KEY,
    student_address VARCHAR(42) NOT NULL REFERENCES students(student_address) ON DELETE CASCADE,
    grade_level VARCHAR(20) NOT NULL,
    total_classes INT NOT NULL DEFAULT 100,
    absences INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS predictions (
    id SERIAL PRIMARY KEY,
    student_address VARCHAR(42) NOT NULL REFERENCES students(student_address) ON DELETE CASCADE,
    dropout_risk NUMERIC(5, 2) NOT NULL, -- AI predicted risk score percentage (e.g. 12.45%)
    career_recommendation VARCHAR(255) NOT NULL,
    predicted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indices for fast query retrieval in REST and listening lookups
CREATE INDEX IF NOT EXISTS idx_report_cards_student ON report_cards(student_address);
CREATE INDEX IF NOT EXISTS idx_academic_records_student ON academic_records(student_address);
CREATE INDEX IF NOT EXISTS idx_attendance_records_student ON attendance_records(student_address);
CREATE INDEX IF NOT EXISTS idx_predictions_student ON predictions(student_address);
