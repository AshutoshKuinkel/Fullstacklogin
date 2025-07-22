import { IJWTPayload } from './../types/global.types';
import User from "../models/user.model";
import dotenv from 'dotenv';
dotenv.config();
import CustomError from "../middlewares/errorhandlermiddleware";
import { Request,Response,NextFunction } from "express";
import nodemailer from "nodemailer";
import { comparePassword, hashPassword } from "../utils/bcrypt.utils";
import { generateToken } from '../utils/jwt.utils';


//register user
export const register = async(req:Request,res:Response,next:NextFunction)=>{
try{
    //taking in the users input
  const {email,password,phone,name} = req.body

  //check all fields are entered.
  if(!email){
    throw new CustomError(`Email required.`,400)
  }
  if(!password){
    throw new CustomError(`Password required.`,400)
  }
  if(!phone){
    throw new CustomError(`PhoneNumber required.`,400)
  }
  if(!name){
    throw new CustomError(`Name required.`,400)
  }

  //check if user already exists.
  const userExists = await User.findOne({email})
  if(userExists){
    throw new CustomError(`That email is already registered with an account.`,400)
  }

  //Creating and saving the user info to db
  const user:any = await User.create({email,password,phone,name})
  const hashedPassword = await hashPassword(password)
  user.password = hashedPassword; //user password is successfully hashed so no one has access to the password except the user themselves.
  await user.save()

  const {password:_,...withoutPassObj} = user.toObject()

  res.status(200).json({
    message: `User successfully created`,
    success: true,
    data:withoutPassObj
  })
}catch(err){
  next(err)
}
}

//login 
export const login = async(req:Request,res:Response,next:NextFunction)=>{
try{
  //take in just the email and password from the user.
  const {email,password} = req.body

  //raise error if field is missing.
  if(!email){
    throw new CustomError(`Email required`,400)
  }
  if(!password){
    throw new CustomError(`Passowrd required`,400)
  }

  //check if email exists and password match and display success message
  const user:any = await User.findOne({email}).select("+password")
  if(!user){
      throw new CustomError('We cannot find an account associated with that email', 400);
    }
  const isPassMatch = await comparePassword(password,user.password)
  
  if(!isPassMatch){
    throw new CustomError("Invalid Credentials",404)
  }

  const payload:IJWTPayload = {
    _id: user._id,
    email: user.email,
    name: user.name
  }

  //generating jwt token:
  const access_token = generateToken(payload)

 const {password:_,...withoutPassObj} = user.toObject()

  if(user && isPassMatch){
    res.cookie('access_token',access_token,{
      secure:process.env.NODE_ENV === 'development' ? false:true,
      httpOnly:true,
      maxAge: Number(process.env.COOKIE_EXPIRY) * 24 * 60 * 60 * 60 * 1000})
    .status(200).json({
    message: `Successfully logged in`,
    success: true,
    data:withoutPassObj,access_token
    })
  }
}catch(err){
  next(err)
}
}


//forgot password
export const forgotPassword = async(req:Request,res:Response,next:NextFunction)=>{
try{
 //ask for email and if the email exists then send a reset link to the email, if the email doesn't exist raise error.
 //take in email from req body, then use the findone on email and write the if condition and then use nodemailer maybe?

 //taking in user email:
 const {email} = req.body
 if(!email){throw new CustomError(`Email required`,400)}
 const user = await User.findOne({email})
 if(!user){
  throw new CustomError(`No registered user under that email`,400)
 }

 //using nodemailer to send a message to the user email.

  // Create a transporter for SMTP
  const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

//sending the message:
    const info = await transporter.sendMail({
      from: `"Ashutosh Kuinkel" <${process.env.SMTP_USER}>`, // sender address
      to: `${user?.email}`, // send it to the user email
      subject: "Password Reset Link", // Subject line
      text: "Hey 🙋‍♂️, The reset link is still being developed. Please come back at a later time.", // plain text body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

     res.status(200).json({
      message: "Reset email sent successfully",
      success: true,
      previewURL: nodemailer.getTestMessageUrl(info) || null,
    });
}catch(err){
  next(err)
}
}

//Add password hashing next and make sure that when a new user is created or logged in they have access to all the other fields on display except password.