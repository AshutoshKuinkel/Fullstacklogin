import mongoose from 'mongoose';
import dotenv from "dotenv";
import { errorHandler } from './middlewares/errorhandlermiddleware';
import express from "express";
import {Request, Response, NextFunction} from "express";
import path from "path"

dotenv.config()
const PORT = process.env.PORT;
const DB_URI = process.env.DB_URI;
const app = express()

app.use(express.json());
app.use(express.urlencoded({extended:true}))

//importing roiutes
import authRoutes from './routes/auth.routes'

mongoose.connect(DB_URI!)
.then(() => {
    console.log('MongoDB connected successfully!');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// Serve frontend static files from the 'frontend' folder inside your backend folder
app.use(express.static(path.join(__dirname, '..', 'frontend')));

//using the routes
app.use('/api/auth',authRoutes)


//calling the errorHandler middleware
app.use(errorHandler)

app.listen(PORT,()=>{
  console.log(`Live server: http://localhost:${PORT}`);
})
