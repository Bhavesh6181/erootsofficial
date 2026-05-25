import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Clock3, Edit, Mail, MessageSquare, Plus, Save, Star, Trash2, X, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { Testimonial, TestimonialStatus } from '../../types'
import { api } from '../../utils/api'

const emptyTestimonial: Partial<Testimonial> = {
  name: '',
  email: '',
  company: '',
  content: '',
  rating: 5,
  avatar: '',
  featured: false,
}

const statusStyles: Record<TestimonialStatus, string> = {
  pending: 'bg-amber-100 text-amber-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
}

const statusLabels: Record<TestimonialStatus, string> = {
  pending: 'Pending Review',
  approved: 'Approved',
  rejected: 'Rejected',
}

const TestimonialsManagement: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Testimonial>>(emptyTestimonial)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      setLoading(true)
      const response = await api.get('/testimonials')
      setTestimonials(response.data.data)
      setLoadError(null)
    } catch (error) {
      console.error('Error fetching testimonials:', error)
      setTestimonials([])
      setLoadError('Testimonials could not be loaded. Check the API connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({ ...emptyTestimonial })
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    try {
      if (editingId) {
        await api.put(`/testimonials/${editingId}`, formData)
        toast.success('Testimonial updated successfully.')
      } else {
        await api.post('/testimonials', formData)
        toast.success('Testimonial created successfully.')
      }

      await fetchTestimonials()
      resetForm()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save testimonial.')
    }
  }

  const handleEdit = (testimonial: Testimonial) => {
    setEditingId(testimonial._id || null)
    setFormData({
      name: testimonial.name,
      email: testimonial.email || '',
      company: testimonial.company || '',
      content: testimonial.content,
      rating: testimonial.rating,
      avatar: testimonial.avatar || '',
      featured: testimonial.featured,
    })
    setShowForm(true)
  }

  const handleDelete = async (testimonialId: string) => {
    if (!window.confirm('Delete this testimonial?')) {
      return
    }

    try {
      await api.delete(`/testimonials/${testimonialId}`)
      toast.success('Testimonial deleted successfully.')
      await fetchTestimonials()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete testimonial.')
    }
  }

  const handleStatusUpdate = async (testimonialId: string, status: TestimonialStatus) => {
    try {
      await api.patch(`/testimonials/${testimonialId}/status`, { status })
      toast.success(`Testimonial ${status} successfully.`)
      await fetchTestimonials()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update testimonial status.')
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary-600" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Testimonials Management</h2>
          <p className="text-gray-600">Manage customer proof points shown on the public website.</p>
        </div>
        <button
          onClick={() => {
            setFormData({ ...emptyTestimonial })
            setEditingId(null)
            setShowForm(true)
          }}
          className="btn-primary inline-flex items-center"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add Testimonial
        </button>
      </div>

      {loadError && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {loadError}
        </div>
      )}

      {testimonials.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">No Testimonials Available</h3>
          <p className="mt-2 text-sm text-gray-600">Add testimonials here to surface social proof across the site.</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              {testimonial.status === 'pending' && (
                <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  This feedback is waiting for approval before it appears on the public website.
                </div>
              )}

              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-semibold text-gray-900">{testimonial.name}</h3>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[testimonial.status]}`}
                    >
                      {statusLabels[testimonial.status]}
                    </span>
                    {testimonial.featured && (
                      <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
                        Featured
                      </span>
                    )}
                  </div>
                  {testimonial.company && <p className="mt-1 text-sm text-gray-500">{testimonial.company}</p>}
                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                    <Mail className="h-4 w-4" />
                    <span>{testimonial.email || 'No email provided'}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(testimonial)}
                    className="rounded-lg bg-primary-100 px-3 py-2 text-primary-700 hover:bg-primary-200"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(testimonial._id!)}
                    className="rounded-lg bg-red-50 px-3 py-2 text-red-700 hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-1 text-yellow-500">
                {Array.from({ length: 5 }).map((_, ratingIndex) => (
                  <Star
                    key={`${testimonial._id}-star-${ratingIndex}`}
                    className={`h-4 w-4 ${ratingIndex < testimonial.rating ? 'fill-current' : ''}`}
                  />
                ))}
              </div>

              <p className="mt-4 text-sm leading-6 text-gray-700">{testimonial.content}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  onClick={() => handleStatusUpdate(testimonial._id!, 'approved')}
                  disabled={testimonial.status === 'approved'}
                  className="inline-flex items-center rounded-lg bg-green-50 px-3 py-2 text-sm font-semibold text-green-700 transition hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Approve
                </button>
                <button
                  onClick={() => handleStatusUpdate(testimonial._id!, 'rejected')}
                  disabled={testimonial.status === 'rejected'}
                  className="inline-flex items-center rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </button>
                {testimonial.status === 'pending' && (
                  <span className="inline-flex items-center rounded-lg bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800">
                    <Clock3 className="mr-2 h-4 w-4" />
                    Awaiting review
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h3 className="text-2xl font-bold text-gray-900">
                {editingId ? 'Edit Testimonial' : 'Add Testimonial'}
              </h3>
              <button onClick={resetForm} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900">Customer Name *</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900">Email *</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900">Company</label>
                  <input
                    type="text"
                    value={formData.company || ''}
                    onChange={(event) => setFormData((prev) => ({ ...prev, company: event.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900">Avatar URL</label>
                  <input
                    type="url"
                    value={formData.avatar || ''}
                    onChange={(event) => setFormData((prev) => ({ ...prev, avatar: event.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900">Rating *</label>
                  <select
                    value={formData.rating || 5}
                    onChange={(event) => setFormData((prev) => ({ ...prev, rating: Number(event.target.value) }))}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <option key={rating} value={rating}>
                        {rating} Star{rating > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">Testimonial *</label>
                <textarea
                  value={formData.content || ''}
                  onChange={(event) => setFormData((prev) => ({ ...prev, content: event.target.value }))}
                  rows={5}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <label className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={Boolean(formData.featured)}
                  onChange={(event) => setFormData((prev) => ({ ...prev, featured: event.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                Highlight this testimonial as featured
              </label>

              <div className="flex flex-col gap-3 border-t border-gray-200 pt-5 sm:flex-row">
                <button type="submit" className="btn-primary inline-flex items-center justify-center">
                  <Save className="mr-2 h-4 w-4" />
                  {editingId ? 'Update Testimonial' : 'Create Testimonial'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-gray-300 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default TestimonialsManagement
