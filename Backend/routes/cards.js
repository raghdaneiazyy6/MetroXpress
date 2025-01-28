// Import required dependencies
const express = require('express');
const router = express.Router();
const joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Import models
const {RFIDcard} = require('../models/RFIDCard');
const {Transaction} = require('../models/Transaction');
const {User} = require('../models/User');

// Define the routes

/**
 * @desc Add a new card
 * @route /home/cards
 * @method POST
 */

router.post('/', async (req, res) => {
    // Define validation schema for request body
    const schema = joi.object({
        userId: joi.string().required(),
        cardId: joi.string().required(),
        balance: joi.number().min(0).required(),
        status: joi.string().valid('active', 'inactive').required()
    });

    // Validate the request body against schema
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        // Check if card already exists for this user
        const card_instance = await RFIDcard.findOne({ userId: req.body.userId });
        if (card_instance) {
            return res.status(400).json({ error: "This card already exists for this user" });
        }

        // Check if user exists
        const user_instance = await User.findById(req.body.userId);
        if (!user_instance) {
            return res.status(404).json({ error: "User not found" });
        }

        // Create new card instance
        const card = new RFIDcard({
            cardId: req.body.cardId,
            userId: req.body.userId,
            balance: req.body.balance,
            status: req.body.status
        });

        // Save card and get user name
        const new_card = await card.save();
        const user_name = user_instance.fullName;
        res.status(201).json({ new_card, user_name });

    } catch (err) {
        // Handle any server errors
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});


/**
 * @desc update a card
 * @route /home/cards/:id
 * @method POST
 */

router.put('/:id', async (req, res) => {
    // Admin can update everything
    if (req.user.isAdmin) {
        // Update all card fields if admin
        const updated_card = await RFIDcard.findOneAndUpdate(
            { cardId: req.params.id },
            {
                $set: {
                    userId: req.body.userId,
                    balance: req.body.balance,
                    status: req.body.status
                }
            },
            { new: true }
        );
        if (!updated_card) return res.status(404).json({ message: 'Card not found' });
        return res.status(200).json(updated_card);
    }

    // Non-admin users can only update balance
    if (req.body.userId || req.body.status) {
        return res.status(400).json({ error: "You are not authorized to update status of this card" });
    }

    // Update only balance for non-admin users
    const updated_card = await RFIDcard.findOneAndUpdate(
        { cardId: req.params.id },
        { $set: { balance: req.body.balance } },
        { new: true }
    );
    if (!updated_card) return res.status(404).json({ message: 'Card not found' });
    return res.status(200).json(updated_card);
});


/**
 * @desc Retrieve all cards
 * @route /home/cards
 * @method Get
 */

router.get('/', async (req, res) => {
    const cards = await RFIDcard.find()
    res.status(200).json(cards)
});


/**
 * @desc Retrieve card
 * @route /home/cards/:id
 * @method Get
 */

// Commented out old version of route
// router.get('/:id', async (req, res) => {
//     const card_instance=await RFIDcard.findOne({cardId:req.params.id})
//     if(!card_instance){
//         return res.status(404).json({message:'Card not found'})
//     }
//     const transactions=await Transaction.findOne({rfidCardId:req.params.id})

//     const {userId,cardId,...rest}=card_instance._doc
//     res.status(200).json({...rest,transactions})
// })

router.get('/:id', async (req, res) => {
    try {
        // Find the RFID card instance by card ID
        const card_instance = await RFIDcard.findOne({ cardId: req.params.id });
        if (!card_instance) {
            return res.status(404).json({ message: 'Card not found' });
        }

        // Get all transactions for this card, sorted by date
        const transactions = await Transaction.find({ rfidCardId: req.params.id }).sort({ date: 1 });

        // Group entry and exit transactions into pairs
        const transactionLog = [];
        let currentEntry = null;

        // Iterate through transactions to pair entries with exits
        transactions.forEach((transaction) => {
            if (transaction.type === 'entry') {
                // Store entry transaction until matching exit is found
                currentEntry = transaction;
            } else if (transaction.type === 'exit' && currentEntry) {
                // When exit is found, create a complete trip record
                transactionLog.push({
                    entry: {
                        station: currentEntry.station,
                        date: currentEntry.date,
                    },
                    exit: {
                        station: transaction.station,
                        date: transaction.date,
                    },
                    amount: transaction.amount, // Fare for this trip
                });

                // Clear current entry for next pair
                currentEntry = null;
            }
        });

        // Prepare response by removing sensitive info
        const { userId, cardId, ...rest } = card_instance._doc;
        res.status(200).json({ ...rest, transactions: transactionLog });
    } catch (error) {
        // Handle any server errors
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @desc Get cards for current user
 * @route GET /home/cards/user
 * @access Private
 */
router.get('/user/cards', async (req, res) => {
    try {
        // Get user ID from JWT token
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userId = decoded.id;

        // Find cards belonging to the user
        const cards = await RFIDcard.find({ userId })
            .select('cardId balance status issueDate expiryDate lastUsed');
        
        res.status(200).json(cards);
    } catch (error) {
        console.error('Error fetching user cards:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// Export router for use in main application
module.exports=router;