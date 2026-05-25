import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Users, Zap, Target } from 'lucide-react'

const Hero: React.FC = () => {
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

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-white to-primary-50 pt-16 sm:pt-20"
      aria-labelledby="hero-heading"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 sm:-top-40 sm:-right-40 w-60 h-60 sm:w-96 sm:h-96 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute -bottom-20 -left-20 sm:-bottom-40 sm:-left-40 w-60 h-60 sm:w-96 sm:h-96 bg-gradient-to-br from-secondary-400 to-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-20 left-1/2 sm:top-40 w-60 h-60 sm:w-96 sm:h-96 bg-gradient-to-br from-primary-300 to-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="container-custom relative z-10 px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-5xl mx-auto"
        >
          <motion.div variants={itemVariants} className="mb-4 sm:mb-6">
            <span className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium bg-primary-100 text-primary-800">
              <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
              <span className="hidden xs:inline">Smart Systems. Smarter Engineering.</span>
              <span className="xs:hidden">Smart Engineering</span>
            </span>
          </motion.div>

          <motion.h1
            id="hero-heading"
            variants={itemVariants}
            className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 sm:mb-8 px-2 leading-tight"
          >
            <span className="text-gradient block mb-2 tracking-tight">From Essential Components</span>
            <span className="text-gradient block tracking-tight">to Complete Project Solutions</span>
          </motion.h1>

          <motion.div
            variants={itemVariants}
            className="mb-8 sm:mb-10"
          >
            <div className="w-16 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto mb-6 rounded-full"></div>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed px-4 font-light">
              High-quality components and end-to-end project solutions designed for
              <span className="text-primary-600 font-medium"> innovation</span> and
              <span className="text-primary-600 font-medium"> reliability</span>.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-8 sm:mb-12 px-4"
          >
            <Link
              to="/store"
              className="btn-primary inline-flex items-center group w-full sm:w-auto justify-center text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 focus-ring touch-target"
              aria-label="Shop electronic components"
            >
              Shop Components
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/#contact"
              className="btn-secondary inline-flex items-center group w-full sm:w-auto justify-center text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 font-semibold rounded-xl border-2 hover:shadow-lg transition-all duration-300 focus-ring touch-target"
              aria-label="Start a new project with us"
            >
              Start a Project
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-2xl mx-auto px-4"
          >
            <div className="glass-card text-center p-6">
              <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full mx-auto mb-3 sm:mb-4 shadow-lg shadow-primary-500/30">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">900+</div>
              <div className="text-sm sm:text-base text-gray-600 font-medium">Happy Clients</div>
            </div>
            <div className="glass-card text-center p-6">
              <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full mx-auto mb-3 sm:mb-4 shadow-lg shadow-primary-500/30">
                <Target className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">500+</div>
              <div className="text-sm sm:text-base text-gray-600 font-medium">Projects Completed</div>
            </div>
            <div className="glass-card text-center p-6">
              <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full mx-auto mb-3 sm:mb-4 shadow-lg shadow-primary-500/30">
                <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">5+</div>
              <div className="text-sm sm:text-base text-gray-600 font-medium">Component Deliveries</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

    </section>
  )
}

export default Hero
