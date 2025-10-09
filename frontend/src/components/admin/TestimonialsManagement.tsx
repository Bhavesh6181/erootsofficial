import React from 'react'
import { motion } from 'framer-motion'
import { Users, Star, Plus } from 'lucide-react'

const TestimonialsManagement: React.FC = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Testimonials Management</h2>
          <p className="text-gray-600">Manage client testimonials and reviews.</p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Add Testimonial</span>
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center"
      >
        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Testimonials Management</h3>
        <p className="text-gray-600 mb-6">
          This section will allow you to manage client testimonials, reviews, and feedback.
          You can add new testimonials, edit existing ones, and control which ones are featured.
        </p>
        
        <div className="flex items-center justify-center space-x-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
          ))}
          <span className="text-gray-600 ml-2">Client satisfaction</span>
        </div>
      </motion.div>
    </div>
  )
}

export default TestimonialsManagement
