# Car Expert System - Online Maintenance & Troubleshooting

A comprehensive online expert system for car maintenance and troubleshooting built with Next.js, MongoDB, and JWT authentication.

## Features

- **User Authentication**: Secure JWT-based authentication with registration and login
- **Vehicle Management**: Add and manage multiple vehicles
- **Expert System Engine**: Rule-based diagnosis system that matches symptoms to faults
- **Symptom Selection**: Categorized symptoms for accurate diagnosis
- **Diagnosis Results**: Detailed fault information with solutions and confidence levels
- **Consultation History**: Track all past consultations and diagnoses
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with bcryptjs for password hashing
- **Deployment**: Vercel-ready configuration

## Database Schema

The system implements the following entities as specified in the design document:

- **Users**: User accounts with roles (Admin/User)
- **Vehicles**: User's vehicle information
- **Symptoms**: Categorized car symptoms
- **Faults**: Possible car faults with severity levels
- **Solutions**: Repair instructions with cost estimates
- **Rules**: Diagnostic rules linking symptoms to faults
- **Consultations**: History of user consultations

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd online-expert-system-for-car-maintenance-and-trobubleshooting
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/car-expert-system
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

4. Start MongoDB:
Make sure MongoDB is running on your system.

5. Seed the database:
```bash
npm run seed
```

6. Start the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### For Users

1. **Register/Login**: Create an account or sign in
2. **Add Vehicles**: Add your vehicles in the Vehicles section
3. **Start Consultation**: 
   - Select your vehicle
   - Choose symptoms from categorized lists
   - Get instant diagnosis with solutions
4. **View History**: Check past consultations and diagnoses

### Expert System Algorithm

The system uses a rule-based inference engine:

1. User selects symptoms from categorized lists
2. System matches symptoms against diagnostic rules
3. Rules are evaluated with confidence levels
4. Matching faults are identified and ranked by confidence
5. Solutions are provided with cost estimates and difficulty levels

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Vehicles
- `GET /api/vehicles` - Get user's vehicles
- `POST /api/vehicles` - Add new vehicle

### Diagnosis
- `POST /api/diagnosis` - Perform diagnosis
- `GET /api/symptoms` - Get symptoms (with grouping option)

### Consultations
- `GET /api/consultations` - Get consultation history

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   ├── vehicles/          # Vehicle management
│   ├── consultation/      # Consultation interface
│   ├── history/          # Consultation history
│   ├── login/            # Login page
│   └── register/         # Registration page
├── components/            # Reusable components
├── lib/                  # Utility libraries
│   ├── mongodb.ts        # Database connection
│   ├── auth.ts           # Authentication utilities
│   └── expertSystem.ts   # Expert system engine
├── models/               # MongoDB models
├── scripts/              # Database seeding scripts
└── middleware.ts         # Route protection middleware
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
