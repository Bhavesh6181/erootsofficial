import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { useParams, useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { api } from '../utils/api'
import { Product } from '../types'
import { ArrowLeft, Star, ShoppingCart, Truck, Shield, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return
      
      try {
        setLoading(true)
        const response = await api.get(`/products/${id}`)
        if (response.data.success) {
          setProduct(response.data.data)
          setSelectedImage(0)
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        toast.error('Failed to load product details')
        navigate('/store')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id, navigate])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  const handleAddToCart = () => {
    if (!product) return
    
    if (product.stock < quantity) {
      toast.error(`Only ${product.stock} items available`)
      return
    }

    addToCart(product, quantity)
    toast.success(`${product.name} added to cart!`)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <button
            onClick={() => navigate('/store')}
            className="btn-primary touch-target focus-ring"
            aria-label="Go back to store"
          >
            Back to Store
          </button>
        </div>
      </div>
    )
  }

  const images = product.images && product.images.length > 0 
    ? product.images 
    : [product.image]

  return (
    <>
      <Helmet>
        <title>{product.name || 'Product'} - Eroots Technology</title>
        <meta name="description" content={product.description || 'Product details'} />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/store')}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 touch-target focus-ring rounded-md px-2 py-1"
              aria-label="Go back to store"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Store
            </button>
          </div>

          <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
            {/* Product Images */}
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm border p-4 sm:p-6"
              >
                {/* Main Image */}
                <div className="aspect-w-1 aspect-h-1 mb-4">
                  <img
                    src={images[selectedImage]}
                    alt={product.name}
                    className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-lg border"
                    onError={(e) => {
                      e.currentTarget.src = '/images/placeholder-product.jpg'
                    }}
                  />
                </div>

                {/* Thumbnail Images */}
                {images.length > 1 && (
                  <div className="flex space-x-2 overflow-x-auto">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg border-2 overflow-hidden touch-target focus-ring ${
                          selectedImage === index 
                            ? 'border-primary-500' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        aria-label={`View product image ${index + 1}`}
                      >
                        <img
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/images/placeholder-product.jpg'
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Product Details */}
            <div className="lg:col-span-5 mt-8 lg:mt-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg shadow-sm border p-4 sm:p-6"
              >
                {/* Product Title */}
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {renderStars(Math.floor(product.rating?.average || 0))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    ({product.rating?.count || 0} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-2xl sm:text-3xl font-bold text-primary-600">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <>
                        <span className="text-xl text-gray-500 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                        <span className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded">
                          {product.discountPercentage}% OFF
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Stock Status */}
                <div className="mb-6">
                  {product.stock > 0 ? (
                    <div className="flex items-center text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="font-medium">
                        {product.stock} items in stock
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                      <span className="font-medium">Out of stock</span>
                    </div>
                  )}
                </div>

                {/* Quantity Selector */}
                {product.stock > 0 && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 touch-target focus-ring"
                        disabled={quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="w-16 text-center font-medium">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 touch-target focus-ring"
                        disabled={quantity >= product.stock}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                {/* Add to Cart Button */}
                <div className="mb-6">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="w-full btn-primary text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center touch-target focus-ring"
                    aria-label="Add product to cart"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>

                {/* Features */}
                <div className="space-y-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Truck className="w-5 h-5 mr-2 text-primary-600" />
                    <span>Free shipping on orders over ₹500</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Shield className="w-5 h-5 mr-2 text-primary-600" />
                    <span>1 year warranty</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <RefreshCw className="w-5 h-5 mr-2 text-primary-600" />
                    <span>7-day return policy</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Product Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>
          </motion.div>

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8"
            >
              <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Key Features</h2>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}

          {/* Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-8"
            >
              <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Specifications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-900">{key}:</span>
                      <span className="text-gray-700">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  )
}

export default ProductDetail
