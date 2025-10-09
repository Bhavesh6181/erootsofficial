# Deployment Guide - E_roots MERN Application

This guide will help you deploy your E_roots MERN application to production.

## 🚀 Deployment Architecture

- **Frontend**: Vercel (React app)
- **Backend**: Render/Heroku (Node.js API)
- **Database**: MongoDB Atlas (Cloud database)

## 📋 Pre-Deployment Checklist

1. ✅ Complete development and testing
2. ✅ Set up MongoDB Atlas cluster
3. ✅ Prepare environment variables
4. ✅ Configure domain and SSL certificates
5. ✅ Set up monitoring and logging

## 🗄️ Database Setup (MongoDB Atlas)

### 1. Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster (M0 Sandbox is free)

### 2. Configure Database Access
1. Go to Database Access
2. Add a new database user with read/write permissions
3. Note down the username and password

### 3. Configure Network Access
1. Go to Network Access
2. Add your IP address (0.0.0.0/0 for all IPs - not recommended for production)
3. For production, add specific IP ranges

### 4. Get Connection String
1. Go to Clusters
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password

## 🖥️ Backend Deployment (Render)

### 1. Prepare Backend for Production
1. Create a new repository on GitHub
2. Push your code to the repository
3. Ensure all dependencies are in `package.json`

### 2. Deploy to Render
1. Go to [Render](https://render.com)
2. Sign up with your GitHub account
3. Click "New" → "Web Service"
4. Connect your repository
5. Configure the service:
   - **Name**: eroots-api
   - **Environment**: Node
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Instance Type**: Free tier

### 3. Environment Variables (Render)
Add these environment variables in Render dashboard:

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/eroots
JWT_SECRET=your_super_secure_jwt_secret_here
CLIENT_URL=https://your-frontend-domain.vercel.app
# Admin credentials - set your own
ADMIN_EMAIL=your-admin@email.com
ADMIN_PASSWORD=your-secure-password
```

### 4. Deploy
1. Click "Create Web Service"
2. Wait for deployment to complete
3. Note the service URL (e.g., `https://eroots-api.onrender.com`)

## 🌐 Frontend Deployment (Vercel)

### 1. Prepare Frontend for Production
1. Update API URL in environment variables
2. Ensure build configuration is correct
3. Test the build locally: `cd client && npm run build`

### 2. Deploy to Vercel
1. Go to [Vercel](https://vercel.com)
2. Sign up with your GitHub account
3. Click "New Project"
4. Import your repository
5. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3. Environment Variables (Vercel)
Add these environment variables in Vercel dashboard:

```env
VITE_API_URL=https://eroots-api.onrender.com/api
VITE_APP_NAME=E_roots
VITE_APP_DESCRIPTION=Smart Systems. Smarter Engineering.
VITE_APP_URL=https://your-domain.vercel.app
VITE_CONTACT_EMAIL=eroots2025@gmail.com
VITE_CONTACT_PHONE=+917350059825
VITE_CONTACT_ADDRESS=Pune, Maharashtra, India
VITE_WHATSAPP_URL=https://wa.me/917350059825
```

### 4. Deploy
1. Click "Deploy"
2. Wait for deployment to complete
3. Note the deployment URL

## 🔧 Post-Deployment Configuration

### 1. Update CORS Settings
Update your backend CORS configuration to include your production frontend URL:

```javascript
app.use(cors({
  origin: [
    'https://your-domain.vercel.app',
    'http://localhost:3000' // For development
  ],
  credentials: true
}));
```

### 2. Seed Production Database
Run the seed script to populate your production database:

```bash
# Set production environment variables
export MONGODB_URI="your_production_mongodb_uri"
export NODE_ENV="production"

# Run seed script
cd backend
node seedData.js
```

### 3. Configure Domain (Optional)
1. Buy a custom domain
2. Configure DNS settings to point to Vercel
3. Update environment variables with custom domain

## 🔒 Security Considerations

### 1. Environment Variables
- Use strong, unique passwords
- Generate secure JWT secrets
- Never commit `.env` files to version control

### 2. Database Security
- Use strong database passwords
- Restrict network access to specific IPs
- Enable database encryption

### 3. API Security
- Implement rate limiting
- Use HTTPS in production
- Validate all input data
- Implement proper error handling

### 4. Admin Access
- Change default admin credentials
- Use strong passwords
- Consider implementing 2FA

## 📊 Monitoring and Analytics

### 1. Application Monitoring
- Set up error tracking (Sentry)
- Monitor API performance
- Set up uptime monitoring

### 2. Database Monitoring
- Monitor database performance
- Set up alerts for issues
- Regular backup verification

### 3. Analytics
- Set up Google Analytics
- Monitor user behavior
- Track conversion rates

## 🔄 CI/CD Pipeline

### 1. GitHub Actions (Optional)
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./frontend

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Render
        run: |
          curl -X POST "${{ secrets.RENDER_DEPLOY_HOOK }}"
```

### 2. Environment Variables in GitHub
Add these secrets in GitHub repository settings:
- `VERCEL_TOKEN`
- `ORG_ID`
- `PROJECT_ID`
- `RENDER_DEPLOY_HOOK`

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check CORS configuration in backend
   - Verify frontend URL is whitelisted

2. **Database Connection Issues**
   - Verify MongoDB Atlas connection string
   - Check network access settings
   - Ensure database user has correct permissions

3. **Build Failures**
   - Check environment variables
   - Verify all dependencies are installed
   - Review build logs for specific errors

4. **Authentication Issues**
   - Verify JWT secret is set correctly
   - Check token expiration settings
   - Ensure admin credentials are correct

### Support
- Check deployment logs in respective platforms
- Review application logs for errors
- Test API endpoints using Postman or similar tools

## 📝 Maintenance

### Regular Tasks
1. **Database Backups**: Set up automated backups
2. **Security Updates**: Keep dependencies updated
3. **Performance Monitoring**: Monitor response times
4. **Content Updates**: Keep content fresh and relevant

### Updates and Deployments
1. Test changes in development environment
2. Deploy to staging environment (optional)
3. Deploy to production during low-traffic periods
4. Monitor for issues after deployment

---

## 🎉 Congratulations!

Your E_roots MERN application is now deployed and ready for production use!

**Production URLs:**
- Frontend: `https://your-domain.vercel.app`
- Backend API: `https://eroots-api.onrender.com`
- Admin Dashboard: `https://your-domain.vercel.app/admin`

Remember to:
- Update your contact information in the deployed application
- Set up proper monitoring and alerts
- Keep your application updated and secure
- Monitor performance and user feedback
