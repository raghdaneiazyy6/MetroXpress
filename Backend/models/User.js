// Import required dependencies
const mongoose = require('mongoose');
const joi = require('joi')

// Define the user schema with validation rules and data types
const userSchema=new mongoose.Schema({
    fullName:{
        type:String,
        required:true,
        trim:true,
        minlength:3,
        maxlength:50
    },
    email:{
        type:String,
        required:true,
        trim:true,
        minlength:3,
        maxlength:100,
        unique:true
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:3,
        maxlength:100
    },
    balance: {
        type: Number,
        // required: true,
        default: 0, // Default balance for new users
    },
    isAdmin:{
        type:Boolean,
        default:false // Users are not admins by default
    }
    
},
    {
        timestamps: true // Automatically add createdAt and updatedAt timestamps
    });


/**
 * Validates user registration data
 * @param {Object} obj - Object containing user registration details
 * @returns {Object} Validation result
 */
function validateRegiterUser(obj){
    const schema=joi.object({
        fullName:joi.string().required().min(3).max(100).required(),
        email:joi.string().required().min(3).max(100).email().required(),
        password:joi.string().required().min(3).max(100).required(),
        balance:joi.number()
        
    });
    return schema.validate(obj)
}

/**
 * Validates user login data
 * @param {Object} obj - Object containing login credentials
 * @returns {Object} Validation result
 */
function validateLoginUser(obj){
    const schema=joi.object({
        email:joi.string().min(3).max(100).email().required(),
        password:joi.string().min(3).max(100).required(),
        isAdmin:joi.boolean()
        
    });
    return schema.validate(obj)
}

/**
 * Validates user update data
 * @param {Object} obj - Object containing fields to update
 * @returns {Object} Validation result
 */
function validateUpdateUser(obj){
    const schema=joi.object({
        fullName:joi.string().min(3).max(100),
        email:joi.string().min(3).max(100).email(),
        password:joi.string().min(3).max(100)
    });
    return schema.validate(obj)
}

// Create the User model from the schema
const User = mongoose.model('User', userSchema);

// Export the User model and validation functions
module.exports = {
    User,
    validateRegiterUser,
    validateLoginUser,
    validateUpdateUser
}
