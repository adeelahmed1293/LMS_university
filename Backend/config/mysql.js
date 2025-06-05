// config/mysql.js
const mysql = require('mysql2/promise');

// MySQL connection configuration for XAMPP
const mysqlConfig = {
  host: 'localhost',
  user: 'root',
  password: '', // Default XAMPP password is empty
  database: 'university_lms_backup',
  port: 3306,
  connectTimeout: 20000 // 20 seconds - this is the only valid timeout option
};

// Test MySQL connection function
async function testMySQLConnection() {
  try {
    console.log('🔍 Testing MySQL connection...');
    console.log('Connection config:', {
      host: mysqlConfig.host,
      user: mysqlConfig.user,
      port: mysqlConfig.port,
      database: mysqlConfig.database
    });
    
    const connection = await mysql.createConnection({
      host: mysqlConfig.host,
      user: mysqlConfig.user,
      password: mysqlConfig.password,
      port: mysqlConfig.port,
      connectTimeout: mysqlConfig.connectTimeout
      // Don't specify database initially to test basic connection
    });
    
    console.log('✅ MySQL connection test successful');
    await connection.end();
    return true;
  } catch (error) {
    console.error('❌ MySQL connection test failed:', error.message);
    console.error('Error code:', error.code);
    return false;
  }
}

// Create MySQL connection with better error handling
async function createMySQLConnection() {
  try {
    console.log('🔌 Attempting to connect to MySQL...');
    
    // First test basic connection
    const canConnect = await testMySQLConnection();
    if (!canConnect) {
      throw new Error('Basic MySQL connection test failed. Please check if MySQL is running.');
    }
    
    // Create connection without specifying database first
    const connection = await mysql.createConnection({
      host: mysqlConfig.host,
      user: mysqlConfig.user,
      password: mysqlConfig.password,
      port: mysqlConfig.port,
      connectTimeout: mysqlConfig.connectTimeout
    });
    
    console.log('✅ Connected to MySQL server');
    return connection;
  } catch (error) {
    console.error('❌ MySQL connection error:', error.message);
    
    // Provide specific error messages based on error code
    if (error.code === 'ECONNREFUSED') {
      throw new Error('MySQL connection refused. Please ensure XAMPP MySQL service is running on port 3306.');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      throw new Error('MySQL access denied. Check username and password.');
    } else if (error.code === 'ENOTFOUND') {
      throw new Error('MySQL host not found. Check if localhost is correct.');
    } else {
      throw error;
    }
  }
}

module.exports = {
  mysqlConfig,
  testMySQLConnection,
  createMySQLConnection
};