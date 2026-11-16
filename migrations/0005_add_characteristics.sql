-- Migration 0005: Add characteristics column to places table
ALTER TABLE places ADD COLUMN characteristics TEXT;
