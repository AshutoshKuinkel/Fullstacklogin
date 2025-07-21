import { Express } from "express";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  //we need an email, password, phone number here.
  email: {
    type: String,
    trim: true,
    require: [true,`Email field is required`],
    unique: [true,`This email is already in use, please choose a different one`],
    minLength: [13,`email min len is 13`],
    maxLength: [50, 'email max len is 50']
  },

 password: {
    type: String,
    require: [true,`Password field is required`],
    minLength: [6,`Password min len is 13`],
    select:false
  },

  phone:{
    type: Number,
    trim: true,
    require: [true,"Phone number required"],
    maxLength: [15,`Phone number max len is 15`]
  },

  name: {
    type: String,
    require: [true,`Name field is required`],
    minLength: [3,`Name min len is 13`],
    maxLength: [20,`Name max len is 26`],
  },
})

const User = mongoose.model("User",userSchema)

export default User
