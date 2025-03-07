import sendEmail from "../config/sendGrid.config";
import { User } from "../models/users.model";
import ApiError from "../utils/ApiError";
import generateAccessToken from "../config/jwt.config.js"

const otpStore = {};


export  async function signUpUser(req,res){
  const {userName,email,password} = req.body;
  if(!userName||!email||!password) return res.status(400).json(new ApiError(400,"please provide all fields"))
 
  const ifUserExist = await User.findOne({userName});

  if(ifUserExist)return res.status(400).json(new ApiError(400,"user is already registered with this username"))
     
    const ifUserExist2 = await User.findOne({email});

    if(ifUserExist2)return res.status(400).json(new ApiError(400,"user is already registered with this email"))
    
    sendEmail(email)

    try {
        const { otp, otpExpiration } = await sendEmail(email);
        otpStore[email] = { otp, otpExpiration };
        return res.status(200).json(new ApiResponse(200, "otp has been set to your email"));
          
    } catch (error) {
        return res.status(500).json(new ApiError(500, "Error sending OTP"));
    }

}

export async function verifyOtp(req,res) {
    const { email, otp } = req.body;

     if (!email || !otp) {
        return res.status(400).json(new ApiError(400, "Email and OTP are required"));
      }
    
      if (!otpStore[email]) {
        return res.status(400).json(new ApiError(400, "OTP not found or expired"));
      }
    
      const { otp: storedOtp, otpExpiration } = otpStore[email];
      if (otpExpiration < Date.now()) {
        return res.status(400).json(new ApiError(400, "OTP has expired! Cancel and Try Again"));
      }
    
      // Check if OTP matches
      if (storedOtp != otp) {
        return res.status(400).json(new ApiError(400, "Invalid OTP! Please try Again"));
      }

      try {
        // Create a new user with verified email
        const newUser = await User.create({
         userName:req.body.userName,
          email,
          password: req.body.password, // Make sure to hash the password before saving it
          isVerified: true, // Mark user as verified
        });
    

        const token = generateAccessToken(newUser._id);
    
        // Send the token in an HTTP-only cookie
        res.cookie("accessToken", token, {
          httpOnly: true,
          secure: true,  // Enforce cookie over HTTPS
          maxAge: 3600000,
          sameSite: "None", // Ensure cross-origin requests are allowed
        });
        
        delete otpStore[email];
        newUser.password = undefined;
    
        return res.status(201).json(new ApiResponse(201, newUser, "User created successfully and verified"));
      } catch (error) {
        return res.status(500).json(new ApiError(500, "Error creating user"));
      }
    
    
}

export async function LoginUser(req,res) {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password)
      return res.status(400).json(new ApiError(400, "email and password field is required"));
  
    // Check if user exists in the database
    const user = await User.findOne({ email }).populate("channel");
    if (!user)
      return res.status(404).json(new ApiError(404, "user is not registered with this email id"));
  
    // Validate the password
    const isValidPassword = user.comparePassword(password);
    if (!isValidPassword)
      return res.status(400).json(new ApiError(400, "user password is wrong"));
  
    // Generate an access token for the user
    const token = generateAccessToken(user._id);
  
    // Send the token in an HTTP-only cookie
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: true,  // Enforce cookie over HTTPS
      maxAge: 3600000,
      sameSite: "None", // Ensure cross-origin requests are allowed
    });
    
  
    user.password = undefined; // Don't send the password in the response
  
    // Return the logged-in user's details
    return res.status(200).json(new ApiResponse(200, user, "user login successfully"));
}

export async function logoutUser(params) {
    const { user } = req;

    // Check if the user is logged in
    if (!user)
      return res.status(404).json(new ApiError(404, "no user found please login and try again"));
  
    // Clear the authentication token cookie
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only set secure: true for production environment
      sameSite: "none", // Added sameSite for additional security
    });
  
    // Return success message
    return res.status(200).json(new ApiResponse(200, null, "user logout successfully"));
  }
  
  export async function getCurrentUser(req, res) {
    const { user } = req;
  
    // Check if the user is logged in
    if (!user) return res.status(400).json(new ApiError(400, "user not found please login and try again"));
  
    const currentUser = await User.findById(user._id)
  
    // If the user does not exist, return an error
    if (!currentUser) return res.status(404).json(new ApiError(400, "user does not exist"));
  
    // Return the current user's details
    return res.status(200).json(new ApiResponse(200, currentUser, "user fetched successfully"));
  }