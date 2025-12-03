import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const rawCode = searchParams.get('code')
    const code = rawCode?.trim().toUpperCase()

    if (!code || code.length === 0) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 })
    }

    // Use admin client to bypass RLS (same as offers page)
    // Codes are stored in uppercase, so we use exact match after normalizing
    const { data, error } = await supabaseAdmin
      .from('offer_emails')
      .select('*')
      .eq('code', code)
      .maybeSingle() // Use maybeSingle() instead of single() to avoid error when not found

    if (error) {
      console.error('Database error when searching for code:', code, error)
      return NextResponse.json({ error: error.message || 'Database error' }, { status: 500 })
    }

    if (!data) {
      console.error('Code not found:', code)
      // Let's also check if there are any codes in the database for debugging
      const { data: allCodes } = await supabaseAdmin
        .from('offer_emails')
        .select('code')
        .limit(5)
      console.log('Sample codes in database:', allCodes?.map(c => c.code))
      return NextResponse.json({ error: `Code "${code}" not found` }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Validation error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

