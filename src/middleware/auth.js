const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET_KEY = process.env.JWT_SECRET_KEY;

// Middleware to verify JWT and attach user info to req.user
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Extract token after 'Bearer'

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }

    req.user = decoded; // Attach user info to request object
    next(); // Continue to the next middleware or route handler
  });
};

module.exports = authenticateToken;
