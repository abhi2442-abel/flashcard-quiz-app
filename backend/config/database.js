require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/flashcard-quiz';
    
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`\n✅ MongoDB Connected`);
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}\n`);
    
    return conn;
  } catch (error) {
    console.error(`\n❌ MongoDB Connection Error:`);
    console.error(`   ${error.message}\n`);
    process.exit(1);
  }
};

module.exports = connectDB;
