export interface Service {
  _id?: string
  title: string
  description: string
  icon: string
  features: string[]
  createdAt?: Date
  updatedAt?: Date
}

export interface Project {
  _id?: string
  title: string
  description: string
  image?: string
  technologies: string[]
  category: string
  status: 'completed' | 'in-progress' | 'planned'
  featured?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface Product {
  _id?: string
  name: string
  description: string
  price: number
  originalPrice?: number
  category: string
  image: string
  images?: string[]
  stock: number
  featured: boolean
  rating?: {
    average: number
    count: number
  }
  features?: string[]
  specifications?: { [key: string]: string }
  discountPercentage?: number
  createdAt?: Date
  updatedAt?: Date
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface OrderItem {
  product: string
  name: string
  price: number
  quantity: number
  image: string
}

export interface UserAddress {
  street: string
  city: string
  state: string
  pincode: string
  country?: string
}

export interface UserInfo {
  firstName: string
  lastName: string
  name?: string // For backward compatibility
  email: string
  phone: string
  address: UserAddress
}

export interface Order {
  _id?: string
  orderId: string
  user: UserInfo
  items: OrderItem[]
  totalAmount: number
  paymentMethod: 'COD' | 'UPI' | 'CARD' | 'NET_BANKING'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  deliveryInstructions?: string
  estimatedDelivery?: Date
  trackingNumber?: string
  notes?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface ProjectRequest {
  _id?: string
  name: string
  email: string
  phone?: string
  serviceType: string
  description: string
  status: 'pending' | 'in-review' | 'approved' | 'rejected'
  notes?: string
  createdAt?: Date
  updatedAt?: Date
}

export type TestimonialStatus = 'pending' | 'approved' | 'rejected'

export interface Testimonial {
  _id?: string
  name: string
  email: string
  company?: string
  content: string
  rating: number
  avatar?: string
  featured: boolean
  status: TestimonialStatus
  createdAt?: Date
  updatedAt?: Date
}

export interface User {
  _id?: string
  email: string
  name?: string
  profilePicture?: string
  role: 'admin' | 'user'
  authProvider?: 'local' | 'google'
  isVerified?: boolean
  createdAt?: Date
}

export interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  loginWithGoogle: () => void
  handleGoogleCallback: (token: string) => Promise<void>
  isLoading: boolean
}

export interface CartContextType {
  cart: CartItem[]
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
  isInCart: (productId: string) => boolean
  getItemQuantity: (productId: string) => number
  canAddToCart: (productId: string, quantity?: number) => boolean
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pages: number
}
