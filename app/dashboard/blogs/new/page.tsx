import BlogForm from '@/components/BlogForm'

export default function NewBlogPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Blog Post</h1>
          <p className="text-gray-600 mt-2">Write and publish a new blog article</p>
        </div>
      </div>
      <BlogForm />
    </div>
  )
}

