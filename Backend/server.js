const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./db');
const user = require('./routes/user_routes');
const hod = require('./routes/hod_routes');
const student = require('./routes/student_routes');
const envChecker = require('./middleware/envChecker');
const teacher =require('./routes/teacher_routes');
const app = express();
app.use(bodyParser.json());
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173', // or whatever your frontend URL is
  credentials: true,
}));

// Apply environment checker middleware
app.use(envChecker);

// Connect to MongoDB
connectDB();

app.use('/user', user);
app.use('/hod_profile', hod);
app.use('/teacher_profile', teacher);

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
