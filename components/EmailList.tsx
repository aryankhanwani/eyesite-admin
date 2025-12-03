'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import RefreshButton from './RefreshButton'
import ExportButton from './ExportButton'
import CustomSelect from './CustomSelect'
import StatusSelect from './StatusSelect'

interface Email {
  id: string
  email: string
  name?: string
  phone?: string
  service?: string
  message?: string
  status?: string
  code?: string
  is_used?: boolean
  created_at: string
}

interface EmailListProps {
  emails: Email[]
  type: 'newsletter' | 'appointment' | 'offer'
  searchParams: { filter?: string; search?: string }
}

export default function EmailList({ emails, type, searchParams }: EmailListProps) {
  const router = useRouter()
  const searchParamsHook = useSearchParams()
  const [search, setSearch] = useState(searchParams.search || '')
  const [filter, setFilter] = useState(searchParams.filter || '')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (filter) params.set('filter', filter)
    router.push(`?${params.toString()}`)
  }

  const updateStatus = async (id: string, newStatus: string) => {
    const tableName =
      type === 'appointment' ? 'appointment_emails' : type === 'offer' ? 'offer_emails' : 'newsletter_emails'

    const res = await fetch(`/api/emails/${tableName}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })

    if (res.ok) {
      router.refresh()
    }
  }

  const statusOptions =
    type === 'appointment'
      ? ['new', 'contacted', 'booked', 'cancelled']
      : type === 'offer'
        ? ['new', 'code_sent', 'code_used']
        : []

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      booked: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      code_sent: 'bg-purple-100 text-purple-800',
      code_used: 'bg-gray-100 text-gray-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      {/* Header with Refresh */}
      <div className="flex items-center justify-end">
        <RefreshButton />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-end">
          <div className="flex-1 min-w-0">
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by email, name, or phone..."
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19395f] focus:border-[#19395f] transition-all text-black placeholder:text-gray-400 text-sm sm:text-base"
            />
          </div>
          {statusOptions.length > 0 && (
            <div className="w-full sm:w-auto sm:min-w-[200px]">
              <CustomSelect
                value={filter}
                onChange={setFilter}
                options={[
                  { value: '', label: 'All Statuses' },
                  ...statusOptions.map((status) => ({
                    value: status,
                    label: status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' '),
                    icon: (
                      <div className={`w-2 h-2 rounded-full ${
                        status === 'new' ? 'bg-blue-500' :
                        status === 'contacted' ? 'bg-yellow-500' :
                        status === 'booked' ? 'bg-green-500' :
                        status === 'cancelled' ? 'bg-red-500' :
                        status === 'code_sent' ? 'bg-purple-500' :
                        'bg-gray-500'
                      }`}></div>
                    ),
                  })),
                ]}
                placeholder="All Statuses"
                label="Filter by Status"
              />
            </div>
          )}
          <button
            type="submit"
            className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-[#19395f] to-[#0d2440] text-white rounded-lg hover:from-[#80acc9] hover:to-[#19395f] transition-all font-medium shadow-lg text-sm sm:text-base whitespace-nowrap"
          >
            Search
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Export Buttons */}
        {emails.length > 0 && (
          <div className="p-4 sm:p-6 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-sm sm:text-base font-semibold text-gray-700">Export Data</h3>
            <div className="flex flex-wrap gap-2">
              <ExportButton
                rows={emails.map((email) => {
                  if (type === 'appointment') {
                    return [
                      email.name || '',
                      email.email,
                      email.phone || '',
                      email.service || '',
                      email.status || 'new',
                      new Date(email.created_at).toLocaleDateString()
                    ]
                  } else if (type === 'offer') {
                    return [
                      email.email,
                      email.code || '',
                      email.is_used ? 'Yes' : 'No',
                      new Date(email.created_at).toLocaleDateString()
                    ]
                  } else {
                    return [
                      email.email,
                      new Date(email.created_at).toLocaleDateString()
                    ]
                  }
                })}
                filename={type === 'newsletter' ? 'newsletters' : type === 'appointment' ? 'appointments' : 'offers'}
                type="csv"
                headers={
                  type === 'appointment'
                    ? ['Name', 'Email', 'Phone', 'Service', 'Status', 'Date']
                    : type === 'offer'
                      ? ['Email', 'Code', 'Used', 'Date']
                      : ['Email', 'Date']
                }
              />
              <ExportButton
                rows={emails.map((email) => {
                  if (type === 'appointment') {
                    return [
                      email.name || '',
                      email.email,
                      email.phone || '',
                      email.service || '',
                      email.status || 'new',
                      new Date(email.created_at).toLocaleDateString()
                    ]
                  } else if (type === 'offer') {
                    return [
                      email.email,
                      email.code || '',
                      email.is_used ? 'Yes' : 'No',
                      new Date(email.created_at).toLocaleDateString()
                    ]
                  } else {
                    return [
                      email.email,
                      new Date(email.created_at).toLocaleDateString()
                    ]
                  }
                })}
                filename={type === 'newsletter' ? 'newsletters' : type === 'appointment' ? 'appointments' : 'offers'}
                type="xls"
                headers={
                  type === 'appointment'
                    ? ['Name', 'Email', 'Phone', 'Service', 'Status', 'Date']
                    : type === 'offer'
                      ? ['Email', 'Code', 'Used', 'Date']
                      : ['Email', 'Date']
                }
              />
            </div>
          </div>
        )}
        <div className="overflow-x-auto overflow-y-visible">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                {type === 'appointment' && (
                  <>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden md:table-cell">
                      Phone
                    </th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden lg:table-cell">
                      Service
                    </th>
                  </>
                )}
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Email
                </th>
                {type === 'offer' && (
                  <>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Used
                    </th>
                  </>
                )}
                {type === 'appointment' && (
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                )}
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Date
                </th>
                {type === 'appointment' && (
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {emails.length > 0 ? (
                emails.map((email) => (
                  <tr key={email.id} className="hover:bg-gray-50 transition-colors">
                    {type === 'appointment' && (
                      <>
                        <td className="px-3 sm:px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#19395f]/10 rounded-full flex items-center justify-center flex-shrink-0">
                              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-[#19395f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="text-xs sm:text-sm font-medium text-gray-900 truncate block">{email.name || '-'}</span>
                              <span className="text-xs text-gray-500 md:hidden">{email.phone || '-'}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-4 hidden md:table-cell">
                          <span className="text-xs sm:text-sm text-gray-700">{email.phone || '-'}</span>
                        </td>
                        <td className="px-3 sm:px-6 py-4 hidden lg:table-cell">
                          <span className="text-xs sm:text-sm text-gray-700">{email.service || '-'}</span>
                        </td>
                      </>
                    )}
                    <td className="px-3 sm:px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{email.email}</span>
                      </div>
                    </td>
                    {type === 'offer' && (
                      <>
                        <td className="px-3 sm:px-6 py-4">
                          <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-mono font-semibold bg-purple-100 text-purple-800">
                            {email.code || '-'}
                          </span>
                        </td>
                        <td className="px-3 sm:px-6 py-4">
                          <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                            email.is_used 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {email.is_used ? (
                              <>
                                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Used
                              </>
                            ) : (
                              <>
                                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Not Used
                              </>
                            )}
                          </span>
                        </td>
                      </>
                    )}
                    {type === 'appointment' && (
                      <td className="px-3 sm:px-6 py-4">
                        <StatusSelect
                          value={email.status || 'new'}
                          onChange={(newStatus) => updateStatus(email.id, newStatus)}
                          options={statusOptions}
                          getStatusColor={getStatusColor}
                        />
                      </td>
                    )}
                    <td className="px-3 sm:px-6 py-4">
                      <div className="text-xs sm:text-sm text-gray-700 whitespace-nowrap">
                        {new Date(email.created_at).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>
                    {type === 'appointment' && email.message && (
                      <td className="px-3 sm:px-6 py-4">
                        <details className="cursor-pointer">
                          <summary className="text-[#19395f] hover:text-[#80acc9] font-medium text-xs sm:text-sm">
                            View Message
                          </summary>
                          <p className="mt-2 text-xs sm:text-sm text-gray-700 p-3 bg-gray-50 rounded-lg">{email.message}</p>
                        </details>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={type === 'appointment' ? 7 : type === 'offer' ? 4 : 2}
                    className="px-6 py-12 text-center"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 font-medium">No emails found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
