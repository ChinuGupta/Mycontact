const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../modles/usermodel");

//@desc register a user
//@route post /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("User already exist");
  }

  //hash password
  // console.log(password);
  const hashedPassword = await bcrypt.hash(password, 10); //here 10 is salt
  console.log("hashed password", hashedPassword);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  console.log(`user created ${user}`);
  if (user) {
    res.status(201).json({ _id: user.id, email: user.email });
  } else {
    res.status(400);
    throw new Error("user data  is not valid");
  }
});

//@desc login a user
//@route post /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All feidls are mandatory!");
  }
  const user = await User.findOne({ email });
  //compare password with hashed password
  if (user && (await bcrypt.compare(password, user.password))) {
    //password which is received from client in request body and hashed password
    const accessToken = jwt.sign(
      {
        //payload in jwt->contain the information of the user
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECERT,
      { expiresIn: "20m" }
    );
    res.status(200).json({accessToken});
  }
  else{
    res.status(401)
    throw new Error("email or password is not valid")
  }
});

//@desc current user
//@route get /api/users/current
//@access private

// in this we can verify the token  which is passed by the user after login and then we check that it is correct or not for the logined user
const currentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});

module.exports = {
  registerUser,
  loginUser,
  currentUser,
};
