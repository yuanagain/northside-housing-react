import { NextRequest, NextResponse } from 'next/server';
import { getGoogleMapsApiKey } from '../../../lib/secrets';

export async function GET(request: NextRequest) {
  try {
    // Check if running in development mode with local env variable
    if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
      return NextResponse.json({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      });
    }

    // Production: fetch from Google Cloud Secret Manager
    const apiKey = await getGoogleMapsApiKey();
    return NextResponse.json({ apiKey });
  } catch (error) {
    console.error('Error fetching Google Maps API key:', error);
    return NextResponse.json(
      { error: 'Failed to fetch API key' },
      { status: 500 }
    );
  }
}