import mongoose from "mongoose";

export interface IJWTPayload{
  _id:mongoose.Schema.Types.ObjectId,
  email:string,
  name:string
}