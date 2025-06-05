const {
  getModel,
  convertMongoDocToSQL,
  insertDataIntoSQL,
  deleteMissingRecords,
  backupImagesTable
} = require('../utils/dataConverter');

const User = require('../schemas/User');
const Teacher = require('../schemas/Teacher');
const Student = require('../schemas/Student');
const HOD = require('../schemas/Hod');
const Portal = require('../schemas/Portal');
const SubPortal = require('../schemas/SubPortal');
const Quiz = require('../schemas/Quiz');
const QuizResult = require('../schemas/QuizResult');
const Performance = require('../schemas/PerformanceMetrics');
const Feedback = require('../schemas/Feedback');
const ExtensionRequest = require('../schemas/ExtensionRequest');
const Course = require('../schemas/Course');
const Announcement = require('../schemas/Announcement');

async function performFullBackup(connection) {
  const backupStats = {
    totalRecords: 0,
    processedRecords: 0,
    tables: {}
  };

  const imageCollections = [
    { name: 'teachers', model: Teacher },
    { name: 'hods', model: HOD }
  ];

  const regularCollections = [
    { name: 'users', model: User },
    { name: 'students', model: Student },
    { name: 'portals', model: Portal },
    { name: 'sub_portals', model: SubPortal },
    { name: 'courses', model: Course },
    { name: 'quizzes', model: Quiz },
    { name: 'quiz_results', model: QuizResult },
    { name: 'performances', model: Performance },
    { name: 'feedbacks', model: Feedback },
    { name: 'extension_requests', model: ExtensionRequest },
    { name: 'announcements', model: Announcement }
  ];

  // Backup regular collections
  for (const { name, model } of regularCollections) {
    console.log(`📂 Backing up ${name}...`);
    try {
      const Model = getModel(model);
      const documents = await Model.find({});
      const sqlData = documents.map(convertMongoDocToSQL);
      const inserted = await insertDataIntoSQL(connection, name, sqlData);
      await deleteMissingRecords(connection, name, sqlData.map(doc => doc.id));

      backupStats.tables[name] = {
        total: documents.length,
        inserted
      };
      backupStats.totalRecords += documents.length;
      backupStats.processedRecords += inserted;

      console.log(`✅ Successfully backed up ${inserted}/${documents.length} records from ${name}`);
    } catch (error) {
      console.error(`❌ Error backing up ${name}:`, error.message);
      backupStats.tables[name] = {
        total: 0,
        inserted: 0,
        error: error.message
      };
    }
  }

  // Backup collections with image data
  for (const { name, model } of imageCollections) {
    console.log(`📸 Backing up ${name} with images...`);
    try {
      const Model = getModel(model);
      const documents = await Model.find({});
      const sqlData = documents.map(doc => {
        const converted = convertMongoDocToSQL(doc);
        if (doc.profileImageData) {
          converted.profile_image_data = doc.profileImageData;
          converted.profile_image_content_type = doc.profileImageContentType;
        }
        return converted;
      });

      const inserted = await insertDataIntoSQL(connection, name, sqlData);
      await deleteMissingRecords(connection, name, sqlData.map(doc => doc.id));

      backupStats.tables[name] = {
        total: documents.length,
        inserted
      };
      backupStats.totalRecords += documents.length;
      backupStats.processedRecords += inserted;

      console.log(`✅ Successfully backed up ${inserted}/${documents.length} records with images from ${name}`);
    } catch (error) {
      console.error(`❌ Error backing up ${name} with images:`, error.message);
      backupStats.tables[name] = {
        total: 0,
        inserted: 0,
        error: error.message
      };
    }
  }

  return backupStats;
}

async function getBackupStatus(connection) {
  const tables = [
    'users', 'teachers', 'students', 'hods', 'portals',
    'sub_portals', 'courses', 'quizzes', 'quiz_results',
    'performances', 'feedbacks', 'extension_requests', 'announcements'
  ];

  const status = {};

  for (const table of tables) {
    try {
      const [rows] = await connection.query(`SELECT COUNT(*) as count FROM ${table}`);
      status[table] = {
        count: rows[0].count,
        hasImages: ['teachers', 'hods'].includes(table)
      };

      if (['teachers', 'hods'].includes(table)) {
        try {
          const [imageRows] = await connection.query(
            `SELECT COUNT(*) as count FROM ${table} WHERE profile_image_data IS NOT NULL`
          );
          status[table].withImages = imageRows[0].count;
        } catch (imageError) {
          status[table].withImages = 0;
        }
      }
    } catch (error) {
      status[table] = {
        count: 0,
        error: error.message
      };
    }
  }

  return status;
}

async function backupOnlyImages(connection) {
  const imageCollections = [
    { name: 'teachers', model: Teacher },
    { name: 'hods', model: HOD }
  ];

  const results = {};

  for (const { name, model } of imageCollections) {
    console.log(`🖼️ Backing up images for ${name}...`);
    try {
      const Model = getModel(model);
      const documents = await Model.find({
        $or: [
          { profileImageData: { $exists: true, $ne: null } },
          { profileImage: { $exists: true, $ne: null } }
        ]
      });

      if (documents.length > 0) {
        const inserted = await backupImagesTable(connection, name, documents);
        results[name] = {
          total: documents.length,
          inserted
        };
        console.log(`✅ Backed up images for ${inserted}/${documents.length} ${name} records`);
      } else {
        results[name] = {
          total: 0,
          inserted: 0
        };
        console.log(`ℹ️ No image data found for ${name}`);
      }
    } catch (error) {
      console.error(`❌ Error backing up images for ${name}:`, error.message);
      results[name] = {
        total: 0,
        inserted: 0,
        error: error.message
      };
    }
  }

  return results;
}

module.exports = {
  performFullBackup,
  getBackupStatus,
  backupOnlyImages
};
