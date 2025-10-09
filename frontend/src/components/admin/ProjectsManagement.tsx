import React from 'react'
import { motion } from 'framer-motion'
import { FolderOpen, Plus } from 'lucide-react'

const ProjectsManagement: React.FC = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Projects Management</h2>
          <p className="text-gray-600">Manage your project portfolio and showcase your work.</p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Add Project</span>
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center"
      >
        <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Projects Management</h3>
        <p className="text-gray-600">
          This section will allow you to showcase your completed projects, add new ones,
          and manage project details including descriptions, technologies used, and images.
        </p>
      </motion.div>
    </div>
  )
}

export default ProjectsManagement
