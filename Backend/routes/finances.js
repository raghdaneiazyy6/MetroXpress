    // Import required dependencies
    const express = require('express');
    const router = express.Router();
    const jwt = require('jsonwebtoken');

    // Import models
    const { User } = require('../models/User');
    const { Transaction } = require('../models/Transaction');
    const { RFIDcard } = require('../models/RFIDCard');
    const { Station } = require('../models/station'); // Corrected capitalization
    const { Fare } = require('../models/Fare');

    // Mapping of station names to their corresponding integer numbers
    // Used for calculating fares based on distance between stations
    const stationMap = {
        monib: 0,        // First station
        mekky: 1,        // Second station
        om_masryen: 2,   // Third station
        giza: 3,         // Fourth station
        faisal: 4,       // Fifth station
        cairouni: 5,     // Sixth station
        behos: 6,        // Seventh station
        dokki: 7,        // Eighth station
        opera: 8,        // Ninth station
        sadat: 9,        // Tenth station
        naguib: 10       // Eleventh station
    };

    /**
     * @route POST /entry
     * @desc Handle user entry by validating RFID card and creating an entry transaction
     */
    router.post('/entry', async (req, res) => {
        try {
            // Extract rfidCardId and station from request body
            const { rfidCardId, station } = req.body;

            // Validate station name input
            if (!station || typeof station !== 'string') {
                return res.status(400).json({ message: 'Station name is required and must be a string' });
            }

            // Convert station name to station number using map
            const entryStation = stationMap[station.toLowerCase()];
            if (entryStation === undefined) {
                return res.status(400).json({ message: 'Invalid station name' });
            }

            // Find and validate RFID Card
            const rfidCard = await RFIDcard.findOne({ cardId: rfidCardId });
            if (!rfidCard) {
                return res.status(400).json({ message: 'Invalid RFID card' });
            }

            // Find and validate User associated with the RFID card
            const user = await User.findById(rfidCard.userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Verify fare price is set in system
            const currentFare = await Fare.getCurrentFare();
            if (currentFare === null) {
                return res.status(400).json({ message: 'Fare price not set' });
            }

            // Create new Entry Transaction with no initial fare
            const transaction = new Transaction({
                userId: user._id,
                amount: 0, // No fare deducted upon entry
                rfidCardId,
                station: station,
                type: 'entry',
            });

            // Save the entry transaction
            await transaction.save();

            // Return the created transaction
            res.status(201).json(transaction);
        } catch (error) {
            // Log and return any errors
            console.error('Error in /entry:', error);
            res.status(500).json({ message: 'Server error' });
        }
    });

    /**
     * @route POST /exit
     * @desc Handle user exit by validating RFID card, calculating fare, and creating an exit transaction
     */
    router.post('/exit', async (req, res) => {
        try {
            // Extract rfidCardId and station from request body
            const { rfidCardId, station } = req.body;

            // Validate station name input
            if (!station || typeof station !== 'string') {
                return res.status(400).json({ message: 'Station name is required and must be a string' });
            }

            // Convert station name to station number using map
            const exitStation = stationMap[station.toLowerCase()];
            if (exitStation === undefined) {
                return res.status(400).json({ message: 'Invalid station name' });
            }

            // Find and validate RFID Card
            const rfidCard = await RFIDcard.findOne({ cardId: rfidCardId });
            if (!rfidCard) {
                return res.status(400).json({ message: 'Invalid RFID card' });
            }

            // Find and validate User associated with the RFID card
            const user = await User.findById(rfidCard.userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Find the most recent entry transaction for this card
            const lastEntry = await Transaction.findOne({
                rfidCardId,
                type: 'entry',
            }).sort({ date: -1 });

            // Log entry transaction for debugging
            console.log("Last Entry Transaction:", lastEntry);
            
            // Verify entry transaction exists
            if (!lastEntry) {
                return res.status(400).json({ message: 'No matching entry transaction found' });
            }

            // Get entry station number and calculate stations traveled
            const entryStationNumber = stationMap[lastEntry.station.toLowerCase()];
            const stationsDifference = Math.abs(exitStation - entryStationNumber);

            // Get current fare rate
            const currentFare = await Fare.getCurrentFare();
            if (currentFare === null) {
                return res.status(404).json({ message: 'Fare price not set' });
            }

            // Calculate total fare based on stations traveled
            const fare = stationsDifference * currentFare;

            // Log fare calculation details
            console.log("Stations Difference:", stationsDifference);
            console.log("Fare Per Station:", currentFare);
            console.log("Total Fare:", fare);

            // Check if card has enough balance
            if (rfidCard.balance < fare) {
                return res.status(400).json({ message: 'Insufficient balance' });
            }

            // Deduct fare from card balance
            rfidCard.balance -= fare;
            await rfidCard.save();

            // Create exit transaction record
            const exitTransaction = new Transaction({
                userId: user._id,
                amount: fare,
                rfidCardId,
                station: station,
                type: 'exit',
                pairedTransactionId: lastEntry._id, // Link to entry transaction
            });

            // Save exit transaction
            await exitTransaction.save();

            // Return the created exit transaction
            res.status(201).json(exitTransaction);
        } catch (error) {
            // Log and return any errors
            console.error('Error in /exit:', error);
            res.status(500).json({ message: 'Server error' });
        }
    });

    /**
     * @route GET /transactions
     * @desc Retrieve all transactions for the authenticated user
     */
    router.get('/transactions', async (req, res) => {
        try {
            const token = req.header('Authorization')?.replace('Bearer ', '');
            if (!token) {
                return res.status(401).json({ message: 'No token provided' });
            }

            // Verify the token and extract user ID
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            const userId = decoded.id;

            // Find all transactions for user, sorted by date descending
            const transactions = await Transaction.find({ userId }).sort({ date: -1 });
            
            // Return transactions
            res.json(transactions);
        } catch (error) {
            // Log and return any errors
            console.error('Error in /transactions:', error);
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Invalid token' });
            }
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    });

    // Export router for use in main application
    module.exports = router;
