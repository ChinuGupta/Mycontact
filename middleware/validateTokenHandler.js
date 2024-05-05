const asyncHandler=require("express-async-handler")
const jwt =require("jsonwebtoken");

const validateToken=asyncHandler(async(req,res,next)=>{
    let token;
    let authHeader=req.headers.Authorization || req.headers.authorization;
    if(authHeader && authHeader.startsWith("Bearer")){
        token=authHeader.split(" ")[1];
        jwt.verify(token,process.env.ACCESS_TOKEN_SECERT,(err,decoded)=>{
            if(err){
                res.status(401);
                throw new Error("User not authorized");
            }
            //the req object represents the incoming HTTP request.
           req.user=decoded.user;
           //next(); is a simple JavaScript statement used to pass control to the next middleware or route handler in an Express.js application.
           next();
        });
        if(!token){
         res.status(400)
         throw new Error("user is not authorized or token is missing or expired")
        }
    }
});

module.exports=validateToken;
