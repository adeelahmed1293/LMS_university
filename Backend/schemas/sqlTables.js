// schemas/sqlTables.js

const tableSchemas = {
  users: `
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(255) PRIMARY KEY,
      full_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      role ENUM('STUDENT', 'TEACHER', 'HOD') NOT NULL DEFAULT 'STUDENT',
      password VARCHAR(255) NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      accepted_terms BOOLEAN DEFAULT FALSE,
      profile_complete BOOLEAN DEFAULT FALSE,
      INDEX idx_email (email),
      INDEX idx_role (role)
    )
  `,
  
  teachers: `
    CREATE TABLE IF NOT EXISTS teachers (
      id VARCHAR(255) PRIMARY KEY,
      user_id VARCHAR(255) UNIQUE NOT NULL,
      address TEXT,
      gender ENUM('Male', 'Female', 'Other'),
      date_of_hire DATE,
      subjects JSON,
      dept_name VARCHAR(255),
      qualification VARCHAR(255),
      date_of_birth DATE,
      profile_image_data LONGBLOB,
      profile_image_content_type VARCHAR(100),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `,
  
  students: `
    CREATE TABLE IF NOT EXISTS students (
      id VARCHAR(255) PRIMARY KEY,
      user_id VARCHAR(255) UNIQUE NOT NULL,
      address TEXT,
      attendance INT DEFAULT 0,
      joined_portals JSON,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `,
  
  hods: `
    CREATE TABLE IF NOT EXISTS hods (
      id VARCHAR(255) PRIMARY KEY,
      user_id VARCHAR(255) UNIQUE NOT NULL,
      phone_number VARCHAR(20),
      gender ENUM('male', 'female', 'other'),
      date_of_birth DATE,
      profile_image_data LONGBLOB,
      profile_image_content_type VARCHAR(100),
      department_name VARCHAR(100) NOT NULL,
      qualification VARCHAR(255),
      address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `,
  
  portals: `
    CREATE TABLE IF NOT EXISTS portals (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      portal_id VARCHAR(255) UNIQUE NOT NULL,
      sub_portals JSON,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `,
  
  sub_portals: `
    CREATE TABLE IF NOT EXISTS sub_portals (
      id VARCHAR(255) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      type ENUM('quiz', 'assignment', 'lecture') NOT NULL,
      file_url VARCHAR(500),
      portal_id VARCHAR(255) NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (portal_id) REFERENCES portals(id) ON DELETE CASCADE
    )
  `,
  
  courses: `
    CREATE TABLE IF NOT EXISTS courses (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255),
      teacher_id VARCHAR(255),
      students JSON,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE SET NULL
    )
  `,
  
  quizzes: `
    CREATE TABLE IF NOT EXISTS quizzes (
      id VARCHAR(255) PRIMARY KEY,
      course_id VARCHAR(255),
      questions JSON,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    )
  `,
  
  quiz_results: `
    CREATE TABLE IF NOT EXISTS quiz_results (
      id VARCHAR(255) PRIMARY KEY,
      student_id VARCHAR(255),
      quiz_id VARCHAR(255),
      answers JSON,
      score INT,
      submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
      FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
    )
  `,
  
  performances: `
    CREATE TABLE IF NOT EXISTS performances (
      id VARCHAR(255) PRIMARY KEY,
      student_id VARCHAR(255),
      course_id VARCHAR(255),
      grade VARCHAR(10),
      progress INT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    )
  `,
  
  feedbacks: `
    CREATE TABLE IF NOT EXISTS feedbacks (
      id VARCHAR(255) PRIMARY KEY,
      student_id VARCHAR(255),
      course_id VARCHAR(255),
      teacher_id VARCHAR(255),
      feedback_text TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
      FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE
    )
  `,
  
  extension_requests: `
    CREATE TABLE IF NOT EXISTS extension_requests (
      id VARCHAR(255) PRIMARY KEY,
      assignment_id VARCHAR(255),
      student_id VARCHAR(255),
      proposed_date DATE,
      reason TEXT,
      status VARCHAR(50) DEFAULT 'Pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
    )
  `,
  
  announcements: `
    CREATE TABLE IF NOT EXISTS announcements (
      id VARCHAR(255) PRIMARY KEY,
      portal_id VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      posted_by VARCHAR(255),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (portal_id) REFERENCES portals(id) ON DELETE CASCADE,
      FOREIGN KEY (posted_by) REFERENCES teachers(id) ON DELETE SET NULL
    )
  `
};

// Create all SQL tables using .query() instead of .execute() for DDL statements
async function createSQLTables(connection) {
  for (const [tableName, createQuery] of Object.entries(tableSchemas)) {
    try {
      await connection.query(createQuery);
      console.log(`✅ Created table: ${tableName}`);
    } catch (error) {
      console.error(`❌ Error creating table ${tableName}:`, error.message);
      throw error;
    }
  }
}

module.exports = {
  tableSchemas,
  createSQLTables
};