import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import DeleteBlogButton from '@/components/DeleteBlogButton'
import RefreshButton from '@/components/RefreshButton'
import SafeImage from '@/components/SafeImage'
import ExportButton from '@/components/ExportButton'
import { getUserRole } from '@/lib/auth-helpers'
import AdminOnly from '@/components/AdminOnly'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog Posts | Eyesite Admin',
  description: 'Manage blog articles and content',
}

export default async function BlogsPage() {
  const supabase = await createClient()
  const userRolePromise = getUserRole()
  const { data: blogs, error } = await supabase
    .from('blogs')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching blogs:', error)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Manage your blog articles and content</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <RefreshButton />
          <AdminOnly userRolePromise={userRolePromise}>
            <Link
              href="/dashboard/blogs/new"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#19395f] to-[#0d2440] text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg hover:from-[#80acc9] hover:to-[#19395f] transition-all font-medium shadow-lg text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">Create New Blog</span>
              <span className="sm:hidden">New Blog</span>
            </Link>
          </AdminOnly>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 font-medium">Total Posts</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{blogs?.length || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 font-medium">Published</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{blogs?.length || 0}</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700 font-medium">Categories</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">
                {new Set(blogs?.map(b => b.category)).size || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      {blogs && blogs.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Export Buttons */}
          <div className="p-4 sm:p-6 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-sm sm:text-base font-semibold text-gray-700">Export Data</h3>
            <div className="flex flex-wrap gap-2">
              <ExportButton
                rows={blogs?.map(blog => [
                  blog.title,
                  blog.category,
                  blog.author,
                  new Date(blog.date).toLocaleDateString(),
                  blog.excerpt || ''
                ]) || []}
                filename="blogs"
                type="csv"
                headers={['Title', 'Category', 'Author', 'Date', 'Excerpt']}
              />
              <ExportButton
                rows={blogs?.map(blog => [
                  blog.title,
                  blog.category,
                  blog.author,
                  new Date(blog.date).toLocaleDateString(),
                  blog.excerpt || ''
                ]) || []}
                filename="blogs"
                type="xls"
                headers={['Title', 'Category', 'Author', 'Date', 'Excerpt']}
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden md:table-cell">
                    Category
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden lg:table-cell">
                    Author
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {blogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 sm:px-6 py-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        {blog.image && (
                          <SafeImage 
                            src={blog.image} 
                            alt={blog.title}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover flex-shrink-0"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{blog.title}</div>
                          <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">{blog.excerpt}</div>
                          <div className="md:hidden mt-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                              {blog.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 hidden md:table-cell">
                      <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                        {blog.category}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#19395f]/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-[#19395f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <span className="text-xs sm:text-sm text-gray-700 truncate">{blog.author}</span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4">
                      <div className="text-xs sm:text-sm text-gray-700 whitespace-nowrap">
                        {new Date(blog.date).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 flex-wrap">
                        <AdminOnly userRolePromise={userRolePromise}>
                          <>
                            <Link
                              href={`/dashboard/blogs/${blog.id}/edit`}
                              className="inline-flex items-center gap-1 px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-[#19395f] hover:bg-[#19395f]/10 rounded-lg transition-colors"
                            >
                              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              <span className="hidden sm:inline">Edit</span>
                            </Link>
                            <DeleteBlogButton blogId={blog.id} blogTitle={blog.title} />
                          </>
                        </AdminOnly>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <p className="text-gray-500 text-lg font-medium mb-2">No blogs found</p>
          <p className="text-gray-400 text-sm mb-6">Get started by creating your first blog post</p>
          <Link
            href="/dashboard/blogs/new"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#19395f] to-[#0d2440] text-white px-6 py-3 rounded-lg hover:from-[#80acc9] hover:to-[#19395f] transition-all font-medium shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Your First Blog
          </Link>
        </div>
      )}
    </div>
  )
}
