// Middleware to check if essential environment variables are set
const envChecker = (req, res, next) => {
  const requiredVars = ['MONGO_URI', 'JWT_SECRET'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error(`Error: Missing required environment variables: ${missingVars.join(', ')}`);
    console.error('Please create a .env file with the following variables:');
    console.error(`MONGO_URI=mongodb://localhost:27017/university_lms
JWT_SECRET=your_jwt_secret_key_here`);
    
    return res.status(500).json({ 
      message: 'Server configuration error. Check server logs for details.' 
    });
  }
  
  next();
};

module.exports = envChecker; 