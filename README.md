E_roots - Engineering Freelance Studio

📌 Overview
E_roots is a professional engineering freelance studio specializing in embedded systems, IoT development, PCB & antenna design, and web/app solutions. This repository contains the source code for the E_roots official website.
✨ Features

Responsive Design: Fully optimized for all device sizes
Modern UI: Clean, professional interface with smooth animations
Contact Form: Integrated with Formspree for easy client inquiries
Visitor Counter: Tracks and displays site visitor statistics
Performance Optimized: Fast loading and rendering

🖥️ Live Demo
View Live Site
🛠️ Technologies Used

HTML5
CSS3 (with modern features like Flexbox, Grid, Animations)
JavaScript (ES6+)
FormSpree API for form handling
localStorage/sessionStorage for visitor tracking

📋 Project Structure
├── index.html          # Main HTML document
├── styles.css          # CSS styles (included inline in HTML for this project)
├── script.js           # JavaScript functionality (included inline in HTML for this project)
├── assets/             # Directory for images and other assets
│   ├── images/         
│   └── icons/          
└── README.md           # Project documentation
🚀 Setup and Deployment
Local Development

Clone this repository:
bashgit clone https://github.com/your-username/eroots-website.git
cd eroots-website

Open index.html in your browser:
bash# On macOS
open index.html

# On Windows
start index.html

# On Linux
xdg-open index.html

For development with live reload, you can use a local server:
bash# Using Python
python -m http.server

# Or install live-server via npm
npm install -g live-server
live-server


Deployment
GitHub Pages

Push your code to GitHub
bashgit add .
git commit -m "Initial commit"
git push origin main

Enable GitHub Pages in your repository settings:

Go to Settings > Pages
Select main branch as source
Click Save



Other Hosting Options
The site can be deployed on any static website hosting service:

Netlify
Vercel
Firebase Hosting
Amazon S3

⚙️ Configuration
Form Submission
The contact form is configured to use Formspree. To change the form endpoint:

Open index.html
Find the form element:
html<form action="https://formspree.io/f/mldbagao" method="POST">

Replace the Formspree ID with your own

Visitor Counter
The visitor counter uses browser localStorage/sessionStorage. For a production environment, you might want to:

Implement a server-side counter, or
Integrate with an analytics service like Google Analytics

📝 Customization Guide
Changing Colors
The site uses a blue color scheme. To change it:

Open index.html
Find color-related CSS variables and gradients:

Main colors: #1e40af, #3b82f6
Background colors: #f8fafc, #f1f5f9
Replace with your preferred colors



Updating Content

Services: Update the cards in the "services" section
Projects: Modify the project cards in the "projects" section
Testimonials: Change the testimonial quotes
Contact Info: Update contact details in the footer

🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

Fork the repository
Create a new branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add some amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
📞 Contact
E_roots Engineering Studio

📍 Dhankawadi, Pune
📞 7350059825
📧 eroots2025@gmail.com


© 2025 E_roots. All Rights Reserved.
