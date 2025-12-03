import { supabaseAdmin } from '@/lib/supabase/admin'
import EmailList from '@/components/EmailList'

export default async function OffersPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; search?: string }>
}) {
  const sp = await searchParams

  let query = supabaseAdmin.from('offer_emails').select('*').order('created_at', { ascending: false })

  if (sp.search) {
    query = query.ilike('email', `%${sp.search}%`)
  }

  const { data: offers, error } = await query

  if (error) {
    console.error('Error fetching offers:', error)
  }

  const usedCount = offers?.filter(o => o.is_used).length || 0
  const unusedCount = offers?.filter(o => !o.is_used).length || 0

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">20% Off Offer Signups</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Track discount code signups and usage</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700 font-medium">Unused Codes</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{unusedCount}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-700 font-medium">Used Codes</p>
              <p className="text-2xl font-bold text-orange-900 mt-1">{usedCount}</p>
            </div>
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <EmailList
        emails={offers || []}
        type="offer"
        searchParams={sp}
      />
    </div>
  )
}
