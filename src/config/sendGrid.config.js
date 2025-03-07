import sgMail from '@sendgrid/mail';
import crypto from "crypto"
import dotenv from 'dotenv';

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY); 

const generateOTP = () => {
  return crypto.randomInt(1000, 9999); // Generates a 6-digit OTP
};

const sendEmail = async (to) => {

    const otp = generateOTP();
    console.log(otp);
    
    const otpExpiration = Date.now() + Number(process.env.OTP_EXPIRATION_TIME); // OTP expires after 5 minutes
    
  const msg = {
    to, 
    from: 'devrathore653@gmail.com', // Verified sender email address
    subject: 'Your OTP for Email Verification',
     html: `<p>Your OTP is: <strong>${otp}</strong></p><p>This OTP is valid for 5 minutes.</p>`,
  };

  try {
    await sgMail.send(msg); // Send the email
    console.log('Email sent successfully');
    return{otp,otpExpiration}
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export default sendEmail;