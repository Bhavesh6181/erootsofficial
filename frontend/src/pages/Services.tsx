import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Service } from '../types'
import { api } from '../utils/api'

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get('/services')
        setServices(response.data.data)
      } catch (error) {
        console.error('Error fetching services:', error)
        // Set default services if API fails
        setServices([
          {
            title: 'Embedded Systems Development',
            description: 'Custom embedded solutions for your projects with real-time performance and reliability',
            icon: '🔧',
            features: ['Microcontroller Programming', 'Hardware Integration', 'Real-time Systems', 'Firmware Development'],
          },
          {
            title: 'IoT Solutions',
            description: 'Connected devices and smart systems that bring your ideas to life',
            icon: '🌐',
            features: ['Sensor Networks', 'Cloud Integration', 'Data Analytics', 'Remote Monitoring'],
          },
          {
            title: 'PCB Design & Layout',
            description: 'Professional circuit board design with optimized performance and manufacturability',
            icon: '⚡',
            features: ['Schematic Design', 'Layout Optimization', 'Prototyping', 'Manufacturing Support'],
          },
          {
            title: 'Antenna Design & RF',
            description: 'Advanced RF design and optimization for wireless communication systems',
            icon: '📡',
            features: ['RF Simulation', 'Prototyping', 'Testing', 'Performance Optimization'],
          },
          {
            title: 'Web & App Development',
            description: 'Modern web and mobile applications with cutting-edge technology',
            icon: '💻',
            features: ['Frontend Development', 'Backend Services', 'Mobile Apps', 'API Integration'],
          },
          {
            title: 'Electronic Components',
            description: 'High-quality electronic components and modules for your projects',
            icon: '🔌',
            features: ['Microcontrollers', 'Sensors', 'Motors', 'Power Modules'],
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading services...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Services - Eroots Technology</title>
        <meta name="description" content="Professional engineering services including embedded systems, IoT development, PCB design, antenna design, and web development." />
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
                Our <span className="text-gradient">Services</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We provide comprehensive engineering solutions to bring your ideas to life
                with cutting-edge technology and expert craftsmanship.
              </p>
            </motion.div>
          </div>

          {/* Services Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {services.map((service, index) => (
              <motion.div
                key={service._id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 group"
              >
                <div className="text-center">
                  <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  
                  {service.features && service.features.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900 mb-3">Key Features:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {service.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center">
                            <span className="w-2 h-2 bg-primary-500 rounded-full mr-3 flex-shrink-0"></span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
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

export default Services
