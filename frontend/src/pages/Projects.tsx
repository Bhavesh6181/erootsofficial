import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Project } from '../types'
import { api } from '../utils/api'
import { canUseDemoFallbacks } from '../utils/runtime'

const demoProjects: Project[] = [
  {
    title: 'Home Automation System',
    description: 'ESP8266 + Arduino IoT Cloud with real-time alerts and safety monitoring.',
    technologies: ['ESP8266', 'Arduino IoT Cloud', 'Gas Sensors'],
    category: 'IoT',
    status: 'completed',
  },
  {
    title: 'Live Bus Tracking System',
    description: 'ESP32 + GPS + Firebase stack for live location visibility and route awareness.',
    technologies: ['ESP32', 'GPS', 'Firebase'],
    category: 'IoT',
    status: 'completed',
  },
  {
    title: 'Wearable Patch Antenna',
    description: 'Textile antenna design and RF simulation for wearable applications.',
    technologies: ['Ansys HFSS', 'Textile Integration', 'RF Design'],
    category: 'Antenna',
    status: 'completed',
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'in-progress':
      return 'bg-blue-100 text-blue-800'
    case 'planned':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/projects')
        setProjects(response.data.data)
        setLoadError(null)
      } catch (error) {
        console.error('Error fetching projects:', error)

        if (canUseDemoFallbacks) {
          setProjects(demoProjects)
          setLoadError('Showing local preview projects because the live API is unavailable.')
        } else {
          setProjects([])
          setLoadError('Live project data is temporarily unavailable. Please contact us for recent case studies.')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading projects...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Projects - Eroots Technology</title>
        <meta
          name="description"
          content="Explore engineering projects across IoT, RF, embedded systems, and applied product development."
        />
      </Helmet>

      <div className="min-h-screen pt-16 relative">
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-12">
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
              </button>

              <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Featured <span className="text-gradient">Projects</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  A concise portfolio view of the systems, RF work, and embedded products we have built.
                </p>
              </div>
            </div>

            {loadError && (
              <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                {loadError}
              </div>
            )}

            {projects.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">Projects Unavailable</h2>
                <p className="text-gray-600">Please contact us directly for recent work samples and case studies.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {projects.map((project, index) => (
                  <div
                    key={project._id || index}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 group relative overflow-hidden"
                  >
                    <div className="absolute top-4 right-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}
                      >
                        {project.status.replace('-', ' ')}
                      </span>
                    </div>

                    <div className="inline-block bg-primary-100 text-primary-800 text-sm font-medium px-3 py-1 rounded-full mb-4">
                      {project.category}
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-gray-600 mb-6 leading-relaxed">{project.description}</p>

                    {project.technologies && project.technologies.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                          <Zap className="w-4 h-4 mr-2 text-primary-500" />
                          Technologies Used
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Projects
