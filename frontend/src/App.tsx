import { Routes, Route, useLocation } from 'react-router-dom' // Force rebuild
import { motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Breadcrumb from './components/Breadcrumb'
import BackToTop from './components/BackToTop'
import Footer from './components/Footer'
import ErootMitra from './components/ErootMitra'
import AnimatedBackground from './components/AnimatedBackground'
import Home from './pages/Home'
import Services from './pages/Services'
import Projects from './pages/Projects'
import Contact from './pages/Contact'
import Store from './pages/Store'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import Admin from './pages/Admin'
import AuthCallback from './pages/AuthCallback'
import MyOrders from './pages/MyOrders'
import { CartProvider } from './contexts/CartContext'
import { AuthProvider } from './contexts/AuthContext'

function App() {
  const location = useLocation()
  const isAdminPage = location.pathname === '/admin'

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen relative">
          <AnimatedBackground />
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
