import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CreditCard, Mail, MapPin, Phone, ShieldCheck, User } from 'lucide-react'
import toast from 'react-hot-toast'
import { useCart } from '../contexts/CartContext'
import { api } from '../utils/api'
import { enabledPaymentMethods } from '../utils/runtime'
import { UserInfo } from '../types'

const checkoutSupportsCod = enabledPaymentMethods.includes('COD')

const Checkout: React.FC = () => {
  const { cart, getTotalPrice, clearCart } = useCart()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [fetchingLocation, setFetchingLocation] = useState(false)
  const [deliveryInstructions, setDeliveryInstructions] = useState('')
  const [userInfo, setUserInfo] = useState<UserInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India',
    },
  })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/store')
    }
  }, [cart.length, navigate])

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price)

  const validateMobileNumber = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '')
    const indianMobileRegex = /^[6-9]\d{9}$/

    return {
      isValid: indianMobileRegex.test(cleanPhone),
      clean: cleanPhone,
    }
  }

  const handleInputChange = (field: string, value: string) => {
    if (field === 'phone') {
      const cleanValue = value.replace(/\D/g, '').slice(0, 10)
      setUserInfo((prev) => ({
        ...prev,
        phone: cleanValue,
      }))
      return
    }

    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setUserInfo((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof UserInfo] as Record<string, string>),
          [child]: value,
        },
      }))
      return
    }

    setUserInfo((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const fetchCurrentLocation = async () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported in this browser.')
      return
    }

    setFetchingLocation(true)
    toast.loading('Fetching your current location...', { id: 'location' })

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
            {
              headers: {
                Accept: 'application/json',
                'User-Agent': 'Eroots-Checkout',
              },
            }
          )

          if (!response.ok) {
            throw new Error('Reverse geocoding failed')
          }

          const data = await response.json()
          const address = data?.address

          if (!address) {
            throw new Error('Address not found')
          }

          setUserInfo((prev) => ({
            ...prev,
            address: {
              street: address.road || address.street || address.neighbourhood || address.suburb || '',
              city: address.city || address.town || address.village || address.county || '',
              state: address.state || address.region || '',
              pincode: address.postcode || '',
              country: 'India',
            },
          }))

          toast.success('Address fields updated from your current location.', { id: 'location' })
        } catch (error) {
          console.error('Error fetching address:', error)
          toast.error('Could not convert your location to an address. Please enter it manually.', {
            id: 'location',
          })
        } finally {
          setFetchingLocation(false)
        }
      },
      (error) => {
        console.error('Geolocation error:', error)

        const messages = {
          [error.PERMISSION_DENIED]: 'Location permission was denied.',
          [error.POSITION_UNAVAILABLE]: 'Your location is currently unavailable.',
          [error.TIMEOUT]: 'Location request timed out.',
        }

        toast.error(messages[error.code] || 'Failed to detect your location.', {
          id: 'location',
        })
        setFetchingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    )
  }

  const validateForm = () => {
    const { firstName, lastName, email, phone, address } = userInfo

    if (!checkoutSupportsCod) {
      toast.error('Checkout is currently unavailable. Please contact support before placing an order.')
      return false
    }

    if (!firstName.trim()) {
      toast.error('Please enter your first name.')
      return false
    }

    if (!lastName.trim()) {
      toast.error('Please enter your last name.')
      return false
    }

    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid email address.')
      return false
    }

    if (!phone.trim()) {
      toast.error('Please enter your phone number.')
      return false
    }

    if (!validateMobileNumber(phone).isValid) {
      toast.error('Please enter a valid 10-digit Indian mobile number.')
      return false
    }

    if (!address.street.trim() || !address.city.trim() || !address.state.trim() || !address.pincode.trim()) {
      toast.error('Please complete your shipping address.')
      return false
    }

    if (!/^\d{6}$/.test(address.pincode)) {
      toast.error('Please enter a valid 6-digit pincode.')
      return false
    }

    if (cart.some((item) => !item.product._id)) {
      toast.error('One or more cart items are invalid. Please refresh your cart and try again.')
      navigate('/cart')
      return false
    }

    return true
  }

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const response = await api.post('/orders', {
        user: {
          ...userInfo,
          name: `${userInfo.firstName} ${userInfo.lastName}`.trim(),
        },
        items: cart.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
        totalAmount: getTotalPrice(),
        paymentMethod: 'COD',
        deliveryInstructions,
      })

      if (!response.data.success) {
        throw new Error(response.data.message || 'Order could not be created')
      }

      const { order, invoiceUrl, accountCreated, accountDetails } = response.data.data

      clearCart()
      toast.success('Order placed successfully.')

      navigate('/order-confirmation', {
        state: {
          order,
          invoiceUrl,
          accountCreated,
          accountDetails,
        },
      })
    } catch (error: any) {
      console.error('Error placing order:', error)
      toast.error(error.response?.data?.message || 'Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    return null
  }

  return (
    <>
      <Helmet>
        <title>Checkout - Eroots Technology</title>
        <meta name="description" content="Secure checkout for your Eroots order." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 pt-20 sm:pt-24 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 sm:mb-8">
            <button
              onClick={() => navigate('/cart')}
              className="inline-flex items-center rounded-md px-2 py-1 text-sm sm:text-base text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Back to Cart
            </button>
            <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-gray-900">Checkout</h1>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              Review your delivery details and place your order securely.
            </p>
          </div>

          {!checkoutSupportsCod && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              Checkout is currently unavailable. Please contact support before placing an order.
            </div>
          )}

          <div className="lg:grid lg:grid-cols-12 lg:gap-x-10">
            <div className="lg:col-span-8">
              <div className="space-y-6">
                <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                  <div className="border-b border-gray-200 px-4 py-4 sm:px-6">
                    <h2 className="flex items-center text-base sm:text-lg font-semibold text-gray-900">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Contact Information
                    </h2>
                  </div>

                  <div className="px-4 py-5 sm:px-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                        <input
                          type="text"
                          value={userInfo.firstName}
                          onChange={(event) => handleInputChange('firstName', event.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Enter your first name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                        <input
                          type="text"
                          value={userInfo.lastName}
                          onChange={(event) => handleInputChange('lastName', event.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Enter your last name"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          <input
                            type="email"
                            value={userInfo.email}
                            onChange={(event) => handleInputChange('email', event.target.value)}
                            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Enter your email"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          <input
                            type="tel"
                            value={userInfo.phone}
                            onChange={(event) => handleInputChange('phone', event.target.value)}
                            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="9876543210"
                            maxLength={10}
                          />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">Enter a 10-digit Indian mobile number.</p>
                        {userInfo.phone && (
                          <p
                            className={`mt-1 text-xs ${
                              validateMobileNumber(userInfo.phone).isValid ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {validateMobileNumber(userInfo.phone).isValid ? 'Valid mobile number' : 'Invalid mobile number'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                  <div className="border-b border-gray-200 px-4 py-4 sm:px-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <h2 className="flex items-center text-base sm:text-lg font-semibold text-gray-900">
                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Shipping Address
                      </h2>
                      <button
                        type="button"
                        onClick={fetchCurrentLocation}
                        disabled={fetchingLocation}
                        className="inline-flex items-center justify-center rounded-lg border border-primary-200 bg-primary-50 px-3 py-2 text-sm font-medium text-primary-700 hover:bg-primary-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <MapPin className="w-4 h-4 mr-2" />
                        {fetchingLocation ? 'Detecting...' : 'Use Current Location'}
                      </button>
                    </div>
                  </div>

                  <div className="px-4 py-5 sm:px-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                      <input
                        type="text"
                        value={userInfo.address.street}
                        onChange={(event) => handleInputChange('address.street', event.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="House number, street, area"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                        <input
                          type="text"
                          value={userInfo.address.city}
                          onChange={(event) => handleInputChange('address.city', event.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Enter your city"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                        <input
                          type="text"
                          value={userInfo.address.state}
                          onChange={(event) => handleInputChange('address.state', event.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Enter your state"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                        <input
                          type="text"
                          value={userInfo.address.pincode}
                          onChange={(event) => handleInputChange('address.pincode', event.target.value.replace(/\D/g, '').slice(0, 6))}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Enter pincode"
                          maxLength={6}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Delivery Instructions
                      </label>
                      <textarea
                        value={deliveryInstructions}
                        onChange={(event) => setDeliveryInstructions(event.target.value)}
                        rows={3}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Gate number, landmark, or any helpful note for delivery."
                      />
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                  <div className="border-b border-gray-200 px-4 py-4 sm:px-6">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900">Payment Method</h2>
                  </div>

                  <div className="px-4 py-5 sm:px-6">
                    <div className="rounded-2xl border-2 border-primary-200 bg-primary-50 p-5">
                      <div className="flex items-start gap-4">
                        <div className="rounded-xl bg-white p-3 text-primary-700 shadow-sm">
                          <CreditCard className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-base font-semibold text-gray-900">Cash on Delivery</h3>
                          <p className="mt-1 text-sm text-gray-600">
                            Pay when the order reaches you.
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2 text-xs">
                            <span className="rounded-full bg-white px-3 py-1 text-green-700 ring-1 ring-green-200">
                              No prepayment required
                            </span>
                            <span className="rounded-full bg-white px-3 py-1 text-gray-700 ring-1 ring-gray-200">
                              Secure invoice link included
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>

            <div className="mt-8 lg:mt-0 lg:col-span-4">
              <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 px-6 py-4">
                  <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
                </div>

                <div className="px-6 py-5">
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={item.product._id} className="flex items-center gap-3">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="h-12 w-12 rounded-lg border border-gray-200 object-cover"
                          onError={(event) => {
                            event.currentTarget.src = '/images/placeholder-product.jpg'
                          }}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-gray-900">{item.product.name}</p>
                          <p className="text-sm text-gray-600">
                            Qty: {item.quantity} x {formatPrice(item.product.price)}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 space-y-2 border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-medium text-gray-900">{formatPrice(getTotalPrice())}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Shipping</span>
                      <span className="font-medium text-green-600">Free</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-200 pt-2 text-lg font-semibold text-gray-900">
                      <span>Total</span>
                      <span className="text-primary-600">{formatPrice(getTotalPrice())}</span>
                    </div>
                  </div>

                  <div className="mt-5 rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="mt-0.5 h-4 w-4 text-primary-600" />
                      <p>
                        We will confirm your order details and share your invoice after checkout.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading || !checkoutSupportsCod}
                    className="mt-6 w-full rounded-xl bg-primary-600 px-4 py-3 text-base font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? 'Placing Order...' : `Place Order (${formatPrice(getTotalPrice())})`}
                  </button>

                  <p className="mt-4 text-center text-sm text-gray-600">
                    Cash on Delivery only. Estimated delivery window: 5 to 7 days.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Checkout
