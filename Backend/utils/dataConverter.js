// utils/dataConverter.js
const mongoose = require('mongoose');

function getModel(module) {
  return module.default || module;
}

function convertMongoDocToSQL(doc) {
  const sqlDoc = {};
  
  for (const [key, value] of Object.entries(doc.toObject())) {
    if (key === '_id') {
      sqlDoc.id = value.toString();
    } else if (key === '__v') {
      continue;
    } else if (value instanceof Date) {
      sqlDoc[key.replace(/([A-Z])/g, '_$1').toLowerCase()] = value;
    } else if (Array.isArray(value)) {
      sqlDoc[key.replace(/([A-Z])/g, '_$1').toLowerCase()] = JSON.stringify(value);
    } else if (typeof value === 'object' && value !== null) {
      if (mongoose.Types.ObjectId.isValid(value)) {
        sqlDoc[key.replace(/([A-Z])/g, '_$1').toLowerCase()] = value.toString();
      } else if (Buffer.isBuffer(value)) {
        // Handle Buffer data (like images) - convert to base64 or keep as buffer
        sqlDoc[key.replace(/([A-Z])/g, '_$1').toLowerCase()] = value;
      } else {
        sqlDoc[key.replace(/([A-Z])/g, '_$1').toLowerCase()] = JSON.stringify(value);
      }
    } else {
      sqlDoc[key.replace(/([A-Z])/g, '_$1').toLowerCase()] = value;
    }
  }

  return sqlDoc;
}

async function insertDataIntoSQL(connection, tableName, data) {
  if (!data || data.length === 0) return 0;

  const columns = Object.keys(data[0]);
  const placeholders = columns.map(() => '?').join(', ');
  const updateClause = columns
    .filter(col => col !== 'id')
    .map(col => `${col} = VALUES(${col})`)
    .join(', ');

  const query = `
    INSERT INTO ${tableName} (${columns.join(', ')})
    VALUES (${placeholders})
    ON DUPLICATE KEY UPDATE ${updateClause}
  `;

  let insertedCount = 0;

  for (const row of data) {
    try {
      const values = columns.map(col => {
        const value = row[col];
        // Handle Buffer data (images) properly
        if (Buffer.isBuffer(value)) {
          return value;
        }
        // Handle null/undefined values
        if (value === null || value === undefined) {
          return null;
        }
        return value;
      });
      
      await connection.execute(query, values);
      insertedCount++;
    } catch (error) {
      console.error(`❌ Error inserting into ${tableName}:`, error.message);
      console.error('Row data keys:', Object.keys(row));
      // Log the specific error for debugging
      if (error.message.includes('Data too long')) {
        console.error('❌ Data too long error - check BLOB field sizes');
      }
    }
  }

  return insertedCount;
}

async function deleteMissingRecords(connection, tableName, mongoIds) {
  if (mongoIds.length === 0) return;

  try {
    const [existingRows] = await connection.execute(`SELECT id FROM ${tableName}`);
    const sqlIds = new Set(existingRows.map(row => row.id));
    const missingIds = [...sqlIds].filter(id => !mongoIds.includes(id));

    if (missingIds.length > 0) {
      const placeholders = missingIds.map(() => '?').join(', ');
      const deleteQuery = `DELETE FROM ${tableName} WHERE id IN (${placeholders})`;
      await connection.execute(deleteQuery, missingIds);
      console.log(`🗑 Deleted ${missingIds.length} obsolete records from ${tableName}`);
    }
  } catch (error) {
    console.error(`❌ Error deleting records from ${tableName}:`, error.message);
  }
}

// Special function to handle image backup with better error handling
async function backupImagesTable(connection, tableName, mongoData) {
  if (!mongoData || mongoData.length === 0) return 0;

  let insertedCount = 0;

  for (const doc of mongoData) {
    try {
      const sqlDoc = convertMongoDocToSQL(doc);
      const columns = Object.keys(sqlDoc);
      const placeholders = columns.map(() => '?').join(', ');
      const updateClause = columns
        .filter(col => col !== 'id')
        .map(col => `${col} = VALUES(${col})`)
        .join(', ');

      const query = `
        INSERT INTO ${tableName} (${columns.join(', ')})
        VALUES (${placeholders})
        ON DUPLICATE KEY UPDATE ${updateClause}
      `;

      const values = columns.map(col => {
        const value = sqlDoc[col];
        if (Buffer.isBuffer(value)) {
          return value;
        }
        return value === null || value === undefined ? null : value;
      });

      await connection.execute(query, values);
      insertedCount++;
    } catch (error) {
      console.error(`❌ Error inserting ${tableName} record:`, error.message);
      
      // Try to insert without image data as fallback
      try {
        const sqlDocWithoutImage = { ...convertMongoDocToSQL(doc) };
        delete sqlDocWithoutImage.profile_image_data;
        delete sqlDocWithoutImage.profile_image_content_type;
        
        const columnsWithoutImage = Object.keys(sqlDocWithoutImage);
        const placeholdersWithoutImage = columnsWithoutImage.map(() => '?').join(', ');
        const updateClauseWithoutImage = columnsWithoutImage
          .filter(col => col !== 'id')
          .map(col => `${col} = VALUES(${col})`)
          .join(', ');

        const queryWithoutImage = `
          INSERT INTO ${tableName} (${columnsWithoutImage.join(', ')})
          VALUES (${placeholdersWithoutImage})
          ON DUPLICATE KEY UPDATE ${updateClauseWithoutImage}
        `;

        const valuesWithoutImage = columnsWithoutImage.map(col => sqlDocWithoutImage[col]);
        await connection.execute(queryWithoutImage, valuesWithoutImage);
        
        console.log(`⚠️ Inserted ${tableName} record without image data as fallback`);
        insertedCount++;
      } catch (fallbackError) {
        console.error(`❌ Fallback insert also failed for ${tableName}:`, fallbackError.message);
      }
    }
  }

  return insertedCount;
}

module.exports = {
  getModel,
  convertMongoDocToSQL,
  insertDataIntoSQL,
  deleteMissingRecords,
  backupImagesTable
};