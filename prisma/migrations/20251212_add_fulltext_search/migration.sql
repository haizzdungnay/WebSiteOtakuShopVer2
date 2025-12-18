-- Migration: Add full-text search support for products
-- This improves search performance significantly

-- Create a GIN index for full-text search on product name and description
-- Using 'simple' dictionary for Vietnamese language support

-- Add tsvector column for search
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "search_vector" tsvector;

-- Create function to update search vector
CREATE OR REPLACE FUNCTION update_product_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := 
        setweight(to_tsvector('simple', COALESCE(NEW.name, '')), 'A') ||
        setweight(to_tsvector('simple', COALESCE(NEW.description, '')), 'B') ||
        setweight(to_tsvector('simple', COALESCE(NEW."shortDescription", '')), 'C') ||
        setweight(to_tsvector('simple', COALESCE(NEW."productCode", '')), 'D');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update search vector on insert/update
DROP TRIGGER IF EXISTS product_search_vector_update ON "Product";
CREATE TRIGGER product_search_vector_update
    BEFORE INSERT OR UPDATE OF name, description, "shortDescription", "productCode"
    ON "Product"
    FOR EACH ROW
    EXECUTE FUNCTION update_product_search_vector();

-- Update existing products to populate search_vector
UPDATE "Product" SET 
    search_vector = 
        setweight(to_tsvector('simple', COALESCE(name, '')), 'A') ||
        setweight(to_tsvector('simple', COALESCE(description, '')), 'B') ||
        setweight(to_tsvector('simple', COALESCE("shortDescription", '')), 'C') ||
        setweight(to_tsvector('simple', COALESCE("productCode", '')), 'D');

-- Create GIN index for fast full-text search
CREATE INDEX IF NOT EXISTS idx_product_search_vector ON "Product" USING GIN(search_vector);

-- Create additional indexes for common search patterns
CREATE INDEX IF NOT EXISTS idx_product_name_trigram ON "Product" USING GIN(name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_product_active ON "Product"("isActive") WHERE "isActive" = true;
CREATE INDEX IF NOT EXISTS idx_product_category ON "Product"("categoryId");
CREATE INDEX IF NOT EXISTS idx_product_featured ON "Product"("featured") WHERE "featured" = true;

-- Enable pg_trgm extension for fuzzy/partial matching (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create a search function for easy querying
CREATE OR REPLACE FUNCTION search_products(
    search_query TEXT,
    category_slug TEXT DEFAULT NULL,
    limit_count INTEGER DEFAULT 20,
    offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
    id TEXT,
    name TEXT,
    slug TEXT,
    price DECIMAL,
    "comparePrice" DECIMAL,
    images TEXT[],
    featured BOOLEAN,
    "isActive" BOOLEAN,
    "createdAt" TIMESTAMP,
    "categoryId" TEXT,
    rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.name,
        p.slug,
        p.price,
        p."comparePrice",
        p.images,
        p.featured,
        p."isActive",
        p."createdAt",
        p."categoryId",
        ts_rank(p.search_vector, plainto_tsquery('simple', search_query)) +
        similarity(p.name, search_query) AS rank
    FROM "Product" p
    LEFT JOIN "Category" c ON p."categoryId" = c.id
    WHERE 
        p."isActive" = true
        AND (
            p.search_vector @@ plainto_tsquery('simple', search_query)
            OR p.name ILIKE '%' || search_query || '%'
            OR p.description ILIKE '%' || search_query || '%'
        )
        AND (category_slug IS NULL OR c.slug = category_slug)
    ORDER BY rank DESC, p."createdAt" DESC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;

-- Comment for documentation
COMMENT ON FUNCTION search_products IS 'Full-text search for products with ranking. Returns products matching the search query, optionally filtered by category.';
