// Import mongoose for MongoDB schema creation
const mongoose = require('mongoose');

// Define the transaction schema for storing metro card transactions
const transactionSchema = new mongoose.Schema({
    // Reference to the user who made the transaction
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // References the User model
        required: true
    },
    // Amount of money involved in the transaction
    amount: {
        type: Number,
        required: true
    },
    // ID of the RFID card used in the transaction
    rfidCardId: {
        // type: mongoose.Schema.Types.ObjectId,
        type: String,
        ref: 'RFIDcard', // References the RFIDcard model
        required: true
    },
    // Commented out legacy fields for station tracking
    // entryStation: {
    //     type: String,
    //     required: true
    // },
    // exitStation: {
    //     type: String,
    //     required: true
    // },
    // Current station where transaction occurred
    station:{
        type: String,
        required: function () {
            // Station is required for entry/exit transactions but not for top-ups
            return this.type !== 'top-up';
    }},
    // Type of transaction - can be entry, exit, or top-up
    type: {
        type: String,
        required: true,
        enum: ['entry', 'exit', 'top-up'], // Restricts to these three values only
    },
    // Timestamp of when the transaction occurred
    date: {
        type: Date,
        default: Date.now // Automatically set to current time if not specified
    },
    // Reference to related transaction (links entry with corresponding exit)
    pairedTransactionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction', // Self-reference to Transaction model
    }
});

// Create the Transaction model from the schema
const Transaction = mongoose.model('Transaction', transactionSchema);

// Export the Transaction model
module.exports = { Transaction }; 