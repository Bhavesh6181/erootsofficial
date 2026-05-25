import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import Hero from '../components/Hero'
import Services from '../components/Services'
import Projects from '../components/Projects'
import ContactForm from '../components/ContactForm'
import FeedbackForm from '../components/FeedbackForm'
import Testimonials from '../components/Testimonials'
import { Service, Project, Testimonial } from '../types'
import { api } from '../utils/api'
import { canUseDemoFallbacks } from '../utils/runtime'

const demoServices: Service[] = [
  {
    title: 'Embedded Systems',
    description: 'Custom embedded solutions for your projects',
    icon: '[ES]',
    features: ['Microcontroller Programming', 'Hardware Integration', 'Real-time Systems'],
  },
  {
    title: 'IoT Solutions',
    description: 'Connected devices and smart systems',
    icon: '[IoT]',
    features: ['Sensor Networks', 'Cloud Integration', 'Data Analytics'],
  },
  {
    title: 'PCB Design',
    description: 'Professional circuit board design',
    icon: '[PCB]',
    features: ['Schematic Design', 'Layout Optimization', 'Prototyping'],
  },
  {
    title: 'Antenna Design',
    description: 'RF design and optimization',
    icon: '[RF]',
    features: ['Simulation', 'Prototyping', 'Testing'],
  },
  {
    title: 'Web & App Development',
    description: 'Modern web and mobile applications',
    icon: '[Web]',
    features: ['Frontend Development', 'Backend Services', 'Mobile Apps'],
  },
]

const demoProjects: Project[] = [
  {
    title: 'Home Automation System',
    description:
      'ESP8266 + Arduino IoT Cloud with safety monitoring and real-time alerts.',
    technologies: ['ESP8266', 'Arduino IoT Cloud', 'Gas Sensors'],
    category: 'IoT',
    status: 'completed',
  },
  {
    title: 'Live Bus Tracking System',
    description:
      'ESP32 + GPS + Firebase with real-time updates and route monitoring.',
    technologies: ['ESP32', 'GPS', 'Firebase'],
    category: 'IoT',
    status: 'completed',
  },
  {
    title: 'Wearable Patch Antenna',
    description:
      'Dual-band textile antenna designed and simulated for wearable applications.',
    technologies: ['Ansys HFSS', 'Textile Integration', 'RF Design'],
    category: 'Antenna',
    status: 'completed',
  },
]

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
        if (canUseDemoFallbacks) {
          setServices(demoServices)
          setProjects(demoProjects)
          setTestimonials([])
        } else {
          setServices([])
          setProjects([])
          setTestimonials([])
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (location.hash) {
      const hash = location.hash.slice(1)
      setTimeout(() => {
        const element = document.getElementById(hash)
        if (element) {
          const navbarHeight = 80
          const elementPosition = element.offsetTop
          const offsetPosition = elementPosition - navbarHeight

          window.scrollTo({
            top: Math.max(0, offsetPosition),
            behavior: 'smooth',
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
        <meta
          name="description"
          content="Transforming ideas into reality with embedded solutions, IoT development, PCB and antenna design, and web/app engineering."
        />
        <meta
          name="keywords"
          content="embedded systems, IoT, PCB design, antenna design, web development, engineering services"
        />
        <meta property="og:title" content="Eroots | Smart Systems. Smarter Engineering." />
        <meta
          property="og:description"
          content="Transforming ideas into reality with embedded solutions, IoT development, PCB and antenna design, and web/app engineering."
        />
      </Helmet>

      <div className="pt-16 relative">
        <Hero />
        {services.length > 0 && <Services services={services} />}
        {projects.length > 0 && <Projects projects={projects} />}
        <Testimonials testimonials={testimonials} />
        <FeedbackForm />
        <ContactForm />
      </div>
    </>
  )
}

export default Home
