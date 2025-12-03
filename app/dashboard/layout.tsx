import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import DashboardLayoutClient from '@/components/DashboardLayoutClient'

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

  // Get user role
  const { data: adminUser } = await supabaseAdmin
    .from('admin_users')
    .select('role')
    .eq('auth_user_id', user.id)
    .single()

  const userRole = adminUser?.role || 'staff'

  return <DashboardLayoutClient user={user} userRole={userRole}>{children}</DashboardLayoutClient>
}

