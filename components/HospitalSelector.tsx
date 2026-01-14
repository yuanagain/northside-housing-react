interface Hospital {
  name: string
  address: string
  lat: number
  lng: number
}

interface HospitalSelectorProps {
  hospitals: Hospital[]
  selectedHospital: Hospital | null
  onHospitalSelect: (hospital: Hospital) => void
}

export default function HospitalSelector({
  hospitals,
  selectedHospital,
  onHospitalSelect
}: HospitalSelectorProps) {
  return (
    <div className="space-y-3">
      {hospitals.map((hospital, index) => (
        <button
          key={index}
          onClick={() => onHospitalSelect(hospital)}
          className={`
            w-full text-left p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md
            ${selectedHospital?.name === hospital.name
              ? 'border-northside-blue bg-blue-50 shadow-md'
              : 'border-gray-200 hover:border-gray-300 bg-white'
            }
          `}
        >
          <div className="flex items-start space-x-3">
            <div className={`
              w-3 h-3 rounded-full mt-1.5 flex-shrink-0
              ${selectedHospital?.name === hospital.name ? 'bg-northside-blue' : 'bg-red-500'}
            `} />
            <div className="flex-1 min-w-0">
              <h3 className={`
                font-medium text-sm leading-tight
                ${selectedHospital?.name === hospital.name ? 'text-northside-blue' : 'text-gray-900'}
              `}>
                {hospital.name.replace('Northside Hospital ', '')}
              </h3>
              <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                {hospital.address}
              </p>
            </div>
          </div>

          {selectedHospital?.name === hospital.name && (
            <div className="mt-3 pt-3 border-t border-blue-200">
              <div className="flex items-center space-x-2 text-xs text-blue-600">
                <span>📍</span>
                <span>Selected Location</span>
              </div>
            </div>
          )}
        </button>
      ))}

      {hospitals.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-2xl mb-2">🏥</div>
          <p className="text-sm">Loading hospitals...</p>
        </div>
      )}
    </div>
  )
}