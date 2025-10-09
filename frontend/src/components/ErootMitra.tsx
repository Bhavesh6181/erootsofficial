import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot, User } from 'lucide-react'

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

const ErootMitra: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m Eroot-Mitra, your AI assistant. I can help you with our electronics store, development services, and technical questions. How can I assist you today?',
      isUser: false,
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [conversationContext, setConversationContext] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()
    
    // Update conversation context
    setConversationContext(prev => [...prev.slice(-3), message]) // Keep last 4 messages for context
    
    // Enhanced greeting responses
    if (message.includes('hello') || message.includes('hi') || message.includes('hey') || message.includes('good morning') || message.includes('good afternoon') || message.includes('good evening')) {
      const greetings = [
        'Hello! Welcome to Eroots Technology! I\'m Eroot-Mitra, your AI assistant. I\'m here to help you with our electronics components, development services, and projects. How can I assist you today?',
        'Hi there! Great to see you at Eroots Technology. I can help you explore our store, understand our services, or answer questions about our projects. What would you like to know?',
        'Hey! Welcome to Eroots Technology! I\'m excited to help you discover our range of electronic components and engineering solutions. What brings you here today?'
      ]
      return greetings[Math.floor(Math.random() * greetings.length)]
    }
    
    // Enhanced product inquiries with specific details
    if (message.includes('product') || message.includes('store') || message.includes('buy') || message.includes('component') || message.includes('microcontroller') || message.includes('sensor') || message.includes('motor')) {
      if (message.includes('microcontroller') || message.includes('arduino') || message.includes('esp32') || message.includes('raspberry')) {
        return 'We have a great selection of microcontrollers! We stock Arduino boards, ESP32 modules, Raspberry Pi, and various development boards. Our microcontrollers come with detailed specifications and are perfect for IoT projects. Would you like to know about specific models or pricing?'
      }
      if (message.includes('sensor') || message.includes('temperature') || message.includes('motion') || message.includes('pressure')) {
        return 'Our sensor collection includes temperature sensors, motion detectors, pressure sensors, humidity sensors, and many more! All sensors are high-quality and come with documentation. What type of sensor are you looking for?'
      }
      if (message.includes('motor') || message.includes('servo') || message.includes('stepper') || message.includes('dc motor')) {
        return 'We offer various motors including servo motors, stepper motors, DC motors, and motor drivers. Perfect for robotics and automation projects! Are you working on a specific project that needs motors?'
      }
      return 'Our electronics store features 30+ high-quality components including microcontrollers, sensors, motors, power supplies, and connectors. All products come with detailed specifications and are perfect for your engineering projects. Check out our Store section or tell me what specific component you need!'
    }
    
    // Enhanced services with detailed information
    if (message.includes('service') || message.includes('development') || message.includes('iot') || message.includes('embedded') || message.includes('pcb') || message.includes('antenna')) {
      if (message.includes('embedded') || message.includes('microcontroller')) {
        return 'Our embedded systems development includes custom firmware development, hardware integration, real-time systems, and optimization. We work with Arduino, ESP32, STM32, and other platforms. What kind of embedded project do you have in mind?'
      }
      if (message.includes('iot') || message.includes('internet of things')) {
        return 'We specialize in IoT solutions including sensor networks, data collection, cloud integration, and mobile apps. Our IoT projects include smart monitoring systems, environmental sensors, and industrial automation. Tell me about your IoT requirements!'
      }
      if (message.includes('pcb') || message.includes('circuit board')) {
        return 'Our PCB design services cover schematic design, layout optimization, manufacturing support, and testing. We work with various complexity levels from simple circuits to multi-layer boards. What\'s your PCB project about?'
      }
      if (message.includes('antenna') || message.includes('rf') || message.includes('wireless')) {
        return 'We offer antenna design and simulation services using advanced tools like Ansys HFSS. Our expertise includes patch antennas, monopole designs, and custom RF solutions. What frequency range or application do you need?'
      }
      return 'We offer comprehensive engineering services: Embedded Systems Development, IoT Solutions, PCB Design, Antenna Design & Simulation, and Web/App Development. With 500+ completed projects and 900+ happy clients, we deliver innovative solutions. Which service interests you most?'
    }
    
    // Enhanced project portfolio with specific examples
    if (message.includes('project') || message.includes('portfolio') || message.includes('work') || message.includes('example')) {
      if (message.includes('iot') || message.includes('smart') || message.includes('monitoring')) {
        return 'Our IoT projects include Smart Home Systems, Environmental Monitoring, Industrial Automation, and Wearable Devices. We\'ve built systems with real-time data collection, cloud integration, and mobile apps. Would you like to see specific project details?'
      }
      if (message.includes('antenna') || message.includes('rf') || message.includes('wireless')) {
        return 'Our antenna projects include Wearable Patch Antennas, Yagi-Uda Arrays, Helical Antennas, and Custom RF Solutions. We use advanced simulation tools and provide complete design-to-prototype services. What antenna application are you working on?'
      }
      if (message.includes('embedded') || message.includes('microcontroller')) {
        return 'Our embedded projects range from simple sensor nodes to complex control systems. We\'ve developed solutions for automotive, medical, industrial, and consumer applications. Tell me about your embedded system requirements!'
      }
      return 'We\'ve completed 500+ projects including IoT systems, embedded solutions, antenna designs, and web applications. Our portfolio showcases innovative engineering solutions across various industries. You can view detailed case studies in our Projects section. What type of project are you planning?'
    }
    
    // Enhanced contact and support
    if (message.includes('contact') || message.includes('reach') || message.includes('phone') || message.includes('email') || message.includes('support')) {
      return 'You can reach us through multiple channels: 📧 Email: eroots2025@gmail.com | 📱 Phone: +91 7350059825 | 📍 Location: Pune, Maharashtra | 💬 WhatsApp: Available for instant chat | 📱 Instagram: @eroots_technology. We typically respond within 2-4 hours during business hours!'
    }
    
    // Enhanced pricing with context
    if (message.includes('price') || message.includes('cost') || message.includes('expensive') || message.includes('budget') || message.includes('quote')) {
      return 'Our pricing is competitive and varies based on project complexity, timeline, and requirements. Component prices are listed in our store. For development services, we provide detailed quotes after understanding your needs. We offer flexible payment options and can work within your budget. Would you like a rough estimate for your project?'
    }
    
    // Technical support and troubleshooting
    if (message.includes('help') || message.includes('support') || message.includes('problem') || message.includes('issue') || message.includes('troubleshoot')) {
      return 'I\'m here to help with technical questions, product recommendations, project guidance, and general support! I can assist with component selection, design advice, troubleshooting, and connecting you with our engineering team. What specific help do you need?'
    }
    
    // Company information
    if (message.includes('about') || message.includes('company') || message.includes('team') || message.includes('experience')) {
      return 'Eroots Technology is a leading engineering company specializing in embedded systems, IoT solutions, and electronic components. With 5+ years of experience, we\'ve served 900+ clients and completed 500+ projects. Our team combines technical expertise with innovative solutions to deliver exceptional results. We\'re based in Pune, India, and serve clients globally!'
    }
    
    // Capabilities and expertise
    if (message.includes('capability') || message.includes('expertise') || message.includes('skill') || message.includes('technology')) {
      return 'Our expertise includes: Embedded Systems (Arduino, ESP32, STM32), IoT Development (sensors, cloud, mobile apps), PCB Design (schematic, layout, manufacturing), Antenna Design (simulation, prototyping), Web/App Development (React, Node.js), and Electronic Components (microcontrollers, sensors, motors). We use cutting-edge tools and follow industry best practices!'
    }
    
    // Project timeline and process
    if (message.includes('timeline') || message.includes('duration') || message.includes('process') || message.includes('how long') || message.includes('when')) {
      return 'Project timelines vary based on complexity: Simple components (1-2 days), PCB design (1-2 weeks), Embedded systems (2-6 weeks), IoT projects (4-8 weeks), Complex systems (2-3 months). We follow agile development with regular updates and milestones. We can provide detailed timelines after understanding your requirements!'
    }
    
    // Quality and reliability
    if (message.includes('quality') || message.includes('reliable') || message.includes('guarantee') || message.includes('warranty')) {
      return 'We maintain high quality standards with rigorous testing, documentation, and quality assurance processes. All components are sourced from trusted suppliers, and our development follows industry standards. We provide warranties on our work and offer post-delivery support. Quality and reliability are our top priorities!'
    }
    
    // Context-aware responses based on conversation history
    const hasDiscussedProducts = conversationContext.some(ctx => 
      ctx.includes('product') || ctx.includes('component') || ctx.includes('store')
    )
    const hasDiscussedServices = conversationContext.some(ctx => 
      ctx.includes('service') || ctx.includes('development') || ctx.includes('project')
    )
    
    if (hasDiscussedProducts && !hasDiscussedServices) {
      return 'I see you\'re interested in our products! We also offer comprehensive development services including embedded systems, IoT solutions, and PCB design. Would you like to know more about our services, or do you have specific questions about our components?'
    }
    
    if (hasDiscussedServices && !hasDiscussedProducts) {
      return 'Great! Since you\'re interested in our services, you might also want to check out our electronics store. We have microcontrollers, sensors, and other components that are perfect for your projects. Would you like to explore our product range?'
    }
    
    // Enhanced default responses with more personality and context
    const defaultResponses = [
      'That\'s a great question! I\'d love to help you with that. Could you provide a bit more detail about what you\'re looking for?',
      'Interesting! I\'m here to assist with our products, services, and technical expertise. What specific aspect would you like to explore?',
      'Thanks for reaching out! I can help you with component selection, project guidance, or technical questions. What can I clarify for you?',
      'I\'m excited to help! Whether it\'s about our electronics store, development services, or project portfolio, I\'m here to assist. What interests you most?',
      'Great to hear from you! I can provide detailed information about our offerings or help you plan your next project. What would you like to know?',
      'That sounds interesting! I\'d be happy to dive deeper into that topic. Could you tell me more about your specific needs or interests?',
      'I\'m here to help! You can ask me about our 30+ electronic components, development services, or browse our portfolio of 500+ completed projects. What would you like to explore?'
    ]
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate bot typing delay with more realistic timing
    const typingDelay = 800 + Math.random() * 1200 // 0.8-2 seconds
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(userMessage.text),
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, typingDelay)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg transition-all duration-300 ${
          isOpen 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800'
        } flex items-center justify-center text-white hover:scale-110`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 z-40 w-80 h-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Eroot-Mitra</h3>
                  <p className="text-xs opacity-90">AI Assistant</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs">Online</span>
              </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[85%] ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.isUser 
                        ? 'bg-primary-600' 
                        : 'bg-gradient-to-r from-primary-500 to-primary-600'
                    }`}>
                      {message.isUser ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className={`rounded-2xl px-4 py-2 ${
                      message.isUser
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-gray-800 border border-gray-200'
                    }`}>
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.isUser ? 'text-primary-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start space-x-2 max-w-[85%]">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white text-gray-800 border border-gray-200 rounded-2xl px-4 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
              
              {/* Quick Action Buttons */}
              {messages.length <= 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  <p className="text-xs text-gray-500 text-center mb-3">Quick actions:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setInputValue('Tell me about your products')}
                      className="text-xs bg-white border border-gray-200 rounded-lg px-3 py-2 text-left hover:bg-gray-50 transition-colors"
                    >
                      📦 Products
                    </button>
                    <button
                      onClick={() => setInputValue('What services do you offer?')}
                      className="text-xs bg-white border border-gray-200 rounded-lg px-3 py-2 text-left hover:bg-gray-50 transition-colors"
                    >
                      🔧 Services
                    </button>
                    <button
                      onClick={() => setInputValue('Show me your projects')}
                      className="text-xs bg-white border border-gray-200 rounded-lg px-3 py-2 text-left hover:bg-gray-50 transition-colors"
                    >
                      🚀 Projects
                    </button>
                    <button
                      onClick={() => setInputValue('How can I contact you?')}
                      className="text-xs bg-white border border-gray-200 rounded-lg px-3 py-2 text-left hover:bg-gray-50 transition-colors"
                    >
                      📞 Contact
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ErootMitra
