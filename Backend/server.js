const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./db');
const user = require('./routes/user_routes');

const app = express();
app.use(bodyParser.json());
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173', // or whatever your frontend URL is
  credentials: true,
}));

// Connect to MongoDB
connectDB();

app.use('/user', user);


// Start Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
