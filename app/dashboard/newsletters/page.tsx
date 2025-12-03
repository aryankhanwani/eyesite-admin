import { supabaseAdmin } from '@/lib/supabase/admin'
import EmailList from '@/components/EmailList'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Newsletter Subscribers | Eyesite Admin',
  description: 'Manage newsletter email subscribers',
}

export const revalidate = 30 // Revalidate every 30 seconds

export default async function NewslettersPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; search?: string }>
}) {
  const sp = await searchParams

  let query = supabaseAdmin.from('newsletter_emails').select('*').order('created_at', { ascending: false })

  if (sp.search) {
    query = query.ilike('email', `%${sp.search}%`)
  }

  const { data: emails, error } = await query

  if (error) {
    console.error('Error fetching newsletters:', error)
  }

  const totalCount = emails?.length || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Newsletter Subscribers</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Manage your newsletter email subscribers and track signups</p>
        </div>
      </div>

      {/* Stats Card */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-green-700 font-medium">Total Subscribers</p>
            <p className="text-3xl font-bold text-green-900 mt-1">{totalCount}</p>
          </div>
          <div className="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>

      <EmailList
        emails={emails || []}
        type="newsletter"
        searchParams={sp}
      />
    </div>
  )
}
