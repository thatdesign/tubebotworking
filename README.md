# YouTube Channel Connection Troubleshooting

## Database Migration Issues

### Resolving Missing Columns

If you encounter column-related errors during migration:

1. **Apply Migration Manually**
   ```bash
   supabase migration up
   ```

2. **Verify Table Schema**
   Run in Supabase SQL Editor:
   ```sql
   SELECT column_name, data_type, is_nullable 
   FROM information_schema.columns 
   WHERE table_name = 'youtube_channels'
   ORDER BY ordinal_position;
   ```

### Common Migration Problems

- Missing columns
- Incorrect column types
- Constraint violations

### Troubleshooting Steps

1. **Check Migration File**
   - Verify all required columns are present
   - Ensure correct data types
   - Add `IF NOT EXISTS` clauses

2. **Manual Column Addition**
   ```sql
   -- Example of adding a missing column
   ALTER TABLE youtube_channels 
   ADD COLUMN IF NOT EXISTS subscriber_count TEXT;
   ```

3. **Verify Column Constraints**
   ```sql
   -- Check column nullability and constraints
   SELECT 
     column_name, 
     is_nullable, 
     data_type 
   FROM information_schema.columns 
   WHERE table_name = 'youtube_channels';
   ```

### Recommended Actions

- Review migration files
- Verify Supabase project configuration
- Check environment variables
- Restart development server

## Support

If migration issues persist:
1. Provide full error message
2. Share table schema output
3. Verify migration history

### Contact Support
- Check project documentation
- File a GitHub issue with detailed information
