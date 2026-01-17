# Car Expert System - Setup Guide

## Quick Start

Follow these steps to get the Car Expert System running on your local machine:

### 1. Prerequisites

Make sure you have the following installed:
- **Node.js 18+** - [Download here](https://nodejs.org/)
- **MongoDB** - [Download here](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Git** - [Download here](https://git-scm.com/)

### 2. Installation

```bash
# Clone the repository
git clone <your-repository-url>
cd online-expert-system-for-car-maintenance-and-trobubleshooting

# Install dependencies
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/car-expert-system
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

**Important:** 
- If using MongoDB Atlas, replace the MONGODB_URI with your Atlas connection string
- Change the JWT_SECRET to a secure random string in production

### 4. Database Setup

Start MongoDB (if running locally):
```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Windows
net start MongoDB

# On Linux
sudo systemctl start mongod
```

Seed the database with sample data:
```bash
npm run seed
```

This will create:
- 28 car symptoms across different categories
- 8 common car faults
- 8 diagnostic rules
- 8 repair solutions

### 5. Start the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Test the System

1. **Register a new account** at `/register`
2. **Add a vehicle** in the Vehicles section
3. **Start a consultation** and select symptoms
4. **View the diagnosis** and recommended solutions
5. **Check your history** to see past consultations

## System Features

### For Regular Users:
- ✅ User registration and authentication
- ✅ Vehicle management (add multiple vehicles)
- ✅ Symptom-based diagnosis
- ✅ Detailed repair solutions with cost estimates
- ✅ Consultation history tracking
- ✅ Responsive mobile-friendly design

### For Administrators:
- ✅ Admin dashboard with system statistics
- ✅ User role management
- 🔄 Symptom management (basic framework)
- 🔄 Diagnostic rule management (basic framework)

### Expert System Engine:
- ✅ Rule-based inference system
- ✅ Symptom matching with confidence levels
- ✅ Multiple diagnosis ranking
- ✅ Solution recommendations with difficulty levels

## Database Schema

The system implements these main entities:

```
Users ──┐
        ├── Vehicles ──┐
        └── Consultations ──┤
                           ├── Symptoms
                           └── Faults ── Solutions
                                    └── Rules
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login  
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Core Features
- `GET/POST /api/vehicles` - Vehicle management
- `POST /api/diagnosis` - Perform diagnosis
- `GET /api/symptoms` - Get symptoms (with grouping)
- `GET /api/consultations` - Get consultation history

## Troubleshooting

### Common Issues:

**MongoDB Connection Error:**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
- Make sure MongoDB is running
- Check your MONGODB_URI in `.env.local`

**Build Warnings:**
- The JWT and bcrypt warnings during build are normal for server-side authentication

**Port Already in Use:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Development Tips:

1. **View Database:** Use MongoDB Compass or Studio 3T to inspect your data
2. **API Testing:** Use Postman or curl to test API endpoints
3. **Logs:** Check browser console and terminal for error messages
4. **Hot Reload:** The app automatically reloads when you make changes

## Production Deployment

### Environment Variables for Production:
```env
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-secure-random-jwt-secret
NODE_ENV=production
```

### Deployment Platforms:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Railway**
- **Heroku**

### Database Options:
- **MongoDB Atlas** (recommended)
- **Railway MongoDB**
- **DigitalOcean Managed MongoDB**

## Next Steps

After getting the system running, you can:

1. **Expand the Knowledge Base:**
   - Add more symptoms and faults
   - Create more diagnostic rules
   - Add vehicle-specific diagnoses

2. **Enhance Features:**
   - Add image upload for symptoms
   - Implement email notifications
   - Add maintenance scheduling
   - Create mobile app with React Native

3. **Improve Admin Panel:**
   - Full CRUD operations for all entities
   - Analytics and reporting
   - User management tools

## Support

If you encounter any issues:
1. Check this setup guide
2. Review the error messages carefully
3. Check the GitHub issues
4. Create a new issue with detailed error information

Happy diagnosing! 🚗🔧