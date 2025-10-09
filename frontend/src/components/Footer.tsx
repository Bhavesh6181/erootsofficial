import React from 'react'
import { motion } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Mail, Phone, MapPin, Github, Linkedin, Twitter, Instagram } from 'lucide-react'
import Logo from './Logo'

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()
  const location = useLocation()
  const navigate = useNavigate()

  const handleNavClick = (href: string) => {
    if (href.startsWith('/#')) {
      // Handle hash navigation
      const hash = href.slice(1) // Remove the #
      
      if (location.pathname === '/') {
        // If we're already on home page, just scroll to section
        setTimeout(() => {
          const element = document.getElementById(hash)
          if (element) {
            const navbarHeight = 80 // Fixed navbar height
            const elementPosition = element.offsetTop
            const offsetPosition = elementPosition - navbarHeight
            
            
            window.scrollTo({
              top: Math.max(0, offsetPosition),
              behavior: 'smooth'
            })
          } else {
          }
        }, 50)
      } else {
        // If we're on a different page, navigate to home first, then scroll
        navigate('/')
        setTimeout(() => {
          const element = document.getElementById(hash)
          if (element) {
            const navbarHeight = 80 // Fixed navbar height
            const elementPosition = element.offsetTop
            const offsetPosition = elementPosition - navbarHeight
            
            
            window.scrollTo({
              top: Math.max(0, offsetPosition),
              behavior: 'smooth'
            })
          } else {
          }
        }, 200)
      }
    } else {
      // Handle regular navigation
      navigate(href)
    }
  }

  const footerLinks = {
    services: [
      { name: 'Embedded Systems', href: '/#services' },
      { name: 'IoT Development', href: '/#services' },
      { name: 'PCB Design', href: '/#services' },
      { name: 'Antenna Design', href: '/#services' },
      { name: 'Web & App Development', href: '/#services' },
    ],
    company: [
      { name: 'About Us', href: '/#about' },
      { name: 'Our Projects', href: '/#projects' },
      { name: 'Contact', href: '/#contact' },
      { name: 'Store', href: '/store' },
    ],
    support: [
      { name: 'Help Center', href: '/#help' },
      { name: 'Privacy Policy', href: '/#privacy' },
      { name: 'Terms of Service', href: '/#terms' },
      { name: 'FAQ', href: '/#faq' },
    ],
  }

  const socialLinks = [
    { name: 'GitHub', icon: Github, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/eroots_technology/?utm_source=qr' },
  ]

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container-custom">
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-1"
            >
      <Link to="/" className="mb-4 block">
        <Logo size="lg" />
      </Link>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Smart Systems. Smarter Engineering. Transforming ideas into reality with 
                cutting-edge technology solutions.
              </p>
              <div className="space-y-3">
                <div className="flex items-center text-gray-300">
                  <MapPin className="w-5 h-5 mr-3 text-primary-400" />
                  <span>Pune, Maharashtra, India</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Phone className="w-5 h-5 mr-3 text-primary-400" />
                  <a href="tel:+917350059825" className="hover:text-primary-400 transition-colors">
                    +91 7350059825
                  </a>
                </div>
                <div className="flex items-center text-gray-300">
                  <Mail className="w-5 h-5 mr-3 text-primary-400" />
                  <a href="mailto:eroots2025@gmail.com" className="hover:text-primary-400 transition-colors">
                    eroots2025@gmail.com
                  </a>
                </div>
                <div className="flex items-center text-gray-300">
                  <Instagram className="w-5 h-5 mr-3 text-primary-400" />
                  <a href="https://www.instagram.com/eroots_technology/?utm_source=qr" target="_blank" rel="noopener noreferrer" className="hover:text-primary-400 transition-colors">
                    @eroots_technology
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Services */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-3">
                {footerLinks.services.map((link) => (
                  <li key={link.name}>
                    {link.href.startsWith('/#') ? (
                      <a
                        href={link.href}
                        onClick={(e) => {
                          e.preventDefault()
                          handleNavClick(link.href)
                        }}
                        className="text-gray-300 hover:text-primary-400 transition-colors"
                      >
                        {link.name}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-gray-300 hover:text-primary-400 transition-colors"
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Company */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    {link.href.startsWith('/#') ? (
                      <a
                        href={link.href}
                        onClick={(e) => {
                          e.preventDefault()
                          handleNavClick(link.href)
                        }}
                        className="text-gray-300 hover:text-primary-400 transition-colors"
                      >
                        {link.name}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-gray-300 hover:text-primary-400 transition-colors"
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Support */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    {link.href.startsWith('/#') ? (
                      <a
                        href={link.href}
                        onClick={(e) => {
                          e.preventDefault()
                          handleNavClick(link.href)
                        }}
                        className="text-gray-300 hover:text-primary-400 transition-colors"
                      >
                        {link.name}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-gray-300 hover:text-primary-400 transition-colors"
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 pt-8 border-t border-gray-700"
          >
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex space-x-6 mb-4 md:mb-0">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="text-gray-400 hover:text-primary-400 transition-colors"
                    aria-label={social.name}
                  >
                    <social.icon className="w-6 h-6" />
                  </a>
                ))}
              </div>
              <div className="text-gray-400 text-sm">
                © {currentYear} Eroots. All rights reserved.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
