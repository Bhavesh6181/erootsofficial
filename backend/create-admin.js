#!/usr/bin/env node

/**
 * Create Admin User Script
 * 
 * This script helps you create the first admin user for your Eroots application.
 * Run this after setting up your database and before using the admin panel.
 * 
 * Usage:
 *   node create-admin.js
 *   or
 *   npm run create-admin
 */

require('./config/loadEnv');
const mongoose = require('mongoose');
const User = require('./models/User');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function createAdminUser() {
  try {
    console.log('🚀 Eroots Admin User Creation Script');
    console.log('=====================================\n');

    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eroots');
    console.log('✅ Connected to MongoDB\n');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists:');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Role: ${existingAdmin.role}`);
      console.log('\nTo create another admin user, update an existing user record manually or use a protected maintenance workflow.\n');
      process.exit(0);
    }

    // Get admin details
    console.log('👤 Creating new admin user...\n');
    
    const email = await question('Enter admin email: ');
    if (!email || !email.includes('@')) {
      console.log('❌ Invalid email address');
      process.exit(1);
    }

    const password = await question('Enter admin password (min 6 characters): ');
    if (!password || password.length < 6) {
      console.log('❌ Password must be at least 6 characters');
      process.exit(1);
    }

    const name = await question('Enter admin name (optional): ') || 'Admin';

    // Create admin user
    console.log('\n🔄 Creating admin user...');
    const adminUser = new User({
      email: email.toLowerCase().trim(),
      password,
      name: name.trim(),
      role: 'admin',
      isVerified: true
    });

    await adminUser.save();

    console.log('✅ Admin user created successfully!');
    console.log('\n📋 Admin Details:');
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Name: ${adminUser.name}`);
    console.log(`   Role: ${adminUser.role}`);
    console.log(`   Verified: ${adminUser.isVerified}`);
    
    console.log('\n🎉 You can now login to the admin panel!');
    console.log('   Frontend: http://localhost:5173/admin');
    console.log('   Backend: http://localhost:5000/api');

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    if (error.code === 11000) {
      console.log('\n💡 This email is already registered. Please use a different email or login with existing credentials.');
    }
  } finally {
    await mongoose.connection.close();
    rl.close();
    process.exit(0);
  }
}

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\n\n👋 Admin creation cancelled.');
  await mongoose.connection.close();
  rl.close();
  process.exit(0);
});

// Run the script
createAdminUser();
