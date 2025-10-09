import React from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, CheckCircle, Clock } from 'lucide-react'

const RequestsManagement: React.FC = () => {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Project Requests</h2>
        <p className="text-gray-600">Manage incoming project requests and client inquiries.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center"
      >
        <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Project Requests Management</h3>
        <p className="text-gray-600 mb-6">
          This section will display all incoming project requests from the contact form.
          You'll be able to view details, update status, and respond to clients.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <div className="bg-blue-50 p-4 rounded-lg">
            <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-semibold text-blue-900">Pending</h4>
            <p className="text-sm text-blue-700">New requests awaiting review</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <MessageSquare className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <h4 className="font-semibold text-yellow-900">In Review</h4>
            <p className="text-sm text-yellow-700">Requests being evaluated</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-semibold text-green-900">Completed</h4>
            <p className="text-sm text-green-700">Successfully processed</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default RequestsManagement
