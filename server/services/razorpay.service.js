import dotenv from "dotenv";
dotenv.config();

import Razorpay from "razorpay";


const razorpay = new Razorpay({
  key_id: process.env,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default razorpay;