-- Add product detail fields
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "features" TEXT;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "condition" VARCHAR(100);
