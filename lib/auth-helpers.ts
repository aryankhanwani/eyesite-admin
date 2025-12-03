import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function getUserRole(): Promise<'admin' | 'staff' | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: adminUser } = await supabaseAdmin
    .from('admin_users')
    .select('role')
    .eq('auth_user_id', user.id)
    .single()

  return adminUser?.role as 'admin' | 'staff' | null
}

export async function isAdmin(): Promise<boolean> {
  const role = await getUserRole()
  return role === 'admin'
}

export async function requireAdmin() {
  const isAdminUser = await isAdmin()
  if (!isAdminUser) {
    throw new Error('Admin access required')
  }
}

