const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

const Auth = async (req, res, next) => {
  const token = req.cookies.Authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET);

    if (Date.now() > decoded.exp * 1000) {
      return res.status(401).json({ error: "Session Expired" });
    }

    const user = await User.findById(decoded.sub);

    if (!user) {
      return res.status(401).json({ error: "Invalid User" });
    }

    // Attach the user object to the request for use in other route handlers.
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = Auth;
