// Import required dependencies
const express = require('express');
const router = express.Router();
const joi = require('joi');
const bcrypt = require('bcryptjs');
// Import User model and validation functions
const {User,validateRegiterUser,validateUpdateUser,validateLoginUser} = require('../models/User');
// Import JWT for authentication
const jwt = require('jsonwebtoken');
const { RFIDcard } = require('../models/RFIDCard');


// Define the routes

/**
 * @desc Sign up a new user
 * @route /home/signup
 * @method POST
 */
router.post('/signup', async(req,res)=>{
    try {
        // Validate request body against schema
        const{error}=validateRegiterUser(req.body)
        if(error){
            return res.status(400).json({error:error.details[0].message})
        }
        
        // Check if user with this email already exists
        let user_instance=await User.findOne({email:req.body.email})
        if (user_instance){
            return res.status(400).json({error:"this user already exists"})
        }
        
        // Generate salt and hash password for security
        const salt=await bcrypt.genSalt(10)
        req.body.password=await bcrypt.hash(req.body.password,salt)
        
        // Create new user instance with request data
        const user=new User({
            fullName:req.body.fullName,
            email:req.body.email,
            password:req.body.password,
        })
        
        // Save user to database
        const result=await user.save()
        
        // Generate JWT token for authentication
        const token= jwt.sign({id:user._id},process.env.JWT_SECRET_KEY,{expiresIn:'30d'})
        
        // Create a new RFID card for the user
        const newCard = new RFIDcard({
            cardId: `RFID-${Math.random().toString(36).substr(2, 9)}`, // Generate random card ID
            userId: user._id,
            balance: 100,
            status: 'active',
            issueDate: new Date(),
            expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // Set expiry to 1 year from now
            lastUsed: new Date()
        });
        
        await newCard.save();
        
        // Remove password from response data
        const{password,...other}=result._doc
        
        // Send response with user data and token
        res.status(201).json({...other, token, card: newCard})
    } catch (error) {
        // Log error and send error response
        console.error(error)
        return res.status(500).json({error:error.message})
    }
})

/**
 * @desc Login a user
 * @route /home/login
 * @method POST
 */
router.post('/login',async(req,res)=>{
    // Validate login credentials
    const {error}=validateLoginUser(req.body)
    if(error){
        return res.status(400).json({error:error.details[0].message})
    }
    
    // Find user by email
    const user_instance = await User.findOne({email:req.body.email})
    if(!user_instance){
        return res.status(400).json({error:"Invalid email or password"})
    }
    
    // Compare provided password with stored hash
    const isPasswordMatch=await bcrypt.compare(req.body.password,user_instance.password)
    if (!isPasswordMatch){
        return res.status(400).json({error:"Invalid email or password"})
    }
    
    // Generate JWT token with user ID and admin status
    const token= jwt.sign({id:user_instance._id,isAdmin:user_instance.isAdmin},process.env.JWT_SECRET_KEY,{expiresIn:'30d'})
    
    // Remove password from response data
    const{password,...other}=user_instance._doc
    
    // Send response with user data and token
    res.status(200).json({...other,token})
})

// Export router for use in main application
module.exports = router;