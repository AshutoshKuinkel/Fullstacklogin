import dotenv from 'dotenv';
import { IJWTPayload } from '../types/global.types';
import  jwt from "jsonwebtoken";
dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET ?? ''
const JWT_EXPIRE_IN = process.env.JWT_EXPIRE_IN

export const generateToken = (payload:IJWTPayload)=>{
  return jwt.sign(payload,JWT_SECRET,{expiresIn:JWT_EXPIRE_IN as any})
}