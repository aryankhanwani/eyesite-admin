import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { isAdmin } from '@/lib/auth-helpers'
import { revalidatePath } from 'next/cache'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only admins can create blogs
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const body = await request.json()

    const payload = {
      slug: body.slug,
      title: body.title,
      excerpt: body.excerpt,
      content: body.content,
      author: body.author,
      date: body.date,
      category: body.category,
      image: body.image,
      read_time: body.read_time ?? body.readTime ?? null,
      tags: body.tags ?? [],
    }

    const { data, error } = await supabase.from('blogs').insert([payload]).select().single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Revalidate blog pages to show new content instantly
    revalidatePath('/blog')
    revalidatePath('/api/blogs')
    revalidatePath('/')

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

