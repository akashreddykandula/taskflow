const express = require ('express');
const cors = require ('cors');
const dotenv = require ('dotenv');
const connectDB = require ('./config/db');

dotenv.config ();
connectDB ();

const app = express ();

app.use (
  cors ({
    origin: ['http://localhost:5173', 'https://taskflow-two-gules.vercel.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use (express.json ());

const authRoutes = require ('./routes/authRoutes');
const taskRoutes = require ('./routes/taskRoutes');

app.use ('/api/auth', authRoutes);
app.use ('/api/tasks', taskRoutes);

app.get ('/', (req, res) => {
  res.send ('TaskFlow API is running...');
});

module.exports = app; // 🔥 THIS LINE IS CRITICAL
