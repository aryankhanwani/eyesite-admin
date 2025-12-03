import { supabaseAdmin } from '@/lib/supabase/admin'
import EmailList from '@/components/EmailList'

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

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Newsletter Subscribers</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Manage your newsletter email subscribers</p>
      </div>
      <EmailList
        emails={emails || []}
        type="newsletter"
        searchParams={sp}
      />
    </div>
  )
}
