CREATE INDEX IF NOT EXISTS idx_places_active_featured
ON places (is_active, is_featured);

CREATE INDEX IF NOT EXISTS idx_places_slug
ON places (slug);

CREATE INDEX IF NOT EXISTS idx_places_category
ON places (category_id);

CREATE INDEX IF NOT EXISTS idx_places_created_at
ON places (created_at);

CREATE INDEX IF NOT EXISTS idx_place_tags_place_id
ON place_tags (place_id);

CREATE INDEX IF NOT EXISTS idx_place_tags_tag_id
ON place_tags (tag_id);

CREATE INDEX IF NOT EXISTS idx_tags_slug
ON tags (slug);

CREATE INDEX IF NOT EXISTS idx_galleries_place_id
ON galleries (place_id);