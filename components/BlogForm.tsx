'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import SafeImage from './SafeImage'
import CustomSelect from './CustomSelect'

interface Blog {
  id?: string
  slug: string
  title: string
  excerpt: string
  content: string
  author: string
  date: string
  category: string
  image: string
  readTime?: string
  read_time?: string
  tags: string[]
}

interface BlogFormProps {
  blog?: Blog
}

export default function BlogForm({ blog }: BlogFormProps) {
  const router = useRouter()
  const contentRef = useRef<HTMLTextAreaElement | null>(null)
  const [formData, setFormData] = useState<Blog>({
    id: blog?.id,
    slug: blog?.slug || '',
    title: blog?.title || '',
    excerpt: blog?.excerpt || '',
    content: blog?.content || '',
    author: blog?.author || '',
    date: blog?.date || new Date().toISOString().split('T')[0],
    category: blog?.category || '',
    image: blog?.image || '',
    readTime: blog?.readTime || blog?.read_time || '',
    tags: blog?.tags || [],
  })
  const [tagInput, setTagInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const categories = [
    'Eye Health',
    'Eyewear',
    'Contact Lenses',
    'Eye Conditions',
  ]

  const applyFormat = (format: 'bold' | 'h1' | 'h2' | 'h3' | 'bullet') => {
    const textarea = contentRef.current
    if (!textarea) return

    const { selectionStart, selectionEnd, value } = textarea
    const selectedText = value.slice(selectionStart, selectionEnd) || 'Your text'

    let formatted = selectedText

    switch (format) {
      case 'bold':
        formatted = `** ${selectedText} **`
        break
      case 'h1':
        formatted = `# ${selectedText}`
        break
      case 'h2':
        formatted = `## ${selectedText}`
        break
      case 'h3':
        formatted = `### ${selectedText}`
        break
      case 'bullet':
        formatted = selectedText
          .split('\n')
          .map((line) => (line.trim() ? `- ${line}` : line))
          .join('\n')
        break
    }

    const newValue =
      value.slice(0, selectionStart) + formatted + value.slice(selectionEnd)

    setFormData((prev) => ({
      ...prev,
      content: newValue,
    }))

    const newCursorStart = selectionStart
    const newCursorEnd = selectionStart + formatted.length
    requestAnimationFrame(() => {
      textarea.focus()
      textarea.selectionStart = newCursorStart
      textarea.selectionEnd = newCursorEnd
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!formData.slug && formData.title) {
        formData.slug = formData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      }

      const blogId = blog?.id || formData.id
      const url = blogId ? `/api/blogs/${blogId}` : '/api/blogs'
      const method = blogId ? 'PUT' : 'POST'

      const payload = {
        ...formData,
        read_time: formData.readTime || formData.read_time || null,
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to save blog')
      }

      router.push('/dashboard/blogs')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      })
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    })
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setUploadError('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload/blog-image', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to upload image')
      }

      const data = await res.json()
      setFormData((prev) => ({
        ...prev,
        image: data.url,
      }))
    } catch (err: any) {
      setUploadError(err.message)
    } finally {
      setUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg shadow-sm">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Error: {error}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Content Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-[#19395f] to-[#0d2440] px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Blog Content</h2>
            <p className="text-sm text-white/80 mt-1">Write your blog post content</p>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <svg className="w-4 h-4 text-[#19395f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h10m-7 4h7" />
                </svg>
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19395f] focus:border-[#19395f] transition-all text-black placeholder:text-gray-400 text-lg font-medium"
                placeholder="Enter blog post title..."
              />
              <p className="text-xs text-gray-500 mt-1">{formData.title.length} characters</p>
            </div>

            {/* Slug */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <svg className="w-4 h-4 text-[#19395f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                URL Slug
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19395f] focus:border-[#19395f] transition-all text-black placeholder:text-gray-400 font-mono text-sm"
                placeholder="auto-generated-from-title"
              />
              <p className="text-xs text-gray-500 mt-1">Leave empty to auto-generate from title</p>
            </div>

            {/* Excerpt */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <svg className="w-4 h-4 text-[#19395f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                Excerpt <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                required
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19395f] focus:border-[#19395f] transition-all text-black placeholder:text-gray-400 resize-none"
                placeholder="Write a brief summary of your blog post..."
              />
              <p className="text-xs text-gray-500 mt-1">{formData.excerpt.length} characters</p>
            </div>

            {/* Content Editor */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <svg className="w-4 h-4 text-[#19395f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Content <span className="text-red-500">*</span>
              </label>
              
              {/* Formatting Toolbar */}
              <div className="mb-3 bg-gray-50 border border-gray-200 rounded-lg p-2 flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-gray-600 mr-2">Formatting:</span>
                <button
                  type="button"
                  onClick={() => applyFormat('bold')}
                  className="px-3 py-1.5 text-sm font-semibold text-gray-900 bg-white border border-gray-300 rounded-md hover:bg-[#19395f] hover:text-white hover:border-[#19395f] transition-all flex items-center gap-1.5"
                  title="Bold"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h8a4 4 0 014 4 4 4 0 01-4 4H6z" />
                  </svg>
                  Bold
                </button>
                <button
                  type="button"
                  onClick={() => applyFormat('h1')}
                  className="px-3 py-1.5 text-sm font-semibold text-gray-900 bg-white border border-gray-300 rounded-md hover:bg-[#19395f] hover:text-white hover:border-[#19395f] transition-all"
                  title="Heading 1"
                >
                  H1
                </button>
                <button
                  type="button"
                  onClick={() => applyFormat('h2')}
                  className="px-3 py-1.5 text-sm font-semibold text-gray-900 bg-white border border-gray-300 rounded-md hover:bg-[#19395f] hover:text-white hover:border-[#19395f] transition-all"
                  title="Heading 2"
                >
                  H2
                </button>
                <button
                  type="button"
                  onClick={() => applyFormat('h3')}
                  className="px-3 py-1.5 text-sm font-semibold text-gray-900 bg-white border border-gray-300 rounded-md hover:bg-[#19395f] hover:text-white hover:border-[#19395f] transition-all"
                  title="Heading 3"
                >
                  H3
                </button>
                <button
                  type="button"
                  onClick={() => applyFormat('bullet')}
                  className="px-3 py-1.5 text-sm font-semibold text-gray-900 bg-white border border-gray-300 rounded-md hover:bg-[#19395f] hover:text-white hover:border-[#19395f] transition-all flex items-center gap-1.5"
                  title="Bullet List"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  List
                </button>
              </div>
              
              <textarea
                ref={contentRef}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                rows={20}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19395f] focus:border-[#19395f] transition-all text-black placeholder:text-gray-400 font-mono text-sm resize-y"
                placeholder="Write your blog content here... Use markdown formatting or the toolbar above."
              />
              <p className="text-xs text-gray-500 mt-1">{formData.content.length} characters</p>
            </div>
          </div>
        </div>

        {/* Metadata Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Metadata</h2>
            <p className="text-sm text-gray-600 mt-1">Blog post details and settings</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Author */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <svg className="w-4 h-4 text-[#19395f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Author <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19395f] focus:border-[#19395f] transition-all text-black placeholder:text-gray-400"
                  placeholder="Author name"
                />
              </div>

              {/* Category */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <svg className="w-4 h-4 text-[#19395f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Category <span className="text-red-500">*</span>
                </label>
                <CustomSelect
                  value={formData.category}
                  onChange={(value) => setFormData({ ...formData, category: value })}
                  options={[
                    { value: '', label: 'Select a category' },
                    ...categories.map((cat) => ({
                      value: cat,
                      label: cat,
                      icon: (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                      ),
                    })),
                  ]}
                  placeholder="Select a category"
                  required
                />
              </div>

              {/* Date */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <svg className="w-4 h-4 text-[#19395f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Publication Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19395f] focus:border-[#19395f] transition-all text-black"
                />
              </div>

              {/* Read Time */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <svg className="w-4 h-4 text-[#19395f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Read Time
                </label>
                <input
                  type="text"
                  value={formData.readTime}
                  onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19395f] focus:border-[#19395f] transition-all text-black placeholder:text-gray-400"
                  placeholder="e.g., 5 min read"
                />
              </div>
            </div>

            {/* Image Upload/URL */}
            <div className="mt-6">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <svg className="w-4 h-4 text-[#19395f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Featured Image
              </label>
              
              {/* File Upload */}
              <div className="mb-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className={`inline-flex items-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
                    uploading
                      ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
                      : 'border-[#19395f] bg-white hover:bg-[#19395f] hover:text-white hover:border-[#19395f]'
                  }`}
                >
                  {uploading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-sm font-medium">Uploading...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span className="text-sm font-medium">Upload Image to Supabase</span>
                    </>
                  )}
                </label>
                <p className="text-xs text-gray-500 mt-2">Supported formats: JPEG, PNG, WebP, GIF (Max 5MB)</p>
                {uploadError && (
                  <div className="mt-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                    {uploadError}
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">OR</span>
                </div>
              </div>

              {/* URL Input */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Or enter image URL:</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19395f] focus:border-[#19395f] transition-all text-black placeholder:text-gray-400 font-mono text-sm"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Image Preview */}
              {formData.image && (
                <div className="mt-4 rounded-lg overflow-hidden border border-gray-200">
                  <SafeImage src={formData.image} alt="Preview" className="w-full h-48 object-cover" />
                  <div className="p-3 bg-gray-50 border-t border-gray-200">
                    <p className="text-xs text-gray-600 break-all">{formData.image}</p>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image: '' })}
                      className="mt-2 text-xs text-red-600 hover:text-red-800 font-medium"
                    >
                      Remove Image
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tags Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Tags</h2>
            <p className="text-sm text-gray-600 mt-1">Add tags to help categorize your blog post</p>
          </div>
          
          <div className="p-6">
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19395f] focus:border-[#19395f] transition-all text-black placeholder:text-gray-400"
                placeholder="Type a tag and press Enter"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-6 py-3 bg-[#19395f] text-white rounded-lg hover:bg-[#80acc9] transition-colors font-medium flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Tag
              </button>
            </div>
            
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-2 bg-[#19395f]/10 text-[#19395f] px-4 py-2 rounded-full text-sm font-medium border border-[#19395f]/20"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-red-600 transition-colors"
                      title="Remove tag"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all font-medium flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-[#19395f] to-[#0d2440] text-white rounded-lg hover:from-[#80acc9] hover:to-[#19395f] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {blog ? 'Update Blog Post' : 'Publish Blog Post'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
