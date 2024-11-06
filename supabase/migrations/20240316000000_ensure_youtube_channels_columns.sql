-- Comprehensive migration to ensure youtube_channels table schema
BEGIN;

-- Add columns if they don't exist
DO $$
BEGIN
  -- Check and add access_token column
  BEGIN
    ALTER TABLE youtube_channels ADD COLUMN access_token TEXT;
  EXCEPTION WHEN duplicate_column THEN
    RAISE NOTICE 'Column access_token already exists';
  END;

  -- Check and add refresh_token column
  BEGIN
    ALTER TABLE youtube_channels ADD COLUMN refresh_token TEXT;
  EXCEPTION WHEN duplicate_column THEN
    RAISE NOTICE 'Column refresh_token already exists';
  END;

  -- Check and add subscriber_count column
  BEGIN
    ALTER TABLE youtube_channels ADD COLUMN subscriber_count TEXT;
  EXCEPTION WHEN duplicate_column THEN
    RAISE NOTICE 'Column subscriber_count already exists';
  END;

  -- Check and add video_count column
  BEGIN
    ALTER TABLE youtube_channels ADD COLUMN video_count INTEGER;
  EXCEPTION WHEN duplicate_column THEN
    RAISE NOTICE 'Column video_count already exists';
  END;

  -- Check and add channel_data column
  BEGIN
    ALTER TABLE youtube_channels ADD COLUMN channel_data JSONB;
  EXCEPTION WHEN duplicate_column THEN
    RAISE NOTICE 'Column channel_data already exists';
  END;
END $$;

-- Ensure columns are NOT NULL and have correct types
ALTER TABLE youtube_channels 
  ALTER COLUMN access_token SET NOT NULL,
  ALTER COLUMN refresh_token SET NOT NULL,
  ALTER COLUMN subscriber_count SET NOT NULL,
  ALTER COLUMN subscriber_count SET DATA TYPE TEXT,
  ALTER COLUMN video_count SET NOT NULL,
  ALTER COLUMN video_count SET DATA TYPE INTEGER,
  ALTER COLUMN channel_data SET NOT NULL,
  ALTER COLUMN channel_data SET DATA TYPE JSONB;

-- Recreate unique constraint to ensure data integrity
ALTER TABLE youtube_channels 
  DROP CONSTRAINT IF EXISTS youtube_channels_user_id_channel_id_key,
  ADD CONSTRAINT youtube_channels_user_id_channel_id_key 
  UNIQUE (user_id, channel_id);

-- Improved trigger function with fixed search path
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql
   SECURITY DEFINER
   SET search_path = pg_catalog, public;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_youtube_channels_updated_at ON youtube_channels;

-- Recreate trigger with the improved function
CREATE TRIGGER update_youtube_channels_updated_at
BEFORE UPDATE ON youtube_channels
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Verbose logging of table structure
DO $$
DECLARE
  col RECORD;
BEGIN
  RAISE NOTICE 'YouTube Channels Table Columns:';
  FOR col IN 
    SELECT column_name, data_type, is_nullable 
    FROM information_schema.columns 
    WHERE table_name = 'youtube_channels' 
    ORDER BY ordinal_position
  LOOP
    RAISE NOTICE '% (%) - Nullable: %', 
      col.column_name, col.data_type, col.is_nullable;
  END LOOP;
END $$;

COMMIT;
