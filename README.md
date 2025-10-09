# E_roots | Smart Systems. Smarter Engineering.

A professional MERN stack application for E_roots Engineering Studio, specializing in embedded systems, IoT development, PCB design, antenna design, and web/app development.

## 🚀 Features

### Frontend (React + Vite + Tailwind CSS)
- **Modern UI/UX**: Professional, responsive design with smooth animations using Framer Motion
- **Component-Based Architecture**: Reusable React components with TypeScript
- **State Management**: Context API for cart and authentication
- **SEO Optimized**: React Helmet for meta tags and social sharing
- **PWA Ready**: Service worker and manifest for offline capabilities

### Backend (Node.js + Express)
- **RESTful API**: Well-structured API endpoints for all operations
- **Authentication**: JWT-based authentication with role-based access control
- **Data Validation**: Express-validator for input validation
- **Security**: Helmet, CORS, and rate limiting
- **Error Handling**: Comprehensive error handling and logging

### Database (MongoDB + Mongoose)
- **Data Models**: Structured schemas for all entities
- **Relationships**: Proper data relationships and indexing
- **Validation**: Schema-level validation and constraints

### Admin Dashboard
- **CRUD Operations**: Full management interface for all content
- **Analytics**: Dashboard with statistics and insights
- **Content Management**: Easy management of services, products, projects, and testimonials
- **Request Management**: Handle client project requests

## 📁 Project Structure

```
eroots-mern-app/
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   ├── utils/          # Utility functions
│   │   └── types/          # TypeScript types
│   ├── public/             # Static assets
│   └── package.json
├── backend/                # Node.js backend
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── config/             # Configuration files
│   └── package.json
└── README.md
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router** - Client-side routing
- **React Hook Form** - Form handling
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcryptjs** - Password hashing
- **Express Validator** - Input validation
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd eroots-mern-app
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   
   Create `.env` file in the server directory:
   ```env
   NODE_ENV=development
   PORT=5000
   CLIENT_URL=http://localhost:3000
   MONGODB_URI=mongodb://localhost:27017/eroots
   JWT_SECRET=your_super_secret_jwt_key_here
   # Admin credentials - set your own
   ADMIN_EMAIL=your-admin@email.com
   ADMIN_PASSWORD=your-secure-password
   ```

4. **Seed the database** (Optional)
   ```bash
   cd backend
   npm run seed
   ```

5. **Create admin user** (Required for admin access)
   ```bash
   cd backend
   npm run create-admin
   ```
   Follow the prompts to create your first admin user.

6. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

## 📱 Usage

### Public Features
- **Homepage**: Company overview and featured content
- **Services**: Browse available engineering services
- **Projects**: View completed projects portfolio
- **Store**: Browse and purchase electronic components
- **Contact**: Submit project requests

### Admin Features
- **Dashboard**: Overview of statistics and recent activity
- **Services Management**: Add, edit, delete services
- **Products Management**: Manage store inventory
- **Projects Management**: Showcase portfolio projects
- **Requests Management**: Handle client inquiries
- **Testimonials Management**: Manage client reviews

### Admin Access
- **First Time Setup**: Run `npm run create-admin` in the backend directory
- **Admin Dashboard**: Access at `/admin` after creating admin user
- **Features**: Manage services, products, projects, requests, and testimonials
- **Security**: Admin users are created with proper password hashing and JWT authentication

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set build command: `cd frontend && npm run build`
3. Set output directory: `frontend/dist`
4. Add environment variables:
   ```
   VITE_API_URL=https://your-backend-url.com/api
   ```

### Backend (Render/Heroku)
1. Create a new web service
2. Connect your GitHub repository
3. Set build command: `cd backend && npm install`
4. Set start command: `cd backend && npm start`
5. Add environment variables:
   ```
   NODE_ENV=production
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_production_jwt_secret
   CLIENT_URL=https://your-frontend-url.com
   ```

### Database (MongoDB Atlas)
1. Create a MongoDB Atlas cluster
2. Create a database user
3. Whitelist your server IP addresses
4. Get your connection string and add to environment variables

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/verify` - Verify JWT token
- `POST /api/auth/logout` - User logout

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get service by ID
- `POST /api/services` - Create service (Admin)
- `PUT /api/services/:id` - Update service (Admin)
- `DELETE /api/services/:id` - Delete service (Admin)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create project (Admin)
- `PUT /api/projects/:id` - Update project (Admin)
- `DELETE /api/projects/:id` - Delete project (Admin)

### Requests
- `GET /api/requests` - Get all requests (Admin)
- `GET /api/requests/:id` - Get request by ID (Admin)
- `POST /api/requests` - Submit project request (Public)
- `PUT /api/requests/:id` - Update request status (Admin)
- `DELETE /api/requests/:id` - Delete request (Admin)

### Testimonials
- `GET /api/testimonials` - Get all testimonials
- `GET /api/testimonials/:id` - Get testimonial by ID
- `POST /api/testimonials` - Create testimonial (Admin)
- `PUT /api/testimonials/:id` - Update testimonial (Admin)
- `DELETE /api/testimonials/:id` - Delete testimonial (Admin)

## 🎨 Customization

### Styling
- Modify `frontend/tailwind.config.js` for theme customization
- Update colors, fonts, and spacing in the config
- Add custom components in `frontend/src/components/`

### Content
- Update company information in components
- Modify services, projects, and products data
- Customize testimonials and contact information

### Features
- Add new API endpoints in `backend/routes/`
- Create new React components as needed
- Extend database models for additional fields

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

**E_roots Engineering Studio**

📍 **Location**: Pune, Maharashtra, India  
📞 **Phone**: +91 7350059825  
📧 **Email**: eroots2025@gmail.com  
🌐 **Website**: [Your Website URL]

---

© 2025 E_roots. All Rights Reserved.