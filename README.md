# YouTube Channel Connection Setup

## Prerequisites
- Google Cloud Console account
- Supabase project

## OAuth Configuration Steps

1. **Google Cloud Console Setup**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing project
   - Enable the YouTube Data API v3
   - Navigate to "Credentials"
   - Create an OAuth 2.0 Client ID
     - Application Type: Web application
     - Authorized redirect URIs: `http://localhost:3000/auth/youtube/callback` (replace with your actual app URL)

2. **Environment Variables**:
   Create a `.env.local` file in the project root with the following variables:
   ```
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_YOUTUBE_SCOPES=https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.force-ssl
   ```

3. **Supabase Setup**:
   - Ensure Supabase migrations are up to date
   - Verify the `youtube_channels` table is created

## Troubleshooting

### Common Connection Issues
- Verify all environment variables are set correctly
- Check Google Cloud Console OAuth settings
- Ensure redirect URI matches exactly
- Verify Supabase project and authentication are working

### Debugging
- Check browser console for error messages
- Review server-side logs
- Validate OAuth token exchange in network tab

## Support
If you encounter persistent issues, please check the project documentation or file an issue in the GitHub repository.
