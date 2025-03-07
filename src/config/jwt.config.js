import jwt from "jsonwebtoken";

// Function to generate an access token with expiration
function generateAccessToken(userId) {
    const token = jwt.sign({ id: userId }, process.env.SECRET_TOKEN_KEY, { expiresIn: '1h' }); // Token expires in 1 hour
    return token;
}

export default generateAccessToken;