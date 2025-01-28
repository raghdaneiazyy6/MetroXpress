// Import required dependencies
const express = require('express'); // Express web framework
const mongoose = require('mongoose'); // MongoDB ODM
const dotenv = require('dotenv'); // Load environment variables
const cors = require('cors'); // Enable Cross-Origin Resource Sharing
dotenv.config(); // Initialize dotenv configuration


// Initialize Express application
const app = express();
// Parse JSON request bodies
app.use(express.json());
// Enable Cross-Origin Resource Sharing
app.use(cors());

// Connect to MongoDB database using connection string from environment variables
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB')) // Log successful connection
    .catch((error) => console.log('Could not connect to MongoDB...', error)); // Log connection errors

// Add the home routes for authentication
app.use('/home', require('./routes/home'));
// Simplified routes without auth
app.use('/home/cards', require('./routes/cards'));
app.use('/profile', require('./routes/profile'));
app.use('/finances', require('./routes/finances'));

// Set server port
const port = 3000;
// Start server and listen on specified port
app.listen(port, () => {
    // Log server startup information
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${port}`);
    console.log(`http://localhost:${port}`);
    
})
