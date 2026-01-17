import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// MongoDB connection
const MONGODB_URI = 'mongodb+srv://user_db_user:r279PhhU0dKXoOsI@fuzzy-based-expert-syst.2cx2z6f.mongodb.net/car-maintenance-and-trobubleshooting?retryWrites=true&w=majority';

// User schema
const UserSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  fullname: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['Admin', 'User'],
    default: 'User'
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', UserSchema);

async function createAdminUser() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to database');

    // Admin user details
    const adminData = {
      fullname: 'System Administrator',
      email: 'admin@carexpert.com',
      password: 'admin123',
      role: 'Admin'
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log('❌ Admin user already exists!');
      console.log('📧 Email:', adminData.email);
      console.log('🔑 Password: admin123');
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(adminData.password, salt);

    // Create admin user
    const adminUser = new User({
      fullname: adminData.fullname,
      email: adminData.email,
      password: hashedPassword,
      role: adminData.role
    });

    await adminUser.save();

    console.log('✅ Admin user created successfully!');
    console.log('');
    console.log('🔐 ADMIN LOGIN DETAILS:');
    console.log('📧 Email: admin@carexpert.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Role: Admin');
    console.log('');
    console.log('⚠️  IMPORTANT: Change the password after first login!');
    console.log('🌐 Login at: http://localhost:3000/login');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database');
  }
}

// Run the script
createAdminUser().then(() => process.exit(0));