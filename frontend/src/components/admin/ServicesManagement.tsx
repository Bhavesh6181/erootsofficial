import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Edit, Plus, Save, Trash2, Wrench, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { Service } from '../../types'
import { api } from '../../utils/api'

const emptyService: Partial<Service> = {
  title: '',
  description: '',
  icon: '',
  features: [],
}

const ServicesManagement: React.FC = () => {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<Partial<Service>>(emptyService)

  useEffect(() => {
    fetchServices()
  }, [])

  const resetForm = () => {
    setEditingId(null)
    setFormData(emptyService)
    setShowForm(false)
  }

  const fetchServices = async () => {
    try {
      setLoading(true)
      const response = await api.get('/services')
      setServices(response.data.data)
      setLoadError(null)
    } catch (error) {
      console.error('Error fetching services:', error)
      setServices([])
      setLoadError('Live service data could not be loaded. Check the API connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    try {
      if (editingId) {
        await api.put(`/services/${editingId}`, formData)
        toast.success('Service updated successfully.')
      } else {
        await api.post('/services', formData)
        toast.success('Service created successfully.')
      }

      await fetchServices()
      resetForm()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save service.')
    }
  }

  const handleEdit = (service: Service) => {
    setEditingId(service._id || null)
    setFormData({
      title: service.title,
      description: service.description,
      icon: service.icon,
      features: service.features || [],
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this service?')) {
      return
    }

    try {
      await api.delete(`/services/${id}`)
      toast.success('Service deleted successfully.')
      await fetchServices()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete service.')
    }
  }

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...(prev.features || []), ''],
    }))
  }

  const updateFeature = (index: number, value: string) => {
    const nextFeatures = [...(formData.features || [])]
    nextFeatures[index] = value
    setFormData((prev) => ({
      ...prev,
      features: nextFeatures,
    }))
  }

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: (prev.features || []).filter((_, featureIndex) => featureIndex !== index),
    }))
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Services Management</h2>
          <p className="text-gray-600">Manage service copy, icons, and feature highlights.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Add Service</span>
        </button>
      </div>

      {loadError && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {loadError}
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="p-6">
          {services.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
              <Wrench className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">No Services Available</h3>
              <p className="mt-2 text-sm text-gray-600">
                Create your first service entry or restore API connectivity to manage live records.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {services.map((service) => (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-gray-200 p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="text-3xl">{service.icon}</div>
                  <h3 className="mt-4 text-xl font-semibold text-gray-900">{service.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{service.description}</p>

                  {service.features?.length ? (
                    <div className="mt-4">
                      <p className="text-sm font-semibold text-gray-900">Features</p>
                      <ul className="mt-2 space-y-2 text-sm text-gray-600">
                        {service.features.map((feature, index) => (
                          <li key={`${service._id}-feature-${index}`} className="flex items-center">
                            <span className="mr-2 h-1.5 w-1.5 rounded-full bg-primary-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  <div className="mt-6 flex gap-2">
                    <button
                      onClick={() => handleEdit(service)}
                      className="inline-flex items-center rounded-lg bg-primary-100 px-3 py-2 text-sm font-medium text-primary-700 hover:bg-primary-200"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(service._id!)}
                      className="inline-flex items-center rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">{editingId ? 'Edit Service' : 'Add Service'}</h3>
              <button onClick={resetForm} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">Service Title *</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">Description *</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">Icon</label>
                <input
                  type="text"
                  value={formData.icon || ''}
                  onChange={(event) => setFormData((prev) => ({ ...prev, icon: event.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g. IoT, RF, AI, PCB"
                />
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <label className="block text-sm font-semibold text-gray-900">Features</label>
                  <button
                    type="button"
                    onClick={addFeature}
                    className="text-sm font-medium text-primary-700 hover:text-primary-800"
                  >
                    Add Feature
                  </button>
                </div>

                <div className="space-y-2">
                  {(formData.features || []).map((feature, index) => (
                    <div key={`feature-${index}`} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(event) => updateFeature(index, event.target.value)}
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Feature description"
                      />
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button type="submit" className="btn-primary inline-flex items-center justify-center">
                  <Save className="mr-2 h-4 w-4" />
                  {editingId ? 'Update Service' : 'Create Service'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 hover:bg-gray-50"
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

export default ServicesManagement
