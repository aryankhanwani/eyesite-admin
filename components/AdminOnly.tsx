import { use } from 'react'
import { Suspense } from 'react'

interface AdminOnlyProps {
  children: React.ReactNode
  userRolePromise: Promise<'admin' | 'staff' | null>
  fallback?: React.ReactNode
}

function AdminOnlyContent({ children, userRolePromise, fallback = null }: AdminOnlyProps) {
  const userRole = use(userRolePromise)
  
  if (userRole !== 'admin') {
    return <>{fallback}</>
  }
  
  return <>{children}</>
}

export default function AdminOnly(props: AdminOnlyProps) {
  return (
    <Suspense fallback={null}>
      <AdminOnlyContent {...props} />
    </Suspense>
  )
}

