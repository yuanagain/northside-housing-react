# Security Implementation

## Google Maps API Key Management

This application uses Google Cloud Secret Manager to securely manage the Google Maps API key.

### Development Setup

1. For local development, uncomment and set your development API key in `.env.local`:
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-dev-key-here
   ```

2. The application will automatically use the environment variable in development mode.

### Production Setup

1. The API key is stored in Google Cloud Secret Manager under the name `google-maps-api-key`.

2. The application fetches the API key at runtime from the `/api/maps-key` endpoint.

3. The MapsLoader component handles the secure loading of Google Maps with the API key.

### Security Features

- API key is never committed to the repository
- Environment variables are excluded via `.gitignore`
- Production API key is managed through Google Cloud Secret Manager
- Client-side API key loading is done dynamically and securely

### API Endpoint

- `GET /api/maps-key`: Returns the Google Maps API key for the current environment
  - Development: Uses `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` environment variable
  - Production: Fetches from Google Cloud Secret Manager

### Components

- `MapsLoader`: Securely loads Google Maps API with proper error handling
- `lib/secrets.ts`: Utility functions for accessing Google Cloud Secret Manager
- `app/api/maps-key/route.ts`: API endpoint for retrieving the Maps API key