
import jwt from 'jsonwebtoken';
import User from "../models/users.model.js"; // Adjust the import as per your path
import ApiError from "../utils/ApiError.js"; // Adjust the import for ApiError

function isAuthenticate(req, res, next) {
  const token = req.cookies.accessToken || (req.headers.authorization && req.headers.authorization.split(" ")[1]);
   
  if (!token) {
    return res.status(400).json(new ApiError(400, "Invalid token or expired token"));
  }
                
  // Verify the token
  jwt.verify(token, process.env.SECRET_TOKEN_KEY, async (err, decoded) => {
    if (err) {
      return res.status(401).json(new ApiError(401, "Token verification failed"));
    }

    try {
      const user = await User.findById(decoded.id); // Use `decoded.id` to find the user
      if (!user) {
        return res.status(404).json(new ApiError(404, "User not found with this token"));
      }

      // Attach user info to the request object
      req.user = user;
      next(); // Proceed to the next middleware or route handler
    } catch (err) {
      return res.status(500).json(new ApiError(500, "Internal server error"));
    }
  });
}

export default isAuthenticate;
