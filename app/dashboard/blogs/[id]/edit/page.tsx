import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import BlogForm from '@/components/BlogForm'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditBlogPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: blog, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !blog) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Blog Post</h1>
          <p className="text-gray-600 mt-2">Update your blog article content and settings</p>
        </div>
        <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700 font-medium">Editing: {blog.title}</p>
        </div>
      </div>
      <BlogForm blog={blog} />
    </div>
  )
}

