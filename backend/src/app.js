const express = require ('express');
const cors = require ('cors');

const app = express ();

app.use (
  cors ({
    origin: ['http://localhost:5173', 'https://taskflow-two-gules.vercel.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.options ('*', cors ());

app.use (express.json ());
