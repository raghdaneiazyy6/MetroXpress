// Import mongoose for MongoDB object modeling
const mongoose = require('mongoose');

// Define the schema for a station
const stationSchema = new mongoose.Schema({
    // Station name field
    name: {
        type: String,        // Name must be a string
        required: true,      // Name is required
        unique: true         // Ensure station names are unique
    },
    // Station fare field
    fare: {
        type: Number,        // Fare must be a number
        required: true       // Fare is required
    }
});

// Create the Station model from the schema
const Station = mongoose.model('Station', stationSchema);

// Export the Station model
module.exports = { Station };
