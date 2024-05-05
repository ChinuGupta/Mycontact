const express=require("express");
const { registerUser, loginUser, currentUser } = require("../Controller/userController");
const validateToken=require("../middleware/validateTokenHandler")
const router =express.Router();

// router.post("/register",(req,res)=>{
//     res.json({message:"Register the user"});
// });

// router.post("/login",(req,res)=>{
//     res.json({message:"login user"});
// });


// router.get("/current",(req,res)=>{
//     res.json({message:"current user information"});
// });

router.post("/register",registerUser);

router.post("/login",loginUser);


router.get("/current",validateToken,currentUser);

module.exports = router;
