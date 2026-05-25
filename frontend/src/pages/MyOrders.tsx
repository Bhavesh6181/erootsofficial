import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Package, Eye, Truck, CheckCircle, Clock, XCircle, Download } from 'lucide-react'
import { api, API_BASE_URL } from '../utils/api'
import { Order } from '../types'
import toast from 'react-hot-toast'

const MyOrders: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/admin') // Redirect to login
      return
    }
    fetchOrders()
  }, [user, navigate])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await api.get('/orders/my-orders')
      if (response.data.success) {
        setOrders(response.data.data)
      }
    } catch (error) {
      toast.error('Failed to fetch your orders')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleDownloadInvoice = async (order: Order) => {
    try {
      toast.loading('Preparing invoice...', { id: 'invoice-download' })

      const response = await fetch(`${API_BASE_URL}/orders/${order._id}/invoice`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('eroots-token')}`
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to download invoice: ${response.status}`)
      }

      const blob = await response.blob()

      if (blob.size === 0) {
        throw new Error('Received empty PDF file')
      }

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `invoice-${order.orderId}.pdf`
      document.body.appendChild(a)
      a.click()

      setTimeout(() => {
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }, 100)

      toast.success('Invoice downloaded successfully!', { id: 'invoice-download' })
    } catch (error) {
      toast.error(`Failed to download invoice: ${error instanceof Error ? error.message : 'Unknown error'}`, { id: 'invoice-download' })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5" />
      case 'confirmed':
      case 'processing':
        return <Package className="w-5 h-5" />
      case 'shipped':
        return <Truck className="w-5 h-5" />
      case 'delivered':
        return <CheckCircle className="w-5 h-5" />
      case 'cancelled':
        return <XCircle className="w-5 h-5" />
      default:
        return <Package className="w-5 h-5" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'processing':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order)
    setShowDetailsModal(true)
  }

  const handleCloseModal = () => {
    setShowDetailsModal(false)
    setSelectedOrder(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>My Orders - Eroots Technology</title>
        <meta name="description" content="Track and manage your orders" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 pt-20 sm:pt-24 pb-12">
        <div className="max-w-7xl mx-auto mobile-padding">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
            <p className="text-gray-600">Track and manage your orders</p>
          </div>

          {/* Orders List */}
          {orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center"
            >
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h3>
              <p className="text-gray-600 mb-6">
                You haven't placed any orders yet. Start shopping to see your orders here!
              </p>
              <button
                onClick={() => navigate('/store')}
                className="btn-primary touch-target focus-ring"
                aria-label="Go to store to browse products"
              >
                Browse Products
              </button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {orders.map((order, index) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      {/* Order Info */}
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Order #{order.orderId}
                          </h3>
                          <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(order.orderStatus)} flex items-center gap-1 w-fit`}>
                            {getStatusIcon(order.orderStatus)}
                            {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                          <div className="space-y-1">
                            <p className="text-gray-600">Order Date: <span className="font-medium text-gray-900">{formatDate(order.createdAt!)}</span></p>
                            <p className="text-gray-600">Items: <span className="font-medium text-gray-900">{order.items.length} product(s)</span></p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-gray-600">Total: <span className="font-semibold text-primary-600">{formatPrice(order.totalAmount)}</span></p>
                            <p className="text-gray-600">Payment: <span className="font-medium text-gray-900">{order.paymentMethod}</span></p>
                          </div>
                        </div>

                        {order.estimatedDelivery && (
                          <div className="mt-3 flex items-center text-sm text-gray-600">
                            <Truck className="w-4 h-4 mr-2" />
                            <span>Estimated Delivery: <span className="font-medium">{formatDate(order.estimatedDelivery)}</span></span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => handleViewDetails(order)}
                          className="btn-secondary flex items-center justify-center touch-target focus-ring"
                          aria-label={`View details for order ${order.orderId}`}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </button>
                        <button
                          onClick={() => handleDownloadInvoice(order)}
                          className="btn-primary flex items-center justify-center text-sm touch-target focus-ring"
                          aria-label={`Download invoice for order ${order.orderId}`}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Invoice
                        </button>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex flex-wrap gap-2">
                        {order.items.slice(0, 3).map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-10 h-10 object-cover rounded"
                            />
                            <div className="text-sm">
                              <p className="font-medium text-gray-900 truncate max-w-[150px]">{item.name}</p>
                              <p className="text-gray-600">Qty: {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="flex items-center justify-center bg-gray-100 px-4 py-2 rounded-lg text-sm text-gray-600">
                            +{order.items.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Order Details Modal */}
        {showDetailsModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
                <div>
                  <h2 id="modal-title" className="text-2xl font-bold text-gray-900">Order Details</h2>
                  <p className="text-gray-600 text-sm mt-1">#{selectedOrder.orderId}</p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors touch-target focus-ring rounded-md p-1"
                  aria-label="Close order details modal"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Status */}
                <div className="flex flex-wrap gap-3">
                  <div>
                    <span className="text-xs text-gray-600 block mb-1">Order Status</span>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(selectedOrder.orderStatus)} flex items-center gap-1 w-fit`}>
                      {getStatusIcon(selectedOrder.orderStatus)}
                      {selectedOrder.orderStatus.charAt(0).toUpperCase() + selectedOrder.orderStatus.slice(1)}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-600 block mb-1">Payment Method</span>
                    <span className="px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-800 border border-gray-200 block">
                      {selectedOrder.paymentMethod}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Package className="w-5 h-5 mr-2" />
                    Order Items
                  </h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 bg-gray-50 rounded-lg p-4"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{formatPrice(item.price)}</p>
                          <p className="text-sm text-gray-600">per item</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-primary-600">{formatPrice(item.price * item.quantity)}</p>
                          <p className="text-sm text-gray-600">subtotal</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium text-gray-900">{formatPrice(selectedOrder.totalAmount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium text-gray-900">Free</span>
                    </div>
                    <div className="border-t border-gray-300 pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold text-gray-900">Total</span>
                        <span className="text-lg font-bold text-primary-600">{formatPrice(selectedOrder.totalAmount)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Order Date</p>
                    <p className="font-medium text-gray-900">{formatDate(selectedOrder.createdAt!)}</p>
                  </div>
                  {selectedOrder.estimatedDelivery && (
                    <div>
                      <p className="text-gray-600">Estimated Delivery</p>
                      <p className="font-medium text-gray-900">{formatDate(selectedOrder.estimatedDelivery)}</p>
                    </div>
                  )}
                  {selectedOrder.trackingNumber && (
                    <div className="md:col-span-2">
                      <p className="text-gray-600">Tracking Number</p>
                      <p className="font-medium text-gray-900">{selectedOrder.trackingNumber}</p>
                    </div>
                  )}
                  {selectedOrder.deliveryInstructions && (
                    <div className="md:col-span-2">
                      <p className="text-gray-600">Delivery Instructions</p>
                      <p className="font-medium text-gray-900">{selectedOrder.deliveryInstructions}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex justify-between gap-4">
                <button
                  onClick={() => handleDownloadInvoice(selectedOrder)}
                  className="btn-secondary flex items-center justify-center touch-target focus-ring"
                  aria-label={`Download invoice for order ${selectedOrder.orderId}`}
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Invoice
                </button>
                <button
                  onClick={handleCloseModal}
                  className="btn-primary touch-target focus-ring"
                  aria-label="Close modal"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </>
  )
}

export default MyOrders

