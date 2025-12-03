import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Diagnostic endpoint to check if blogs exist and RLS is working
export async function GET() {
  try {
    const supabase = await createClient()
    
    // Check with anon key (what the frontend uses)
    const { data: blogsAnon, error: errorAnon } = await supabase
      .from('blogs')
      .select('*')
      .limit(10)

    // Try with service role key (bypasses RLS)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    let blogsServiceRole: any[] = []
    let errorServiceRole: any = null
    
    if (supabaseUrl && serviceRoleKey) {
      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/blogs?select=*&limit=10`, {
          headers: {
            apikey: serviceRoleKey,
            Authorization: `Bearer ${serviceRoleKey}`,
          },
        })
        
        if (response.ok) {
          blogsServiceRole = await response.json()
        } else {
          errorServiceRole = { status: response.status, statusText: response.statusText }
        }
      } catch (e: any) {
        errorServiceRole = { message: e.message }
      }
    }

    return NextResponse.json({
      anonKey: {
        count: blogsAnon?.length || 0,
        error: errorAnon ? { message: errorAnon.message, code: errorAnon.code } : null,
        sample: blogsAnon?.slice(0, 2) || [],
      },
      serviceRoleKey: {
        count: blogsServiceRole?.length || 0,
        error: errorServiceRole,
        sample: blogsServiceRole?.slice(0, 2) || [],
        hasServiceKey: !!serviceRoleKey,
      },
      conclusion: blogsServiceRole.length > 0 && blogsAnon?.length === 0
        ? 'RLS is blocking reads with anon key'
        : blogsServiceRole.length === 0
        ? 'No blogs found in database (even with service role)'
        : 'Blogs accessible with anon key',
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

