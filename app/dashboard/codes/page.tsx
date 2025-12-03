'use client'

import { useState } from 'react'

export default function ValidateCodesPage() {
  const [code, setCode] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch(`/api/codes/validate?code=${encodeURIComponent(code)}`)
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to validate code')
      }

      setResult(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkUsed = async () => {
    if (!result || !confirm('Mark this code as used?')) return

    try {
      const res = await fetch(`/api/codes/${result.id}/mark-used`, {
        method: 'PATCH',
      })

      if (!res.ok) {
        throw new Error('Failed to mark code as used')
      }

      setResult({ ...result, is_used: true })
      alert('Code marked as used')
    } catch (err: any) {
      alert(err.message)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
    <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Validate Offer Code</h1>
        <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-1">Check discount code validity and mark codes as used when customers redeem them</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 max-w-2xl w-full">
        <form onSubmit={handleValidate} className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Enter code (e.g., EYESITE123456)"
              required
              className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19395f] focus:border-transparent font-mono text-base sm:text-lg text-black placeholder:text-gray-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-[#19395f] text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:bg-[#80acc9] transition-colors disabled:opacity-50 font-medium whitespace-nowrap"
            >
              {loading ? 'Validating...' : 'Validate'}
            </button>
          </div>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg mb-4 sm:mb-6 text-sm sm:text-base">
            {error}
          </div>
        )}

        {result && (
          <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900">Code Details</h2>
            <div className="space-y-2.5 sm:space-y-3">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                <span className="text-sm sm:text-base text-gray-600 font-medium sm:font-normal">Code:</span>
                <span className="font-mono font-semibold text-gray-900 text-sm sm:text-base break-all">{result.code}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                <span className="text-sm sm:text-base text-gray-600 font-medium sm:font-normal">Email:</span>
                <span className="text-gray-900 text-sm sm:text-base break-all sm:text-right">{result.email}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0 items-start sm:items-center">
                <span className="text-sm sm:text-base text-gray-600 font-medium sm:font-normal">Status:</span>
                <span
                  className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold inline-block ${
                    result.is_used
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {result.is_used ? 'Used' : 'Valid'}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                <span className="text-sm sm:text-base text-gray-600 font-medium sm:font-normal">Created:</span>
                <span className="text-gray-900 text-sm sm:text-base">{new Date(result.created_at).toLocaleString()}</span>
              </div>
              {result.used_at && (
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                  <span className="text-sm sm:text-base text-gray-600 font-medium sm:font-normal">Used At:</span>
                  <span className="text-gray-900 text-sm sm:text-base">{new Date(result.used_at).toLocaleString()}</span>
                </div>
              )}
            </div>

            {!result.is_used && (
              <button
                onClick={handleMarkUsed}
                className="mt-4 sm:mt-6 w-full sm:w-auto bg-red-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base font-medium"
              >
                Mark as Used
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

