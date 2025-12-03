import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import DashboardLayoutClient from '@/components/DashboardLayoutClient'
import { unstable_cache } from 'next/cache'

// Cache user role lookup for 5 minutes
const getCachedUserRole = unstable_cache(
  async (userId: string) => {
    const { data: adminUser } = await supabaseAdmin
      .from('admin_users')
      .select('role')
      .eq('auth_user_id', userId)
      .single()
    return adminUser?.role || 'staff'
  },
  ['user-role'],
  {
    revalidate: 300, // 5 minutes
    tags: ['user-role'],
  }
)

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user role with caching
  const userRole = await getCachedUserRole(user.id)

  return <DashboardLayoutClient user={user} userRole={userRole}>{children}</DashboardLayoutClient>
}

