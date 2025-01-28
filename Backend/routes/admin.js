// Import required dependencies
const express = require('express');
const router = express.Router();
const joi = require('joi');
const bcrypt = require('bcryptjs');
// Import User model and validation functions
const {User,validateRegiterUser,validateUpdateUser,validateLoginUser} = require('../models/User');
// Import RFID card model
const {RFIDcard} = require('../models/RFIDCard');
// Import Fare model
const {Fare} = require('../models/Fare');

/**
 * @desc Update or create fare price
 * @route PUT /admin/fare
 * @access Admin only
 */
router.put('/fare', async (req, res) => {
    // Validate input using Joi schema
    const schema = joi.object({
        price: joi.number().positive().required() // Price must be positive number
    });

    // Check for validation errors
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    // Extract price from request body
    const { price } = req.body;

    try {
        // Find existing fare record
        const fare = await Fare.findOne();
        if (!fare) {
            // Create a new fare if it doesn't exist
            const newFare = new Fare({ price });
            await newFare.save();
            return res.status(201).json(newFare);
        }

        // Update existing fare price
        fare.price = price;
        await fare.save();
        res.status(200).json(fare);
    } catch (err) {
        // Log error and send error response
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @desc Get all users
 * @route /home/admin/users
 * @method GET
 */
router.get('/users',async (req, res) => {
    // Find all users, excluding password field
    const users=await User.find().select('-password')
    res.status(200).json(users)
})

/**
 * @desc Get specified user by id 
 * @route /home/signup
 * @method GET
 */
router.get('/users/:id',async(req,res)=>{
    // Find user by ID, excluding password
    const user_instance= await User.findById(req.params.id).select('-password')
    // Return 404 if user not found
    if(!user_instance){
        return res.status(404).json({message:'User not found'})
    } 
    
    // Return user data    
    res.status(200).json(user_instance)
})

/**
 * @desc update user info 
 * @route /home/admin/:id
 * @method PUT
 */
router.put('/users/:id',async(req,res)=>{
    // Validate update data
    const{error}=validateUpdateUser(req.body);
    if(error){
        return res.status(400).json({error:error.details[0].message})
    }

    // Hash new password if provided
    if(req.body.password){
        const salt= await bcrypt.genSalt(10);
        req.body.password=await bcrypt.hash(req.body.password,salt)
    }
    
    // Update user document with new data
    const updated_user=await User.findByIdAndUpdate(req.params.id,{
        $set:{
            fullName:req.body.fullName,
            email:req.body.email,
            password:req.body.password
        }
    },{new:true}).select('-password')
    res.status(200).json(updated_user)
})

/**
 * @desc Delete user 
 * @route /home/signup
 * @method DELETE
 */
router.delete('/users/:id',async(req,res)=>{
    // Delete user and get deleted user data
    const user_instance= await User.findByIdAndDelete(req.params.id).select('-password')
    // Delete associated RFID card if exists
    const rfid_card=await RFIDcard.findOneAndDelete({userId:req.params.id})
    
    // Return 404 if user not found
    if(!user_instance){
        return res.status(404).json({message:'User not found'})
    }
    
    // Return appropriate success message based on whether RFID card was found and deleted
    if(rfid_card){
        return res.status(200).json({message:'User and associated RFID card deleted successfully'})
    }
    else{
        return res.status(200).json({message:'User deleted successfully. No associated RFID card found'})
    }
})

// Export router for use in main application
module.exports = router;