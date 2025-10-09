import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft, ExternalLink, Github, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Project } from '../types'
import { api } from '../utils/api'

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/projects')
        setProjects(response.data.data)
      } catch (error) {
        console.error('Error fetching projects:', error)
        // Set default projects if API fails
        setProjects([
          {
            title: 'Home Automation System',
            description: 'ESP8266 + Arduino IoT Cloud; gas detection & blast protection; comprehensive safety monitoring with real-time alerts and mobile app integration',
            technologies: ['ESP8266', 'Arduino IoT Cloud', 'Gas Sensors', 'Mobile App'],
            category: 'IoT',
            status: 'completed',
          },
          {
            title: 'Live Bus Tracking System',
            description: 'ESP32 + GPS + Firebase; real-time updates with user-friendly interface; future geofencing & route optimization capabilities for public transportation',
            technologies: ['ESP32', 'GPS', 'Firebase', 'Real-time Database'],
            category: 'IoT',
            status: 'completed',
          },
          {
            title: 'Wearable Patch Antenna',
            description: 'Innovative textile patch integrated on jeans at 2.45 GHz & 5.8 GHz; precisely simulated in Ansys HFSS for optimal performance in wearable applications',
            technologies: ['Ansys HFSS', 'Textile Integration', 'RF Design', 'Wearable Tech'],
            category: 'Antenna',
            status: 'completed',
          },
          {
            title: 'Antenna Prototype Design',
            description: 'Comprehensive suite of Monopole, Yagi-Uda, Whip, Helix & Dipole designs; advanced RF simulation & rigorous testing protocols for various applications',
            technologies: ['RF Simulation', 'Prototyping', 'Testing', 'Multiple Antenna Types'],
            category: 'Antenna',
            status: 'completed',
          },
          {
            title: 'Smart Agriculture System',
            description: 'IoT-based monitoring system for soil moisture, temperature, and humidity with automated irrigation control and crop health analytics',
            technologies: ['IoT Sensors', 'Arduino', 'Cloud Analytics', 'Automation'],
            category: 'IoT',
            status: 'in-progress',
          },
          {
            title: 'Industrial Monitoring Dashboard',
            description: 'Real-time industrial equipment monitoring with predictive maintenance capabilities and comprehensive data visualization',
            technologies: ['Industrial IoT', 'Predictive Analytics', 'Dashboard Design', 'Data Visualization'],
            category: 'IoT',
            status: 'planned',
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✓'
      case 'in-progress':
        return '⏳'
      case 'planned':
        return '📋'
      default:
        return '•'
    }
  }

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
        <meta name="description" content="Explore our portfolio of innovative engineering solutions including IoT projects, antenna designs, and embedded systems." />
      </Helmet>

      <div className="min-h-screen pt-16 relative">
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>
        <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Header */}
          <div className="mb-12">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </button>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Featured <span className="text-gradient">Projects</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Explore our portfolio of innovative engineering solutions that showcase
                our expertise across various domains.
              </p>
            </motion.div>
          </div>

          {/* Projects Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {projects.map((project, index) => (
              <motion.div
                key={project._id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 group relative overflow-hidden"
              >
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    <span className="mr-1">{getStatusIcon(project.status)}</span>
                    {project.status.replace('-', ' ')}
                  </span>
                </div>

                {/* Category Badge */}
                <div className="inline-block bg-primary-100 text-primary-800 text-sm font-medium px-3 py-1 rounded-full mb-4">
                  {project.category}
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors">
                  {project.title}
                </h3>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  {project.description}
                </p>

                {/* Technologies */}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                      <Zap className="w-4 h-4 mr-2 text-primary-500" />
                      Technologies Used:
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

                {/* Project Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex space-x-4">
                    <button className="flex items-center text-primary-600 hover:text-primary-700 transition-colors">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">View Details</span>
                    </button>
                    <button className="flex items-center text-gray-600 hover:text-gray-700 transition-colors">
                      <Github className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">Code</span>
                    </button>
                  </div>
                  <div className="text-xs text-gray-500">
                    {project.createdAt && new Date(project.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Call to Action */}
        </div>
        </div>
      </div>
    </>
  )
}

export default Projects
