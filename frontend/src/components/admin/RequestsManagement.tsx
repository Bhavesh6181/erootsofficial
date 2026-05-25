import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Clock3, Mail, MessageSquare, Phone, Save, Trash2, UserRound, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { ProjectRequest } from '../../types'
import { api } from '../../utils/api'

const requestStatuses: ProjectRequest['status'][] = ['pending', 'in-review', 'approved', 'rejected']

const getStatusClasses = (status: ProjectRequest['status']) => {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-800'
    case 'in-review':
      return 'bg-blue-100 text-blue-800'
    case 'rejected':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-amber-100 text-amber-800'
  }
}

const RequestsManagement: React.FC = () => {
  const [requests, setRequests] = useState<ProjectRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<'all' | ProjectRequest['status']>('all')
  const [selectedRequest, setSelectedRequest] = useState<ProjectRequest | null>(null)
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState<ProjectRequest['status']>('pending')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const response = await api.get('/requests')
      setRequests(response.data.data)
      setLoadError(null)
    } catch (error) {
      console.error('Error fetching requests:', error)
      setRequests([])
      setLoadError('Project requests could not be loaded. Verify admin API access and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenRequest = (request: ProjectRequest) => {
    setSelectedRequest(request)
    setNotes(request.notes || '')
    setStatus(request.status)
  }

  const handleSave = async () => {
    if (!selectedRequest?._id) {
      return
    }

    try {
      setSaving(true)
      await api.put(`/requests/${selectedRequest._id}`, {
        status,
        notes: notes.trim(),
      })
      toast.success('Request updated successfully.')
      await fetchRequests()
      setSelectedRequest(null)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update request.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (requestId: string) => {
    if (!window.confirm('Delete this request?')) {
      return
    }

    try {
      await api.delete(`/requests/${requestId}`)
      toast.success('Request deleted successfully.')
      await fetchRequests()
      if (selectedRequest?._id === requestId) {
        setSelectedRequest(null)
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete request.')
    }
  }

  const filteredRequests =
    selectedStatus === 'all' ? requests : requests.filter((request) => request.status === selectedStatus)

  const summary = {
    total: requests.length,
    pending: requests.filter((request) => request.status === 'pending').length,
    review: requests.filter((request) => request.status === 'in-review').length,
    approved: requests.filter((request) => request.status === 'approved').length,
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
      <div className="mb-8 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Project Requests</h2>
          <p className="text-gray-600">Review incoming leads, update their status, and keep internal notes.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedStatus('all')}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              selectedStatus === 'all' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 ring-1 ring-gray-200'
            }`}
          >
            All
          </button>
          {requestStatuses.map((value) => (
            <button
              key={value}
              onClick={() => setSelectedStatus(value)}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                selectedStatus === value ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 ring-1 ring-gray-200'
              }`}
            >
              {value.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Requests</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{summary.total}</p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
          <p className="text-sm text-amber-700">Pending</p>
          <p className="mt-2 text-3xl font-bold text-amber-900">{summary.pending}</p>
        </div>
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
          <p className="text-sm text-blue-700">In Review</p>
          <p className="mt-2 text-3xl font-bold text-blue-900">{summary.review}</p>
        </div>
        <div className="rounded-2xl border border-green-200 bg-green-50 p-5 shadow-sm">
          <p className="text-sm text-green-700">Approved</p>
          <p className="mt-2 text-3xl font-bold text-green-900">{summary.approved}</p>
        </div>
      </div>

      {loadError && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {loadError}
        </div>
      )}

      {filteredRequests.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">No Requests Found</h3>
          <p className="mt-2 text-sm text-gray-600">
            {selectedStatus === 'all'
              ? 'Incoming project inquiries will appear here.'
              : `No requests are currently marked as ${selectedStatus.replace('-', ' ')}.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request, index) => (
            <motion.div
              key={request._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900">{request.name}</h3>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(request.status)}`}>
                      {request.status.replace('-', ' ')}
                    </span>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                      {request.serviceType}
                    </span>
                  </div>

                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <div className="space-y-2 text-sm text-gray-600">
                      <p className="flex items-center">
                        <Mail className="mr-2 h-4 w-4 text-gray-400" />
                        {request.email}
                      </p>
                      {request.phone && (
                        <p className="flex items-center">
                          <Phone className="mr-2 h-4 w-4 text-gray-400" />
                          {request.phone}
                        </p>
                      )}
                    </div>
                    <p className="flex items-center text-sm text-gray-600">
                      <Clock3 className="mr-2 h-4 w-4 text-gray-400" />
                      {request.createdAt ? new Date(request.createdAt).toLocaleString('en-IN') : 'Unknown'}
                    </p>
                  </div>

                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-700">{request.description}</p>

                  {request.notes && (
                    <div className="mt-4 rounded-xl bg-gray-50 p-3 text-sm text-gray-700">
                      <span className="font-semibold text-gray-900">Notes:</span> {request.notes}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 lg:flex-col">
                  <button
                    onClick={() => handleOpenRequest(request)}
                    className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
                  >
                    Review Request
                  </button>
                  <button
                    onClick={() => handleDelete(request._id!)}
                    className="rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Review Request</h3>
                <p className="mt-1 text-sm text-gray-500">{selectedRequest.serviceType}</p>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6 px-6 py-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="flex items-center text-sm font-semibold text-gray-900">
                    <UserRound className="mr-2 h-4 w-4 text-gray-500" />
                    Contact
                  </p>
                  <p className="mt-3 text-sm text-gray-700">{selectedRequest.name}</p>
                  <p className="mt-1 text-sm text-gray-700">{selectedRequest.email}</p>
                  {selectedRequest.phone && <p className="mt-1 text-sm text-gray-700">{selectedRequest.phone}</p>}
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-sm font-semibold text-gray-900">Submitted</p>
                  <p className="mt-3 text-sm text-gray-700">
                    {selectedRequest.createdAt ? new Date(selectedRequest.createdAt).toLocaleString('en-IN') : 'Unknown'}
                  </p>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">Project Brief</label>
                <div className="rounded-xl bg-gray-50 p-4 text-sm leading-6 text-gray-700">
                  {selectedRequest.description}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900">Status</label>
                  <select
                    value={status}
                    onChange={(event) => setStatus(event.target.value as ProjectRequest['status'])}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {requestStatuses.map((value) => (
                      <option key={value} value={value}>
                        {value.replace('-', ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900">Internal Notes</label>
                  <textarea
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    rows={5}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Add follow-up details, next steps, budget notes, or priority."
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-gray-200 px-6 py-4 sm:flex-row sm:justify-between">
              <button
                onClick={() => handleDelete(selectedRequest._id!)}
                className="inline-flex items-center justify-center rounded-lg bg-red-50 px-4 py-3 font-semibold text-red-700 hover:bg-red-100"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Request
              </button>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="rounded-lg border border-gray-300 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-3 font-semibold text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default RequestsManagement
