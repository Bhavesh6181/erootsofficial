import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { Product } from '../types'
import { api } from '../utils/api'
import toast from 'react-hot-toast'
import { Search, Filter, ShoppingCart, Eye } from 'lucide-react'

const Store: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const { addToCart, isInCart, getItemQuantity, canAddToCart } = useCart()
  const navigate = useNavigate()

  const categories = [
    'all',
    'microcontrollers',
    'sensors',
    'motors',
    'power',
    'connectors',
    'other'
  ]

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products')
        setProducts(response.data.data)
        setFilteredProducts(response.data.data)
      } catch (error) {
        console.error('Error fetching products:', error)
        // Set default products if API fails
        const defaultProducts: Product[] = [
          {
            _id: '1',
            name: 'ESP8266 NodeMCU',
            description: 'WiFi-enabled microcontroller development board',
            price: 350,
            originalPrice: 400,
            category: 'microcontrollers',
            image: '/images/esp8266-nodemcu.jpg',
            stock: 50,
            featured: true,
          },
          {
            _id: '2',
            name: 'DHT11 Temperature Sensor',
            description: 'Digital temperature and humidity sensor',
            price: 180,
            category: 'sensors',
            image: '/images/dht11.jpg',
            stock: 100,
            featured: true,
          },
          {
            _id: '3',
            name: '9V Battery',
            description: 'Alkaline 9V battery for powering projects',
            price: 120,
            category: 'power',
            image: '/images/9v-battery.png',
            stock: 200,
            featured: false,
          },
          {
            _id: '4',
            name: 'LED Red 5mm',
            description: 'Standard 5mm red LED for indicators',
            price: 15,
            category: 'other',
            image: '/images/led-red.jpg',
            stock: 500,
            featured: false,
          },
          {
            _id: '5',
            name: 'Push Button',
            description: 'Tactile push button switch',
            price: 25,
            category: 'other',
            image: '/images/push-button.jpg',
            stock: 300,
            featured: false,
          },
          {
            _id: '6',
            name: '220Ω Resistor',
            description: 'Carbon film resistor 220 ohms',
            price: 8,
            category: 'other',
            image: '/images/resistor-220.jpg',
            stock: 1000,
            featured: false,
          },
        ]
        setProducts(defaultProducts)
        setFilteredProducts(defaultProducts)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    let filtered = products

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'name':
          return a.name.localeCompare(b.name)
        case 'featured':
          return b.featured === a.featured ? 0 : b.featured ? -1 : 1
        default:
          return 0
      }
    })

    setFilteredProducts(filtered)
  }, [products, selectedCategory, searchTerm, sortBy])

  const handleAddToCart = (product: Product) => {
    try {
      if (product._id && canAddToCart(product._id)) {
        addToCart(product)
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Store - Electronic Components | Eroots</title>
        <meta name="description" content="Shop high-quality electronic components, microcontrollers, sensors, and development boards for your engineering projects." />
      </Helmet>

      <div className="pt-14 sm:pt-16 min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="container-custom py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
                Electronic <span className="text-gradient">Components Store</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
                High-quality electronic components, microcontrollers, sensors, and development boards
                for all your engineering projects.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Filters */}
        <div className="container-custom py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm focus-ring touch-target"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center space-x-2 min-w-0 flex-shrink-0">
                <Filter className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm focus-ring touch-target min-w-0"
                >
                  <option value="all">All Categories</option>
                  <option value="microcontrollers">Microcontrollers</option>
                  <option value="sensors">Sensors</option>
                  <option value="motors">Motors</option>
                  <option value="power">Power</option>
                  <option value="connectors">Connectors</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm focus-ring touch-target min-w-0 flex-shrink-0"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="featured">Featured First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="container-custom pb-16 px-4 sm:px-6 lg:px-8">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <ShoppingCart className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-sm sm:text-base text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
                >
                  {/* Product Image */}
                  <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ShoppingCart className="w-16 h-16" />
                      </div>
                    )}
                    
                    {product.featured && (
                      <div className="absolute top-2 left-2 bg-primary-600 text-white text-xs font-semibold px-2 py-1 rounded">
                        Featured
                      </div>
                    )}
                    
                    {product.originalPrice && product.originalPrice > product.price && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                        Sale
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-3 sm:p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm sm:text-base">
                      {product.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <span className="text-base sm:text-lg font-bold text-primary-600">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-xs sm:text-sm text-gray-500 line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        Stock: {product.stock}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                      <button
                        onClick={() => navigate(`/product/${product._id}`)}
                        className="flex-1 btn-secondary flex items-center justify-center text-xs sm:text-sm py-2 touch-target focus-ring"
                        aria-label={`View details for ${product.name}`}
                      >
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0 || !canAddToCart(product._id || '')}
                        className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-3 py-2 rounded-lg font-medium text-xs transition-all duration-300 hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center touch-target focus-ring"
                        aria-label={`Add ${product.name} to cart`}
                      >
                        <ShoppingCart className="w-3 h-3 mr-1" />
                        <span className="hidden xs:inline">
                          {isInCart(product._id || '') ? `In Cart (${getItemQuantity(product._id || '')})` : (product.stock === 0 ? 'Out of Stock' : 'Add')}
                        </span>
                        <span className="xs:hidden">
                          {isInCart(product._id || '') ? getItemQuantity(product._id || '') : (product.stock === 0 ? 'Out' : 'Add')}
                        </span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Store
