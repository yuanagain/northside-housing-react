'use client'

import { useState, useEffect } from 'react'
import HospitalSelector from '../components/HospitalSelector'
import PropertyMap from '../components/PropertyMap'
import PropertyList from '../components/PropertyList'
import Header from '../components/Header'
import LoadingSpinner from '../components/LoadingSpinner'
import MapsLoader from '../components/MapsLoader'

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
  hospital_name: string
  marketing_summary?: string
}

const API_BASE_URL = 'https://northside-housing-explorer-907131932548.us-central1.run.app'

export default function HomePage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null)
  const [properties, setProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingProperties, setLoadingProperties] = useState(false)
  const [mapCenter, setMapCenter] = useState({ lat: 33.8732, lng: -84.3707 })
  const [searchTerm, setSearchTerm] = useState('')
  const [maxCommute, setMaxCommute] = useState(30)
  const [minRating, setMinRating] = useState(0)

  useEffect(() => {
    fetchHospitals()
  }, [])

  useEffect(() => {
    if (selectedHospital) {
      fetchProperties(selectedHospital.name)
      setMapCenter({ lat: selectedHospital.lat, lng: selectedHospital.lng })
    }
  }, [selectedHospital])

  useEffect(() => {
    applyFilters()
  }, [properties, searchTerm, maxCommute, minRating])

  const fetchHospitals = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/hospitals`)
      const data = await response.json()
      setHospitals(data)
      setLoading(false)

      // Auto-select first hospital
      if (data.length > 0) {
        setSelectedHospital(data[0])
      }
    } catch (error) {
      console.error('Error fetching hospitals:', error)
      setLoading(false)
    }
  }

  const fetchProperties = async (hospitalName: string) => {
    setLoadingProperties(true)
    try {
      const formattedName = hospitalName.toLowerCase().replace(/\s+/g, '_')
      const response = await fetch(`${API_BASE_URL}/api/hospitals/${formattedName}/properties`)
      const data = await response.json()
      setProperties(data.properties || [])
    } catch (error) {
      console.error('Error fetching properties:', error)
      setProperties([])
    } finally {
      setLoadingProperties(false)
    }
  }

  const applyFilters = () => {
    let filtered = properties

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(property =>
        property.property_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Commute time filter
    filtered = filtered.filter(property =>
      property.driving_duration_minutes <= maxCommute
    )

    // Rating filter
    filtered = filtered.filter(property =>
      property.rating >= minRating
    )

    // Sort by drive time
    filtered.sort((a, b) => a.driving_duration_minutes - b.driving_duration_minutes)

    setFilteredProperties(filtered)
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <MapsLoader>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-4 gap-6 h-[calc(100vh-8rem)]">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6 overflow-y-auto custom-scrollbar">
              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  🏥 Select Hospital
                </h2>
                <HospitalSelector
                  hospitals={hospitals}
                  selectedHospital={selectedHospital}
                  onHospitalSelect={setSelectedHospital}
                />
              </div>

              {selectedHospital && (
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    🔍 Filter Properties
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Search Properties
                      </label>
                      <input
                        type="text"
                        placeholder="Property name or address..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-northside-blue focus:border-transparent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Commute: {maxCommute} minutes
                      </label>
                      <input
                        type="range"
                        min="5"
                        max="60"
                        value={maxCommute}
                        onChange={(e) => setMaxCommute(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Min Rating: {minRating === 0 ? 'Any' : minRating.toFixed(1)}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="5"
                        step="0.5"
                        value={minRating}
                        onChange={(e) => setMinRating(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <div className="text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Found:</span>
                          <span className="font-medium">{filteredProperties.length} properties</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Hospital:</span>
                          <span className="font-medium">{selectedHospital.name.replace('Northside Hospital ', '')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Map */}
            <div className="lg:col-span-2">
              <div className="card h-full p-0">
                <PropertyMap
                  center={mapCenter}
                  hospital={selectedHospital}
                  properties={filteredProperties}
                  loading={loadingProperties}
                />
              </div>
            </div>

            {/* Property List */}
            <div className="lg:col-span-1">
              <PropertyList
                properties={filteredProperties}
                loading={loadingProperties}
                selectedHospital={selectedHospital}
              />
            </div>
          </div>
        </div>
      </div>
    </MapsLoader>
  )
}