import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import DashboardNav from '@/components/DashboardNav'

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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="hidden md:flex md:w-64 lg:w-72 bg-[#19395f] text-white flex-col flex-shrink-0">
        <DashboardNav user={user} userRole={userRole} />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden w-full bg-[#19395f] text-white flex-shrink-0">
        <DashboardNav user={user} userRole={userRole} />
      </div>

      {/* Main content */}
      <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 overflow-x-auto min-w-0">{children}</main>
    </div>
  )
}

