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
