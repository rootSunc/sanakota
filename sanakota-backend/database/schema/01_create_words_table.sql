-- Sanakota Database Schema
-- Words table for storing linguistic data

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the words table
CREATE TABLE words (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lemma VARCHAR(255) NOT NULL,
    pos VARCHAR(50) NOT NULL, -- Part of Speech (noun, verb, adjective, etc.)
    translation TEXT,
    definition TEXT,
    synonyms JSONB DEFAULT '[]'::jsonb,
    inflections JSONB DEFAULT '{}'::jsonb,
    lexical_category VARCHAR(100),
    example_sentences JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_words_lemma ON words(lemma);
CREATE INDEX idx_words_pos ON words(pos);
CREATE INDEX idx_words_lexical_category ON words(lexical_category);
CREATE INDEX idx_words_created_at ON words(created_at);

-- Create GIN indexes for JSONB columns for efficient JSON queries
CREATE INDEX idx_words_synonyms_gin ON words USING GIN(synonyms);
CREATE INDEX idx_words_inflections_gin ON words USING GIN(inflections);
CREATE INDEX idx_words_example_sentences_gin ON words USING GIN(example_sentences);

-- Create a full-text search index on lemma and definition
CREATE INDEX idx_words_fulltext ON words USING GIN(
    to_tsvector('english', lemma || ' ' || COALESCE(definition, ''))
);

-- Add constraints
ALTER TABLE words ADD CONSTRAINT chk_pos_not_empty CHECK (pos != '');
ALTER TABLE words ADD CONSTRAINT chk_lemma_not_empty CHECK (lemma != '');

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_words_updated_at 
    BEFORE UPDATE ON words 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE words IS 'Main table storing word entries with linguistic data';
COMMENT ON COLUMN words.id IS 'Unique identifier for each word entry';
COMMENT ON COLUMN words.lemma IS 'Base form or dictionary form of the word';
COMMENT ON COLUMN words.pos IS 'Part of speech (noun, verb, adjective, adverb, etc.)';
COMMENT ON COLUMN words.translation IS 'Translation of the word in target language';
COMMENT ON COLUMN words.definition IS 'Detailed definition or explanation of the word';
COMMENT ON COLUMN words.synonyms IS 'JSON array of synonyms for the word';
COMMENT ON COLUMN words.inflections IS 'JSON object containing different inflected forms';
COMMENT ON COLUMN words.lexical_category IS 'Broader lexical category or semantic field';
COMMENT ON COLUMN words.example_sentences IS 'JSON array of example sentences using the word';
COMMENT ON COLUMN words.created_at IS 'Timestamp when the record was created';
COMMENT ON COLUMN words.updated_at IS 'Timestamp when the record was last updated';