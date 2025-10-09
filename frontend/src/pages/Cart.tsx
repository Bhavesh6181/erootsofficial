import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { useCart } from '../contexts/CartContext'
import { useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

const Cart: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, getTotalPrice, getTotalItems, clearCart } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0)
  }, [])

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId)
    } else {
      updateQuantity(productId, newQuantity)
    }
  }

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty')
      return
    }
    navigate('/checkout')
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  if (cart.length === 0) {
    return (
      <>
        <Helmet>
          <title>Cart - Eroots Technology</title>
          <meta name="description" content="Your shopping cart" />
        </Helmet>

        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <ShoppingBag className="mx-auto h-24 w-24 text-gray-400 mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
              <p className="text-lg text-gray-600 mb-8">
                Looks like you haven't added any items to your cart yet.
              </p>
              <button
                onClick={() => navigate('/store')}
                className="btn-primary inline-flex items-center touch-target focus-ring"
                aria-label="Continue shopping"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>{`Cart (${getTotalItems()} items) - Eroots Technology`}</title>
        <meta name="description" content="Your shopping cart" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 pt-20 sm:pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <button
              onClick={() => navigate('/store')}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base touch-target focus-ring rounded-md px-2 py-1"
              aria-label="Continue shopping"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
              Continue Shopping
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Shopping Cart ({getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'})
            </h1>
          </div>

          <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
            {/* Cart Items */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900">Cart Items</h2>
                    <button
                      onClick={() => {
                        clearCart()
                        toast.success('Cart cleared')
                      }}
                      className="text-xs sm:text-sm text-red-600 hover:text-red-800 touch-target focus-ring rounded-md px-2 py-1"
                      aria-label="Clear all items from cart"
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-gray-200">
                  {cart.map((item, index) => (
                    <motion.div
                      key={item.product._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="px-4 sm:px-6 py-4 sm:py-6"
                    >
                      <div className="flex items-start sm:items-center space-x-3 sm:space-x-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border"
                            onError={(e) => {
                              e.currentTarget.src = '/images/placeholder-product.jpg'
                            }}
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-medium text-gray-900 truncate">
                            {item.product.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mt-1">
                            {item.product.description}
                          </p>
                          <div className="mt-2">
                            <span className="text-base sm:text-lg font-semibold text-primary-600">
                              {formatPrice(item.product.price)}
                            </span>
                            {item.product.originalPrice && item.product.originalPrice > item.product.price && (
                              <span className="ml-2 text-xs sm:text-sm text-gray-500 line-through">
                                {formatPrice(item.product.originalPrice)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quantity Controls and Actions */}
                        <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-1 sm:space-x-2">
                            <button
                              onClick={() => handleQuantityChange(item.product._id!, item.quantity - 1)}
                              className="p-2 rounded-full hover:bg-gray-100 transition-colors touch-target focus-ring"
                              disabled={item.quantity <= 1}
                              aria-label={`Decrease quantity of ${item.product.name}`}
                            >
                              <Minus className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                            </button>
                            
                            <span className="w-8 sm:w-12 text-center font-medium text-sm sm:text-base">
                              {item.quantity}
                            </span>
                            
                            <button
                              onClick={() => handleQuantityChange(item.product._id!, item.quantity + 1)}
                              className="p-2 rounded-full hover:bg-gray-100 transition-colors touch-target focus-ring"
                              disabled={item.quantity >= item.product.stock}
                              aria-label={`Increase quantity of ${item.product.name}`}
                            >
                              <Plus className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                            </button>
                          </div>

                          {/* Item Total */}
                          <div className="text-right sm:text-right">
                            <div className="text-sm sm:text-lg font-semibold text-gray-900">
                              {formatPrice(item.product.price * item.quantity)}
                            </div>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeFromCart(item.product._id!)}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors touch-target focus-ring"
                            aria-label={`Remove ${item.product.name} from cart`}
                          >
                            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Stock Warning */}
                      {item.quantity >= item.product.stock && (
                        <div className="mt-2 text-sm text-amber-600">
                          Only {item.product.stock} items left in stock
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="mt-8 lg:mt-0 lg:col-span-4">
              <div className="bg-white rounded-lg shadow-sm border sticky top-20">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
                </div>

                <div className="px-6 py-6">
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Items ({getTotalItems()})</span>
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
                    
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span className="text-primary-600">{formatPrice(getTotalPrice())}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full mt-6 btn-primary text-lg py-3 touch-target focus-ring"
                    aria-label="Proceed to checkout"
                  >
                    Proceed to Checkout
                  </button>

                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                      Secure checkout with Cash on Delivery
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

export default Cart
