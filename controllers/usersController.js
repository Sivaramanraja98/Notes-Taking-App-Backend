const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

const signup = async (req, res) => {
  try {
    // Get the sent in data off request body
    const { email, password } = req.body;

    // Hashpassword
    const hashpassword = bcrypt.hashSync(password, 10);

    // Create a note with it
    await User.create({
      email,
      password: hashpassword,
    });
    // respond with the new note
    res.status(200).send("User created Successfully");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user in the database by email.
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid User" });
    }

    // Compare the provided password with the hashed password from the database.
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid Password" });
    }

    // Generate a JWT token with the user's ID and an expiration time.
    const expiresIn =  60 * 60 * 24 * 10;
    const token = jwt.sign({ sub: user._id }, process.env.SECRET, {
      expiresIn,
    });

    // Set an HTTP-only cookie named "Authorization" with the JWT as the value.
    res.cookie("Authorization", token, {
      maxAge: expiresIn * 1000, // Convert seconds to milliseconds
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    // Send a 200 OK response with a success message and the token.
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const logout = (req, res) => {
  try {
    res.clearCookie("Authorization");
  res.status(200).send("logged out Successfully");  
  } catch (err) {
    res.status(400)
  }  
};

const checkAuth = (req, res) => {
  try {
  res.status(200).send("Success");
  } catch (err) {
    res.status(400)
  }
};

module.exports = {
  signup,
  login,
  logout,
  checkAuth,
};
