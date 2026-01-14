'use client';

import { useEffect, useState } from 'react';

interface MapsLoaderProps {
  children: React.ReactNode;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

export default function MapsLoader({ children }: MapsLoaderProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      setIsLoaded(true);
      return;
    }

    // Fetch API key and load Google Maps
    const loadGoogleMaps = async () => {
      try {
        const response = await fetch('/api/maps-key');
        if (!response.ok) {
          throw new Error('Failed to fetch API key');
        }

        const { apiKey } = await response.json();

        // Create script element
        const script = document.createElement('script');
        script.async = true;
        script.defer = true;
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry,places`;
        script.onload = () => setIsLoaded(true);
        script.onerror = () => setError('Failed to load Google Maps');

        document.head.appendChild(script);
      } catch (err) {
        setError('Failed to initialize Google Maps');
        console.error('Maps loading error:', err);
      }
    };

    loadGoogleMaps();
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Maps Loading Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Google Maps...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}