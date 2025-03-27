const jwt=require("jsonwebtoken");
const User=require("../models/userModel");

exports.protect=async(req,res,next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try{
            token = req.headers.authorization.split(' ')[1];
            const decode=jwt.verify(token,process.env.JWT_SECRET);
            const user=await User.findById(decode.id).select('-password');
            req.user=user;
            next();
        }
        catch(error){
            res.status(401).json({
                msg:"not authorized, token failed"
            });
        }
    }
    if(!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
        return res.status(401).json({
            msg: "Not authorized, no token"
        });
    }
    
}