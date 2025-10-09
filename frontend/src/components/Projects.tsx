import React from 'react'
import { motion } from 'framer-motion'
import { Project } from '../types'
import { ExternalLink, Github, Zap } from 'lucide-react'

interface ProjectsProps {
  projects: Project[]
}

const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  }

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

  return (
    <section id="projects" className="section-padding bg-gradient-secondary">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            Featured <span className="text-gradient">Projects</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Explore our portfolio of innovative engineering solutions that showcase
            our expertise across various domains.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {projects.map((project, index) => (
            <motion.div
              key={project._id || index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="card p-4 sm:p-6 lg:p-8 group relative overflow-hidden"
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

              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 group-hover:text-primary-600 transition-colors">
                {project.title}
              </h3>

              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
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
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                  <button className="flex items-center text-primary-600 hover:text-primary-700 transition-colors touch-target focus-ring rounded-md px-2 py-1">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">View Details</span>
                  </button>
                  <button className="flex items-center text-gray-600 hover:text-gray-700 transition-colors touch-target focus-ring rounded-md px-2 py-1">
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

      </div>
    </section>
  )
}

export default Projects
