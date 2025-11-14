"use client"

import { useState } from "react"
import { 
  Download, 
  FileText, 
  FileSpreadsheet, 
  File, 
  X,
  Loader2,
  Users
} from "lucide-react"

interface UserExportModalProps {
  isOpen: boolean
  onClose: () => void
  onExport: (format: 'csv' | 'json' | 'pdf') => void
  isExporting?: boolean
  userCount?: number
}

const exportFormats = [
  {
    id: 'csv' as const,
    name: 'CSV',
    description: 'Comma-separated values file',
    icon: FileSpreadsheet,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  {
    id: 'json' as const,
    name: 'JSON',
    description: 'JavaScript Object Notation',
    icon: FileText,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  {
    id: 'pdf' as const,
    name: 'PDF',
    description: 'Portable Document Format (Text-based)',
    icon: File,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200'
  }
]

export function UserExportModal({ 
  isOpen, 
  onClose, 
  onExport,
  isExporting = false,
  userCount = 0
}: UserExportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'json' | 'pdf'>('csv')

  const handleExport = () => {
    onExport(selectedFormat)
  }

  const handleClose = () => {
    if (!isExporting) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Users className="h-6 w-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Export Users</h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isExporting}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Export Format
            </label>
            <div className="space-y-3">
              {exportFormats.map((format) => {
                const Icon = format.icon
                return (
                  <div
                    key={format.id}
                    className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedFormat === format.id
                        ? `${format.borderColor} ${format.bgColor}`
                        : 'border-gray-200 hover:border-gray-300'
                    } ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => !isExporting && setSelectedFormat(format.id)}
                  >
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg ${format.bgColor} mr-3`}>
                        <Icon className={`h-5 w-5 ${format.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{format.name}</h3>
                        <p className="text-sm text-gray-500">{format.description}</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        selectedFormat === format.id
                          ? `${format.borderColor} bg-current ${format.color}`
                          : 'border-gray-300'
                      }`}>
                        {selectedFormat === format.id && (
                          <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Users className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-800">
                  The export will include {userCount} users with their details, roles, status, and statistics.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClose}
            disabled={isExporting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export Users
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}



