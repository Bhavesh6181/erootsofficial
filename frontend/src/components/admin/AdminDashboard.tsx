import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { LogOut, Users, Package, MessageSquare, Settings, BarChart3, ShoppingCart } from 'lucide-react'
import ServicesManagement from './ServicesManagement'
import ProductsManagement from './ProductsManagement'
import ProjectsManagement from './ProjectsManagement'
import RequestsManagement from './RequestsManagement'
import TestimonialsManagement from './TestimonialsManagement'
import OrdersManagement from './OrdersManagement'
import DashboardStats from './DashboardStats'

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'services', label: 'Services', icon: Settings },
    { id: 'projects', label: 'Projects', icon: MessageSquare },
    { id: 'requests', label: 'Requests', icon: MessageSquare },
    { id: 'testimonials', label: 'Testimonials', icon: Users },
  ]

  const handleLogout = () => {
    logout()
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardStats />
      case 'orders':
        return <OrdersManagement />
      case 'products':
        return <ProductsManagement />
      case 'services':
        return <ServicesManagement />
      case 'projects':
        return <ProjectsManagement />
      case 'requests':
        return <RequestsManagement />
      case 'testimonials':
        return <TestimonialsManagement />
      default:
        return <DashboardStats />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
                <span className="text-gradient">Eroots</span> Admin Dashboard
              </h1>
              <p className="text-sm sm:text-base text-gray-600 truncate">Welcome back, {user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm sm:text-base touch-target focus-ring"
              aria-label="Logout from admin dashboard"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <div className="w-full lg:w-64 bg-white shadow-sm lg:min-h-screen">
          <nav className="mt-4 lg:mt-8">
            <div className="flex flex-wrap lg:flex-col">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 lg:w-full flex items-center justify-center lg:justify-start space-x-2 lg:space-x-3 px-3 lg:px-6 py-3 lg:py-4 text-left transition-colors text-sm lg:text-base touch-target focus-ring rounded-md ${
                      activeTab === tab.id
                        ? 'bg-primary-50 text-primary-700 lg:border-r-2 lg:border-primary-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    aria-label={`Navigate to ${tab.label}`}
                    aria-current={activeTab === tab.id ? 'page' : undefined}
                  >
                    <Icon className="w-4 h-4 lg:w-5 lg:h-5" />
                    <span className="font-medium hidden sm:block">{tab.label}</span>
                    <span className="font-medium sm:hidden">{tab.label.split(' ')[0]}</span>
                  </button>
                )
              })}
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
