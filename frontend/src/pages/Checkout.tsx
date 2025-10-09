import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { useCart } from '../contexts/CartContext'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CreditCard, Smartphone, Building2, MapPin, Phone, Mail, User } from 'lucide-react'
import { api } from '../utils/api'
import toast from 'react-hot-toast'
import { Order, UserInfo } from '../types'

const Checkout: React.FC = () => {
  const { cart, getTotalPrice, getTotalItems, clearCart } = useCart()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI'>('COD')

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0)
  }, [])

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
      country: 'India'
    }
  })

  const [deliveryInstructions, setDeliveryInstructions] = useState('')
  const [fetchingLocation, setFetchingLocation] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  // Mobile number validation for Indian numbers
  const validateMobileNumber = (phone: string) => {
    // Remove all non-digit characters
    const cleanPhone = phone.replace(/\D/g, '')
    
    // Check if it's a valid Indian mobile number
    // Indian mobile numbers: 10 digits starting with 6, 7, 8, or 9
    const indianMobileRegex = /^[6-9]\d{9}$/
    
    return {
      isValid: indianMobileRegex.test(cleanPhone),
      formatted: cleanPhone.length === 10 ? `+91 ${cleanPhone.slice(0, 5)} ${cleanPhone.slice(5)}` : cleanPhone,
      clean: cleanPhone
    }
  }

  const handleInputChange = (field: string, value: string) => {
    // Special handling for phone number
    if (field === 'phone') {
      // Only allow digits and limit to 10 digits
      const cleanValue = value.replace(/\D/g, '').slice(0, 10)
      setUserInfo(prev => ({
        ...prev,
        [field]: cleanValue
      }))
      return
    }

    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setUserInfo(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof UserInfo],
          [child]: value
        }
      }))
    } else {
      setUserInfo(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const fetchCurrentLocation = async () => {
    if (!navigator.geolocation) {
      toast.error('❌ Geolocation is not supported by your browser')
      return
    }

    setFetchingLocation(true)
    
    // Step 1: Request location permission
    toast.loading('📍 Requesting location permission...', { id: 'location' })

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        
        // Step 2: Got coordinates
        toast.loading(`📡 Got coordinates (${latitude.toFixed(4)}, ${longitude.toFixed(4)})\n🔄 Converting to address...`, { id: 'location' })
        
        try {
          // Step 3: Reverse geocoding
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
            {
              headers: {
                'Accept': 'application/json',
                'User-Agent': 'Eroots-Checkout' // Required by Nominatim
              }
            }
          )
          
          if (!response.ok) {
            throw new Error('Failed to fetch address from coordinates')
          }
          
          // Step 4: Parsing address
          toast.loading('🗺️ Parsing address details...', { id: 'location' })
          
          const data = await response.json()
          
          if (data && data.address) {
            const address = data.address
            
            // Extract address components
            const street = address.road || address.street || address.neighbourhood || address.suburb || ''
            const city = address.city || address.town || address.village || address.county || ''
            const state = address.state || address.region || ''
            const pincode = address.postcode || ''
            
            // Step 5: Filling form
            toast.loading('✍️ Auto-filling address fields...', { id: 'location' })
            
            // Small delay to show the message
            await new Promise(resolve => setTimeout(resolve, 300))
            
            // Update user info with fetched location
            setUserInfo(prev => ({
              ...prev,
              address: {
                street: street,
                city: city,
                state: state,
                pincode: pincode,
                country: 'India'
              }
            }))
            
            // Success message with details
            const locationSummary = [city, state].filter(Boolean).join(', ')
            toast.success(
              `✅ Address auto-filled successfully!\n📍 ${locationSummary || 'Location detected'}`,
              { 
                id: 'location',
                duration: 4000,
                style: {
                  minWidth: '300px'
                }
              }
            )
          } else {
            toast.error('❌ Could not determine address from your location', { id: 'location' })
          }
        } catch (error) {
          console.error('Error fetching address:', error)
          toast.error('❌ Failed to convert location to address. Please enter manually.', { id: 'location' })
        } finally {
          setFetchingLocation(false)
        }
      },
      (error) => {
        console.error('Geolocation error:', error)
        
        let errorMessage = '❌ Failed to get your location'
        let errorDetails = ''
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = '🚫 Location Permission Denied'
            errorDetails = 'Please enable location access in your browser settings and try again.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = '📍 Location Unavailable'
            errorDetails = 'Your device could not determine your location. Please enter address manually.'
            break
          case error.TIMEOUT:
            errorMessage = '⏱️ Location Request Timed Out'
            errorDetails = 'Taking too long to get location. Please try again or enter manually.'
            break
        }
        
        toast.error(`${errorMessage}\n${errorDetails}`, { 
          id: 'location',
          duration: 5000,
          style: {
            minWidth: '300px'
          }
        })
        setFetchingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 15000, // Increased timeout
        maximumAge: 0
      }
    )
  }

  const validateForm = () => {
    const { firstName, lastName, email, phone, address } = userInfo
    
    if (!firstName.trim()) {
      toast.error('Please enter your first name')
      return false
    }
    if (!lastName.trim()) {
      toast.error('Please enter your last name')
      return false
    }
    if (!email.trim()) {
      toast.error('Please enter your email')
      return false
    }
    if (!email.includes('@')) {
      toast.error('Please enter a valid email')
      return false
    }
    if (!phone.trim()) {
      toast.error('Please enter your phone number')
      return false
    }
    
    // Validate mobile number using our validation function
    const phoneValidation = validateMobileNumber(phone)
    if (!phoneValidation.isValid) {
      toast.error('Please enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9)')
      return false
    }
    
    if (!address.street.trim()) {
      toast.error('Please enter your street address')
      return false
    }
    if (!address.city.trim()) {
      toast.error('Please enter your city')
      return false
    }
    if (!address.state.trim()) {
      toast.error('Please enter your state')
      return false
    }
    if (!address.pincode.trim()) {
      toast.error('Please enter your pincode')
      return false
    }
    if (address.pincode.length < 6) {
      toast.error('Please enter a valid pincode')
      return false
    }
    return true
  }

  const handlePlaceOrder = async () => {
    if (!validateForm()) return

    setLoading(true)
    try {
      const orderData = {
        user: {
          ...userInfo,
          name: `${userInfo.firstName} ${userInfo.lastName}`.trim()
        },
        items: cart.map(item => ({
          product: item.product._id,
          quantity: item.quantity
        })),
        totalAmount: getTotalPrice(),
        paymentMethod,
        deliveryInstructions
      }

      const response = await api.post('/orders', orderData)
      
      if (response.data.success) {
        toast.success('Order placed successfully!')
        
        // Show account creation message if applicable
        if (response.data.data.accountCreated) {
          toast.success('🎉 Account created! Check your email for login credentials.', { duration: 5000 })
        }
        
        clearCart()
        
        // Navigate to order confirmation page
        navigate('/order-confirmation', { 
          state: { 
            order: response.data.data.order,
            invoiceUrl: response.data.data.invoiceUrl,
            accountCreated: response.data.data.accountCreated,
            accountDetails: response.data.data.accountDetails
          }
        })
      }
    } catch (error: any) {
      console.error('Error placing order:', error)
      toast.error(error.response?.data?.message || 'Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/store')
    }
  }, [cart.length, navigate])

  if (cart.length === 0) {
    return null
  }

  return (
    <>
      <Helmet>
        <title>Checkout - Eroots Technology</title>
        <meta name="description" content="Secure checkout for your order" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 pt-20 sm:pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <button
              onClick={() => navigate('/cart')}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base touch-target focus-ring rounded-md px-2 py-1"
              aria-label="Go back to cart"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
              Back to Cart
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Checkout</h1>
          </div>

          <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
            {/* Checkout Form */}
            <div className="lg:col-span-8">
              <div className="space-y-6 sm:space-y-8">
                {/* Contact Information */}
                <div className="bg-white rounded-lg shadow-sm border">
                  <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Contact Information
                    </h2>
                  </div>
                  <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          First Name *
                        </label>
                        <input
                          type="text"
                          value={userInfo.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base touch-target focus-ring"
                          placeholder="Enter your first name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          value={userInfo.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent touch-target focus-ring"
                          placeholder="Enter your last name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          value={userInfo.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent touch-target focus-ring"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 text-sm">+91</span>
                        </div>
                        <input
                          type="tel"
                          value={userInfo.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent touch-target focus-ring"
                          placeholder="9876543210"
                          maxLength={10}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Enter 10-digit Indian mobile number (starting with 6, 7, 8, or 9)
                      </p>
                      {userInfo.phone && (
                        <div className="mt-1">
                          {validateMobileNumber(userInfo.phone).isValid ? (
                            <span className="text-green-600 text-xs flex items-center">
                              ✓ Valid mobile number
                            </span>
                          ) : (
                            <span className="text-red-600 text-xs flex items-center">
                              ✗ Invalid mobile number
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white rounded-lg shadow-sm border">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                        <MapPin className="w-5 h-5 mr-2" />
                        Shipping Address
                      </h2>
                      <button
                        type="button"
                        onClick={fetchCurrentLocation}
                        disabled={fetchingLocation}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-target focus-ring"
                        aria-label="Use current location to auto-fill address"
                      >
                        <MapPin className="w-4 h-4" />
                        {fetchingLocation ? 'Fetching...' : 'Use Current Location'}
                      </button>
                    </div>
                  </div>
                  <div className="px-6 py-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        value={userInfo.address.street}
                        onChange={(e) => handleInputChange('address.street', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent touch-target focus-ring"
                        placeholder="Enter your street address"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          value={userInfo.address.city}
                          onChange={(e) => handleInputChange('address.city', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent touch-target focus-ring"
                          placeholder="Enter your city"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          State *
                        </label>
                        <input
                          type="text"
                          value={userInfo.address.state}
                          onChange={(e) => handleInputChange('address.state', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent touch-target focus-ring"
                          placeholder="Enter your state"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Pincode *
                        </label>
                        <input
                          type="text"
                          value={userInfo.address.pincode}
                          onChange={(e) => handleInputChange('address.pincode', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent touch-target focus-ring"
                          placeholder="Enter pincode"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Delivery Instructions (Optional)
                      </label>
                      <textarea
                        value={deliveryInstructions}
                        onChange={(e) => setDeliveryInstructions(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent touch-target focus-ring"
                        rows={3}
                        placeholder="Any special delivery instructions..."
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-lg shadow-sm border">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>
                  </div>
                  <div className="px-6 py-6">
                    <div className="space-y-4">
                      {/* Cash on Delivery */}
                      <div 
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                          paymentMethod === 'COD' 
                            ? 'border-primary-500 bg-primary-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setPaymentMethod('COD')}
                      >
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                            paymentMethod === 'COD' 
                              ? 'border-primary-500 bg-primary-500' 
                              : 'border-gray-300'
                          }`}>
                            {paymentMethod === 'COD' && (
                              <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                            )}
                          </div>
                          <CreditCard className="w-6 h-6 text-gray-600 mr-3" />
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">Cash on Delivery (COD)</h3>
                            <p className="text-sm text-gray-600">
                              Pay with cash when your order is delivered safely to your doorstep.
                            </p>
                            <div className="mt-2 text-sm text-green-600 font-medium">
                              ✓ No payment required now • ✓ Secure delivery • ✓ 7-day return policy
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* UPI Payment (Placeholder) */}
                      <div 
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all opacity-50 ${
                          paymentMethod === 'UPI' 
                            ? 'border-primary-500 bg-primary-50' 
                            : 'border-gray-200'
                        }`}
                        onClick={() => toast.info('UPI payment coming soon!')}
                      >
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded-full border-2 border-gray-300 mr-3"></div>
                          <Smartphone className="w-6 h-6 text-gray-400 mr-3" />
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-500">UPI Payment</h3>
                            <p className="text-sm text-gray-400">
                              Pay instantly using UPI (Coming Soon)
                            </p>
                            <div className="mt-2 text-sm text-gray-400">
                              🔄 Under development
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="mt-8 lg:mt-0 lg:col-span-4">
              <div className="bg-white rounded-lg shadow-sm border sticky top-4">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
                </div>

                <div className="px-6 py-6">
                  {/* Items */}
                  <div className="space-y-3 mb-6">
                    {cart.map((item) => (
                      <div key={item.product._id} className="flex items-center space-x-3">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-12 h-12 object-cover rounded border"
                          onError={(e) => {
                            e.currentTarget.src = '/images/placeholder-product.jpg'
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.product.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Qty: {item.quantity} × {formatPrice(item.product.price)}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="space-y-2 border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">{formatPrice(getTotalPrice())}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium text-green-600">Free</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">₹0</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                      <span>Total</span>
                      <span className="text-primary-600">{formatPrice(getTotalPrice())}</span>
                    </div>
                  </div>

                  {/* Place Order Button */}
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="w-full mt-6 btn-primary text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed touch-target focus-ring"
                    aria-label="Place your order"
                  >
                    {loading ? 'Placing Order...' : `Place Order (${paymentMethod})`}
                  </button>

                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                      {paymentMethod === 'COD' 
                        ? 'Pay when delivered • Estimated delivery: 5-7 days'
                        : 'Secure payment processing'
                      }
                    </p>
                  </div>
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
