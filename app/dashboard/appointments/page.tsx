import { supabaseAdmin } from '@/lib/supabase/admin'
import EmailList from '@/components/EmailList'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Appointment Requests | Eyesite Admin',
  description: 'Manage customer appointment inquiries',
}

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; search?: string }>
}) {
  const sp = await searchParams

  let query = supabaseAdmin
    .from('appointment_emails')
    .select('*')
    .order('created_at', { ascending: false })

  if (sp.search) {
    query = query.or(`email.ilike.%${sp.search}%,name.ilike.%${sp.search}%,phone.ilike.%${sp.search}%`)
  }

  if (sp.filter) {
    query = query.eq('status', sp.filter)
  }

  const { data: appointments, error } = await query

  if (error) {
    console.error('Error fetching appointments:', error)
  }

  const newCount = appointments?.filter(a => a.status === 'new').length || 0
  const bookedCount = appointments?.filter(a => a.status === 'booked').length || 0

  const totalCount = appointments?.length || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Appointment Requests</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Manage customer appointment inquiries and track booking status</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700 font-medium">Total Requests</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{totalCount}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 font-medium">New Requests</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{newCount}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 font-medium">Booked</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{bookedCount}</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <EmailList
        emails={appointments || []}
        type="appointment"
        searchParams={sp}
      />
    </div>
  )
}
