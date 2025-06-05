// db.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const connectDB = async () => {
  try {
    // Remove deprecated options: useNewUrlParser and useUnifiedTopology
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

module.exports = connectDB;