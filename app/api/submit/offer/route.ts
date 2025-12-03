import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

function generateUniqueCode(): string {
  const prefix = 'EYESITE'
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `${prefix}${randomPart}`
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Generate unique code
    let code = generateUniqueCode()
    let attempts = 0
    let isUnique = false

    // Ensure code is unique
    while (!isUnique && attempts < 10) {
      const { data: existing } = await supabase
        .from('offer_emails')
        .select('id')
        .eq('code', code)
        .single()

      if (!existing) {
        isUnique = true
      } else {
        code = generateUniqueCode()
        attempts++
      }
    }

    if (!isUnique) {
      return NextResponse.json({ error: 'Failed to generate unique code' }, { status: 500 })
    }

    const { data, error } = await supabase
      .from('offer_emails')
      .insert([
        {
          email,
          code,
          is_used: false,
        },
      ])
      .select()
      .single()

    if (error) {
      // If duplicate email, return existing code
      if (error.code === '23505') {
        const { data: existing } = await supabase
          .from('offer_emails')
          .select('*')
          .eq('email', email)
          .single()

        if (existing) {
          return NextResponse.json({ success: true, data: existing })
        }
      }
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

