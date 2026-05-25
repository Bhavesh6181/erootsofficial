import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import LoginForm from '../components/admin/LoginForm'
import AdminDashboard from '../components/admin/AdminDashboard'

const Admin: React.FC = () => {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()
  const [isLoginLoading, setIsLoginLoading] = useState(false)

  // Redirect regular users to My Orders page
  useEffect(() => {
    if (user && user.role === 'user') {
      navigate('/my-orders')
    }
  }, [user, navigate])

  if (isLoading || isLoginLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <>
        <Helmet>
          <title>Admin Login | Eroots</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                <span className="text-gradient">Eroots</span> Admin
              </h2>
              <p className="text-gray-600">Sign in to access the production admin dashboard.</p>
              <p className="mt-2 text-sm text-gray-500">
                Customer order tracking also uses this sign-in page, but only admin accounts can open the dashboard.
              </p>
            </motion.div>
            
            <LoginForm setIsLoading={setIsLoginLoading} />
          </div>
        </div>
      </>
    )
  }

  // If user is regular user, show redirecting message (they'll be redirected by useEffect)
  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to your orders...</p>
        </div>
      </div>
    )
  }

  // Only render AdminDashboard for admin users
  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Eroots</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <AdminDashboard />
    </>
  )
}

export default Admin
