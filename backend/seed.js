const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('./config/loadEnv');

// Import models
const User = require('./models/User');
const Service = require('./models/Service');
const Product = require('./models/Product');
const Project = require('./models/Project');
const Testimonial = require('./models/Testimonial');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

// Clear existing collections
const clearCollections = async () => {
  try {
    await User.deleteMany({});
    await Service.deleteMany({});
    await Product.deleteMany({});
    await Project.deleteMany({});
    await Testimonial.deleteMany({});
    console.log('🧹 Cleared existing data');
  } catch (error) {
    console.error('❌ Error clearing collections:', error);
    throw error;
  }
};

// Seed admin user
const seedAdminUser = async () => {
  try {
    // Admin user should be created manually or through proper registration
    console.log('👤 Skipping admin user creation - create admin user manually');
  } catch (error) {
    console.error('❌ Error in admin user setup:', error);
    throw error;
  }
};

// Seed services
const seedServices = async () => {
  try {
    const services = [
      {
        title: 'Embedded Systems',
        description: 'Custom embedded solutions for your projects',
        icon: '🔧',
        features: ['Microcontroller Programming', 'Hardware Integration', 'Real-time Systems']
      },
      {
        title: 'IoT Solutions',
        description: 'Connected devices and smart systems',
        icon: '🌐',
        features: ['Sensor Networks', 'Cloud Integration', 'Data Analytics']
      },
      {
        title: 'PCB Design',
        description: 'Professional circuit board design',
        icon: '⚡',
        features: ['Schematic Design', 'Layout Optimization', 'Prototyping']
      },
      {
        title: 'Antenna Design & Simulation',
        description: 'RF design and optimization',
        icon: '📡',
        features: ['Simulation', 'Prototyping', 'Testing']
      },
      {
        title: 'Web & App Development',
        description: 'Modern web and mobile applications',
        icon: '💻',
        features: ['Frontend Development', 'Backend Services', 'Mobile Apps']
      }
    ];

    await Service.insertMany(services);
    console.log('🔧 Created services');
  } catch (error) {
    console.error('❌ Error creating services:', error);
    throw error;
  }
};

// Seed products
const seedProducts = async () => {
  try {
    const products = [
      {
        name: 'ESP8266 NodeMCU CP2102 Wi-Fi Development Board',
        description: 'WiFi-enabled microcontroller development board with built-in WiFi module, perfect for IoT projects and home automation. Features 11 digital I/O pins, 1 analog input, and built-in LED.',
        price: 289,
        originalPrice: 299,
        category: 'microcontrollers',
        image: '/images/esp8266-nodemcu.jpg',
        images: ['/images/esp8266-nodemcu.jpg'],
        stock: 50,
        featured: true,
        rating: {
          average: 4.5,
          count: 128
        },
        features: [
          'Built-in WiFi module',
          '11 Digital I/O pins',
          '1 Analog input',
          'Arduino IDE compatible',
          'Low power consumption'
        ],
        specifications: {
          'Operating Voltage': '3.3V',
          'Input Voltage': '3.3V - 5V',
          'Digital I/O Pins': '11',
          'Analog Input Pins': '1',
          'Flash Memory': '4MB',
          'SRAM': '80KB',
          'Clock Speed': '80MHz',
          'WiFi': '802.11 b/g/n'
        }
      },
      {
        name: 'DHT11 Temperature and Humidity Sensor Module',
        description: 'Digital temperature and humidity sensor with single wire interface. Provides accurate temperature and humidity readings for weather stations, greenhouses, and environmental monitoring projects.',
        price: 96,
        originalPrice: 146,
        category: 'sensors',
        image: '/images/dht11.jpg',
        images: ['/images/dht11.jpg'],
        stock: 75,
        featured: true,
        rating: {
          average: 4.2,
          count: 89
        },
        features: [
          'Single wire digital interface',
          'Temperature range: 0-50°C',
          'Humidity range: 20-90% RH',
          'Arduino compatible',
          'Long-term stability'
        ],
        specifications: {
          'Temperature Range': '0°C to 50°C',
          'Humidity Range': '20% to 90% RH',
          'Temperature Accuracy': '±2°C',
          'Humidity Accuracy': '±5% RH',
          'Sampling Rate': '1Hz',
          'Operating Voltage': '3.5V - 5.5V'
        }
      },
      {
        name: 'PIR Motion Detection Sensor - HC SR501',
        description: 'Passive infrared motion detection sensor for security applications',
        price: 89,
        originalPrice: 95,
        category: 'sensors',
        image: '/images/pir-sensor.png',
        stock: 60,
        featured: false
      },
      {
        name: 'IR Sensor Module - LM393 Photoelectric Sensor Module',
        description: 'Infrared proximity sensor for object detection',
        price: 35,
        originalPrice: 40,
        category: 'sensors',
        image: '/images/ir-sensor.png',
        stock: 80,
        featured: false
      },
      {
        name: 'LDR Sensor (Light Dependent Resistor) - 5mm',
        description: 'Light dependent resistor for ambient light detection',
        price: 10,
        originalPrice: 14,
        category: 'sensors',
        image: '/images/ldr-sensor.png',
        stock: 200,
        featured: false
      },
      {
        name: 'KY002 Shock Module',
        description: 'SW-420 vibration switch sensor module',
        price: 89,
        category: 'sensors',
        image: '/images/ky002.jpg',
        stock: 90,
        featured: false
      },
      {
        name: 'ZMPT101B AC Voltage Sensor',
        description: 'AC voltage sensor module for Arduino (0-250V AC)',
        price: 149,
        category: 'sensors',
        image: '/images/zmpt101b.jpg',
        stock: 20,
        featured: false
      },
      {
        name: 'MAX4466 Microphone Module',
        description: 'Electret microphone amplifier module with adjustable gain',
        price: 129,
        category: 'sensors',
        image: '/images/max4466.jpg',
        stock: 35,
        featured: false
      },
      {
        name: '3mm LED - Red Color',
        description: 'Standard 3mm red LED with 20mA forward current',
        price: 6,
        originalPrice: 9,
        category: 'other',
        image: '/images/led-red.jpg',
        stock: 500,
        featured: false
      },
      {
        name: 'Push Button (2 Pin Tactile Micro Switch)',
        description: 'Tactile push button switch for user input',
        price: 8,
        originalPrice: 10,
        category: 'other',
        image: '/images/push-button.jpg',
        stock: 300,
        featured: false
      },
      {
        name: '220-ohm, 1/4-Watt Resistor (Pack of 10)',
        description: '1/4W carbon film resistor pack of 10 pieces',
        price: 9,
        category: 'other',
        image: '/images/resistor-220.jpg',
        stock: 100,
        featured: false
      },
      {
        name: '9V Battery (Hi-Waote)',
        description: 'Alkaline 9V battery for portable electronics',
        price: 26,
        originalPrice: 35,
        category: 'power',
        image: '/images/9v-battery.png',
        stock: 50,
        featured: false
      },
      {
        name: '9V Battery Snap Connector',
        description: 'Snap connector for 9V battery terminals',
        price: 9,
        originalPrice: 12,
        category: 'connectors',
        image: '/images/9v-connector.png',
        stock: 100,
        featured: false
      },
      {
        name: 'USB to Micro USB Cable wire 1M for NodeMCU',
        description: 'Data transfer and charging cable for micro USB devices',
        price: 140,
        originalPrice: 199,
        category: 'connectors',
        image: '/images/usb-cable.jpg',
        stock: 75,
        featured: false
      },
      {
        name: 'Male to Male Jumper Wires (Set of 40)',
        description: '40-piece male-to-male jumper wire set for breadboarding',
        price: 56,
        originalPrice: 70,
        category: 'connectors',
        image: '/images/jumper-mm.jpg',
        stock: 50,
        featured: false
      },
      {
        name: 'Male to Female Jumper Wires (Set of 40)',
        description: '40-piece male-to-female jumper wire set for connections',
        price: 59,
        originalPrice: 85,
        category: 'connectors',
        image: '/images/jumper-mf.jpg',
        stock: 50,
        featured: false
      },
      {
        name: 'Breadboard - GL-12 840 Points',
        description: 'Half-size breadboard with 840 tie points for prototyping',
        price: 58,
        originalPrice: 76,
        category: 'other',
        image: '/images/breadboard.jpg',
        stock: 25,
        featured: false
      },
      {
        name: 'LM7809 9V DC / AC, Three Terminal Voltage, Regulator Power',
        description: '9V positive voltage regulator IC for power supply circuits',
        price: 298,
        originalPrice: 314,
        category: 'power',
        image: '/images/lm7809.jpg',
        stock: 100,
        featured: false
      },
      {
        name: 'XL7015 DC-DC Converter',
        description: 'DC-DC step-down converter module (4V-40V to 1.25V-35V)',
        price: 179,
        category: 'power',
        image: '/images/xl7015.jpg',
        stock: 40,
        featured: false
      },
      {
        name: '12-0-12V Transformer',
        description: '1A / 500mA Step-down transformer',
        price: 299,
        category: 'power',
        image: '/images/transformer-12v.jpg',
        stock: 20,
        featured: false
      },
      {
        name: '9-0-9V Transformer',
        description: '500mA Step-down transformer',
        price: 249,
        category: 'power',
        image: '/images/transformer-12v.jpg',
        stock: 15,
        featured: false
      },
      {
        name: '6-0-6V Transformer',
        description: '1A / 500mA Step-down transformer',
        price: 199,
        category: 'power',
        image: '/images/transformer-12v.jpg',
        stock: 25,
        featured: false
      },
      {
        name: 'Dual Shaft DC Geared Motor 100 RPM (BO Motor)',
        description: '6V DC gear motor with 100 RPM for robotics applications',
        price: 43,
        originalPrice: 63,
        category: 'motors',
        image: '/images/bo-motor.png',
        stock: 30,
        featured: false
      },
      {
        name: 'N30 DC Motor with Blade',
        description: '3V to 9V High-Speed Mini Fan Motor',
        price: 66,
        originalPrice: 46,
        category: 'motors',
        image: '/images/n30-motor.jpg',
        stock: 25,
        featured: false
      },
      {
        name: 'ULN2003 Motor Driver',
        description: 'Stepper motor driver board',
        price: 99,
        category: 'motors',
        image: '/images/tpa3116d2.jpg',
        stock: 20,
        featured: false
      },
      {
        name: 'TPA3116D2 Audio Amplifier',
        description: 'High-power audio amplifier board',
        price: 399,
        category: 'other',
        image: '/images/tpa3116d2.jpg',
        stock: 15,
        featured: false
      },
      {
        name: 'Single Channel Relay',
        description: '5V relay module with optocoupler',
        price: 79,
        category: 'other',
        image: '/images/zmpt101b.jpg',
        stock: 40,
        featured: false
      },
      {
        name: '2-Channel Relay Module',
        description: 'Dual relay with isolation',
        price: 149,
        category: 'other',
        image: '/images/zmpt101b.jpg',
        stock: 30,
        featured: false
      },
      {
        name: '4-Channel Relay Module',
        description: 'Quad relay with optocoupler',
        price: 249,
        category: 'other',
        image: '/images/zmpt101b.jpg',
        stock: 20,
        featured: false
      }
    ];

    await Product.insertMany(products);
    console.log('🛍️ Created products');
  } catch (error) {
    console.error('❌ Error creating products:', error);
    throw error;
  }
};

// Seed projects
const seedProjects = async () => {
  try {
    const projects = [
      {
        title: 'Home Automation System',
        description: 'ESP8266 + Arduino IoT Cloud; gas detection & blast protection; comprehensive safety monitoring with real-time alerts',
        technologies: ['ESP8266', 'Arduino IoT Cloud', 'Gas Sensors', 'React', 'Node.js'],
        category: 'IoT',
        status: 'completed',
        featured: true
      },
      {
        title: 'Live Bus Tracking System',
        description: 'ESP32 + GPS + Firebase; real-time updates with user-friendly interface; future geofencing & route optimization capabilities',
        technologies: ['ESP32', 'GPS', 'Firebase', 'React Native'],
        category: 'IoT',
        status: 'completed',
        featured: true
      },
      {
        title: 'Wearable Patch Antenna',
        description: 'Innovative textile patch integrated on jeans at 2.45 GHz & 5.8 GHz; precisely simulated in Ansys HFSS for optimal performance',
        technologies: ['Ansys HFSS', 'Textile Integration', 'RF Design'],
        category: 'Antenna',
        status: 'completed',
        featured: true
      },
      {
        title: 'Antenna Prototype Design',
        description: 'Comprehensive suite of Monopole, Yagi-Uda, Whip, Helix & Dipole designs; advanced RF simulation & rigorous testing protocols',
        technologies: ['Ansys HFSS', 'CST Studio', 'Antenna Theory', 'Prototyping'],
        category: 'Antenna',
        status: 'completed',
        featured: true
      }
    ];

    await Project.insertMany(projects);
    console.log('🚀 Created projects');
  } catch (error) {
    console.error('❌ Error creating projects:', error);
    throw error;
  }
};

// Seed testimonials
const seedTestimonials = async () => {
  try {
    const testimonials = [
      {
        name: 'Sarah Johnson',
        company: 'TechCorp Solutions',
        content: 'Exceptional design and robust embedded solutions! E_roots delivered exactly what we needed and exceeded our expectations.',
        rating: 5,
        featured: true
      },
      {
        name: 'Michael Chen',
        company: 'InnovateLabs',
        content: 'They transformed our idea into a functional IoT product within our timeline and budget. The attention to detail was impressive.',
        rating: 5,
        featured: true
      },
      {
        name: 'Dr. Emily Rodriguez',
        company: 'Research Institute',
        content: 'E_roots is our go-to for RF and app integration projects. Their technical expertise and problem-solving abilities are unmatched.',
        rating: 5,
        featured: true
      },
      {
        name: 'Alex Kumar',
        company: 'ElectroTech Ltd',
        content: 'Professional PCB design services with excellent support throughout the development process. Highly recommended for electronics projects.',
        rating: 5,
        featured: false
      },
      {
        name: 'Priya Sharma',
        company: 'Innovation Hub',
        content: 'Outstanding IoT solutions that transformed our business operations. The team\'s technical knowledge and project management skills are top-notch.',
        rating: 5,
        featured: false
      }
    ];

    await Testimonial.insertMany(testimonials);
    console.log('💬 Created testimonials');
  } catch (error) {
    console.error('❌ Error creating testimonials:', error);
    throw error;
  }
};

// Main seed function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    await connectDB();
    await clearCollections();
    await seedAdminUser();
    await seedServices();
    await seedProducts();
    await seedProjects();
    await seedTestimonials();
    
    console.log('✅ Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log('- 5 Services added');
    console.log('- 30 Products added');
    console.log('- 4 Projects added');
    console.log('- 5 Testimonials added');
    console.log('\n⚠️  Note: Admin user not created - please create admin user manually');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
