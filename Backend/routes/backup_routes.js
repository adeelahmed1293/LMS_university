// routes/backup.js
const express = require('express');
const { testMySQLConnection, createMySQLConnection } = require('../config/mysql');
const { createSQLTables } = require('../schemas/sqlTables');
const { performFullBackup, getBackupStatus, backupOnlyImages } = require('../services/backupService');

const router = express.Router();

// Test MySQL connection route
router.get('/test-mysql-connection', async (req, res) => {
  try {
    console.log('🔍 Testing MySQL connection via API...');
    const canConnect = await testMySQLConnection();
        
    if (canConnect) {
      res.json({
        success: true,
        message: 'MySQL connection successful',
        config: {
          host: 'localhost',
          user: 'root',
          port: 3306,
          database: 'university_lms_backup'
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'MySQL connection failed',
        suggestion: 'Please ensure XAMPP MySQL service is running'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'MySQL connection test failed',
      error: error.message
    });
  }
});

// Main backup route with improved error handling and image support
router.post('/backup-nosql-to-sql', async (req, res) => {
  let connection;
    
  try {
    console.log('🚀 Starting NoSQL to SQL backup process...');
        
    // Test connection first
    const canConnect = await testMySQLConnection();
    if (!canConnect) {
      return res.status(500).json({
        success: false,
        message: 'Cannot connect to MySQL. Please ensure XAMPP MySQL service is running.',
        suggestion: 'Start XAMPP Control Panel and ensure MySQL service is running'
      });
    }
        
    // Connect to MySQL
    connection = await createMySQLConnection();
        
    // Create database if it doesn't exist
    console.log('📝 Creating database...');
    await connection.query('CREATE DATABASE IF NOT EXISTS university_lms_backup');
    await connection.query('USE university_lms_backup');
        
    // Create tables
    console.log('📋 Creating SQL tables...');
    await createSQLTables(connection);
        
    // Perform the backup
    console.log('💾 Starting data backup (including images)...');
    const backupStats = await performFullBackup(connection);
        
    console.log('✅ Backup completed successfully!');
    console.log('📊 Backup Statistics:', backupStats);
        
    res.status(200).json({
      success: true,
      message: 'Backup completed successfully (including images)',
      timestamp: new Date().toISOString(),
      statistics: backupStats,
      recordsProcessed: backupStats.processedRecords,
      tablesBackedUp: Object.keys(backupStats.tables).length
    });
      
  } catch (error) {
    console.error('❌ Backup failed:', error.message);
    res.status(500).json({
      success: false,
      message: 'Backup failed',
      error: error.message,
      timestamp: new Date().toISOString(),
      suggestion: error.message.includes('MySQL') ? 
        'Please ensure XAMPP MySQL service is running' : 
        'Check server logs for details. If image backup failed, try the image-only backup endpoint.'
    });
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 MySQL connection closed');
    }
  }
});

// Separate route for backing up only images (useful for troubleshooting)
router.post('/backup-images-only', async (req, res) => {
  let connection;
    
  try {
    console.log('🖼️ Starting image-only backup process...');
        
    const canConnect = await testMySQLConnection();
    if (!canConnect) {
      return res.status(500).json({
        success: false,
        message: 'Cannot connect to MySQL. Please ensure XAMPP MySQL service is running.'
      });
    }
        
    connection = await createMySQLConnection();
    await connection.query('USE university_lms_backup');
        
    const imageStats = await backupOnlyImages(connection);
        
    console.log('✅ Image backup completed!');
    console.log('📊 Image Backup Statistics:', imageStats);
        
    res.status(200).json({
      success: true,
      message: 'Image backup completed successfully',
      timestamp: new Date().toISOString(),
      statistics: imageStats
    });
      
  } catch (error) {
    console.error('❌ Image backup failed:', error.message);
    res.status(500).json({
      success: false,
      message: 'Image backup failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

// Get backup status route with image information
router.get('/backup-status', async (req, res) => {
  let connection;
    
  try {
    connection = await createMySQLConnection();
    await connection.query('USE university_lms_backup');
        
    const status = await getBackupStatus(connection);
        
    res.json({
      success: true,
      backupExists: true,
      tableStats: status,
      timestamp: new Date().toISOString(),
      summary: {
        totalTables: Object.keys(status).length,
        tablesWithImages: Object.keys(status).filter(table => 
          status[table].hasImages
        ).length,
        totalRecords: Object.values(status).reduce((sum, table) => 
          sum + (table.count || 0), 0
        )
      }
    });
      
  } catch (error) {
    res.json({
      success: false,
      backupExists: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

// Route to check image backup status specifically
router.get('/image-backup-status', async (req, res) => {
  let connection;
    
  try {
    connection = await createMySQLConnection();
    await connection.query('USE university_lms_backup');
        
    const imageStatus = {};
    const imageTables = ['teachers', 'hods'];
    
    for (const table of imageTables) {
      try {
        const [totalRows] = await connection.execute(`SELECT COUNT(*) as count FROM ${table}`);
        const [imageRows] = await connection.execute(
          `SELECT COUNT(*) as count FROM ${table} WHERE profile_image_data IS NOT NULL`
        );
        
        imageStatus[table] = {
          total: totalRows[0].count,
          withImages: imageRows[0].count,
          withoutImages: totalRows[0].count - imageRows[0].count
        };
      } catch (error) {
        imageStatus[table] = { error: error.message };
      }
    }
        
    res.json({
      success: true,
      imageStatus,
      timestamp: new Date().toISOString()
    });
      
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

module.exports = router;