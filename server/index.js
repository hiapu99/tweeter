const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const DataBase = require('./config/DataBase');
const router = require('./router/auth');
const path = require('path');

// Initialize dotenv to manage environment variables
dotenv.config();

// Connect to the database
DataBase();

// Create an Express application
const app = express();
const PORT = process.env.PORT || 3000;

const _dirname=path.resolve()

// Configure CORS to allow requests from a specific origin
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, // Allow credentials (like cookies or auth headers)
}));

// Middleware to parse JSON requests
app.use(express.json());

// Mount the authentication router
app.use("/api", router);


// Serve static files from the client/dist directory
app.use(express.static(path.join(_dirname, '/client/dist')));

// Catch-all route to serve the index.html for any undefined routes
app.get('*', (req, res) => {
  res.sendFile(path.resolve(_dirname, 'client', 'dist', 'index.html'));
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
