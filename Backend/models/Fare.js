// Import mongoose for MongoDB object modeling
const mongoose = require('mongoose');

// Define the fare schema for storing metro fare information
const fareSchema = new mongoose.Schema({
    // Price field to store the current fare amount
    price: {
        type: Number,
        required: [true, 'Fare price is required'], // Make price required with custom error message
        min: [0, 'Fare price cannot be negative'], // Ensure price is not negative
        default: 5 // Set default fare to 5
    },
    // Track when the fare was last updated
    updatedAt: {
        type: Date,
        default: Date.now // Automatically set to current date/time
    }
}, {
    // Enable automatic timestamps for createdAt and updatedAt
    timestamps: true 
});

// Initialize default fare on model load
fareSchema.statics.initializeDefaultFare = async function() {
    // Check if any fare exists in the database
    const fare = await this.findOne();
    if (!fare) {
        // If no fare exists, create one with default price of 5
        const defaultFare = new this({ price: 5 });
        await defaultFare.save();
    }
};

// Create a static method to get the current fare
fareSchema.statics.getCurrentFare = async function() {
    // Find the single fare document in the collection
    const fare = await this.findOne();
    // Return the price if fare exists, otherwise return null
    return fare ? fare.price : null;
};

// Create the Fare model from the schema
const Fare = mongoose.model('Fare', fareSchema);

// Run initialization after model is created to ensure default fare exists
Fare.initializeDefaultFare().catch(console.error);

// Export the Fare model
module.exports = {
    Fare
}; 