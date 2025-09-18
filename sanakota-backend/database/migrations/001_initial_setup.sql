-- Migration: 001_initial_setup.sql
-- Description: Initial database setup for Sanakota
-- Created: 2025-09-19

-- Create database if it doesn't exist (run this manually)
-- CREATE DATABASE sanakota_db;

-- Connect to the database and run the schema
\c sanakota_db;

-- Run the main schema file
\i database/schema/01_create_words_table.sql;