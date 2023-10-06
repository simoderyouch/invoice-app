const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

//@desc Register a user
//@route POST /api/users/register
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
    throw new Error("User already registered!");
  }

  //Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Hashed Password: ", hashedPassword);
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  console.log(`User created ${user}`);
  if (user) {
    res.status(201).json({ _id: user.id, email: user.email });
  } else {
    res.status(400);
    throw new Error("User data us not valid");
  }
  res.json({ message: "Register the user" });
});

//@desc Login user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const user = await User.findOne({ email });
  //compare password with hashedpassword
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECERT,
      { expiresIn: "20min" }
    );
    const refreshToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.REFRESH_ACCESS_TOKEN_SECERT,
      { expiresIn: "2d" }
    );
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res
      .status(200)
      .json({ message: "Login successful", user: user, accessToken: accessToken });
  } else {
    res.status(401);
    throw new Error("email or password is not valid");
  }
});
const refreshTokenController = async (req, res) => {
  const refreshToken = req.cookies.jwt;

  if (!refreshToken) {
    return res.sendStatus(401);
  }

  try {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_ACCESS_TOKEN_SECERT,
      (err, decoded) => {
        if (err) {
          return res.sendStatus(403); // Invalid token
        }

        // Assuming you have a helper function to generate access tokens
        const accessToken = jwt.sign(
          {
            user: {
              username: decoded.user.username,
              email: decoded.user.email,
              id: decoded.user.id,
            },
          },
          process.env.ACCESS_TOKEN_SECERT,
          { expiresIn: "20min" }
        );

        res.json({ accessToken });
      }
    );
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Internal Server Error", message: errorMessage });
  }
};
const logout = () => {
  const refreshToken = req.cookies.jwt;

  if (!refreshToken) {
    return res.sendStatus(204); // No token, nothing to do
  }
  
    try {
      res.clearCookie('jwt', { httpOnly: true });
        return res.sendStatus(204);
        
    } catch (error) {
     
      return res.status(500).json({ error: 'Internal Server Error', message: errorMessage });
    }
}
module.exports = { registerUser, loginUser,logout, refreshTokenController };
