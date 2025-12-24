const express = require ('express');
const cors = require ('cors');
const dotenv = require ('dotenv');
const connectDB = require ('./config/db');

dotenv.config ();
connectDB ();

const app = express ();

app.use (
  cors ({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use (express.json ()); // 🔥 REQUIRED

const authRoutes = require ('./routes/authRoutes');
app.use ('/api/auth', authRoutes);

const taskRoutes = require ('./routes/taskRoutes');

app.use ('/api/tasks', taskRoutes);

app.get ('/', (req, res) => {
  res.send ('TaskFlow API is running...');
});

module.exports = app;
