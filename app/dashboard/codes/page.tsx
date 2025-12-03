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
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Validate Offer Code</h1>

      <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl">
        <form onSubmit={handleValidate} className="mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Enter code (e.g., EYESITE123456)"
              required
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19395f] focus:border-transparent font-mono text-lg text-black placeholder:text-black"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-[#19395f] text-white px-8 py-3 rounded-lg hover:bg-[#80acc9] transition-colors disabled:opacity-50 font-medium"
            >
              {loading ? 'Validating...' : 'Validate'}
            </button>
          </div>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {result && (
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Code Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Code:</span>
                <span className="font-mono font-semibold">{result.code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span>{result.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    result.is_used
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {result.is_used ? 'Used' : 'Valid'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Created:</span>
                <span>{new Date(result.created_at).toLocaleString()}</span>
              </div>
              {result.used_at && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Used At:</span>
                  <span>{new Date(result.used_at).toLocaleString()}</span>
                </div>
              )}
            </div>

            {!result.is_used && (
              <button
                onClick={handleMarkUsed}
                className="mt-6 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
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

