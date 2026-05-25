import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Edit, FolderKanban, Plus, Save, Star, Trash2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { Project } from '../../types'
import { api } from '../../utils/api'

const projectCategories = ['Embedded', 'IoT', 'PCB', 'Antenna', 'Web', 'App', 'Other']
const projectStatuses: Project['status'][] = ['completed', 'in-progress', 'planned']

const emptyProject: Partial<Project> = {
  title: '',
  description: '',
  image: '',
  technologies: [],
  category: 'Other',
  status: 'completed',
  featured: false,
}

const ProjectsManagement: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null)
  const [technologiesInput, setTechnologiesInput] = useState('')
  const [formData, setFormData] = useState<Partial<Project>>(emptyProject)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await api.get('/projects')
      setProjects(response.data.data)
      setLoadError(null)
    } catch (error) {
      console.error('Error fetching projects:', error)
      setProjects([])
      setLoadError('Live project data could not be loaded. Check the API connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingProjectId(null)
    setFormData(emptyProject)
    setTechnologiesInput('')
  }

  const openCreateForm = () => {
    setEditingProjectId(null)
    setFormData(emptyProject)
    setTechnologiesInput('')
    setShowForm(true)
  }

  const openEditForm = (project: Project) => {
    setEditingProjectId(project._id || null)
    setFormData({
      title: project.title,
      description: project.description,
      image: project.image || '',
      technologies: project.technologies || [],
      category: project.category,
      status: project.status,
      featured: Boolean(project.featured),
    })
    setTechnologiesInput((project.technologies || []).join(', '))
    setShowForm(true)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const payload = {
      ...formData,
      technologies: technologiesInput
        .split(',')
        .map((tech) => tech.trim())
        .filter(Boolean),
    }

    try {
      if (editingProjectId) {
        await api.put(`/projects/${editingProjectId}`, payload)
        toast.success('Project updated successfully.')
      } else {
        await api.post('/projects', payload)
        toast.success('Project created successfully.')
      }

      await fetchProjects()
      resetForm()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save project.')
    }
  }

  const handleDelete = async (projectId: string) => {
    if (!window.confirm('Delete this project?')) {
      return
    }

    try {
      await api.delete(`/projects/${projectId}`)
      toast.success('Project deleted successfully.')
      await fetchProjects()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete project.')
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Projects Management</h2>
          <p className="text-gray-600">Maintain the project portfolio shown across the site.</p>
        </div>
        <button onClick={openCreateForm} className="btn-primary inline-flex items-center">
          <Plus className="mr-2 h-5 w-5" />
          Add Project
        </button>
      </div>

      {loadError && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {loadError}
        </div>
      )}

      {projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm">
          <FolderKanban className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">No Projects Available</h3>
          <p className="mt-2 text-sm text-gray-600">
            Add a project entry to populate the portfolio section of the public website.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {projects.map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
                    {project.featured && (
                      <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
                        <Star className="mr-1 h-3.5 w-3.5" />
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-700">{project.category}</span>
                    <span className="rounded-full bg-primary-50 px-3 py-1 font-medium text-primary-700">
                      {project.status.replace('-', ' ')}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEditForm(project)}
                    className="rounded-lg bg-primary-100 px-3 py-2 text-sm font-semibold text-primary-700 hover:bg-primary-200"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(project._id!)}
                    className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-gray-600">{project.description}</p>

              {project.technologies?.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.technologies.map((technology, techIndex) => (
                    <span
                      key={`${project._id}-technology-${techIndex}`}
                      className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                    >
                      {technology}
                    </span>
                  ))}
                </div>
              ) : null}
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
                {editingProjectId ? 'Edit Project' : 'Add Project'}
              </h3>
              <button onClick={resetForm} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900">Project Title *</label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900">Image URL</label>
                  <input
                    type="url"
                    value={formData.image || ''}
                    onChange={(event) => setFormData((prev) => ({ ...prev, image: event.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="https://example.com/project-cover.jpg"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">Description *</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
                  rows={5}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900">Category *</label>
                  <select
                    value={formData.category || 'Other'}
                    onChange={(event) => setFormData((prev) => ({ ...prev, category: event.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {projectCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900">Status *</label>
                  <select
                    value={formData.status || 'completed'}
                    onChange={(event) => setFormData((prev) => ({ ...prev, status: event.target.value as Project['status'] }))}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {projectStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status.replace('-', ' ')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">Technologies</label>
                <input
                  type="text"
                  value={technologiesInput}
                  onChange={(event) => setTechnologiesInput(event.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="ESP32, Firebase, HFSS, React"
                />
                <p className="mt-2 text-xs text-gray-500">Separate multiple technologies with commas.</p>
              </div>

              <label className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={Boolean(formData.featured)}
                  onChange={(event) => setFormData((prev) => ({ ...prev, featured: event.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                Mark this project as featured on the public site
              </label>

              <div className="flex flex-col gap-3 border-t border-gray-200 pt-5 sm:flex-row">
                <button type="submit" className="btn-primary inline-flex items-center justify-center">
                  <Save className="mr-2 h-4 w-4" />
                  {editingProjectId ? 'Update Project' : 'Create Project'}
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

export default ProjectsManagement
