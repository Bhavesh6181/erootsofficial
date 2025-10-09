import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { useLocation, useNavigate } from 'react-router-dom'
import { CheckCircle, Download, ShoppingBag, MapPin, Phone, Mail, Calendar } from 'lucide-react'
import { Order } from '../types'
import toast from 'react-hot-toast'
import { API_BASE_URL } from '../utils/api'

const OrderConfirmation: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [order, setOrder] = useState<Order | null>(null)
  const [invoiceUrl, setInvoiceUrl] = useState<string | null>(null)
  const [accountCreated, setAccountCreated] = useState(false)
  const [accountDetails, setAccountDetails] = useState<any>(null)

  useEffect(() => {
    if (location.state?.order) {
      setOrder(location.state.order)
      setInvoiceUrl(location.state.invoiceUrl)
      setAccountCreated(location.state.accountCreated || false)
      setAccountDetails(location.state.accountDetails || null)
    } else {
      // If no order data, redirect to store
      navigate('/store')
    }
  }, [location.state, navigate])

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
      month: 'long',
      day: 'numeric'
    })
  }

  const handleDownloadInvoice = async () => {
    if (!order || !invoiceUrl) return

    try {
      toast.loading('Preparing invoice...', { id: 'invoice-download' })
      const response = await fetch(`${API_BASE_URL}${invoiceUrl}`)
      
      if (!response.ok) {
        throw new Error('Failed to download invoice')
      }
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `invoice-${order.orderId}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('Invoice downloaded successfully!', { id: 'invoice-download' })
    } catch (error) {
      console.error('Error downloading invoice:', error)
      toast.error('Failed to download invoice', { id: 'invoice-download' })
    }
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Order Confirmation - Eroots Technology</title>
        <meta name="description" content="Your order has been placed successfully" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 pt-24 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-lg text-gray-600">
              Thank you for your order. We'll send you a confirmation email shortly.
            </p>
          </motion.div>

          {/* Account Creation Alert */}
          {accountCreated && accountDetails && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-r from-primary-50 to-primary-100 border-2 border-primary-300 rounded-lg p-6 mb-8"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-8 w-8 text-primary-600" />
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-semibold text-primary-900 mb-2">
                    🎉 Account Created Successfully!
                  </h3>
                  <p className="text-primary-800 mb-3">
                    We've created an account for you with email: <strong>{accountDetails.email}</strong>
                  </p>
                  <p className="text-sm text-primary-700 mb-3">
                    Check your email for your login credentials. You can now track your orders and manage your profile!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 mt-4">
                    <button
                      onClick={() => navigate('/my-orders')}
                      className="inline-flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                    >
                      View My Orders
                    </button>
                    <div className="text-sm text-primary-700 flex items-center">
                      <span>💡 Use the credentials sent to your email to log in</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Order Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm border mb-8"
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>
            </div>
            <div className="px-6 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Order Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order ID:</span>
                      <span className="font-medium">{order.orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Date:</span>
                      <span className="font-medium">{formatDate(order.createdAt!)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="font-medium">{order.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Status:</span>
                      <span className="font-medium capitalize text-primary-600">{order.orderStatus}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estimated Delivery:</span>
                      <span className="font-medium">{formatDate(order.estimatedDelivery!)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Customer Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <span className="text-gray-600 w-16">Name:</span>
                      <span className="font-medium">{order.user.name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 w-16">Email:</span>
                      <span className="font-medium">{order.user.email}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 w-16">Phone:</span>
                      <span className="font-medium">{order.user.phone}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-600 w-16">Address:</span>
                      <span className="font-medium">
                        {order.user.address.street},<br />
                        {order.user.address.city}, {order.user.address.state}<br />
                        {order.user.address.pincode}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Order Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow-sm border mb-8"
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Order Items ({order.items.length})
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {order.items.map((item, index) => (
                <div key={index} className="px-6 py-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded border"
                      onError={(e) => {
                        e.currentTarget.src = '/images/placeholder-product.jpg'
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
                <span className="text-xl font-bold text-primary-600">
                  {formatPrice(order.totalAmount)}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Payment Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-lg shadow-sm border mb-8"
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Payment Information</h2>
            </div>
            <div className="px-6 py-6">
              {order.paymentMethod === 'COD' ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                    <div>
                      <h3 className="font-medium text-green-900">Cash on Delivery (COD)</h3>
                      <p className="text-sm text-green-700 mt-1">
                        You will pay <strong>{formatPrice(order.totalAmount)}</strong> when your order is delivered.
                        Please keep the exact amount ready for the delivery person.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900">Payment Status</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Payment will be processed when your order is confirmed.
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            {invoiceUrl && (
              <button
                onClick={handleDownloadInvoice}
                className="btn-secondary inline-flex items-center justify-center"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Invoice
              </button>
            )}
            <button
              onClick={() => navigate('/store')}
              className="btn-primary inline-flex items-center justify-center"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Continue Shopping
            </button>
          </motion.div>

          {/* Delivery Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6"
          >
            <h3 className="font-medium text-blue-900 mb-3">What's Next?</h3>
            <div className="space-y-2 text-sm text-blue-800">
              <p>• You will receive an order confirmation email shortly</p>
              <p>• We'll start processing your order within 24 hours</p>
              <p>• You'll receive tracking information once your order ships</p>
              <p>• Estimated delivery: {formatDate(order.estimatedDelivery!)}</p>
              <p>• For any questions, contact us at support@eroots.com</p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default OrderConfirmation
