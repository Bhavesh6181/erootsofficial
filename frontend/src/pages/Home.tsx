import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import Hero from '../components/Hero'
import Services from '../components/Services'
import Projects from '../components/Projects'
import ContactForm from '../components/ContactForm'
import Testimonials from '../components/Testimonials'
import { Service, Project, Testimonial } from '../types'
import { api } from '../utils/api'

const Home: React.FC = () => {
  const [services, setServices] = useState<Service[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, projectsRes, testimonialsRes] = await Promise.all([
          api.get('/services'),
          api.get('/projects'),
          api.get('/testimonials'),
        ])

        setServices(servicesRes.data.data)
        setProjects(projectsRes.data.data)
        setTestimonials(testimonialsRes.data.data)
      } catch (error) {
        console.error('Error fetching data:', error)
        // Set default data if API fails
        setServices([
          {
            title: 'Embedded Systems',
            description: 'Custom embedded solutions for your projects',
            icon: '🔧',
            features: ['Microcontroller Programming', 'Hardware Integration', 'Real-time Systems'],
          },
          {
            title: 'IoT Solutions',
            description: 'Connected devices and smart systems',
            icon: '🌐',
            features: ['Sensor Networks', 'Cloud Integration', 'Data Analytics'],
          },
          {
            title: 'PCB Design',
            description: 'Professional circuit board design',
            icon: '⚡',
            features: ['Schematic Design', 'Layout Optimization', 'Prototyping'],
          },
          {
            title: 'Antenna Design',
            description: 'RF design and optimization',
            icon: '📡',
            features: ['Simulation', 'Prototyping', 'Testing'],
          },
          {
            title: 'Web & App Development',
            description: 'Modern web and mobile applications',
            icon: '💻',
            features: ['Frontend Development', 'Backend Services', 'Mobile Apps'],
          },
        ])

        setProjects([
          {
            title: 'Home Automation System',
            description: 'ESP8266 + Arduino IoT Cloud; gas detection & blast protection; comprehensive safety monitoring with real-time alerts',
            technologies: ['ESP8266', 'Arduino IoT Cloud', 'Gas Sensors'],
            category: 'IoT',
            status: 'completed',
          },
          {
            title: 'Live Bus Tracking System',
            description: 'ESP32 + GPS + Firebase; real-time updates with user-friendly interface; future geofencing & route optimization capabilities',
            technologies: ['ESP32', 'GPS', 'Firebase'],
            category: 'IoT',
            status: 'completed',
          },
          {
            title: 'Wearable Patch Antenna',
            description: 'Innovative textile patch integrated on jeans at 2.45 GHz & 5.8 GHz; precisely simulated in Ansys HFSS for optimal performance',
            technologies: ['Ansys HFSS', 'Textile Integration', 'RF Design'],
            category: 'Antenna',
            status: 'completed',
          },
          {
            title: 'Antenna Prototype Design',
            description: 'Comprehensive suite of Monopole, Yagi-Uda, Whip, Helix & Dipole designs; advanced RF simulation & rigorous testing protocols',
            technologies: ['RF Simulation', 'Prototyping', 'Testing'],
            category: 'Antenna',
            status: 'completed',
          },
        ])

        setTestimonials([
          {
            name: 'Sarah Johnson',
            company: 'TechCorp Solutions',
            content: 'Exceptional design and robust embedded solutions! Eroots delivered exactly what we needed and exceeded our expectations.',
            rating: 5,
            featured: true,
          },
          {
            name: 'Michael Chen',
            company: 'InnovateLabs',
            content: 'They transformed our idea into a functional IoT product within our timeline and budget. The attention to detail was impressive.',
            rating: 5,
            featured: true,
          },
          {
            name: 'Dr. Emily Rodriguez',
            company: 'Research Institute',
            content: 'Eroots is our go-to for RF and app integration projects. Their technical expertise and problem-solving abilities are unmatched.',
            rating: 5,
            featured: true,
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Handle hash navigation when component mounts
  useEffect(() => {
    if (location.hash) {
      const hash = location.hash.slice(1) // Remove the #
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
        }
      }, 100)
    }
  }, [location.hash])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Eroots | Smart Systems. Smarter Engineering.</title>
        <meta name="description" content="Transforming ideas into reality with cutting-edge embedded solutions, IoT development, precision PCB & antenna design, and intuitive web & app solutions." />
        <meta name="keywords" content="embedded systems, IoT, PCB design, antenna design, web development, app development, engineering services" />
        <meta property="og:title" content="Eroots | Smart Systems. Smarter Engineering." />
        <meta property="og:description" content="Transforming ideas into reality with cutting-edge embedded solutions, IoT development, precision PCB & antenna design, and intuitive web & app solutions." />
      </Helmet>

      <div className="pt-16 relative">
        <Hero />
        <Services services={services} />
        <Projects projects={projects} />
        <Testimonials testimonials={testimonials} />
        <ContactForm />
      </div>
    </>
  )
}

export default Home
