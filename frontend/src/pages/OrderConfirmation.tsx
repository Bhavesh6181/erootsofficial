import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { useLocation, useNavigate } from 'react-router-dom'
import { Calendar, CheckCircle, Download, Mail, MapPin, ShieldCheck, ShoppingBag } from 'lucide-react'
import toast from 'react-hot-toast'
import { Order } from '../types'
import { API_BASE_URL } from '../utils/api'

const buildInvoiceUrl = (invoiceUrl: string) => {
  if (invoiceUrl.startsWith('http://') || invoiceUrl.startsWith('https://')) {
    return invoiceUrl
  }

  const normalizedPath = invoiceUrl.startsWith('/') ? invoiceUrl : `/${invoiceUrl}`
  return `${API_BASE_URL}${normalizedPath}`
}

const OrderConfirmation: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [order, setOrder] = useState<Order | null>(null)
  const [invoiceUrl, setInvoiceUrl] = useState<string | null>(null)
  const [accountCreated, setAccountCreated] = useState(false)
  const [accountDetails, setAccountDetails] = useState<{ email?: string; message?: string } | null>(null)

  useEffect(() => {
    if (!location.state?.order) {
      navigate('/store')
      return
    }

    setOrder(location.state.order)
    setInvoiceUrl(location.state.invoiceUrl || null)
    setAccountCreated(Boolean(location.state.accountCreated))
    setAccountDetails(location.state.accountDetails || null)
  }, [location.state, navigate])

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price)

  const formatDate = (date: Date | string) =>
    new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

  const handleDownloadInvoice = async () => {
    if (!order || !invoiceUrl) {
      return
    }

    try {
      toast.loading('Preparing invoice...', { id: 'invoice-download' })

      const token = localStorage.getItem('eroots-token')
      const response = await fetch(buildInvoiceUrl(invoiceUrl), {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })

      if (!response.ok) {
        throw new Error(`Invoice request failed with status ${response.status}`)
      }

      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = downloadUrl
      anchor.download = `invoice-${order.orderId}.pdf`
      document.body.appendChild(anchor)
      anchor.click()
      window.URL.revokeObjectURL(downloadUrl)
      document.body.removeChild(anchor)

      toast.success('Invoice downloaded successfully.', { id: 'invoice-download' })
    } catch (error) {
      console.error('Error downloading invoice:', error)
      toast.error('Failed to download invoice. Please try again.', { id: 'invoice-download' })
    }
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-primary-600" />
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Order Confirmation - Eroots Technology</title>
        <meta name="description" content="Your order has been placed successfully." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 pt-24 pb-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-green-200 bg-white p-8 shadow-sm"
          >
            <div className="text-center">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
              <h1 className="mt-4 text-3xl font-bold text-gray-900">Order Confirmed</h1>
              <p className="mt-2 text-lg text-gray-600">
                Your order has been placed successfully. We will email the confirmation and invoice access details
                shortly.
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-gray-50 p-4 text-center">
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="mt-1 font-semibold text-gray-900">{order.orderId}</p>
              </div>
              <div className="rounded-2xl bg-gray-50 p-4 text-center">
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="mt-1 font-semibold text-gray-900">{order.paymentMethod}</p>
              </div>
              <div className="rounded-2xl bg-gray-50 p-4 text-center">
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="mt-1 font-semibold text-primary-600">{formatPrice(order.totalAmount)}</p>
              </div>
            </div>
          </motion.div>

          {accountCreated && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 rounded-3xl border border-primary-200 bg-primary-50 p-6 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <ShieldCheck className="mt-1 h-6 w-6 text-primary-700" />
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-primary-900">Order Tracking Account Created</h2>
                  <p className="mt-2 text-sm text-primary-800">
                    {accountDetails?.message ||
                      'A customer account has been created for this order so you can sign in and track future updates.'}
                  </p>
                  {accountDetails?.email && (
                    <p className="mt-2 text-sm text-primary-700">
                      Account email: <span className="font-semibold">{accountDetails.email}</span>
                    </p>
                  )}
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <button
                      onClick={() => navigate('/admin')}
                      className="inline-flex items-center justify-center rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
                    >
                      Sign In to Track Orders
                    </button>
                    <p className="text-sm text-primary-700">
                      Use the first-time access details sent to your email after checkout.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-3xl border border-gray-200 bg-white shadow-sm"
            >
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-xl font-semibold text-gray-900">Order Items</h2>
              </div>

              <div className="divide-y divide-gray-100">
                {order.items.map((item, index) => (
                  <div key={`${item.name}-${index}`} className="flex items-center gap-4 px-6 py-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-16 w-16 rounded-xl border border-gray-200 object-cover"
                      onError={(event) => {
                        event.currentTarget.src = '/images/placeholder-product.jpg'
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <p className="mt-1 text-sm text-gray-600">
                        Quantity: {item.quantity} x {formatPrice(item.price)}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between text-lg font-semibold text-gray-900">
                  <span>Total</span>
                  <span className="text-primary-600">{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            </motion.section>

            <div className="space-y-6">
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-3xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="border-b border-gray-200 px-6 py-4">
                  <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>
                </div>

                <div className="space-y-4 px-6 py-5 text-sm">
                  <div className="flex items-start gap-3">
                    <Calendar className="mt-0.5 h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-gray-500">Order Date</p>
                      <p className="font-medium text-gray-900">{formatDate(order.createdAt!)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-gray-500">Customer Email</p>
                      <p className="font-medium text-gray-900">{order.user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-gray-500">Shipping Address</p>
                      <p className="font-medium text-gray-900">
                        {order.user.address.street}
                        <br />
                        {order.user.address.city}, {order.user.address.state}
                        <br />
                        {order.user.address.pincode}
                        {order.user.address.country ? `, ${order.user.address.country}` : ''}
                      </p>
                    </div>
                  </div>
                  {order.estimatedDelivery && (
                    <div className="rounded-2xl bg-green-50 p-4 text-green-900">
                      <p className="text-sm font-semibold">Estimated Delivery</p>
                      <p className="mt-1 text-sm">{formatDate(order.estimatedDelivery)}</p>
                    </div>
                  )}
                </div>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-3xl border border-blue-200 bg-blue-50 p-5 shadow-sm"
              >
                <h2 className="text-lg font-semibold text-blue-900">What Happens Next</h2>
                <div className="mt-3 space-y-2 text-sm text-blue-900">
                  <p>We will review and begin processing this order within 24 hours.</p>
                  <p>You will receive shipping updates as the order status changes.</p>
                  <p>Invoice access is protected and can be downloaded from the button below.</p>
                  <p>
                    For questions, reply to the confirmation email or contact{' '}
                    <span className="font-semibold">eroots2025@gmail.com</span>.
                  </p>
                </div>
              </motion.section>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center"
          >
            {invoiceUrl && (
              <button
                onClick={handleDownloadInvoice}
                className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-5 py-3 font-semibold text-gray-900 hover:bg-gray-50"
              >
                <Download className="mr-2 h-5 w-5" />
                Download Invoice
              </button>
            )}
            <button
              onClick={() => navigate('/store')}
              className="inline-flex items-center justify-center rounded-xl bg-primary-600 px-5 py-3 font-semibold text-white hover:bg-primary-700"
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Continue Shopping
            </button>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default OrderConfirmation
