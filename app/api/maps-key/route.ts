import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // For client-side Google Maps API, we need to use environment variables
    // Both development and production will use NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      console.error('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY environment variable not set');
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    return NextResponse.json({ apiKey });
  } catch (error) {
    console.error('Error fetching Google Maps API key:', error);
    return NextResponse.json(
      { error: 'Failed to fetch API key' },
      { status: 500 }
    );
  }
}