# University LMS Backend

This is the backend for a Learning Management System (LMS) for universities. It supports three user roles: HOD (Head of Department), Teacher/Instructor, and Student.

## Features

- User authentication with JWT
- Role-based access control
- Profile management for HOD, Teacher, and Student
- HOD can invite Teachers
- Teachers can invite Students
- Automatic role-relationship linkage

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   MONGO_URI=mongodb://localhost:27017/university_lms
   JWT_SECRET=your_secret_key_here
   ```
4. Start the server:
   ```
   node server.js
   ```

## API Endpoints

### Authentication
- `POST /user/signup` - Register a new user
- `POST /user/login` - Login and get JWT token

### HOD
- `GET /hod/profile-status` - Check if HOD profile exists
- `POST /hod/profile` - Create or update HOD profile
- `GET /hod/profile` - Get HOD profile
- `POST /hod/invite-teacher` - Invite a teacher
- `GET /hod/teachers` - Get all teachers under HOD

### Teacher
- `GET /teacher/profile-status` - Check if Teacher profile exists
- `POST /teacher/profile` - Create or update Teacher profile
- `GET /teacher/profile` - Get Teacher profile
- `GET /teacher/hods` - Get all HODs
- `POST /teacher/invite-student` - Invite a student
- `GET /teacher/students` - Get all students under Teacher

### Student
- `GET /student/profile-status` - Check if Student profile exists
- `POST /student/profile` - Create or update Student profile
- `GET /student/profile` - Get Student profile
- `GET /student/teachers` - Get all Teachers

## First-Time Login

When a user logs in for the first time, they will be prompted to complete their profile based on their role:

1. HOD: Must provide department and contact information
2. Teacher: Must provide department, subjects, qualification, and contact information
3. Student: Must provide roll number, course, semester, batch, and other personal details

## Inviting Users

1. HOD can invite Teachers, which creates a Teacher account with a temporary password
2. Teachers can invite Students, which creates a Student account with a temporary password 