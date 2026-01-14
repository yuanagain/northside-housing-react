'use client'

import { useEffect, useRef } from 'react'

interface Hospital {
  name: string
  address: string
  lat: number
  lng: number
}

interface Property {
  property_name: string
  address: string
  lat: number
  lng: number
  driving_duration_minutes: number
  rush_hour_duration_minutes: number
  rating: number
  total_reviews: number
  price_level: number
}

interface PropertyMapProps {
  center: { lat: number; lng: number }
  hospital: Hospital | null
  properties: Property[]
  loading: boolean
}

export default function PropertyMap({ center, hospital, properties, loading }: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const googleMapRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<google.maps.Marker[]>([])
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null)

  useEffect(() => {
    const initMapWhenReady = () => {
      if (typeof window !== 'undefined' && window.google && window.google.maps && mapRef.current) {
        initializeMap()
      } else {
        // Poll for Google Maps to be ready
        setTimeout(initMapWhenReady, 100)
      }
    }

    initMapWhenReady()
  }, [])

  useEffect(() => {
    if (googleMapRef.current) {
      updateMap()
    }
  }, [center, hospital, properties])

  const initializeMap = () => {
    if (!mapRef.current) return

    const map = new google.maps.Map(mapRef.current, {
      center,
      zoom: 11,
      styles: [
        {
          featureType: 'poi.business',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'poi.medical',
          stylers: [{ visibility: 'on' }]
        }
      ],
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    })

    googleMapRef.current = map
    infoWindowRef.current = new google.maps.InfoWindow()
  }

  const updateMap = () => {
    if (!googleMapRef.current) return

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null))
    markersRef.current = []

    // Center map on hospital
    googleMapRef.current.setCenter(center)

    // Add hospital marker
    if (hospital) {
      const hospitalMarker = new google.maps.Marker({
        position: { lat: hospital.lat, lng: hospital.lng },
        map: googleMapRef.current,
        title: hospital.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: '#ef4444',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 3,
          scale: 12
        }
      })

      hospitalMarker.addListener('click', () => {
        if (infoWindowRef.current) {
          infoWindowRef.current.setContent(`
            <div class=\"p-3\">
              <h3 class=\"font-semibold text-lg text-gray-900\">${hospital.name}</h3>
              <p class=\"text-gray-600 text-sm mt-1\">${hospital.address}</p>
              <div class=\"mt-2 text-xs text-blue-600\">🏥 Hospital Location</div>
            </div>
          `)
          infoWindowRef.current.open(googleMapRef.current, hospitalMarker)
        }
      })

      markersRef.current.push(hospitalMarker)
    }

    // Add property markers
    properties.forEach((property, index) => {
      const marker = new google.maps.Marker({
        position: { lat: property.lat, lng: property.lng },
        map: googleMapRef.current,
        title: property.property_name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: getMarkerColor(property.driving_duration_minutes),
          fillOpacity: 0.8,
          strokeColor: '#ffffff',
          strokeWeight: 2,
          scale: 8
        }
      })

      marker.addListener('click', () => {
        if (infoWindowRef.current) {
          const ratingStars = '★'.repeat(Math.floor(property.rating)) + '☆'.repeat(5 - Math.floor(property.rating))
          const priceSymbols = '$'.repeat(Math.max(1, property.price_level || 1))

          infoWindowRef.current.setContent(`
            <div class=\"p-4 max-w-xs\">
              <h3 class=\"font-semibold text-lg text-gray-900 mb-2\">${property.property_name}</h3>
              <p class=\"text-gray-600 text-sm mb-3\">${property.address}</p>

              <div class=\"space-y-2 text-sm\">
                <div class=\"flex items-center justify-between\">
                  <span class=\"text-gray-500\">🚗 Drive Time:</span>
                  <span class=\"font-medium\">${property.driving_duration_minutes} min</span>
                </div>
                <div class=\"flex items-center justify-between\">
                  <span class=\"text-gray-500\">🚙 Rush Hour:</span>
                  <span class=\"font-medium\">${property.rush_hour_duration_minutes} min</span>
                </div>
                <div class=\"flex items-center justify-between\">
                  <span class=\"text-gray-500\">⭐ Rating:</span>
                  <div>
                    <span class=\"text-yellow-400\">${ratingStars}</span>
                    <span class=\"text-gray-500 ml-1\">(${property.total_reviews})</span>
                  </div>
                </div>
                <div class=\"flex items-center justify-between\">
                  <span class=\"text-gray-500\">💰 Price Level:</span>
                  <span class=\"font-medium text-green-600\">${priceSymbols}</span>
                </div>
              </div>
            </div>
          `)
          infoWindowRef.current.open(googleMapRef.current, marker)
        }
      })

      markersRef.current.push(marker)
    })

    // Adjust zoom to fit all markers
    if (markersRef.current.length > 1) {
      const bounds = new google.maps.LatLngBounds()
      markersRef.current.forEach(marker => {
        if (marker.getPosition()) {
          bounds.extend(marker.getPosition()!)
        }
      })
      googleMapRef.current.fitBounds(bounds)

      // Don't zoom too close
      const listener = google.maps.event.addListener(googleMapRef.current, 'bounds_changed', () => {
        if (googleMapRef.current!.getZoom()! > 15) {
          googleMapRef.current!.setZoom(15)
        }
        google.maps.event.removeListener(listener)
      })
    }
  }

  const getMarkerColor = (driveTime: number): string => {
    if (driveTime <= 15) return '#10b981' // Green - close
    if (driveTime <= 25) return '#f59e0b' // Yellow - medium
    return '#ef4444' // Red - far
  }

  return (
    <div className="relative h-full rounded-xl overflow-hidden">
      {loading && (
        <div className="absolute inset-0 bg-gray-50 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-northside-blue mx-auto mb-4"></div>
            <p className="text-gray-600">Loading properties...</p>
          </div>
        </div>
      )}

      <div ref={mapRef} className="w-full h-full min-h-[500px]" />

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 text-xs">
        <h4 className="font-semibold text-gray-900 mb-2">🗺️ Map Legend</h4>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Hospital Location</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>≤15 min drive</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>15-25 min drive</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>&gt;25 min drive</span>
          </div>
        </div>
      </div>

      {/* Property Counter */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg px-3 py-2 text-sm">
        <span className="text-gray-600">📍 </span>
        <span className="font-medium">{properties.length}</span>
        <span className="text-gray-600"> properties shown</span>
      </div>
    </div>
  )
}