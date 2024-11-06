-- Careful management of YouTube channels table schema and dependencies
BEGIN;

-- Safely handle existing constraints and indexes
DO $$
BEGIN
  -- Drop existing foreign key constraint if it exists
  IF EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE table_name = 'youtube_comments' 
    AND constraint_type = 'FOREIGN KEY' 
    AND constraint_name = 'youtube_comments_channel_id_fkey'
  ) THEN
    ALTER TABLE youtube_comments 
    DROP CONSTRAINT IF EXISTS youtube_comments_channel_id_fkey;
  END IF;

  -- Drop existing index if it exists
  IF EXISTS (
    SELECT 1 
    FROM pg_class 
    WHERE relname = 'youtube_comments_channel_id_idx'
  ) THEN
    DROP INDEX IF EXISTS youtube_comments_channel_id_idx;
  END IF;
END $$;

-- Alter the youtube_channels table to ensure column constraints
ALTER TABLE youtube_channels 
  ALTER COLUMN channel_id SET NOT NULL,
  ALTER COLUMN channel_title SET NOT NULL,
  ALTER COLUMN access_token SET NOT NULL,
  ALTER COLUMN refresh_token SET NOT NULL,
  ALTER COLUMN subscriber_count SET NOT NULL,
  ALTER COLUMN subscriber_count SET DATA TYPE TEXT,
  ALTER COLUMN video_count SET NOT NULL,
  ALTER COLUMN video_count SET DATA TYPE INTEGER,
  ALTER COLUMN channel_data SET NOT NULL,
  ALTER COLUMN channel_data SET DATA TYPE JSONB;

-- Recreate foreign key constraint with ON DELETE CASCADE
ALTER TABLE youtube_comments 
  ADD CONSTRAINT youtube_comments_channel_id_fkey 
  FOREIGN KEY (channel_id) 
  REFERENCES youtube_channels(channel_id) 
  ON DELETE CASCADE;

-- Recreate index for channel_id in youtube_comments
CREATE INDEX IF NOT EXISTS youtube_comments_channel_id_idx 
ON youtube_comments(channel_id);

-- Ensure unique constraint on youtube_channels
ALTER TABLE youtube_channels 
  DROP CONSTRAINT IF EXISTS youtube_channels_user_id_channel_id_key,
  ADD CONSTRAINT youtube_channels_user_id_channel_id_key 
  UNIQUE (user_id, channel_id);

-- Trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql
   SECURITY DEFINER
   SET search_path = pg_catalog, public;

-- Drop and recreate trigger
DROP TRIGGER IF EXISTS update_youtube_channels_updated_at ON youtube_channels;
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
