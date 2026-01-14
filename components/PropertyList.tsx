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
  marketing_summary?: string
  place_id?: string
}

interface PropertyListProps {
  properties: Property[]
  loading: boolean
  selectedHospital: Hospital | null
}

import { useState, useEffect } from 'react'

export default function PropertyList({ properties, loading, selectedHospital }: PropertyListProps) {
  const [propertyImages, setPropertyImages] = useState<{ [key: number]: string }>({})

  // Load property images when properties change
  useEffect(() => {
    const loadPropertyImages = async () => {
      const imageMap: { [key: number]: string } = {}

      for (let i = 0; i < properties.length; i++) {
        const property = properties[i]
        const imageUrl = await getPropertyImageUrl(property, i)
        imageMap[i] = imageUrl
      }

      setPropertyImages(imageMap)
    }

    if (properties.length > 0) {
      loadPropertyImages()
    }
  }, [properties])

  const getRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    return '★'.repeat(fullStars) + (hasHalfStar ? '☆' : '') + '☆'.repeat(5 - fullStars - (hasHalfStar ? 1 : 0))
  }

  const getPriceSymbols = (priceLevel: number) => {
    return '$'.repeat(Math.max(1, priceLevel || 1))
  }

  const getDriveTimeColor = (minutes: number) => {
    if (minutes <= 15) return 'text-green-600 bg-green-50'
    if (minutes <= 25) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const getPropertyImageUrl = async (property: Property, index: number): Promise<string> => {
    const API_BASE_URL = process.env.NODE_ENV === 'development'
      ? 'http://localhost:8080'
      : 'https://northside-housing-explorer-qva5ddbzhq-uc.a.run.app'

    // Strategy 1: Try using keyword-based Maps photo approach
    try {
      const mapsResponse = await fetch(`${API_BASE_URL}/api/property/maps-photo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          property_name: property.property_name,
          address: property.address
        })
      })

      const mapsData = await mapsResponse.json()

      if (mapsData.has_photo && mapsData.photo_url) {
        console.log(`Got photo for ${property.property_name} via keyword-based mapping`)
        return mapsData.photo_url
      }
    } catch (error) {
      console.log(`Keyword-based photo fetch failed for ${property.property_name}`)
    }

    // Strategy 2: Try using place_id if available and valid
    if (property.place_id && property.place_id.trim() && property.place_id !== 'None') {
      try {
        const response = await fetch(`${API_BASE_URL}/api/property/${property.place_id}/photo`)
        const data = await response.json()

        if (data.has_photo && data.photo_url) {
          console.log(`Got photo for ${property.property_name} via place_id`)
          return data.photo_url
        }
      } catch (error) {
        console.log(`Place ID photo fetch failed for ${property.property_name}`)
      }
    }

    // Strategy 3: Try searching by property name and address
    try {
      const searchResponse = await fetch(`${API_BASE_URL}/api/property/search-photo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          property_name: property.property_name,
          address: property.address
        })
      })

      const searchData = await searchResponse.json()

      if (searchData.has_photo && searchData.photo_url) {
        console.log(`Got photo for ${property.property_name} via search`)
        return searchData.photo_url
      }
    } catch (error) {
      console.log(`Search photo fetch failed for ${property.property_name}`)
    }

    // Strategy 4: Fallback to curated apartment images
    const baseImages = [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=250&fit=crop',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=250&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=250&fit=crop',
      'https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=400&h=250&fit=crop',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=250&fit=crop',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=250&fit=crop',
      'https://images.unsplash.com/photo-1515263487990-61b07816b507?w=400&h=250&fit=crop',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=250&fit=crop',
    ]

    const hash = property.property_name.length + index
    console.log(`Using fallback image for ${property.property_name}`)
    return baseImages[hash % baseImages.length]
  }

  const getMockPricing = (index: number) => {
    const prices = ['$1,850', '$2,100', '$1,950', '$2,250', '$1,750', '$2,400', '$1,650', '$2,050']
    const concessions = [
      '1 month free',
      '$1,000 off first month',
      '2 months free',
      '1.5 months free',
      '$500 off + waived fees',
      'No deposit required',
      '6 weeks free',
      '$1,200 off first month'
    ]
    const appFees = ['Waived on AnchorMatch', '$15', '$50', 'Waived on AnchorMatch', '$25', '$15', 'Waived on AnchorMatch', '$35']

    return {
      price: prices[index % prices.length],
      concession: concessions[index % concessions.length],
      appFee: appFees[index % appFees.length]
    }
  }

  if (loading) {
    return (
      <div className="h-full card">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-northside-blue mx-auto mb-4"></div>
            <p className="text-gray-600">Loading properties...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!selectedHospital) {
    return (
      <div className="h-full card">
        <div className="flex items-center justify-center h-64 text-center">
          <div>
            <div className="text-4xl mb-4">🏥</div>
            <p className="text-gray-600">Select a hospital to view nearby properties</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full card p-0">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900">
          🏠 Nearby Properties
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {properties.length} apartments found near {selectedHospital.name.replace('Northside Hospital ', '')}
        </p>
      </div>

      <div className="overflow-y-auto custom-scrollbar h-full max-h-[calc(100vh-12rem)]">
        {properties.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-gray-600">No properties found with current filters</p>
            <p className="text-sm text-gray-500 mt-2">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="p-2 space-y-3">
            {properties.map((property, index) => {
              const mockData = getMockPricing(index)
              return (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200 hover:border-blue-500 cursor-pointer"
                >
                  {/* Property Image */}
                  <div className="relative">
                    <img
                      src={propertyImages[index] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=250&fit=crop'}
                      alt={property.property_name}
                      className="w-full h-32 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=250&fit=crop'
                      }}
                    />
                    <div className="absolute top-2 right-2">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDriveTimeColor(property.driving_duration_minutes)}`}>
                        🚗 {property.driving_duration_minutes}min
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">
                          {property.property_name}
                        </h3>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {property.address}
                        </p>
                      </div>
                      <div className="ml-3 text-right">
                        <div className="text-lg font-bold text-gray-900">
                          {mockData.price}
                        </div>
                        <div className="text-xs text-gray-500">1BD price</div>
                      </div>
                    </div>

                  {/* Mock Data Section */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-3 mb-3">
                    <div className="text-xs font-medium text-green-700 mb-2">💰 Special Offers</div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Concession:</span>
                        <span className="font-medium text-green-600">{mockData.concession}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">App Fee:</span>
                        <span className={`font-medium ${mockData.appFee.includes('Waived') ? 'text-green-600' : 'text-gray-700'}`}>
                          {mockData.appFee}
                        </span>
                      </div>
                    </div>
                  </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <div className="text-gray-500">
                          Rush Hour: {property.rush_hour_duration_minutes}min
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <span className="text-yellow-400 text-sm">
                            {getRatingStars(property.rating)}
                          </span>
                        </div>
                        <div className="text-gray-500 mt-1">
                          {property.total_reviews} reviews
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <div className="text-xs text-gray-500">
                        Price Level: <span className="text-green-600 font-medium">{getPriceSymbols(property.price_level)}</span>
                      </div>
                      <button className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}