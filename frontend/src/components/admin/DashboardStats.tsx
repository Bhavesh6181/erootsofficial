import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, MessageSquare, Package, ShoppingCart, TrendingUp, Wrench } from 'lucide-react'
import { api } from '../../utils/api'
import { Project, ProjectRequest, Testimonial } from '../../types'

interface DashboardStatsProps {
  onSelectTab?: (tabId: string) => void
}

interface Stats {
  totalServices: number
  totalProducts: number
  totalProjects: number
  totalRequests: number
  pendingRequests: number
  totalTestimonials: number
  totalOrders: number
  featuredProjects: number
  featuredTestimonials: number
}

const emptyStats: Stats = {
  totalServices: 0,
  totalProducts: 0,
  totalProjects: 0,
  totalRequests: 0,
  pendingRequests: 0,
  totalTestimonials: 0,
  totalOrders: 0,
  featuredProjects: 0,
  featuredTestimonials: 0,
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ onSelectTab }) => {
  const [stats, setStats] = useState<Stats>(emptyStats)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [servicesRes, productsRes, projectsRes, requestsRes, testimonialsRes, ordersRes] = await Promise.all([
          api.get('/services'),
          api.get('/products'),
          api.get('/projects'),
          api.get('/requests'),
          api.get('/testimonials'),
          api.get('/orders?limit=1'),
        ])

        const projects = projectsRes.data.data as Project[]
        const requests = requestsRes.data.data as ProjectRequest[]
        const testimonials = testimonialsRes.data.data as Testimonial[]

        setStats({
          totalServices: servicesRes.data.data.length,
          totalProducts: productsRes.data.data.length,
          totalProjects: projects.length,
          totalRequests: requests.length,
          pendingRequests: requests.filter((request) => request.status === 'pending').length,
          totalTestimonials: testimonials.length,
          totalOrders: ordersRes.data.pagination?.total ?? ordersRes.data.data.length,
          featuredProjects: projects.filter((project) => project.featured).length,
          featuredTestimonials: testimonials.filter((testimonial) => testimonial.featured).length,
        })
        setLoadError(null)
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
        setStats(emptyStats)
        setLoadError('Dashboard metrics could not be loaded. Check API connectivity and admin access.')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      title: 'Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      title: 'Products',
      value: stats.totalProducts,
      icon: Package,
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
    },
    {
      title: 'Services',
      value: stats.totalServices,
      icon: Wrench,
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
    },
    {
      title: 'Requests',
      value: stats.totalRequests,
      icon: MessageSquare,
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
    },
  ]

  const quickActions = [
    {
      label: 'Review Pending Requests',
      description: `${stats.pendingRequests} leads waiting for action`,
      tabId: 'requests',
      accent: 'bg-amber-50 text-amber-900',
    },
    {
      label: 'Manage Orders',
      description: `${stats.totalOrders} orders recorded`,
      tabId: 'orders',
      accent: 'bg-blue-50 text-blue-900',
    },
    {
      label: 'Update Store Catalog',
      description: `${stats.totalProducts} active products`,
      tabId: 'products',
      accent: 'bg-green-50 text-green-900',
    },
    {
      label: 'Refresh Portfolio',
      description: `${stats.featuredProjects} featured project(s) live`,
      tabId: 'projects',
      accent: 'bg-purple-50 text-purple-900',
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
        <p className="text-gray-600">Live operational metrics from the current production data set.</p>
      </div>

      {loadError && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {loadError}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`rounded-xl p-3 ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.textColor}`} />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          <div className="mt-4 grid gap-3">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => onSelectTab?.(action.tabId)}
                className={`rounded-xl px-4 py-4 text-left transition hover:opacity-90 ${action.accent}`}
              >
                <p className="font-semibold">{action.label}</p>
                <p className="mt-1 text-sm opacity-80">{action.description}</p>
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">Publishing Snapshot</h3>
          </div>

          <div className="mt-5 space-y-4">
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Pending Requests</p>
              <p className="mt-1 text-xl font-semibold text-gray-900">{stats.pendingRequests}</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Featured Projects</p>
              <p className="mt-1 text-xl font-semibold text-gray-900">{stats.featuredProjects}</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Featured Testimonials</p>
              <p className="mt-1 text-xl font-semibold text-gray-900">{stats.featuredTestimonials}</p>
            </div>
            <div className="rounded-xl bg-primary-50 p-4 text-primary-900">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <p className="text-sm font-semibold">Production note</p>
              </div>
              <p className="mt-2 text-sm">
                This dashboard no longer falls back to demo counts. If data is missing here, the admin team sees it
                immediately instead of a fake healthy state.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default DashboardStats
