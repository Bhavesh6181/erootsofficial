import { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Breadcrumb from './components/Breadcrumb'
import BackToTop from './components/BackToTop'
import Footer from './components/Footer'
import ErootMitra from './components/ErootMitra'
import LoadingFallback from './components/LoadingFallback'
import { CartProvider } from './contexts/CartContext'
import { AuthProvider } from './contexts/AuthContext'

// Lazy load all pages for better performance
const Home = lazy(() => import('./pages/Home'))
const Services = lazy(() => import('./pages/Services'))
const Projects = lazy(() => import('./pages/Projects'))
const Contact = lazy(() => import('./pages/Contact'))
const Store = lazy(() => import('./pages/Store'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Cart = lazy(() => import('./pages/Cart'))
const Checkout = lazy(() => import('./pages/Checkout'))
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'))
const Admin = lazy(() => import('./pages/Admin'))
const AuthCallback = lazy(() => import('./pages/AuthCallback'))
const MyOrders = lazy(() => import('./pages/MyOrders'))

function App() {
  const location = useLocation()
  const isAdminPage = location.pathname === '/admin'

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen relative">
          {!isAdminPage && <Navbar />}
          {!isAdminPage && <Breadcrumb />}
          <motion.main
            id="main-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="focus:outline-none"
            tabIndex={-1}
          >
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/store" element={<Store />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-confirmation" element={<OrderConfirmation />} />
                <Route path="/my-orders" element={<MyOrders />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
              </Routes>
            </Suspense>
          </motion.main>
          {!isAdminPage && <Footer />}
          {!isAdminPage && <ErootMitra />}
          {!isAdminPage && <BackToTop />}
        </div>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
