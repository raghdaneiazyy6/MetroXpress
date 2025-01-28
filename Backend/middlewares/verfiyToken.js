const jwt = require("jsonwebtoken")

function verifyToken(req, res, next) {
    const token =req.headers.token;
    if (token){
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
            req.user = decoded;
            next();
            
        } catch (error) {
            return res.status(401).json({error:"Invalid token"})
        }
    }
    else {
        return res.status(401).json({error:"Token is required"})
        
    }

}

module.exports = {
    verifyToken,
 
}