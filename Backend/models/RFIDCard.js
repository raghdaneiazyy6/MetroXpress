// Import required dependencies
const mongoose = require('mongoose');
const joi = require('joi')

// Define the RFID card schema
const rfidSchema = new mongoose.Schema({
    // Unique identifier for the RFID card
    cardId: {
        type: String,
        required: true
    },
    // Reference to the User who owns this card
    userId: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        trim: true
    },
    // Current balance on the card
    balance: {
        type: Number,
        default: 0
    },
    // Card status - can be active, inactive or blocked
    status: {
        type: String,
        required: true,
        enum: ['active', 'inactive', 'blocked'],
        default: 'inactive'
    },
    // Date when the card was issued
    issueDate: {
        type: String,
        default: new Date()
    },
    // Card expiry date - set to 1 year after issue date
    expiryDate: {
        type: String,
        default: function() {
            let expiry = new Date();
            expiry.setFullYear(expiry.getFullYear() + 1);
            return expiry;
        }
    },
    // Timestamp of last card usage
    lastUsed: {
        type: String,
        default: new Date()
    },
})

// Create the RFID card model from the schema
const RFIDcard = mongoose.model('RFIDcard', rfidSchema);

// Export the RFID card model
module.exports = {
    RFIDcard,
}