import BlogForm from '@/components/BlogForm'

export default function NewBlogPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Create New Blog Post</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Write and publish a new blog article for your website</p>
      </div>
      <BlogForm />
    </div>
  )
}

